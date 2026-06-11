# Replay and 2-Player Ball Tray Fix Plan

## Problem Analysis

### 1. Missing Shots in Replay Mode
In `Replay` mode, the `BallTray` at the top of the screen does not display any shots. This is because the `BallTray` is updated via the `Recorder.updateBreak()` method. Currently, `updateBreak()` is only called within the `PlayShot.handleStationary()` method. When in `Replay` mode, the `Replay` controller manages the game state, and its `handleStationary()` method lacks the necessary call to `recorder.updateBreak()`.

### 2. Missing Opponent Shots in 2-Player Mode
Similarly, in 2-player (online) mode, shots taken by the opponent are not shown in the ball tray. When the opponent is playing, the local client is in the `WatchShot` controller state. Like the `Replay` controller, `WatchShot.handleStationary()` does not call `recorder.updateBreak()`, leaving the ball tray unpopulated for opponent actions.

## Proposed Surgical Fix

To fix these issues without impacting other aspects of the ball tray or recorder, we must ensure that `recorder.updateBreak()` is called whenever a shot concludes and the balls come to a rest, regardless of the active controller.

### Step 1: Update `Replay` Controller
In `src/controller/replay.ts`, add the following logic to `handleStationary(outcome)`:
- Determine `isPartOfBreak` and `isEndOfGame` using the current rules.
- Call `this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame)`.
- **Note:** Since `Replay` mode often involves pre-determined outcomes, we must ensure the `Rules` object state (e.g., `previousPotRed` in Snooker) is synchronized if necessary via `rules.advanceState(outcome)`.

### Step 2: Update `WatchShot` Controller
In `src/controller/watchshot.ts`, add the following logic to `handleStationary(outcome)`:
- Determine `isPartOfBreak` and `isEndOfGame` using the current rules.
- Call `this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame)`.
- This ensures that when the opponent's shot finishes locally, the ball tray reflects the result.

### Implementation Details
The implementation should mirror the logic in `PlayShot.ts`:
```typescript
const outcome = this.container.table.outcome;
const isPartOfBreak = this.container.rules.isPartOfBreak(outcome);
const isEndOfGame = this.container.rules.isEndOfGame(outcome);

// Sync rules state for accurate tray grouping/icons in modes where update() isn't called
if (this.container.rules.advanceState) {
    this.container.rules.advanceState(outcome);
}

this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame);
```

## Verification Plan
1. **Replay Mode:** Load a replay and verify that shots appear in the ball tray as they complete.
2. **2-Player Mode:** Play a match against another client/bot and verify that opponent shots and breaks are correctly added to the tray.
3. **Regressions:** Ensure single-player mode and high-score links remain functional.
