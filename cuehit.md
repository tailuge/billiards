# CueHit — Drag-to-Strike Shot Input

This document describes an *alternate* way to strike the cue ball: click the
3D cue, pull it back, then push it forward — the mouse's forward speed becomes
the shot power and the hit fires when the cue returns to its rest position
(tip at the ball). It runs **in parallel** with the existing input (space bar,
power slider, Hit button), changes no physics/rules/network code, and must not
disturb the other mouse gestures (aim rotate, camera height, spin).

---

## 1. Chosen approach

A small self-contained pointer-gesture class, `CueHit` (new file
`src/view/cuehit.ts`), is owned by the `Aim` controller. It listens for
`pointerdown`/`pointermove`/`pointerup` on the canvas, decides whether the
gesture started on the cue, tracks pull-back / push-forward, and finally
reuses the exact same fire path the Hit button uses today.

Everything it produces is funneled into the existing shot pipeline, so it is
purely an *input* addition:

```
gesture fires → set cue.aim.power → Aim.playShot() → HitEvent → PlayShot
              → ControllerBase.hit() → Outcome.hit(cueball, power, 0) → table.hit()
```

No new events, no new state, no serialisation changes, no network changes.

### How it is "enabled" (clicking the 3D cue)

On `pointerdown`, decide whether the pointer is on the cue. Two options, in
order of preference:

1. **Raycast (preferred)** — reuse the pattern already in
   `src/controller/placeallballs.ts` (`Raycaster.setFromCamera(ndc, camera)`):
   `raycaster.intersectObjects(table.cue.root, true)`. Any hit on
   `table.cue.root` starts the gesture. This is literally "click on the 3D cue".
2. **Screen-region fallback (simpler, no raycast)** — the cue is known to sit
   in the central / lower portion of the screen in `aimView`. Accept a
   `pointerdown` inside that box (middle third horizontally, lower half
   vertically). If raycasting the thin cue proves fiddly, use this instead.

The gesture only ever runs in the `Aim` controller, never in `PlaceBall`
(which has its own table-drag) or `WatchAim`.

---

## 2. The gesture (state machine)

```
Idle → Pulling (drag down) → Pushing (drag up) → Fire | Cancel → Idle
```

- **pointerdown on cue** — record start position, `canvas.setPointerCapture`,
  set `cuehit.active = true`, enter `Pulling`.
- **pull back** — as the pointer moves down-screen, the cue visually retracts.
  Track a signed `pull` amount (screen px below the start point). A small
  deadzone (~10 px) ignores jitter.
- **push forward** — when the pointer moves back up-screen through the pull
  (displacement increases toward / past the start), enter `Pushing`. The cue
  visually extends back toward the ball. While pushing, sample pointer speed
  each move and keep a running average.
- **fire** — when the cue reaches its rest position again (tip ≈ ball, i.e.
  `pull ≈ 0`) while pushing with a non-trivial speed, the hit happens:
  map the averaged forward speed to power, `cue.setPower(…)/aim.power = …`,
  then call `Aim.playShot()`.
- **cancel** — releasing the pointer while still pulled back (never pushed, or
  forward speed below the minimum) cancels: the cue eases back to rest, no
  shot. `Escape` also cancels.

### Visual feedback (pull back / push forward)

The cue body position is already computed in `Cue.applyHitAnimation` /
`Cue.moveTo` (`cueBody.position.set(...)` in `src/view/cue.ts`) via a
`strokeX` offset. Add a `Cue.dragBack` value (world units) that is subtracted
from `strokeX`; the gesture writes to it as the pointer moves, so the cue
retracts/extends in sync with the pointer with no new geometry or animation
system. On fire, the existing `hittingAnimation` / `hitAnimationCurve` stroke
plays exactly as it does today.

---

## 3. Power mapping

Power comes from the **forward** motion only (the push), not the pull distance:

```
avg = running average of pointer speed (px/s) during the push phase
power = maxPower * clamp(avg / V_FULL, 0, 1)
fire only if avg >= V_MIN          (else → cancel)
```

- `maxPower` — `src/model/physics/constants`.
- `V_FULL`, `V_MIN` — two tuneable px/s constants. `V_MIN` is the speed below
  which a release is a cancel, not a shot (prevents accidental taps firing).
- `power` is written to the same `cue.aim.power` field the slider/space bar
  use, so the HUD, replay, and `serialiseHit()` all stay consistent.

---

## 4. Parallel with the current system

The drag-to-strike is **additive**; nothing about the current input is removed
or re-routed:

- Space (`Aim.handleInput` `Space` / `SpaceUp`), the power slider
  (`AimInputs.powerChanged`), the mousewheel (`AimInputs.mousewheel`), and the
  Hit button (`AimInputs.hit` → `Input(0,"SpaceUp")`) all keep working.
- The gesture writes the same `aim.power` and calls the same `Aim.playShot()`,
  so it lands in the same `HitEvent` → `PlayShot` → `ControllerBase.hit()`
  path — rules, bots, replays, spectating, and the shot clock are untouched.
- `Aim.playShot()` already clears `container.inputQueue`, so no stale inputs
  leak into the shot when the gesture fires.

---

## 5. Not disturbing aim / height / spin

The other mouse gestures come from `Keyboard.mousetouch`
(`src/events/keyboard.ts`), which the interact.js `draggable`/`gesturable`
listeners feed. It accumulates `movementX`/`movementY`, which are later
emitted as `movementXUp` / `movementYUp` and handled in
`ControllerBase.commonKeyHandler`:

| input        | effect today                          |
|--------------|---------------------------------------|
| `movementXUp`| `cue.rotateAim(delta * 2)` (aim)       |
| `movementYUp`| `camera.adjustHeight(delta * 4)` (height) |

To keep a cue-drag from also rotating aim / changing height:

1. Set `cuehit.active = true` in `pointerdown` (before any interact `move`
   fires) and clear it in `pointerup` / `pointercancel`.
2. Guard `Keyboard.mousetouch`: `if (cueHit.active) return`. One guard covers
   both `draggable.move` and `gesturable.onmove`, so **no** `movementX` /
   `movementY` accumulate and no `movementXUp` / `movementYUp` are emitted.
3. Belt-and-braces: `Aim.handleInput` / `commonKeyHandler` also ignore
   `movementXUp` / `movementYUp` while the gesture is active.

The spin ball (`AimInputs.cueBallElement`) and the `+`/`-` height keys
(`NumpadAdd`/`NumpadSubtract`) are unrelated — the canvas gesture never
dispatches to the spin widget and the keyboard keys are untouched.

---

## 6. Implementation blueprint

### Pointer locations

1. **`src/view/cuehit.ts` (NEW)** — `CueHit` class: the gesture state machine,
   pointer listeners, velocity averaging, power mapping, and the call into
   `Aim.playShot()`.
2. **`src/controller/aim.ts`** — create/enable `CueHit` when `Aim` starts and
   disable it on leaving (the fire path reuses `this.playShot()`).
3. **`src/view/cue.ts`** — add a `dragBack` visual offset to the existing
   `strokeX` computation; expose the already-present `root` group for picking.
4. **`src/events/keyboard.ts`** — early-return in `mousetouch` while the
   gesture is active (the guard in §5).
5. **`src/container/container.ts`** (optional) — hold the single `cueHit`
   instance / `cueHitActive` flag so both `Keyboard` and `Aim` can see it.

### Steps

1. **New `CueHit` class** — constructed with the `Container`; attaches
   `pointerdown/move/up/cancel` to `container.view.element` (same canvas
   `PlaceAllBalls` uses), with `setPointerCapture`. Hit test on pointerdown
   per §1 (raycast against `table.cue.root`, or the lower/central screen box).
2. **Track the gesture** — `pull` (signed px), `phase` (`Pulling`/`Pushing`),
   running average of forward speed, `active` flag. Write `Cue.dragBack` each
   move so the cue follows the pointer.
3. **Fire** — on `pull ≈ 0` during a push (or a fast release), compute power
   per §3, `this.container.table.cue.setPower(power / maxPower)` (or assign
   `aim.power` directly), then call `aim.playShot()`. On cancel, zero
   `Cue.dragBack` and reset.
4. **Hook into `Aim`** — in `Aim`'s constructor/`onFirst`, enable the gesture
   (`cuehit.enable()`); disable it when leaving Aim (e.g. in `PlayShot`'s
   entry, or centrally when `Aim` is replaced). Skip entirely when
   `aimInputs.isDisabled()` (spectator/replay/watch).
5. **Guard `Keyboard`** — `mousetouch` returns early when `cuehit.active` (§5),
   so aim rotate / camera height never fire from a cue-drag.
6. **Visual offset** — add `Cue.dragBack` into the `strokeX` term in
   `applyHitAnimation`, so pull/push animate the cue without touching the rest
   of the hit animation.

---

## 7. Edge cases

- **Tap without push** → below `V_MIN`, treated as cancel; no accidental shot.
- **Release mid-pull** → cancel; cue eases back to rest.
- **Drag off the canvas** → pointer capture keeps events coming; cancel on
  `pointercancel`/`Escape`.
- **Disabled state** → no listeners while `aimInputs.isDisabled()` (spectator,
  replay, bot turn, WatchAim).
- **Multi-touch / pinch** → ignore secondary pointers; only the first pointer
  drives the gesture.
- **Shot clock** — unaffected; firing goes through the same `playShot()` the
  Hit button triggers.

---

## 8. Out of scope

- Touch-specific tuning beyond reusing pointer events.
- Changing the existing aim-rotate / height / spin gestures.
- Any change to power/velocity physics, rules, network protocol, or replays.
- A settings toggle to disable the gesture (can be a small follow-up flag).
