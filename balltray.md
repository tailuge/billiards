# BallTray Plan

## Overview

Replace shot/break messages currently sent to the chat window with a dedicated **BallTray** UI overlay. The tray shows the last 2-3 shots in a compact horizontal strip. Clicking expands it to show the full shot history.

## Current Flow (to be replaced)

```
Recorder.updateBreak()
  → LinkFormatter.lastShotLink() / breakLink()
    → generateLink()
      → ChatEvent pushed to eventQueue
        → Chat.showMessage() renders in #chatoutput
```

## New Flow

```
Recorder.updateBreak()
  → BallTray.addShot() / addBreak()
    → BallTray renders in #ballTray DOM element
```

---

## 1. HTML Changes (`dist/index.html`)

Add a new overlay element inside `#viewP1`, alongside existing overlays:

```html
<div id="ballTray" class="ball-tray" aria-live="polite" role="log">
  <div class="ball-tray-collapsed">
    <!-- Shows last 2-3 shot indicators -->
  </div>
  <div class="ball-tray-expanded" hidden>
    <!-- Full scrollable shot history -->
  </div>
</div>
```

Placement: After `#botDebugOverlay` and before the closing `</div>` of `#viewP1`.

---

## 2. CSS Changes (`dist/index.css`)

Add styles for the ball tray:

- **Collapsed state**: Horizontal strip at bottom of viewport, above the control panel. Shows pill-shaped shot indicators (⚈/⚆) in a row. Semi-transparent background, subtle border.
- **Expanded state**: Full overlay panel with vertical scroll, showing each shot as a row with timestamp, shot icon, pots, and break score if applicable.
- **Transition**: Smooth expand/collapse animation.
- **Z-index**: Above game canvas, below notifications.

Key classes:

- `.ball-tray` — container
- `.ball-tray-collapsed` — compact view
- `.ball-tray-expanded` — expanded view
- `.ball-tray-shot` — individual shot pill
- `.ball-tray-break` — break summary pill
- `.ball-tray-expanded .shot-row` — expanded shot entry

---

## 3. New File: `src/view/ball-tray.ts`

A new view component that manages the ball tray DOM element.

### Class: `BallTray`

**Constructor**: Takes a reference to the `Container` (for access to `Recorder`).

**State**:

- `expanded: boolean` — tracks whether the tray is expanded
- `entries: ShotEntry[]` — mirrors recorder entries for rendering

**Methods**:

| Method                                    | Purpose                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `addShot(entry: RecordEntry)`             | Add a single shot to the tray, update collapsed view |
| `addBreak(breakData: any, score: number)` | Add a break summary entry                            |
| `renderCollapsed()`                       | Render last 2-3 shots as pills                       |
| `renderExpanded()`                        | Render full history with details                     |
| `toggle()`                                | Expand/collapse on click                             |
| `reset()`                                 | Clear tray on new game/rerack                        |

### ShotEntry type

```typescript
interface ShotEntry {
  icon: string; // "⚈" or "⚆" based on pots/break
  label: string; // Short description like "2 pots", "break(5)"
  color: string; // Ball color hex
  replayData: any; // Encoded replay state for link
  timestamp: number; // When the shot occurred
  isBreak: boolean; // Whether this is a break summary
}
```

---

## 4. Integration Changes

### `src/events/recorder.ts`

- Remove calls to `linkFormatter.lastShotLink()` and `linkFormatter.breakLink()`
- Add a `BallTray` dependency (or emit events that `BallTray` subscribes to)
- In `updateBreak()`, call `ballTray.addShot()` for each shot and `ballTray.addBreak()` when a break ends

### `src/view/link-formatter.ts`

- Remove `lastShotLink()` and `breakLink()` methods (or keep for backward compat if needed)
- `generateLink()` no longer pushes `ChatEvent` for shot/break data
- Keep `wholeGameLink()` — this can remain in chat or move to ball tray later

### `src/container/container.ts`

- Add `ballTray: BallTray` instance
- Wire it to `Recorder`

### `src/index.ts`

- Instantiate `BallTray` during game init
- Attach click handler to `#ballTray` element

---

## 5. Behavior Details

### Collapsed View (default)

- Shows last 2-3 shot pills horizontally
- Each pill is a colored circle/icon matching the ball color
- Break summaries shown as a distinct pill (e.g., `⚈⚈⚈ break(5)`)
- Click anywhere on tray to expand

### Expanded View

- Full vertical list of all shots in the game
- Each row shows: `[icon] [ball color] [pots] [timestamp]`
- Break summaries shown as grouped entries with score
- Each row is clickable to open the replay link
- Click outside the expanded panel or on a close button to collapse

### Replay Links

- Each shot/break pill remains clickable and opens the replay URL (same behavior as current chat links)
- The `ReplayEncoder` logic stays the same, just the destination changes

---

## 6. Edge Cases

- **Empty state**: Show a subtle placeholder like "No shots yet" when the tray is empty
- **New game/rerack**: Clear the tray and start fresh
- **Spectator/replay mode**: Ball tray should still function but may need to handle pre-loaded history
- **Mobile**: Tray should be touch-friendly, expanded view should not obscure controls
- **Long games**: Expanded view should scroll; collapsed view always shows only last 2-3

---

## 7. Testing

- Unit tests in `test/view/ball-tray.spec.ts`
  - Constructor and DOM binding
  - `addShot()` updates collapsed view
  - `addBreak()` creates break summary
  - `toggle()` switches between collapsed/expanded
  - `reset()` clears all entries
- Integration: Verify `Recorder.updateBreak()` correctly populates the tray
- Manual: Click to expand/collapse, verify replay links work

---

## 8. File Summary

| File                          | Action                                              |
| ----------------------------- | --------------------------------------------------- |
| `dist/index.html`             | Add `#ballTray` element                             |
| `dist/index.css`              | Add ball tray styles                                |
| `src/view/ball-tray.ts`       | New file — BallTray component                       |
| `src/events/recorder.ts`      | Remove LinkFormatter shot calls, add BallTray calls |
| `src/view/link-formatter.ts`  | Remove `lastShotLink()`, `breakLink()`              |
| `src/container/container.ts`  | Add BallTray instance                               |
| `src/index.ts`                | Wire up BallTray initialization                     |
| `test/view/ball-tray.spec.ts` | New test file                                       |
