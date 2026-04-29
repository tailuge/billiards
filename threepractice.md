# Three-Cushion Proximity Rule

## Problem Statement

In three-cushion billiards, a point should be awarded if the cue ball ends within 4R of the second object ball after hitting ≥3 cushions and the first object ball, even without a direct collision.

## Background

- `Table.advance(t)` is the simulation step loop; outcomes are pushed here as discrete events
- `table.cueball` is always the active player's cue ball (set by `Aim` and `WatchAim` before each shot)
- `Outcome` uses `ballA`/`ballB` shape consistently; `Proximity` can mirror `Collision` so pass 2 of `isThreeCushionPoint` treats it as a substitute second collision
- The guard against duplicate proximity events is cheaply implemented by checking `this.outcome.some(o => o.type === OutcomeType.Proximity)`

## Proposed Solution

Add `OutcomeType.Proximity` emitted during simulation when the cue ball is within 4R of a stationary ball (first occurrence only). Extend `isThreeCushionPoint` with a second pass that accepts a `Proximity` outcome in place of the second `Collision`.

## Tasks

### Task 1: Add `Proximity` outcome type and factory method

- Add `Proximity = "Proximity"` to `OutcomeType` enum in `src/model/outcome.ts`
- Add `static proximity(ballA, ballB)` factory method (mirrors `collision` shape, pass `0` for `incidentSpeed`)

### Task 2: Emit proximity outcome in `Table.advance()`

Add `static proximityEnabled: boolean = false` to `Table` (mirrors `TableGeometry.hasPockets` pattern).  
`ThreeCushion.tableGeometry()` sets `Table.proximityEnabled = true`; all other rules leave it `false`.

Add a private `checkProximity()` method called at the end of `Table.advance(t)`:

1. Guard: skip if `!Table.proximityEnabled`
2. Guard: skip if `this.outcome` already contains a `Proximity` outcome
3. Find balls in motion: `const moving = this.balls.filter(b => b.inMotion())`
4. Only proceed if `moving.length === 2` and `moving` includes `this.cueball`
5. Target is the stationary ball that is not the cue ball: `this.balls.find(b => !b.inMotion() && b !== this.cueball)`
6. If `this.cueball.pos.distanceTo(target.pos) < 4 * R`, push `Outcome.proximity(this.cueball, target)`

### Task 3: Extend `isThreeCushionPoint` with proximity pass

After the existing loop returns `false`, add pass 2:

- Find a `Proximity` outcome where `ballA === cueBall`
- If found, re-run the loop counting only collisions — if `cannons.size === 1` and `cushions >= 3`, return `true`
- Pass 1 is entirely unchanged

### Task 4: Tests in `test/rules/threecushion.spec.ts`

- Proximity after 3 cushions + 1 collision scores a point → controller transitions to `Aim`
- Proximity after only 2 cushions + 1 collision does not score
- Proximity without any prior collision does not score
- Existing collision path still passes (regression)

## Files Changed

### Task 5: `ProximityIndicator` — rings visual on target ball

New file `src/view/proximityindicator.ts`. Creates a `THREE.Group` containing:
- A single ring at radius `4R` (the proximity threshold) using `EllipseCurve` + `LineLoop`
- A `Sprite` text label `"4r"` using a `CanvasTexture`
- Both start `visible = false` [DONE]

The group is positioned at `z = 0.01` (above table bed), same as other overlays.

`Table` holds a `proximityIndicator` instance. `Table.addToScene()` adds its group to the scene (mirrors how `cue.mesh` is added). When `checkProximity()` emits a `Proximity` outcome, it also calls `this.proximityIndicator.showAt(target.pos)` which sets the group position and `visible = true`. It is hidden again at the start of each shot in `ControllerBase.hit()` via `table.proximityIndicator.hide()`.

| File | Change |
|---|---|
| `src/view/proximityindicator.ts` | New — ring visual, `showAt(pos)` / `hide()` [DONE] |
| `src/model/table.ts` | Add `proximityIndicator` field, add to scene, call `showAt` from `checkProximity()` [DONE] |
| `src/controller/controllerbase.ts` | Call `table.proximityIndicator.hide()` in `hit()` |

## Files Changed

| File | Change |
|---|---|
| `src/model/outcome.ts` | Add `Proximity` type, factory method, pass 2 in `isThreeCushionPoint` |
| `src/model/table.ts` | Add `static proximityEnabled`, `proximityIndicator`, `checkProximity()` in `advance()`, add indicator to scene |
| `src/controller/rules/threecushion.ts` | Set `Table.proximityEnabled = true` in `tableGeometry()` |
| `src/view/proximityindicator.ts` | New — ring visual, `showAt(pos)` / `hide()` [DONE] |
| `src/controller/controllerbase.ts` | Call `table.proximityIndicator.hide()` in `hit()` |
| `test/rules/threecushion.spec.ts` | New proximity scoring tests |
