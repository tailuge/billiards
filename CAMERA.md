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

I want to have a new camera mode for spectators (e.g. replay) that allows camera to pan but not updating aim.
To do this I'd like to route the dragX calls depending on the controller state.
Identify a surgical place to add this new idea.
Add stub methods on the camera that accepts this pan info in X and Y.
Check that everything still works. i.e. in replay modes (watch aim watch shot) that pan commans do not change aim.
 