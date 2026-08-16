# CueHit: Reject Sideways Swipes

Add a `Pending` phase to the drag-to-strike gesture so a swipe that starts on
the cue but moves mostly sideways is rejected. The rejected swipe then falls
through to the existing aim drag, letting the player swipe left/right to aim
without triggering a shot.

## Rule

While deciding, track the pointer displacement from the press point:

```
dx = clientX - startX
dy = clientY - startY
```

Reject the gesture when the sideways motion is more than twice the vertical:

```
|dx| > 2 * |dy|   →   reject (abort)
```

Otherwise, once a downward pull is detected, commit to the strike as today.

## State machine

```
Idle ──pointerdown hits cue──▶ Pending
Pending ──|dx| > 2|dy|──▶ Idle          (reject: release pointerId, aim resumes)
Pending ──pull down──▶ Pulling          (commit: capture + preventDefault)
Pulling ──▶ Pushing ──▶ fire / reset    (unchanged)
```

## Why no handoff is needed

`Container` already wires `keyboard.mousetouchGuard = () => cueHit.active`, and
`active` is just `pointerId !== null`. interactjs's `move` listener keeps
firing the whole time and only early-returns on that guard. On reject we set
`pointerId = null`, the guard flips off, and the in-flight aim drag resumes by
itself. No event injection, no new listeners.

## Reject chat / emoji overlays ✅ implemented

CueHit listens on `#viewP1` (the div the renderer canvas is appended to), not
the canvas itself, so pointerdown events from the chat dialog bubble up and
fire the raycast. Reject the press when it lands on the chat input / emoji
area:

```typescript
if ((e.target as Element | null)?.closest?.("#inputTextDiv")) return
```

This check runs only in `onPointerDown`, so a drag that is already captured and
pulling back is unaffected even if the pointer drifts over the chat area.

## Changes (all in `src/view/cuehit.ts`)

1. Add `"Pending"` to the `"Idle" | "Pulling" | "Pushing"` state union and
   record `startX` (alongside `startY`) on press.

2. `onPointerDown`: first reject presses on the chat input / emoji overlay ✅
   (see above), then on a cue hit set `pointerId` and `state = "Pending"`,
   record the start coords, and reset the pull fields. Do **not** call
   `preventDefault()` or `setPointerCapture()` here.

3. `onPointerMove`: add a `Pending` branch that runs first:

   ```typescript
   if (this.state === "Pending") {
     const dx = e.clientX - this.startX
     const dy = e.clientY - this.startY
     if (Math.abs(dx) > 2 * Math.abs(dy)) {
       // reject: hand the press back to the aim drag
       this.state = "Idle"
       this.pointerId = null
       return
     }
     if (this.pullPx > CueHit.DEADZONE_PX) {
       // commit: take over the press
       this.state = "Pulling"
       e.preventDefault()
       ;(this.container.view.element as HTMLElement).setPointerCapture(
         e.pointerId
       )
     }
     return
   }
   ```

   `pullPx` keeps measuring from `startY`; no rebase needed (the slop distance
   is negligible against `MAX_PULL_PX`).

4. `onPointerUp` / `onPointerCancel`: when still `Pending` (a tap or a rejected
   swipe), there is no capture to release — skip `releasePointerCapture` and
   just reset.

5. `disable()`: teardown immediately while `Pending` (no capture is held); keep
   the deferred teardown only while committed.

## Testing

One test: a sideways swipe (`|dx| > 2|dy|`) aborts and never fires.
