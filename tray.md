# Ball Tray Plan

## Goal

In live two-player games, show shots from both players in one tray. Keep replay links for every shot and break, but show the highscore upload link only for breaks made by the local player. Opponent breaks must not contribute upload links or top-break upload results.

## Changes

1. **`src/controller/watchshot.ts`**
   - In `handleStationary()`, compute `isPartOfBreak` and `isEndOfGame` from
     `this.container.rules`, then call
     `recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame, "opponent")`.
   - Do this before the existing end-of-game handling so the final opponent
     shot is recorded.
   - `isPartOfBreak` and `isEndOfGame` mirror the `PlayShot` logic:
     `this.container.rules.isPartOfBreak(outcome)` and
     `this.container.rules.isEndOfGame(outcome)`.

2. **`src/events/recorder.ts`**
   - Add an `origin: "local" | "opponent"` parameter to `updateBreak()`,
     defaulting to `"local"` (all existing callers unchanged).
   - Thread `origin` through to `addShotToTray()` and `addBreakToTray()`.
   - No changes to `record()`, replay encoding, or the recorder's `entries`
     array — origin only affects the tray, not event recording.

3. **`src/view/ball-tray.ts`**
   - Add an optional `origin: "local" | "opponent"` field to `ShotEntry`.
   - Accept `origin` in `addShot()` and `addBreak()`, storing it on the entry.
   - Always render opponent shot and break replay links (replay link is
     always present).
   - Create `hiScoreUri` only when `origin` is undefined or `"local"`; omit
     the 🏆 pill for opponent breaks.
   - `getTopBreaks()` already filters on `typeof entry.hiScoreUri === "string"`,
     so opponent breaks are automatically excluded from game-over highscore
     prompts — no change needed.

4. **Tests**
   - Add one focused `WatchShot`/recorder test proving an opponent shot adds tray entries.
   - Extend the existing ball-tray test to prove a local break gets a highscore link and an opponent break does not.
   - Do not add broad multiplayer or UI tests unless the focused tests expose a regression.

## End-of-game upload: unchanged

Both players see only their own breaks in the GameOver screen and highscore
upload, before and after this change:

- `MatchResultHelper.notifyWin/Loss` calls `getHighBreaks(container)` →
  `ballTray.getTopBreaks(3)`.
- `getTopBreaks` returns only entries where `typeof entry.hiScoreUri === "string"`.
- Opponent-origin breaks never get `hiScoreUri`, so they pass through the tray
  visually (replay links only) but never appear in the upload list.
- Each player's tray contains shots from both sides, but only the local
  player's breaks surface in `getTopBreaks`. Net effect is identical to
  today — the opponent's previously-empty tray becomes populated but only
  with non-uploadable entries.

## Verification

Run only the focused tests first:

```bash
yarn test test/view/ball-tray.spec.ts test/controller/controller.spec.ts
```

Then run the required repository checks after implementation:

```bash
yarn lint
yarn test
yarn prettify
yarn build
```
