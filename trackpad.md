# Trackpad Input Design

Support click-to-aim interaction so laptop trackpad users can play without
holding a button down while dragging. Existing mouse drag and touch inputs are
preserved exactly as they are today.

## Problem

The current desktop interaction model assumes a mouse:

```
pointerdown
  ↓
move while button held   (aim rotation / cue pull / spin)
  ↓
pointerup
```

On a trackpad this is uncomfortable: the user must hold the button (or keep a
finger pressed) throughout the gesture. A trackpad-friendly model decouples
"press" from "move":

```
click (pointerdown → pointerup, no movement)
  ↓
move with no button held   (aim rotation)
  ↓
click (or Escape)
```

These event sequences can coexist without device sniffing:

- **Hold button + move** → existing drag behaviour (unchanged).
- **Click + release without moving** → enter _aim-adjust_ mode.
- **Move with no button held** (in adjust mode) → rotate aim.
- **Next click** (or `Escape`) → leave adjust mode.

This is safe because a plain click on the table currently has **no meaningful
action** (`CueHit` goes `Idle → Pending → reset` on `pointerup`,
`src/view/cuehit.ts:248-255`). We attach new behaviour to an inert event.

## Phase 1 (this implementation — try it, then evaluate)

Scope is deliberately minimal: **`Aim` state only, rotation only**.

1. **New module `src/view/pointertap.ts` (`PointerTap`)**, owned by
   `Container` and armed/disarmed exactly like `CueHit`
   (`container.ts:471-486`) — enabled only while `Aim` is the active
   controller.
2. **Tap classification** at `pointerup`: a press/release pair on the view is a
   tap when displacement < ~8 px, duration < ~500 ms, primary button only,
   `pointerType !== "touch"` (touch keeps its current flow), press target not
   in `#inputTextDiv` (same exclusion as `CueHit.onPointerDown`,
   `cuehit.ts:151-153`), and neither `CueHit` nor `CueBallSpin` owns the
   pointer (same ownership idea as `mousetouchGuard`, `container.ts:134-135`).
3. **Toggle**: tap #1 enters aim-adjust mode; next tap or `Escape` exits. No
   tap ever fires a shot — firing stays with Hit button / `Space` /
   double-click / drag-to-stroke.
4. **Hover-move**: while adjust mode is active and no button is held, horizontal
   pointer deltas are pushed onto the existing `container.inputQueue` as
   `Input(dx, "movementXUp")`. This flows through `Aim.handleInput` →
   `commonKeyHandler` → `cue.rotateAim(delta * 2)` — the exact code path the
   interactjs drag uses today (`keyboard.ts:76-88`, `controllerbase.ts:136`),
   so feel parity with drag-aim and multiplayer aim sync come for free.
5. **Affordance**: `crosshair` cursor over the view while adjust mode is
   active; restored on exit.

Because taps are classified at `pointerup`, drags never misclassify: they
exceed the slop/duration thresholds and are already owned by existing
handlers. No changes to any drag handler, controller, or HUD widget.

### Double-click interplay

`viewportHit` (`aiminputs.ts:351-361`) fires the shot on double-click. Native
ordering `pointerup → click → dblclick` resolves as: toggle on, toggle off,
fire. Compatible; verify the transient toggle (< 300 ms) is invisible when
trying it out.

## Evaluation checklist (manual)

macOS Safari/Chrome trackpad, external mouse, Windows Precision Touchpad:

- Drag-to-aim, drag-to-strike, spin drag, wheel power, double-click fire all
  behave exactly as before.
- Click empty table → cursor becomes crosshair; moving pointer rotates aim
  like dragging did; click again or Escape exits.
- Double-click still fires the shot cleanly (no visible flicker from the
  transient toggle).
- Touch device regression pass (no new behaviour).

## Tests (bare minimum)

One spec, `test/view/pointertap.spec.ts`, covering only the pure classifier:
slop boundary, duration boundary, and the guard predicates (touch,
right-button, chat-input exclusion). Everything else is validated by the
manual evaluation above — this is a UX experiment, not yet hardened
infrastructure.

## Deferred until phase 1 evaluates well

- Vertical hover deltas → camera height/zoom (full drag parity).
- `PlaceBall` tap-to-place support.
- Suppression of the transient toggle when a `dblclick` arrives (only if the
  flicker shows up in practice).
- Pointer leaves window mid-hover: optionally clear adjust mode on
  `pointerleave`.
- Richer visual affordance (hint text / cue highlight).
