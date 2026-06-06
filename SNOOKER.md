# Snooker Score Upload Issue Report

## Issue Summary
In Snooker mode, match results are occasionally uploaded for both the winner and the loser. This results in duplicate or conflicting entries in the scoreboard.

## Technical Analysis

The issue is primarily caused by a race condition in the game-end sequence, exacerbated by how Snooker handles winner determination compared to other game modes.

### 1. Winner Determination Logic
In `src/network/client/matchresult.ts`, the `determineWinner` method has a special case for Snooker:

```typescript
if (rulename === "snooker") {
  return isWinnerByScore;
}
```

Unlike Eight-Ball or Nine-Ball, where potting the money ball (`forcedAmIWinner`) definitively decides the game, Snooker relies entirely on the current score in the `Session` at the moment the game ends.

### 2. Score Synchronization Race Condition
The game-end flow typically proceeds as follows:

1.  **Active Player**: Completes the final shot. `PlayShot.handleStationary` is triggered.
2.  **Active Player**: Updates scores locally and broadcasts a `ScoreEvent` to the opponent.
3.  **Active Player**: Detects `isEndOfGame` and transitions to the `End` state.
4.  **Watching Player**: Their local physics simulation also reaches a stationary state, triggering `WatchShot.handleStationary`.
5.  **Watching Player**: If `isEndOfGame` is true, it immediately calls `handleGameEnd(false)`.

The critical flaw is that the **Watching Player** might process the `StationaryEvent` and trigger game-end logic **before** the `ScoreEvent` (sent by the active player) has been received or processed from the event queue.

If the final shot resulted in a lead change or a foul that decided the game, the watching client's local score state will be **stale**. Because Snooker winner determination is score-based, the watching client may incorrectly believe it has won based on this stale data.

### 3. Dual Submission Trigger
In `src/controller/end.ts`, the `onFirst` method checks if the current client is the winner before submitting:

```typescript
if (
  this.result &&
  this.container.scoreReporter &&
  (MatchResultHelper.isWinner(this.result) || ...)
) {
  this.container.scoreReporter.submitMatchResult(this.result);
}
```

If both clients believe they are the winner (one because they actually won, the other because of stale score data), both will invoke `submitMatchResult`, leading to the observed dual upload.

### 4. Secondary Factors
*   **Player Identification**: If players haven't set names, they default to "Anon". While `MatchResult` includes winner/loser names, identical names make debugging these duplicates more difficult.
*   **Event Processing**: `Container.processEvents` only processes one event per frame when stationary. A `StationaryEvent` might be prioritized or processed immediately when the table stops, while a `ScoreEvent` might still be sitting in the `eventQueue`.

## Potential Solutions (for future implementation)

1.  **Drain Event Queue**: Ensure the event queue is fully processed before allowing a transition to the `End` state in `WatchShot.handleStationary`.
2.  **Acknowledge Final Score**: The watching client could wait for a specific "Final Score" or "Game Over" message from the active client/server instead of relying on local score state.
3.  **Respect `forcedAmIWinner`**: Modify Snooker's `determineWinner` to respect the `isWinner` flag passed from the rules (which is derived from the active player's perspective) rather than strictly re-evaluating based on local score.
4.  **Server-Side Deduplication**: Implement logic on the scoreboard API to prevent multiple submissions for the same table ID within a short timeframe.
