# Plan: drag on the 3D cue ball to set spin

Follow the same pattern as `src/view/cuehit.ts` — a pointer gesture armed only while
`Aim` is the active controller, owned by `Container`, plugging into the existing
`Cue.setSpin` path. No new spin logic.

## Gesture (new small class, e.g. `CueBallSpin` in `src/view/`)

- **Arming**: same as `CueHit` — enabled/disabled from `Container.updateCueHit`
  alongside it (only while `Aim` is active). Also bail if `cue.aimInputs.isDisabled()`.
- **Pointer down**: raycast the *current* cue ball mesh
  `container.table.cueball.ballmesh.mesh` (recursive, like `CueHit.hitCue`).
  Because it reads `table.cueball` on every press, threecushion (`balls[1]`),
  sagu, drills, and analysis all just work — never hardcode `balls[0]`.
- **Capture**: take the `pointerId`, setPointerCapture, and keep `active` true
  until pointerup/cancel (mirror `CueHit`).
- **Drag**: map the pointer offset from the ball's screen centre to an offset
  in `[-0.45, 0.45]` (ball screen radius = `offCenterLimit` 0.45; drag beyond the
  ball clips). Feed it into the **existing** entry point, exactly like the 2D
  ball and the analysis pick do:
  `container.table.cue.setSpin(new Vector3(x, y, 0), table)`
  — this already clamps, runs `avoidCueTouchingOtherBall`, and calls
  `updateAimInput()` (2D cue-tip UI, overlap). Also set
  `container.lastEventTime = performance.now()` like `AimInputs.adjustSpin`.
- **Release**: release capture, clear `pointerId`, reset.

## Not double-handled as aim / zoom

The interactjs drag that becomes aim-left/right (`movementX` → `rotateAim`) and
zoom up/down (`movementY` → `camera.adjustHeight`) is suppressed while
`keyboard.mousetouchGuard` returns true — today that's
`() => this.cueHit?.active ?? false` (`container.ts`). Extend the guard to also
return true while the spin gesture owns a pointer (e.g.
`() => this.cueHit?.active || this.cueBallSpin?.active ?? false`), so a spin
drag never also rotates the aim or zooms.

## Visualisation / flow to opponents

Nothing new: `setSpin` → `updateAimInput` already moves the 2D cue-tip UI, and
the analysis panel polls `table.cue.aim` per frame so its spin marker follows
live. The shot's `HitEvent` carries the aim to the opponent — same as the
existing 2D ball UI. No reimplementation of any adjustment.

## Out of scope

- No changes to `Cue.setSpin`, `avoidCueTouchingOtherBall`, aim inputs, analysis,
  or networking.
- Tests: optional unit test following `CueHit`'s headless-friendly shape
  (no render target → no listeners, gesture drivable programmatically).
