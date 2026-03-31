# Investigation Leads for Nineball Break Replay Discrepancy

## Summary
A discrepancy was observed where a recorded nineball game replay diverged from the live game starting from the break-off shot. Specifically, the cueball position at the start of the second shot in the replay differs from its recorded position.

## Detailed Leads

### 1. Position Mismatch at Shot Boundary (Synchronization)
The `bug.md` data shows that the settled cueball position after shot 1 in the replay is approximately:
- `x: 0.6128004193305969`
- `y: 0.028110530227422714`

While the recorded `aim.pos` for shot 2 is:
- `x: 0.6128116250038147`
- `y: 0.02814456634223461`

The discrepancy (`d ~= 0.000035`) suggests that either the live game settled at a different position than the replay, or the `aim.pos` recorded for shot 2 was not perfectly synchronized with the cueball's final settled position.

**Code Reference:**
- `src/controller/aim.ts:25-27`: `table.cue.moveTo(table.cueball.pos)` is called during `Aim` construction.
- `src/controller/replay.ts:133-134`: `this.container.table.cueball.pos.copy(aim.pos)` and `this.container.table.cue.aim = aim` are called when playing the next shot in replay.

If `cueball.pos` is updated or rounded between the end of `PlayShot` and the start of `Aim`, but `aim.pos` is not, this jump occurs.

### 2. Intermediate Physics Precision
While `Ball.fround()` is called at the end of each `Table.advance(t)` step in `src/model/table.ts:63`, the intermediate updates to velocity and position within the collision resolution loop (`prepareAdvanceAll`) use 64-bit floating point math.

**Code Reference:**
- `src/model/physics/collision.ts:51-53`: `Collision.model.updateVelocities(a, b)` updates velocities using standard math.
- `src/model/physics/collisionthrow.ts`: Impulse and friction calculations are 64-bit.
- `src/model/physics/physics.ts`: Cushion bounce and rolling/sliding deltas are 64-bit.

If multiple collisions occur within a single time step `t`, these 64-bit velocities are used to calculate the next collision's `willCollide` and `positionsAtContact` results. Any tiny divergence here can be amplified, especially during a break where many balls collide in quick succession.

### 3. Collision Resolution Loop Stability
The `while (!this.prepareAdvanceAll(t))` loop in `src/model/table.ts:57-61` continues until all collisions in the current step are resolved.

**Code Reference:**
- `src/model/table.ts:57-61`: The `depth` limit of 100 suggests that pathological cases (e.g., three balls in a line) are handled, but the order of resolution (pairs are checked in a fixed order from `this.pairs`) might interact with 64-bit precision to produce different outcomes if the initial positions are even slightly different.

### 4. Serialization Divergence (`serialiseHit` vs `shortSerialise`)
There is a potential mismatch in how the table state is captured for recording versus how it's used for network synchronization.

**Code Reference:**
- `src/controller/aim.ts:56`: `const hitEvent = new HitEvent(this.container.table.serialiseHit())`
- `src/model/table.ts:130-135`: `serialiseHit()` only captures ball 0 (cueball) and the aim.
- `src/events/recorder.ts:35`: `recordedEvent = (event as HitEvent).tablejson.aim`
- `src/events/recorder.ts:44`: `state: this.container.table.shortSerialise()`

The `Recorder` records the full table state (`shortSerialise`) but uses the `aim` from the `HitEvent`. If the full table state at the moment of the hit has any tiny differences from what the `AimEvent` implies (e.g., due to a previous `PlaceBall` or `StationaryEvent` transition), the replay might start from a slightly "wrong" state.

### 5. `PlaceBall` Rounding
The `PlaceBall` controller calls `this.container.table.cueball.fround()` in `moveTo` and `placed`, but other balls on the table (which could be moved during a respot or rerack) might not be rounded until the first physics step of the next shot.

**Code Reference:**
- `src/controller/placeball.ts:98`: `this.container.table.cueball.fround()`
- `src/controller/placeball.ts:107`: `this.container.table.cueball.fround()`

If a respot occurs (e.g., in `NineBall.respotAndBroadcastNineBall`), `Respot.nineBall` is called, which moves the ball, but `fround()` is not explicitly called on it until `Table.advance`.
