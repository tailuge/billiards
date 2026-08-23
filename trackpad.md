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
finger pressed) throughout the gesture, which is imprecise and tiring. A
trackpad-friendly model decouples "press" from "move":

```
click (pointerdown → pointerup)
  ↓
move with no button held
  ↓
click
```

These are fundamentally different event sequences, but they can coexist
without knowing whether the device is a mouse or a trackpad:

- **Hold button + move** → existing drag behaviour (unchanged).
- **Click + release without moving** → enter an *adjust* state.
- **Move with no button held** (while in adjust state) → apply adjustment.
- **Next click** (or `Escape`) → leave the adjust state.

This is safe because a plain click on the table currently has **no meaningful
action** (`CueHit` goes `Idle → Pending → reset` on `pointerup`,
`src/view/cuehit.ts:248-255`; interactjs produces no `move` events for a
click). We are attaching new behaviour to an event that is currently inert.

## Goals

1. Trackpad users can aim, adjust spin, place the cue ball, and strike
   without any hold-and-drag gesture.
2. Zero behavioural change for existing mouse-drag users and touch users.
3. One small, shared mechanism reused by both the `Aim` and `PlaceBall`
   controller states — no duplicated per-state logic.
4. No device sniffing: behaviour emerges from the event sequences themselves.

## Non-goals

- Changing the drag-to-strike cue gesture (`CueHit`), the drag-to-spin
  gesture (`CueBallSpin`), the interactjs aim/camera drag, or any HUD widget.
- Touch-specific improvements (touch keeps its current flow entirely).
- New visual HUD beyond minimal affordance feedback (see UX section).

## Current behaviour (reference)

| Surface | File | Behaviour |
| --- | --- | --- |
| Drag on table/cue | `src/view/cuehit.ts` | Pull-back-and-release strike gesture; internal state machine `Idle/Pending/Pulling/Pushing`. |
| Drag on cue ball | `src/view/cueballspin.ts` | Spin adjustment; started from `CueHit.onPointerDown` when press hits the cue ball mesh. |
| Drag elsewhere on view | `src/events/keyboard.ts:102-109` | interactjs draggable → horizontal delta rotates aim, vertical delta adjusts camera height. |
| Two-finger pinch | `src/events/keyboard.ts:110-115` | interactjs gesturable → same pipeline, damped `/3`. |
| Plain click on table | — | **No-op** (this is what we build on). |
| Double-click on view (non-touch) | `src/view/dom/aiminputs.ts:351-361` | Fires the shot (`viewportHit`). |
| Hit button / `Space` / mouse wheel | `src/view/dom/aiminputs.ts`, `src/controller/aim.ts` | Set/fire power. |

Controller states involved: `Aim` (aiming + striking), `PlaceBall`
(positioning the cue ball), `PlayShot`/`Watch*` (input ignored for our
purposes). Transitions flow through `Container.updateController()`
(`src/container/container.ts:419-465`) and the input queue
(`container.ts:368-389`).

## Proposed design

### 1. Click detection (new, shared)

Add a small `PointerTap` observer on the render container element
(`src/container/container.ts`, alongside the existing `CueHit` wiring in
`updateCueHit()`):

- Listens to `pointerdown` / `pointerup` (primary button only,
  `e.isPrimary`, left button — same guards as `CueHit.onPointerDown`).
- On `pointerup`, classifies the pair as a **tap** when:
  - total displacement < `TAP_SLOP_PX` (~8 px),
  - duration < ~500 ms,
  - neither `CueHit` nor `CueBallSpin` claimed the pointer (reuse the
    existing `mousetouchGuard` ownership idea from `container.ts:134-135`),
  - `pointerType !== "touch"` (touch keeps its current flow; see
    *Touch safety* below).
- A tap emits a semantic event, e.g. `TapEvent`, pushed onto the existing
  `container.inputQueue` so it flows through the standard
  `controller.handleInput()` path — no new side channels.

Because classification happens *at pointerup*, a drag never misclassifies:
drags exceed the slop/duration thresholds and are already owned by the
existing handlers. No changes to any drag handler are required.

### 2. Adjust-mode state machine (controller level)

Each interested controller gets a tiny internal sub-state, managed by one
shared helper so logic is not duplicated:

```ts
type AdjustMode = { active: boolean }
```

Semantics (identical shape in both states):

| Controller | Tap #1 (enter) | Hover move (active only) | Tap #2 / Escape (exit) |
| --- | --- | --- | --- |
| `Aim` | enter aim-adjust mode | rotate aim / camera height from pointer deltas (same mapping as the interactjs drag) | leave mode, no shot fired |
| `PlaceBall` | enter place-adjust mode | ghost cue ball follows the pointer's table-plane position | confirm placement (existing `placed()` → `Aim`) |

Notes:

- **`Aim`: taps toggle only.** Firing stays with the existing mechanisms:
  Hit button, `Space`, double-click, or the drag-to-stroke gesture. This was
  a deliberate choice — no click ever commits a stroke, so a stray tap can
  never fire an accidental shot.
- **`PlaceBall`: tap #2 confirms.** Placement is reversible-cheap and needs
  a commit action; reusing the existing `SpaceUp`-style input keeps the
  transition identical to the keyboard path.
- **Escape** exits adjust mode in both states without side effects.
- While adjust mode is active, normal drags continue to work unchanged
  (interactjs drags require a held button, so hover-move and drag cannot
  conflict; `mousetouchGuard` already arbitrates against `CueHit`/spin).

### 3. Hover-move plumbing

While adjust mode is active, the active controller consumes plain
`pointermove` events (no button held):

- **`Aim`**: feed `movementX` / `movementY` into the exact same code path the
  interactjs drag uses today (`Keyboard.mousetouch()` → virtual key inputs),
  preserving 1:1 feel parity between drag-aim and hover-aim.
- **`PlaceBall`**: raycast the pointer onto the table plane and update the
  ghost ball position through the existing placement validation (same rules
  as arrow-key movement).

Because hover deltas flow through the same `mousetouch()` pipeline as the
drag, the existing vertical behaviour — camera height / zoom in and out with
up-down movement — behaves **exactly as if the mouse were dragged**: same
mapping, same damping, same clamping. No separate zoom code path.

Implementation home: extend the `PointerTap` observer into a small
`PointerTapHover` module (single listener set, armed/disarmed by
`Container` exactly like `updateCueHit()`), so `Aim` and `PlaceBall` each
just implement two methods, e.g. `handleTap()` / `handleHoverMove(dx, dy)`.

### 3a. Tap exclusions (must NOT trigger adjust mode)

A tap only counts when it lands on the 3D view itself. The classifier must
ignore presses whose `e.target` is any interactive DOM element:

- **Buttons** (Hit, menu, ffwd, chat send, lobby/status controls, …)
- **Emoji picker / emoji list** (`#chatEmojiList`, `.chat-emoji` buttons —
  `src/view/comment.ts`) and the chat **text input** (`#inputTextDiv`,
  same exclusion `CueHit` already applies at `src/view/cuehit.ts:151-153`)
- **Sliders / dials / HUD widgets** (power slider, tilt slider, spin widget,
  `AngleInput`) — these own their own pointer handling today and must keep it

Implementation: require `e.target` to be the renderer canvas (or assert
`!target.closest("button, input, #inputTextDiv, .chat-emoji, …")`), checked
at `pointerdown` — mirroring the `CueHit` precedent. Because classification
happens at press start, an in-flight captured drag is unaffected.

### 3b. Existing gestures that must remain untouched

- **Swipe on the cue (drag-to-strike)**: unchanged. A press on the cue that
  moves vertically still pulls and releases the stroke (`CueHit`
  `Pending → Pulling → Pushing`); the tap classifier never sees it because
  `CueHit` claims ownership and the motion exceeds the tap slop.
- **Tap/click on the 3D cue ball**: unchanged. The press is handed to
  `CueBallSpin` (`cuehit.ts:156-158`), which sets spin from the press
  position immediately. The tap classifier's ownership guard means this is
  **not** captured as an aim-mode toggle.
- **Drag-to-aim / drag-to-zoom** (interactjs): unchanged; still works while
  adjust mode is active since it requires a held button.
- **Mouse wheel power, double-click fire, keyboard controls**: unchanged.

### 4. Interplay with double-click-to-fire

`viewportHit` (`aiminputs.ts:351-361`) fires the shot on double-click for
non-touch. Native ordering is `pointerup → click → dblclick`, so a
double-click resolves as: tap #1 toggles aim-adjust on, tap #2 toggles it
off, `dblclick` fires the shot. All three effects are compatible; no change
is needed. We should verify in testing that the transient toggle-on/off is
invisible in practice (it lasts < 300 ms and produces no rendering change
without pointer movement).

If testing shows the transient state flickers anything, fallback: suppress
the toggle-exit when a `dblclick` arrives within the threshold window.

### 5. Arming conditions

The tap/hover module is armed only when:

- the active controller implements the tap interface (`Aim`, `PlaceBall`;
  explicitly not `WatchAim`, `WatchShot`, `PlayShot`, `Replay`, `End`,
  `Spectate`), and
- `CueHit` / `CueBallSpin` are not mid-gesture.

This mirrors the existing `updateCueHit()` arming pattern
(`container.ts:471-486`) and can live in the same function.

### 6. Touch safety

All tap handling is gated on `e.pointerType !== "touch"`. Touch devices keep
their current interaction set (drag gestures + Hit button) untouched. This
matches the existing non-touch gate in `viewportHit`.

## Edge cases

| Case | Handling |
| --- | --- |
| Click on cue ball | Owned by `CueHit` → spin drag; sets spin as today, never toggles aim mode. Unchanged. |
| Swipe on the cue | Owned by `CueHit` stroke gesture; exceeds tap slop → not a tap. Unchanged. |
| Click on buttons / emoji list / chat input / sliders | Excluded by target check (§3a); the widget's own handling runs. No toggle. |
| Click starting a cue stroke drag | Exceeds slop → not a tap. Unchanged. |
| Right-click / middle-click | Ignored (left button only), right-click drawing (`drawing.ts`) unaffected. |
| Chat input focus (`#inputTextDiv`) | Same exclusion as `CueHit.onPointerDown` (`cuehit.ts:151-153`). |
| Shot fired while aim-adjust active (via Hit button / `dblclick`) | Controller transitions to `PlayShot`; adjust mode discarded with the controller instance. |
| Pointer leaves window mid-hover | `pointermove` stops arriving; state persists until next tap/Escape. Optionally clear on `pointerleave`. Decide during implementation. |
| Opponent's turn (`WatchAim`) | Module disarmed; no hover adjustments leak into spectating. |

## UX affordances

Minimal, optional:

- While aim-adjust is active, show a subtle cue highlight (or HUD hint text)
  so the user knows movement will steer the aim and the next click/Escape
  ends it.
- Cursor style: `crosshair` (or `grabbing`) over the view while active.

## Testing plan

Unit tests (Jest, mirroring `test/` structure):

- Tap classifier: slop boundary, duration boundary, touch exclusion,
  right-button exclusion, ownership guard while `CueHit` active.
- Tap exclusions: presses on buttons, `#chatEmojiList` / `.chat-emoji`,
  `#inputTextDiv`, sliders and dials never emit taps.
- Hover zoom parity: vertical hover deltas produce the same camera/zoom
  result as the equivalent vertical drag.
- `Aim`: tap toggling, hover deltas produce expected inputs, Escape exit,
  no shot fired on any tap.
- `PlaceBall`: tap-enter, hover moves ghost within valid region, tap-confirm
  routes through `placed()`.
- Regression: existing drag flows emit no taps (integration-style test with
  synthetic pointer event sequences).

Manual checks: macOS Safari/Chrome trackpad, external mouse, Windows
Precision Touchpad, touch device regression pass.

## Open items

1. Whether hover-move should be delta-based (chosen, for parity with drag)
   or absolute (aim directly at the table point under the cursor). Delta is
   recommended first; absolute could be a later refinement.
2. Optional visual affordance scope (hint text vs. cue highlight).
3. `pointerleave` behaviour when hovering outside the canvas in adjust mode.
