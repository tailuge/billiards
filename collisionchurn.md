# Collision Path Churn Analysis

This report identifies performance bottlenecks and memory churn in the physics engine's collision and cushion code paths. The analysis focuses on high-frequency operations within the simulation loop.

## 1. Vector Allocation Churn (High Impact)

The most significant source of churn is the frequent instantiation and cloning of `Vector3` objects in hot paths.

### Findings:
- **`CollisionThrow.updateVelocities`**: Uses `.clone()` or `new Vector3()` at least 10 times per collision event (e.g., `a.vel.clone()`, `ab.clone()`, `vPoint.clone()`).
- **`physics.ts`**: Functions like `surfaceVelocityFull`, `cueStrike`, and `cueToSpin` allocate new vectors on every call.
- **`Cushion.bounceAny`**: Calculates `futurePosition` (creating a new vector) before deciding if a bounce is even necessary.
- **`Table.advance`**: Calls `fround()` on every ball property (x, y, z for pos, vel, rvel) every step, which is an expensive operation in JS engines compared to raw math.

### Recommendation:
- Use **static scratch vectors** (pooled vectors) for intermediate calculations.
- Implement "in-place" versions of physics functions that accept a target vector to avoid allocation.
- Avoid `.clone()` in favor of `.copy()` into pre-allocated scratch instances.

---

## 2. Redundant Simulation Loop Logic (High Impact)

The simulation loop in `Table.ts` and `worker.ts` performs overlapping work.

### Findings:
- **Redundant Pair Checks**: `Table.prepareAdvanceAll` iterates over `this.pairs` every step. In `worker.ts`, `getFastWarpTime` performs a similar O(N²) check (`anyBallTooClose`).
- **Warping vs. Advancement**: The simulation calculates `warpTime` and then `table.advance` immediately re-checks all pairs. If `warpTime` is large, we know no collisions occur for N steps, yet we still perform the O(N²) collision detection logic.
- **`futurePosition` redundancy**: Both `willCollide` and `Cushion.bounceAny` calculate the future position independently.

### Recommendation:
- **State-Aware Advancement**: If `warpTime > stepSize`, the simulation can safely skip collision/cushion checks for the duration of the warp (or perform a bulk advancement).
- **Collision Caching**: Cache the `futurePosition` on the Ball object during the `advance` cycle to reuse it across pair and cushion checks.

---

## 3. Cushion Adapter Overhead (Medium Impact)

The `rotateApplyUnrotate` pattern used for cushion physics is elegant but expensive.

### Findings:
- **`physics.ts: rotateApplyUnrotate`**:
  1. Clones `v` and `w`.
  2. Applies `axisAngle` (trigonometry).
  3. Executes model.
  4. Applies inverse `axisAngle` to results.
- This happens for every ball-cushion interaction. For 3-cushion billiards, where balls hit cushions constantly, this adds up.

### Recommendation:
- **Specialize Models**: Provide specialized versions of `mathavan` and `stronge` models for the 4 cardinal cushion directions (X+, X-, Y+, Y-) to eliminate the need for rotation.
- **Pre-calculate Rotations**: Since cushions are static, the rotation matrices/quaternions can be pre-calculated.

---

## 4. Physics Model Refinements (Medium Impact)

### Findings:
- **`Collision.positionsAtContact`**: Solves a quadratic equation to find the exact time of impact. This is called *after* `willCollide` returns true.
- **`CollisionThrow.dynamicFriction`**: Uses `exp()` which is relatively slow.

### Recommendation:
- **Unified Sweep**: Combine `willCollide` and `positionsAtContact` into a single "sweep" test that returns the time-of-impact (TOI) if it exists within `dt`.
- **Approximation**: Replace `exp()` with a Taylor series approximation or a look-up table if collision friction is a bottleneck in multi-ball simulations (e.g. break shots).

---

## Summary of Biggest "Bang for Buck"
1. **Eliminate Vector3 Clones**: Moving to scratch vectors in `CollisionThrow` and `physics.ts` will drastically reduce GC pauses.
2. **Optimized Warp Advancement**: Trusting the `warpTime` calculation to skip O(N²) checks during "flight" time.
3. **In-place Future Position**: Reuse the `futurePos` vector already present on the Ball class instead of re-calculating it multiple times per step.
