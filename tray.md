# Ball Tray Plan (Simplified)

## Goal

In live two-player games, display the opponent's shots in the ball tray as a series of isolated, ungrouped shots (without break grouping or highscore upload links). Each opponent shot appears in the tray with its individual replay link, while local breaks continue to function normally with highscore upload support.

## Design Rationale

- **Ungrouped Opponent Shots**: Opponent shots are passed to `recorder.updateBreak(outcome, false, false)` as individual, non-break shots (`isPartOfBreak = false`).
- **Zero Schema/Model Changes**: `Recorder` and `BallTray` already support recording and rendering individual non-break shots (`addShotToTray`). By treating opponent shots as isolated non-break shots, `addBreakToTray` is never invoked for the opponent.
- **No Highscore Links for Opponent**: Since `BallTray.getTopBreaks()` only counts breaks (`isBreak === true`) with highscore URIs, opponent shots are automatically excluded from top breaks and game-over highscore prompts.

## Proposed Changes

### Controller

#### [MODIFY] [watchshot.ts](file:///home/august/git/billiards/src/controller/watchshot.ts)

- In `handleStationary()`, extract `outcome = this.container.table.outcome` and call `this.container.recorder.updateBreak(outcome, false, false)` prior to game-end check.
- This ensures every completed opponent shot records its outcome and adds an individual shot entry with a replay link to `ballTray`.

### Tests

#### [MODIFY] [watchshot.spec.ts](file:///home/august/git/billiards/test/controller/watchshot.spec.ts)

- Add a unit test verifying that `handleStationary` on `WatchShot` calls `recorder.updateBreak(outcome, false, false)` and adds a shot entry to `ballTray`.

## Verification Plan

### Automated Tests
```bash
yarn test test/controller/watchshot.spec.ts test/view/ball-tray.spec.ts
yarn lint
yarn test
yarn prettify
yarn build
```

### Manual Verification
- Start dev server (`yarn serve`), trigger an opponent shot in multiplayer/spectate mode, and verify opponent shot icons appear in the ball tray with clickable replay links but without break tags or highscore prompts.
