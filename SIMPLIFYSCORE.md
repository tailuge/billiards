# Simplified Score HUD Refactor Plan

The objective is to improve the Snooker HUD and scoring logic without introducing global side effects that break other game rules (like NineBall).

## Core Requirements
- HUD must show both total score and current break.
- Player names and scores should be smaller (`0.6em`).
- Break score remains at `1em`.
- Remove direct `hud.updateBreak` calls from `snooker.ts`.
- Ensure local score updates are reflected immediately.

## Proposed Changes

### 1. View / Styling
- **`dist/index.css`**: Adjust `.p1Score`, `.p2Score` to `0.6em`. Keep `.breakScore` at `1em`.
- **`src/view/hud.ts`**:
    - Update `updateScores(p1, p2, p1Name, p2Name, b)` to accept and display the break `b`.
    - Ensure it handles the absence of player names (single player mode) by showing "Score: X".

### 2. Scoring Logic (Rule-Specific)
- **`src/controller/rules/snooker.ts`**:
    - Manage `scores` and `currentBreak` locally in the class.
    - Create a simple `syncScore()` helper that:
        1. Updates internal state.
        2. Calls `this.container.hud.updateScores(...)` for immediate local display.
        3. Sends a `ScoreEvent` via `this.container.sendEvent()` for network syncing/recording.
    - **CRITICAL**: Do NOT modify `Container.sendEvent` to push to the local queue automatically, as this breaks logic that expects events to be processed exactly once or in a specific order.

### 3. Controller / Event Handling
- **`src/controller/controllerbase.ts`**:
    - In `handleScore(event)`, call `hud.updateScores` using the data from the event. This handles syncing for the second player and replays.
- **`src/controller/playshot.ts`**:
    - Keep it simple: it calls the rules' `update` and then sends a `ScoreEvent`. The rules should have already updated the local HUD if it was a "local" turn.

## Verification
1. Run `yarn test` to ensure no regressions in `NineBall` or `Snooker`.
2. Verify Snooker HUD visually:
    - Font sizes are correct.
    - Break and score appear together.
    - Updates are immediate in single player.
3. Verify Replays:
    - Scores are recorded and played back correctly.

Remember that the way the score array is setup has to always take into account Session.playerIndex because control passes between players.