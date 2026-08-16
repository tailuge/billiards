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
(`src/view/cuehit.ts`), is owned by `Container` and armed only while `Aim` is
the active controller. It listens for
`pointerdown`/`pointermove`/`pointerup` on the canvas, decides whether the
gesture started on the cue, tracks pull-back / push-forward, and finally
reuses the exact same fire path the Hit button uses today.

Everything it produces is funneled into the existing shot pipeline, so it is
purely an *input* addition:

```
gesture fires → set cue.aim.power → push Input(0,"SpaceUp") → Aim.handleInput
              → Aim.playShot() → updateController(PlayShot) → ControllerBase.hit()
              → Outcome.hit(cueball, power, 0) → table.hit()
```

`Aim.playShot()` returns the new `PlayShot` controller, and
`Container.updateController` installs it — the state machine only advances if
that return value reaches `updateController`, so the gesture queues `SpaceUp`
rather than calling `playShot()` directly.

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
  follow the `dragT` retraction.
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
(which has its own table-drag) or `WatchAim`. Being in `Aim` is the single
lifecycle driver: `Container.updateController` enables `CueHit` on `Aim` and
disables it on every other controller (see §6 step 4), so it can never start
— or linger — outside your own aim turn.

---

## 2. The gesture (state machine)

```
Idle → Pulling (drag down) → Pushing (drag up) → Fire | Cancel → Idle
```

- **pointerdown on cue** — record start position, `canvas.setPointerCapture`
  (which makes `cuehit.active` true), enter `Pulling`.
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
  map the averaged forward speed to power, `cue.setPower(ratio)`, then queue
  the same `Input(0, "SpaceUp")` the Hit button uses (never call
  `Aim.playShot()` directly — its returned `PlayShot` must reach
  `updateController`).
- **cancel** — releasing the pointer while still pulled back (never pushed, or
  forward speed below the minimum) cancels: the cue eases back to rest,  no shot.

**Pull-back alone never changes power.** Power comes only from the forward
(push) motion. If the player pulls back and releases *without* pushing past
the zero point, the gesture cancels and the power bar is left untouched —
there is no "release adjusts power" behaviour.

### Visual feedback (pull back / push forward)

The cue body position is already computed in `Cue.applyHitAnimation` /
`Cue.moveTo` (`cueBody.position.set(...)` in `src/view/cue.ts`) via the
existing `swing` term, which is driven by `Cue.t` and reaches its maximum
retraction when `sin(t * 1.5 + Math.PI / 2)` hits `-1` (i.e. `t = 2π/3`). The
gesture reuses this: `CueHit` maps the pull to a `dragT` phase (`0` at rest →
`2π/3` fully retracted) and writes it to `Cue.dragT`, which `moveTo` uses in
place of the free-running `t` (with a fixed, amplified amplitude while
dragging — see `Cue.dragPullAmplifier`). No new geometry or animation system.
On fire, the existing
`hittingAnimation` / `hitAnimationCurve` stroke plays exactly as it does today.

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

Call `cue.setPower(ratio)` **before** queueing the `SpaceUp` input. `setPower`
→ `updateAimInput()` → `updatePowerSlider()` already updates the slider value
and the `powerPercent` text to the deduced power. When the queued input is
processed, `playShot()` disables the inputs, and `PlayShot.onFirst()` runs the
existing `animateSliderHit()`, which strokes 0 → target and **ends at the
deduced power** (identical to the Hit button today). This requires no changes
to the existing display code.

---

## 4. Parallel with the current system

The drag-to-strike is **additive**; nothing about the current input is removed
or re-routed:

- Space (`Aim.handleInput` `Space` / `SpaceUp`), the power slider
  (`AimInputs.powerChanged`), the mousewheel (`AimInputs.mousewheel`), and the
  Hit button (`AimInputs.hit` → `Input(0,"SpaceUp")`) all keep working.
- The gesture writes the same `aim.power` and queues the same
  `Input(0, "SpaceUp")` the Hit button uses, so it lands in the same
  `HitEvent` → `PlayShot` → `ControllerBase.hit()` path — rules, bots,
  replays, spectating, and the shot clock are untouched.
- `Aim.playShot()` clears `container.inputQueue` when it runs, so no stale
  inputs leak into the shot when the gesture fires.

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

1. `cuehit.active` stays true from `pointerdown` on the cue until
   `pointerup` / `pointercancel` — including after the shot has fired — so the
   trailing drag after the zero point is also suppressed (the gesture never
   hands back to the interact drag mid-press).
2. Guard `Keyboard.mousetouch`: `if (cueHit.active) return`. One guard covers
   both `draggable.move` and `gesturable.onmove`, so **no** `movementX` /
   `movementY` accumulate and no `movementXUp` / `movementYUp` are emitted —
   there is nothing further to ignore, so no belt-and-braces check is needed
   in `handleInput` / `commonKeyHandler`.

The spin ball (`AimInputs.cueBallElement`) and the `+`/`-` height keys
(`NumpadAdd`/`NumpadSubtract`) are unrelated — the canvas gesture never
dispatches to the spin widget and the keyboard keys are untouched.

---

## 6. Implementation blueprint

**Progress:** `CueHit` implements the state machine, raycast hit test,
velocity averaging, and power mapping (exposing `active` / `dragT` / `phase`).
It is wired in — the `Keyboard.mousetouch` guard and `Cue.dragT` give the
pull-back retraction, the Aim-scoped lifecycle arms/disarms it, and the
gesture fires shots with visual feedback. The remaining work is the invisible
fat hit mesh. Tuneable constants live at the top of the class:
`DEADZONE_PX`, `MIN_POWER`, `V_FULL`, `V_MIN`, `MAX_PULL_PX`, `T_FULL`.

### Pointer locations

1. **`src/view/cuehit.ts` (DONE)** — `CueHit` class: the gesture state machine,
   pointer listeners, velocity averaging, power mapping, and queueing
   `Input(0, "SpaceUp")` on fire.
2. **`src/controller/aim.ts`** — no `CueHit` code; arming is driven purely by
   the controller type in `Container.updateController`.
3. **`src/view/cue.ts`** (DONE for drag) — `dragT` drives the `swing` term in
   `moveTo` so pull/push retract the cue. **Remaining:** add the invisible fat
   hit mesh (same length, fatter radius) as a child of `mesh` and expose it
   (or `mesh`) for picking.
4. **`src/events/keyboard.ts` (DONE)** — early-return in `mousetouch` while the
   gesture is active (the guard in §5).
5. **`src/container/container.ts` (DONE)** — lazily creates the single
   `cueHit` and, in `updateController`, enables it on `Aim` and disables it on
   any other controller (the lifecycle driver; see step 4).

### Steps

1. **New `CueHit` class** ✅ — constructed with the `Container`; attaches
   `pointerdown/move/up/cancel` to `container.view.element` (same canvas
   `PlaceAllBalls` uses), with `setPointerCapture`. Hit test on pointerdown
   per §1 (raycast `table.cue.mesh`, including the invisible fat hit mesh).
2. **Track the gesture** ✅ (in class) — `pull` (signed px), `phase`
   (`Pulling`/`Pushing`), running average of forward speed, `active` flag,
   and a `dragT` phase that `Cue` reads for the visual retraction.
3. **Fire** ✅ (in class) — on `pull ≈ 0` during a push, compute power per §3,
   clamp to `[MIN_POWER, 1]`, `this.container.table.cue.setPower(ratio)`
   (updates the power indicator), then queue `Input(0, "SpaceUp")` so it flows
   through `Aim.handleInput` → `playShot()` → `updateController(PlayShot)`. On
   cancel, clear `Cue.dragT` and reset — leave power unchanged.
4. **Lifecycle (Aim-scoped)** ✅ — `Container.updateController` lazily creates
   the single `CueHit`, enables it when the new controller is `Aim`, and
   disables it otherwise. `disable()` unarms the gesture, resets state, and
   removes listeners — but if a press is still in flight it defers the release
   (capture + listener teardown) to `pointerup`/`pointercancel`, so the trailing
   drag after a fired shot stays suppressed across the Aim → PlayShot
   transition. The `aimInputs.isDisabled()` pointerdown check is dropped.
5. **Guard `Keyboard`** ✅ — `mousetouch` returns early when `cuehit.active`
   (§5), wired via `container.keyboard.mousetouchGuard`, so aim rotate /
   camera height never fire from a cue-drag.
6. **Visual offset** ✅ — `Cue.moveTo` uses `dragT` (written by the gesture) in
   place of the free-running `t` for the `swing` term, so pull/push retract the
   cue without touching the rest of the hit animation.

---

## 7. Edge cases

- **Tap without push** → below `V_MIN`, treated as cancel; no accidental shot.
- **Release mid-pull** → cancel; cue eases back to rest; power unchanged.
- **Click off the cue** → hit test misses; `CueHit` idle; normal aim/height
  drag proceeds unchanged.
- **Drag off the canvas** → pointer capture keeps events coming; cancel on
  `pointercancel`.
- **Drag continues after the shot fires** → the pointer stays captured until
  release, so the leftover movement never feeds aim/height (the guard stays on
  until `pointerup`/`pointercancel`).
- **Not in Aim** → the gesture is unarmed; spectator, replay, bot turn, and
  WatchAim never start a drag, and the listeners are removed once any
  in-flight press ends (see step 4).
- **Multi-touch / pinch** → ignore secondary pointers; only the first pointer
  drives the gesture.
- **Slow but valid push** → fires at the `MIN_POWER` floor (5%) when the
  speed clears `V_MIN` but maps below 5%.
- **Cue-ball spin click near the tip (future)** — once a 3D cue-ball click
  for spin is added, exclude the `cueTip` mesh from the hit test (§1) so the
  cue drag does not swallow clicks on the ball.
- **Shot clock** — unaffected; firing goes through the same `SpaceUp` input the
  Hit button triggers.

---

## 8. Out of scope

- Touch-specific tuning beyond reusing pointer events and the fat hit mesh.
- Changing the existing aim-rotate / height / spin gestures.
- Any change to power/velocity physics, rules, network protocol, or replays.
- Applying the 5% floor to the slider / space bar / mousewheel (gesture only).
- A settings toggle to disable the gesture (can be a small follow-up flag).
