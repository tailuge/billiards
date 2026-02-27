# Camera System Analysis & Refactoring Plan

## Current State

### Architecture Overview

The camera and input systems are tightly coupled:
- Input (keyboard.ts) → Controller.handleInput() (controllerbase.ts) → cue.rotateAim() / camera.adjustHeight() → Camera.update() → topView or aimView

### Camera (src/view/camera.ts)

| Aspect | Details |
|--------|---------|
| Modes | topView (static overhead), aimView (follows cue ball) |
| Height range | R*6 to R*120 |
| Auto-flip | Switches to topView at height > R*110, back to aimView at < R*105 |

Key methods: topView(), aimView(), adjustHeight(), suggestMode(), forceMode()

### Input Coupling (src/controller/controllerbase.ts:69-81)

- Mouse drag X → cue.rotateAim()
- Mouse drag Y → camera.adjustHeight()
- Key O → toggleMode()

### Automatic Top View Flip (src/view/view.ts:58-60)

Uses frustum culling - if ball in motion not visible, auto-switches to topView.

### Existing Spectator Controllers

- Spectate: networked spectator
- WatchAim: watch opponent aim (default topView)
- WatchShot: watch opponent's shot

---

## Problem Statement

1. Tight coupling - dragging always rotates cue
2. aimView only tracks cue ball, not all balls
3. No spectator-friendly camera that follows action
4. WatchAim/WatchShot use static modes

---

## Refactoring Plan

### Phase 1: Decouple Camera from Aim (Non-Breaking)

1. Create CameraMode interface with update(camera, elapsed, context) method
2. Create CameraContext containing aim, balls[], table, isAiming
3. Migrate topView/aimView to mode objects
4. Add mode registry to Camera class

### Phase 2: Input Context System (Non-Breaking)

1. Create InputContext enum: Aiming | Spectating | Replaying
2. Modify commonKeyHandler to accept context parameter
3. Route input differently:
   - Aiming: movementX → cue.rotateAim, movementY → camera.adjustHeight
   - Spectating/Replaying: movementX/Y → camera orbit rotation

### Phase 3: New ReplayCamera Mode (New Feature)

1. Create ReplayCameraMode that tracks all balls in motion
2. Calculate centroid of moving balls, smoothly lerp camera target
3. Add orbit controls - drag rotates around scene
4. Auto-return to tracking after inactivity
5. Integrate with WatchAim/WatchShot controllers

---

## Key Files to Modify

| Phase | Files |
|-------|-------|
| 1 | camera.ts (refactor), new camera/mode.ts, camera/context.ts |
| 2 | controllerbase.ts, new inputcontext.ts |
| 3 | camera/replay.ts, spectate.ts, watchaim.ts |

---

## Backward Compatibility

- Phase 1: internal refactoring only
- Phase 2: defaults to current behavior
- Phase 3: additive - existing players unaffected
