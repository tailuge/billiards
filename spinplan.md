# Plan: cue-ball spin and cue gesture ownership

## Current implementation

### Cue-ball spin gesture

`src/view/cueballspin.ts` is implemented and is owned by `Container`.

- It is armed while `Aim` is the active controller through
  `Container.updateCueHit`.
- It raycasts the current `table.cueball.ballmesh.mesh`, so it works with
  three-cushion, sagu, drills, and analysis without assuming `balls[0]`.
- It captures the pointer and remains active until `pointerup` or
  `pointercancel`.
- It maps the pointer's screen offset from the projected cue-ball centre into
  the existing `[-0.45, 0.45]` spin range.
- It sends the result through the existing `Cue.setSpin` path, preserving
  clamping, collision avoidance, 2D cue-tip updates, and overlap updates.
- It updates `container.lastEventTime` so the view remains active during the
  gesture.

### Cue-hit gesture

`src/view/cuehit.ts` is also implemented and is armed alongside
`CueBallSpin` while `Aim` is active.

- It raycasts the visible cue and the invisible, wider `cueHitZone`.
- It starts in a pending state so sideways movement can fall back to the
  normal aim drag.
- A downward pull retracts the cue; an upward push measures speed and derives
  shot power.
- It queues the normal `SpaceUp` input path rather than bypassing shot logic.
- Its active state is included in `Keyboard.mousetouchGuard`, so ordinary aim
  and camera drags are suppressed during the gesture.

### Render-only cue squirt

`src/view/cue.ts` now applies a visual-only squirt twist based on lateral spin:

- `aim.offset.x` is used directly because it is already normalised to the
  `offCenterLimit` range.
- The maximum visual squirt angle is currently **0.5 degrees** at full lateral
  offset.
- The cue rotates around its tip, keeping the tip planted while the butt
  deflects.
- The existing `-90°` cue-geometry alignment is preserved; squirt is added to
  that base rotation.
- The cue shadow follows the visual deflection.
- Aim angle, camera position, hit testing, and shot physics are unchanged.

## Known issue: CueHit and CueBallSpin can both own one pointer

Both gesture classes attach independent `pointerdown`, `pointermove`,
`pointerup`, and `pointercancel` listeners to the same canvas. Their hit tests
are independent:

- `CueHit` raycasts the cue and its wider `cueHitZone`.
- `CueBallSpin` raycasts the cue ball.

Near the cue-tip/cue-ball contact area, one screen-space ray can intersect both
objects. Both handlers can then accept the same `pointerdown`, store the same
`pointerId`, and become active. `preventDefault()` does not stop another
listener on the same canvas, and pointer capture does not provide application-
level ownership arbitration.

The current `mousetouchGuard` only suppresses the normal interactjs aim drag
when either gesture is active; it does not choose which gesture owns the
pointer.

## Proposed fix: one decision point at pointerdown, `pointerId` is the lock

Keep the two gesture classes, but route every press through a single decision
point. Only one class ever sets `pointerId`, and `pointerId` itself is the only
mutual-exclusion state. No separate owner slot.

### Policy (the explicit "choice at the start")

Because the cue ball is the more specific target and the fat `cueHitZone`
overlaps it, a press is decided once as:

1. **Spin** when the ray hits the cue ball (`CueBallSpin`'s existing hit test);
   otherwise
2. **Hit** when the ray hits the cue or its fat hit zone (`CueHit`'s existing
   hit test);
   otherwise
3. Nothing — the press falls through to the normal aim drag.

One ray, two hit tests, one outcome. No listener-order dependence because the
two tests are run by a single handler, not by two competing handlers.

### Mechanics

- Keep the decision inside the two gesture classes, not `Container`.
  `CueHit` already owns the cue raycast and the pending fallback, so it becomes
  the single pointerdown entry point: it runs the spin hit test first (reusing
  `CueBallSpin`'s hit test), then its own cue/fat-zone hit test, and starts
  exactly one of the two gestures. `Container.updateCueHit` continues to do
  nothing but `enable()`/`disable()`.
- `CueBallSpin` stops registering its own `pointerdown` listener and exposes a
  small `start(e)` method holding the code its current `onPointerDown` runs
  after the hit test succeeds (set `pointerId`, capture, `preventDefault`,
  first spin update). `CueHit` calls `CueBallSpin.start(e)` on a spin press;
  otherwise it proceeds as it does today. The coupling is one-directional —
  `CueHit` → `CueBallSpin` — which is acceptable because the two inputs are
  already closely related and the classes already share `container`.
- Each class keeps its own `active` getter (`pointerId !== null`) and its
  existing move/up/cancel handlers, all already guarded on `pointerId`. Since
  only one class's `pointerId` is set, only that class reacts to the rest of
  the gesture — this is the whole mutual-exclusion mechanism, so
  `mousetouchGuard` keeps reading the two `active` flags unchanged.
- `CueHit`'s pending fallback is unchanged: a sideways swipe clears
  `pointerId`, which is the same release path the spin and hit gestures already
  use, so the pointer becomes available to the normal aim drag.
- No changes to `preventDefault`, pointer capture, or teardown timing are
  needed beyond starting only one class.

### Why this over a general-purpose arbiter

A shared `tryClaimGesture(owner)` slot adds a second piece of ownership state
that has to be kept in sync with `pointerId` on every path: `pointerup`,
`pointercancel`, the sideways-swipe fallback, `fire()`, and controller
switches. Since both gestures already track `pointerId` and gate all their
handlers on it, one class running both hit tests at `pointerdown` gets the same
mutual exclusion for free and adds no state to `Container`.
`stopImmediatePropagation()` is rejected because it makes the outcome depend on
listener order; a `Container`-owned router is rejected because it spreads the
hit geometry decision across a third place. The single class-local entry point
is the smallest code change that removes the double-ownership bug.

### Edge cases

- **Press hits both cue ball and cue tip**: spin wins, by the policy above.
  `CueHit` delegates to `CueBallSpin` and never sets its own `pointerId`, so no
  duplicate ownership can occur.
- **Press hits only the cue or fat zone**: hit wins, as today.
- **Press hits neither**: neither `pointerId` is set; the interactjs aim drag
  proceeds normally.
- **Controller leaves `Aim` mid-gesture**: the winning class already defers
  listener teardown until `pointerup`/`pointercancel`, and `pointerId` remains
  the single source of truth, so the trailing drag stays suppressed as before.
- **Sideways swipe after a pending hit**: unchanged — `CueHit` clears
  `pointerId` and the aim drag resumes.

## Suggested verification

Add coverage for the single decision point rather than each gesture in
isolation:

- A press that hits both cue ball and cue activates only spin.
- A press that hits only the cue/fat zone activates only hit.
- A press that hits neither leaves both gestures idle and reaches the normal
  aim drag.
- During a spin drag, the hit gesture's handlers never react to move/up/cancel.
- During a hit drag, the spin gesture's handlers never react to move/up/cancel.
- `pointerup`, `pointercancel`, and the sideways-swipe fallback each clear the
  winning class's `pointerId`.
- Leaving `Aim` mid-gesture does not leak a stale `pointerId` into the next
  `Aim` session.

## Out of scope

- No changes to `Cue.setSpin`, `avoidCueTouchingOtherBall`, aim inputs,
  networking, camera aiming, or shot physics.
- The fix should not alter the existing spin mapping or cue-hit power
  calculation.
- `Container` gains no new gesture-routing state or hit-test logic.
