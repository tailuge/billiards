# CueHit — Drag-to-Strike Shot Input

This document describes an *alternate* way to strike the cue ball: click the
3D cue, pull it back, then push it forward — the mouse's forward speed becomes
the shot power and the hit fires when the cue returns to its rest position
(tip at the ball). It runs **in parallel** with the existing input (space bar,
power slider, Hit button), changes no physics/rules/network code, and must not
disturb the other mouse gestures (aim rotate, camera height, spin).

---

## 1. Chosen approach

A small self-contained pointer-gesture class, `CueHit`
(`src/view/cuehit.ts` — **created, not yet wired in**), will be owned by the
`Aim` controller. It listens for
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

**No new dependency.** The gesture uses native pointer events. `interactjs` is
*already* a project dependency (`src/events/keyboard.ts`), used only for the
existing aim-rotate / camera-height drags; the plan guards that path (§5)
rather than adding or replacing anything in `package.json`.

### How it is "enabled" (clicking the 3D cue)

On `pointerdown`, raycast the pointer and decide whether it is on the cue.
This is the **only** hit test — there is no screen-region fallback.

- **Raycast** — reuse the pattern already in `src/controller/placeallballs.ts`
  (`Raycaster.setFromCamera(ndc, camera)`), but intersect the *cue geometry*
  rather than the table plane:
  `raycaster.intersectObjects(table.cue.mesh, true)`. Any hit starts the
  gesture. This is literally "click on the 3D cue".
- **Raycast target** — `table.cue.mesh` (the visible cue group
  `tiltMesh → cueBody`), **not** `table.cue.root`. `root` also parents the
  helper, shadow and placer meshes, and raycasting it would falsely start the
  gesture when the player clicks the aim-helper or shadow area.
- **Fat hit zone** — the cue is a very thin target (tip ≈ 4.6 mm, butt ≈ 15 mm),
  which is hard to hit precisely on touch. Add an *invisible* cylinder with
  the **same length** as the cue but a **fatter radius** (wider, *not* longer)
  as a child of `table.cue.mesh` (still a raycast, not a screen box), and
  include it in the same `intersectObjects` call. It is only needed for the
  `pointerdown` hit test (the cue is at rest then), so it does not need to
  follow the `dragBack` retraction.
- **Cue tip exclusion (future)** — the cue's tip mesh is named `cueTip`
  (`src/view/cuemesh.ts`). If a 3D cue-ball click for `offsetXY` (spin) is
  added later, exclude that mesh from this hit test (filter
  `intersection.object.name === "cueTip"`, or raycast only the cue's other
  sub-meshes) so clicks near the tip fall through to the ball rather than
  starting a cue drag.
- **Miss is normal** — if `pointerdown` does not hit the cue, `CueHit` stays
  idle and the existing `interactjs` drag continues to drive aim-rotate /
  camera-height exactly as today.

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
  each move; at the zero point the average is taken over the final half of the
  collected samples (by count).
- **fire** — when the cue reaches its rest position again (tip ≈ ball, i.e.
  `pull ≈ 0`) while pushing with a non-trivial speed, the hit happens:
  map the averaged forward speed to power, `cue.setPower(ratio)`, then call
  `Aim.playShot()`.
- **cancel** — releasing the pointer while still pulled back (never pushed, or
  forward speed below the minimum) cancels: the cue eases back to rest, no
  shot. `Escape` also cancels.

**Pull-back alone never changes power.** Power comes only from the forward
(push) motion. If the player pulls back and releases *without* pushing past
the zero point, the gesture cancels and the power bar is left untouched —
there is no "release adjusts power" behaviour.

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
avg    = arithmetic mean of the final half of the forward (upward) per-event
         speed samples collected during the push (by count)
ratio  = clamp(avg / V_FULL, MIN_POWER, 1)        // MIN_POWER = 0.05
power  = maxPower * ratio
fire only if avg >= V_MIN                          // else → cancel
```

- `maxPower` — `src/model/physics/constants`.
- `MIN_POWER` — 0.05: the lowest power a fired shot may have (5% floor). This
  applies **only to the drag gesture**; the slider / space bar / mousewheel
  keep their existing 0–100% range.
- `V_FULL`, `V_MIN` — two tuneable px/s constants. `V_FULL` is the
  motion→power scaling knob: lower it to make a given push produce more power,
  raise it to make the same push produce less. `V_MIN` is the speed below
  which a release is a cancel, not a shot (prevents accidental taps firing).
  `V_MIN` (a speed floor that cancels) and `MIN_POWER` (a power floor for a
  fired shot) are distinct.
- `power` is written to the same `cue.aim.power` field the slider/space bar
  use, so the HUD, replay, and `serialiseHit()` all stay consistent.

### Updating the power indicator on fire

Call `cue.setPower(ratio)` **before** `Aim.playShot()`. `setPower` →
`updateAimInput()` → `updatePowerSlider()` already updates the slider value and
the `powerPercent` text to the deduced power. `playShot()` then disables the
inputs, and `PlayShot.onFirst()` runs the existing `animateSliderHit()`, which
strokes 0 → target and **ends at the deduced power** (identical to the Hit
button today). This requires no changes to the existing display code.

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

**Progress:** `src/view/cuehit.ts` exists as a standalone class — never
imported or instantiated. It already implements the state machine, raycast
hit test, velocity averaging, power mapping, and exposes `active` / `dragBack`
/ `phase`. Steps 2–6 below are the remaining wiring. Tuneable constants live
at the top of the class: `DEADZONE_PX`, `MIN_POWER`, `V_FULL`, `V_MIN`,
`PX_TO_WORLD`.

### Pointer locations

1. **`src/view/cuehit.ts` (DONE, standalone)** — `CueHit` class: the gesture state machine,
   pointer listeners, velocity averaging, power mapping, and the call into
   `Aim.playShot()`.
2. **`src/controller/aim.ts`** — create/enable `CueHit` when `Aim` starts and
   disable it on leaving (the fire path reuses `this.playShot()`).
3. **`src/view/cue.ts`** — add a `dragBack` visual offset to the existing
   `strokeX` computation; add the invisible fat hit mesh (same length,
   fatter radius) as a child of `mesh` and expose it (or `mesh`) for picking.
4. **`src/events/keyboard.ts`** — early-return in `mousetouch` while the
   gesture is active (the guard in §5).
5. **`src/container/container.ts`** (optional) — hold the single `cueHit`
   instance / `cueHitActive` flag so both `Keyboard` and `Aim` can see it.

### Steps

1. **New `CueHit` class** ✅ — constructed with the `Container`; attaches
   `pointerdown/move/up/cancel` to `container.view.element` (same canvas
   `PlaceAllBalls` uses), with `setPointerCapture`. Hit test on pointerdown
   per §1 (raycast `table.cue.mesh`, including the invisible fat hit mesh).
2. **Track the gesture** ✅ (in class) — `pull` (signed px), `phase`
   (`Pulling`/`Pushing`), running average of forward speed, `active` flag.
   Remaining: `Cue.dragBack` reads from the class (step 6).
3. **Fire** ✅ (in class) — on `pull ≈ 0` during a push (or a fast release), compute power
   per §3, clamp to `[MIN_POWER, 1]`, `this.container.table.cue.setPower(ratio)`
   (updates the power indicator), then call `aim.playShot()`. On cancel, zero
   `Cue.dragBack` and reset — leave power unchanged.
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
- **Release mid-pull** → cancel; cue eases back to rest; power unchanged.
- **Click off the cue** → hit test misses; `CueHit` idle; normal aim/height
  drag proceeds unchanged.
- **Drag off the canvas** → pointer capture keeps events coming; cancel on
  `pointercancel`/`Escape`.
- **Disabled state** → no listeners while `aimInputs.isDisabled()` (spectator,
  replay, bot turn, WatchAim).
- **Multi-touch / pinch** → ignore secondary pointers; only the first pointer
  drives the gesture.
- **Slow but valid push** → fires at the `MIN_POWER` floor (5%) when the
  speed clears `V_MIN` but maps below 5%.
- **Cue-ball spin click near the tip (future)** — once a 3D cue-ball click
  for spin is added, exclude the `cueTip` mesh from the hit test (§1) so the
  cue drag does not swallow clicks on the ball.
- **Shot clock** — unaffected; firing goes through the same `playShot()` the
  Hit button triggers.

---

## 8. Out of scope

- Touch-specific tuning beyond reusing pointer events and the fat hit mesh.
- Changing the existing aim-rotate / height / spin gestures.
- Any change to power/velocity physics, rules, network protocol, or replays.
- Applying the 5% floor to the slider / space bar / mousewheel (gesture only).
- A settings toggle to disable the gesture (can be a small follow-up flag).
