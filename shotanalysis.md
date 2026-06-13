# Shot Analysis Button Plan

## Goal
Add an analysis button in replay mode that opens a new tab with a `billiards.tailuge.workers.dev` URL
containing `init` (ball positions) and `initShot` (shot parameters) for the shot currently shown.

## URL Format
```
https://billiards.tailuge.workers.dev/?ruletype=threecushion&practice&drill&init=<serialised>&initShot=<shotJson>
```
- `init` = `Table.shortSerialise()` → `[x0,y0,x1,y1,...]`
- `initShot` = `{cueBallId:0, angle, power, offset:{x,y}, elevation}` from `AimEvent`

---

## Phase 1: UI Only (functionless button)

### 1a. Add button in `dist/index.html`
- Add a `<button>` element **above** the `<button class="menuButton" title="menu" id="menu">`.
- Same structure, inside `<div class="outerMenu">`.
- `id="analysis"`, `title="shot analysis"`, `class="menuButton"`, `hidden`.
- Icon: a magnifying glass SVG (or 👓 emoji as fallback).

```html
<button
  class="menuButton"
  title="shot analysis"
  id="analysis"
  type="submit"
  aria-label="Shot analysis"
  hidden
>
  <svg ... magnifying glass icon ...>
</button>
```

### 1b. Wire visibility in `src/view/menu.ts`
- Add `analysis` property: `analysis: HTMLButtonElement`
- Get element in constructor: `this.analysis = this.getElement("analysis")`
- Add `setAnalysisVisible(visible: boolean)` method (mirrors `setShareVisible` / `setConcedeVisible`).
- In `src/container/container.ts` → `updateController()`, call `this.menu?.setAnalysisVisible(controller instanceof Replay)` when controller is Replay.

### 1c. CSS (optional)
- If needed, style in `dist/css/menu.css`.
- The `hidden` attribute and existing `menuButton` styles should suffice.

---

## Phase 2: Functional - capture snapshots & open link

### 2a. Capture snapshots in `src/controller/replay.ts`
- Add two new fields to `Replay`:
  ```ts
  currentInit: string   // serialised ball positions
  currentShot: any      // current AimEvent params
  ```
- Initialize them in constructor (empty/null).
- **Override `hit()`** in `Replay` (replacing the inherited `ControllerBase.hit()`):
  ```ts
  override hit() {
    // Capture snapshot BEFORE the hit advances physics
    this.currentInit = JSON.stringify(this.container.table.shortSerialise())
    const aim = this.container.table.cue.aim
    this.currentShot = JSON.stringify({
      cueBallId: 0,
      angle: aim.angle,
      power: aim.power,
      offset: { x: aim.offset.x, y: aim.offset.y },
      elevation: aim.elevation || 0,
    })
    // Then do the actual hit
    super.hit()
  }
  ```
- Since the `hit()` call path in replay is `handleHit` → `this.hit()`, and `playNextShot` pushes a `HitEvent`, the snapshot captures the state just before the cue strikes the ball — exactly the shot being shown.

### 2b. Wire button click in `src/view/menu.ts`
- In constructor (after getting `this.analysis` element), attach click handler:
  ```ts
  if (this.analysis) {
    this.analysis.onclick = () => {
      const replay = this.container.controller as Replay
      if (replay.currentInit && replay.currentShot) {
        const base = "https://billiards.tailuge.workers.dev/"
        const params = new URLSearchParams()
        params.set("ruletype", this.container.rules.rulename)
        params.set("practice", "")
        params.set("drill", "")
        params.set("init", replay.currentInit)
        params.set("initShot", replay.currentShot)
        window.open(`${base}?${params.toString()}`, "_blank")
      }
    }
  }
  ```
- Need to import `Replay` at top of `menu.ts` (already imported in `container.ts`, but will need adding to menu.ts imports).

### 2c. Edge case: what if the user clicks before any shot plays?
- Button can be disabled until first snapshot exists, or show a tooltip. Simplest: check snapshot exists and silent-noop if not.

---

## Files changed
| File | Change |
|---|---|
| `dist/index.html` | Add analysis button in outerMenu, hidden |
| `src/view/menu.ts` | Add `analysis` element, visibility method, click handler |
| `src/container/container.ts` | Call `setAnalysisVisible` in `updateController` |
| `src/controller/replay.ts` | Add `currentInit`/`currentShot` fields, override `hit()` |

---

## Testing
- Start a replay. Verify button appears when in replay mode.
- Click button during a shot clip: verify new tab opens with correct URL.
- Verify URL params reconstruct the same shot when loaded.
