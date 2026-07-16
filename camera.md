# Camera System Analysis & Proposals

This document provides a detailed analysis of how the camera button toggles the 3D views in the lightweight cue sports simulator, the rules governing changing views and forcing views, and a proposed three-view cycle (including a new step-back aim view). Finally, we explain why the replay camera view currently exhibits janky transitions.

---

## 1. Camera Toggle Mechanics

### 1.1 How the Camera Button Toggles the 3D View
The camera button toggles the viewport representation by invoking the `toggleMode()` method of the `Camera` instance (defined in `src/view/camera.ts`).
- **The Trigger:** When a user clicks the camera button (with the element ID `"camera"`), the event listener configured in `Menu` (in `src/view/menu.ts`) triggers the `adjustCamera()` helper, which in turn calls `this.container.view.camera.toggleMode()`.
- **Current Switch Logic:** Inside `toggleMode()`, a binary check determines the state transition:
  ```typescript
  toggleMode() {
    if (this.mode === this.topView) {
      this.mode = this.aimView
    } else {
      this.mode = this.topView
    }
    this.mainMode = this.mode
  }
  ```
  This immediately toggles the active rendering `mode` function between `topView` and `aimView`, and sets the persistent `mainMode` to match this selection.

---

## 2. Suggesting vs. Forcing Views

The camera system differentiates between "suggesting" a view and "forcing" a view to maintain an optimal perspective while allowing automatic state-driven adjustments.

### 2.1 Rules of `suggestMode(mode)`
The `suggestMode` method offers a conditional, non-intrusive transition that respects the user's intent:
- **Rule 1 (Aim View Priority):** If the persistent `mainMode` is currently set to `aimView`, a suggestion to switch modes is **allowed** and the active rendering `mode` is updated to the suggested view.
- **Rule 2 (Spectator View Priority):** If the persistent `mainMode` is `spectatorView`, suggestions are strictly locked down. The camera only accepts transitions if the suggested mode is either `topView` or `spectatorView`.
- **Purpose:** This prevents gameplay updates (such as balls moving or transitioning between turns) from overriding a persistent mode that the user explicitly wants or which is required by the game's immediate controller state.

### 2.2 Rules of `forceMode(mode)`
The `forceMode` method provides an absolute override:
- **Behavior:** It directly assigns the active `mode` and the persistent `mainMode` to the specified mode.
- **Purpose:** Essential when transitioning to states with strict visual requirements, such as placing a ball on the table (forces `topView`), aiming / taking a shot (forces `aimView`), starting a replay, or reaching the game end screen.

---

## 3. Proposed 3-View Cycle with Aim Step-Back View

Currently, the camera button toggle cycles strictly between 2 views (`aimView` and `topView`). To provide players with a better general spatial awareness of the table layout while aiming, we propose introducing a third view to the cycle.

### 3.1 The New View: `aimStepBackView`
This view functions similarly to the standard `aimView` (looking from behind the cue ball along the aim line) but places the camera further backward and slightly higher to give the player a broader overview of the surrounding table cushions and obstacle balls.

#### Conceptual Structure
```typescript
aimStepBackView(aim: AimEvent, fraction = 0.08) {
  const h = this.height * 1.5 // Step back slightly higher
  const portrait = this.camera.aspect < 0.8
  this.camera.fov = (portrait ? 60 : 40) + this.fovOffset
  if (h < 10 * R) {
    const factor = 100 * (10 * R - h)
    this.camera.fov -= factor * (portrait ? 3 : 1)
  }

  // Increase distance back along the aiming angle by adding an offset factor (e.g., + R * 15)
  this.target
    .copy(aim.pos)
    .addScaledVector(unitAtAngle(aim.angle, this.tempVec), -(this.distance + R * 15))

  this.camera.position.lerp(this.target, fraction)
  this.camera.position.z = h
  this.camera.up = up

  // Look slightly further down the table or keep lookTarget focused but raised
  this.lookTarget.copy(aim.pos).addScaledVector(up, h / 2)
  this.camera.lookAt(this.lookTarget)
}
```

### 3.2 The 3-View Cycle Flow
With this additions, `toggleMode()` will cycle seamlessly as follows:

$$\text{Aim View} \longrightarrow \text{Aim Step-Back View} \longrightarrow \text{Top View} \longrightarrow \text{Aim View}$$

```typescript
toggleMode() {
  if (this.mode === this.aimView) {
    this.mode = this.aimStepBackView
  } else if (this.mode === this.aimStepBackView) {
    this.mode = this.topView
  } else {
    this.mode = this.aimView
  }
  this.mainMode = this.mode
}
```

---

## 4. Replay Camera View Jankiness

The camera during replay mode is described as "janky." Based on the source code analysis of `Replay` (in `src/controller/replay.ts`) and `Camera` (in `src/view/camera.ts`), this is caused by three key factors:

### 4.1 Mismatched Lerp Coefficients
In `spectatorView` (used during replays), the position and the gaze target of the camera interpolate (lerp) toward their targets at completely different speeds:
- **Camera Position:** Interpolates quickly with a factor of `0.1`:
  `this.camera.position.lerp(this.target, 0.1)`
- **Look-at (Gaze) Target:** Interpolates much slower with a factor of `0.03`:
  `this.lookTarget.lerp(..., 0.03)`
- **The Result:** The camera's physical position snaps rapidly to behind the ball, while the gaze (look-at) direction drifts sluggishly. This mismatch causes a disorienting "slipping" or "swimmy" visual effect during fast changes.

### 4.2 Abrupt Camera Snapping and Panning Cuts
When playing a series of shots in sequence via `playNextShot(delay)`:
- The code calculates whether the shot is approximately aligned with the current aim angle (`anglesAlign(...)`) or if the camera is in `topView`.
- If they are **not** aligned, the system abruptly suggests `topView`. This sudden switch snaps the camera's orientation.
- In `topView`, position is lerped at a very high rate of `0.9` (`this.camera.position.lerp(..., 0.9)`), causing an almost instant snap, while the look-at target instantly resets to `zero`. This sudden jump lacks a smooth transit, creating a severe visual shock.

### 4.3 Instant Turn Transitions
As soon as the balls come to rest, the next shot instantly copies the new cue ball position and cue aim in `playNextShot()`:
```typescript
this.container.table.cueball.pos.copy(aim.pos)
this.container.table.cue.aim = aim
```
Because the physical positions and aiming directions change instantly before the camera has had time to lerp gently to the rest position, the camera targets jump to a new part of the table instantaneously. This triggers a sudden, high-speed camera sweep across the entire table.
