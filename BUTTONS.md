# Button Changes Plan

## Part 1: Disable Hit Button in WatchAim/WatchShot/Replay States

### Goal

Grey out and disable the hit button when the controller is in `WatchAim`, `WatchShot`, or `Replay` states (spectating multiplayer or watching a replay).

### Files to Modify

#### 1. `src/view/aiminputs.ts`

Add method:

```typescript
setDisabled(disabled: boolean) {
  if (this.cueHitElement) {
    this.cueHitElement.disabled = disabled
  }
}
```

#### 2. `dist/index.css`

Add after `.hitButton:active`:

```css
.hitButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### 3. `src/controller/watchaim.ts`

Add `onFirst()` override:

```typescript
override onFirst() {
  this.container.table.cue.aimInputs.setDisabled(true)
}
```

#### 4. `src/controller/watchshot.ts`

Add `onFirst()` override:

```typescript
override onFirst() {
  this.container.table.cue.aimInputs.setDisabled(true)
}
```

#### 5. `src/controller/replay.ts`

Add `onFirst()` override:

```typescript
override onFirst() {
  this.container.table.cue.aimInputs.setDisabled(true)
}
```

#### 6. `src/controller/aim.ts`

Add `onFirst()` override:

```typescript
override onFirst() {
  this.container.table.cue.aimInputs.setDisabled(false)
}
```

#### 7. `src/controller/placeball.ts`

Add to existing `onFirst()`:

```typescript
this.container.table.cue.aimInputs.setDisabled(false);
```

---

## Part 2: Remove Replay and Redo Buttons

### Goal

Remove `#replay` and `#redo` buttons and all supporting code.

### Files to Modify

#### 1. `dist/index.html`

Remove lines 137-155 (both button elements):

```html
<button class="menuButton" title="replay" id="replay" ...>↻</button>
<button class="menuButton" title="retry" id="redo" ...>⎌</button>
```

#### 2. `src/view/menu.ts`

- Remove properties: `redo: HTMLButtonElement`, `replay: HTMLButtonElement`
- Remove in constructor: `this.replay = this.getElement("replay")`, `this.redo = this.getElement("redo")`
- Remove in `setMenu()`: `this.replay.disabled = disabled`, `this.redo.disabled = disabled`
- Remove entire `replayMode()` method (lines 42-63)
- Remove entire `interuptEventQueue()` method (lines 65-71)

#### 3. `src/container/browsercontainer.ts`

Remove call to `replayMode()`:

```typescript
this.container.menu.replayMode(window.location.href, breakEvent);
```

#### 4. `test/view/menu.spec.ts`

Remove tests:

- "replay mode shorten url"
- "redo button"
- "replay button"

### Files NOT Modified (Keep)

- `src/controller/replay.ts` - still used for URL-based replay via `?state=` param
- `src/events/breakevent.ts` - still used internally
- Diagram HTML files in `dist/diagrams/` - have their own replay buttons

---

## Summary

- Part 1: 5 TS files, 1 CSS file, ~12 lines added
- Part 2: 2 TS files, 1 HTML file, 1 test file, ~50 lines removed
