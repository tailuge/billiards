# Nine-Ball Rules Implementation Plan

## Overall Goal

To correctly implement the rules of Nine-Ball within the existing game engine by modifying `src/controller/rules/nineball.ts`. This plan outlines the necessary logic changes to support full Nine-Ball rules, including complex foul detection and early-win scenarios.

## Core Rules to Implement

- **Target Ball**: The lowest-numbered ball currently on the table is the legal target.
- **First Contact**: The cue ball must hit the target ball first.
- **Legal Shot**: After contact, at least one ball must be pocketed, or any ball (including the cue ball) must touch a cushion.
- **Winning**: Pocketing the 9-ball on a legal shot wins the game.
- **Fouls**: Any violation results in "ball-in-hand" for the opponent anywhere on the table.
- **Respotting**: If the 9-ball is pocketed on a foul, it is respotted on the foot spot. Other balls stay pocketed.

## Proposed Changes to `src/controller/rules/nineball.ts`

### 1. `update(outcome: Outcome[])` Method

The `update` method will process the `Outcome` array to determine if a foul occurred or if the turn continues.

- **Pre-calculation**: Determine the `lowestBall` on the table before processing the outcome.
- **Foul Detection logic**:
    - **Cue Ball Potted**: Check `Outcome.isCueBallPotted`.
    - **Wrong Ball/No Ball Hit**: 
        - Find the first collision involving the cue ball using `Outcome.firstCollision`.
        - If no collision occurred, it's a foul.
        - If the `ballB` in the first collision is not the `lowestBall`, it's a foul.
    - **No Cushion After Contact**:
        - If no balls were pocketed (`Outcome.potCount(outcome) === 0`):
            - Check if any `OutcomeType.Cushion` occurred *after* the first collision.
            - If no cushion was hit after contact, it's a foul.
- **Turn Transition**:
    - **On Foul**: 
        - If 9-ball was pocketed, call `respotNineBall()`.
        - Return `PlaceBall` controller (or send `PlaceBallEvent`) for the opponent.
    - **On Legal Pot**:
        - If 9-ball was potted, the current player wins. Return `End` controller.
        - Otherwise, the current player continues. Return `Aim` controller.
    - **On Legal Miss**:
        - Switch to the opponent. Return `WatchAim` (or `Aim` in single player).

### 2. `nextCandidateBall()` Method

- Update to return the ball with the lowest number currently on the table.
- This is used for the UI to highlight the target ball.

### 3. `isEndOfGame(outcome: Outcome[])` Method

- Update to check if the 9-ball is among the pocketed balls (`Outcome.pots(outcome)`) and that the shot was NOT a foul.

### 4. `placeBall(target?: Vector3)` Method

- Ensure it allows placement anywhere on the table when ball-in-hand is granted.
- The current implementation seems restricted to the baulk area; this needs to be corrected for Nine-Ball.

### 5. `respotNineBall()` (New Private Method)

- If the 9-ball is pocketed during a foul, it must be returned to the table.
- **Position**: Foot spot, which is `new Vector3(TableGeometry.tableX / 2, 0, 0)`.
- **Blocked Path**: If the foot spot is occupied by any other ball, the 9-ball should be placed on the **long string** (the line from the foot spot to the center of the foot cushion) as close to the foot spot as possible. This means incrementing the X coordinate until an available spot is found.

## Testing Approach

### 1. New Test File: `test/rules/nineball.spec.ts`

- Comprehensive unit tests for the `NineBall` class.

### 2. Key Test Scenarios

- **First Contact Fouls**:
    - Hit no balls -> Foul.
    - Hit 2-ball when 1-ball is on table -> Foul.
    - Hit 1-ball first, then 9-ball into pocket -> Legal win.
- **Cushion Fouls**:
    - Hit 1-ball, no ball pocketed, no ball hits cushion -> Foul.
    - Hit 1-ball, no ball pocketed, cue ball hits cushion -> Legal.
    - Hit 1-ball, 1-ball hits cushion, no ball pocketed -> Legal.
- **9-Ball Specifics**:
    - Pot 9-ball on break -> Legal win.
    - Pot 9-ball on foul -> 9-ball respotted, opponent gets ball-in-hand.
- **Ball-in-Hand**:
    - Verify `PlaceBall` is returned after any foul.
    - Verify cue ball can be placed anywhere.

### 3. Real Objects vs. Mocking

- **Real Models**: Use real `Table` and `Ball` objects to simulate various table states (e.g., only 1, 5, 9 balls left). This ensures the tests are grounded in the actual physics engine's data structures.
- **Outcome Construction**: Manually construct `Outcome` arrays with specific sequences of `Pot`, `Collision`, and `Cushion` events to test edge cases in foul detection (e.g., first contact with wrong ball, 9-ball potted on foul).
- **Isolate Logic**: Only mock external dependencies like `this.container.sound` or `this.container.sendEvent` to verify that the correct side effects are triggered without needing a full UI or network stack.
