# Better Camera: zoom-out from top view while watching a shot

## Goal
When the camera is in **top view** and the player is in the **WatchShot** controller state (watching the opponent's shot play out), clicking the camera button should switch to the **zoomed-out aim view** (`aimz`) instead of the regular aim view.

## Current behavior
- Camera button click → `Menu.adjustCamera()` (`src/view/menu.ts`) → `camera.cycleMode()`.
- `cycleMode()` (`src/view/camera.ts`): from `topView` it always goes to the regular `aimView`. The zoomed-out step-back (`aimz`) is only reachable from `aimView`.

## Simple solution
In `Menu.adjustCamera()`, check the controller state before calling `cycleMode`:

1. Import `WatchShot` into `src/view/menu.ts`.
2. In `adjustCamera()`, add a guard: if `this.container.controller instanceof WatchShot` **and** `camera.mode === camera.topView`, then:
   - set `camera.mode = camera.aimView`
   - call `camera.stepBackToFitAllBalls(balls, aim)` to zoom out to fit all balls
   - set `camera.isZoomedOut = true` (only if `savedDistance` was set, i.e. it actually stepped back)
   - update the camera button to the `aimz` state
   - else fall through to `cycleMode` as before.
3. Otherwise, keep the existing `camera.cycleMode(...)` call unchanged.

> Note: `stepBackToFitAllBalls` only sets `savedDistance`/`isZoomedOut` semantics when it actually moves back. If all balls are already in view it leaves `savedDistance` undefined — in that case we should just go to regular `aimView` (set `isZoomedOut = false`). Mirror the exact logic already used inside `cycleMode`'s first branch to stay consistent.

### Why here (not in `Camera`)
`Camera` has no reference to the controller/container, and wiring one in would be a bigger change. `Menu` already holds `this.container`, so the check is a one-liner there. The keyboard shortcut (`KeyZ` → `cycleMode`) is left as-is for now; this change targets the on-screen button only.

## Files to change
- `src/view/menu.ts` — add the `WatchShot` check in `adjustCamera()`.

## Test
- Add a case to `test/view/menu.spec.ts` (or a new spec): construct a `WatchShot` controller, force the camera to `topView`, click the camera button, and assert the camera ends in the zoomed-out aim view (`isZoomedOut === true`, `mode === aimView`, `savedDistance` defined) — provided balls require stepping back.

## Validation
- `yarn lint` (tsc --noEmit + ESLint)
- `yarn test` (Jest)
- `yarn prettify`
