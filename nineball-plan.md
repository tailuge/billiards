# Nine-Ball Rules Implementation Plan

## Overall Goal

To correctly implement the rules of Nine-Ball within the existing game engine by modifying `src/controller/rules/nineball.ts`. This plan outlines the necessary logic changes without writing the full code.

## Proposed Changes to `src/controller/rules/nineball.ts`

### 1. `update(outcome: Outcome[])` Method

The `update` method will be the central point for processing game events. It needs to handle the following scenarios:

- **Foul Detection:**
    - Check for fouls first. A foul occurs if:
        - The cue ball is potted.
        - The first ball contacted is not the lowest-numbered ball on the table.
        - No ball is pocketed, and no ball contacts a cushion after the cue ball hits the object ball.
    - If a foul occurs, the opponent gets ball-in-hand.
    - If the 9-ball is pocketed on a foul shot, it must be respotted. Other pocketed balls remain pocketed.

- **Legal Shot Processing:**
    - If no foul occurs:
        - **Winning Shot:** Check if the 9-ball was legally pocketed. A legal pocket of the 9-ball wins the game. This can be on a direct hit or a combination shot.
        - **Continuing Turn:** If a ball (other than the 9-ball) is pocketed on a legal shot, the current player's turn continues.
        - **End of Turn:** If no ball is pocketed, but the shot was legal (a ball hit a cushion), the turn ends and the opponent plays.

### 2. `nextCandidateBall()` Method

- This method should be updated to return the ball with the lowest number currently on the table.
- It will iterate through `this.container.table.balls`, filter for balls that are `onTable()`, and find the one with the minimum `id`.

### 3. `isEndOfGame(outcome: Outcome[])` Method

- This method should be updated to check for the winning condition.
- It will return `true` only if the 9-ball is pocketed and the `outcome` does not represent a foul.

### 4. Foul Handling (New Private Method)

- A new private method, e.g., `handleFoul(outcome: Outcome[])`, should be created to manage the consequences of a foul.
- This method will:
    - Check if the 9-ball was potted. If so, call a new `respotNineBall()` method.
    - Transition to the next player's turn.
    - Give the incoming player "ball-in-hand" (the ability to place the cue ball anywhere). This will likely involve returning a `PlaceBall` controller.

### 5. 9-Ball Respotting (New Private Method)

- A new private method, e.g., `respotNineBall()`, should be created.
- This method will place the 9-ball back on the table at its designated spot (usually the foot spot). If the spot is occupied, it should use the standard rules for placing it as close as possible on the line behind the spot.

## File to be Modified

- `src/controller/rules/nineball.ts`

## Testing Approach

The implementation of the Nine-Ball rules will be thoroughly tested using Jest, following the existing project conventions.

### 1. Test File Location

- A new test file, `test/rules/nineball.spec.ts`, will be created to house all tests related to the `NineBall` class.

### 2. Unit Testing `NineBall` Class Methods

- **`update(outcome: Outcome[])`:**
    - Test scenarios for legal shots, including potting non-9-ball, potting 9-ball (winning), and no pot (turn ends).
    - Test all defined foul scenarios: cue ball potted, wrong ball hit first, no ball hit cushion/potted.
    - Verify correct transition to `Aim` or `PlaceBall` controllers based on the outcome.
    - Verify correct score updates and turn management.
- **`nextCandidateBall()`:**
    - Test that it correctly identifies and returns the lowest-numbered ball on the table.
- **`isEndOfGame(outcome: Outcome[])`:**
    - Test cases where the 9-ball is legally potted, leading to a win.
    - Test cases where the 9-ball is not legally potted, and the game continues.
- **`handleFoul(outcome: Outcome[])` (New Private Method):**
    - Test that it correctly identifies if the 9-ball was potted on a foul and triggers `respotNineBall`.
    - Verify that it sets up the next player with "ball-in-hand."
- **`respotNineBall()` (New Private Method):**
    - Test that the 9-ball is correctly respotted at its designated location.
    - Handle scenarios where the spot is occupied.

### 3. Mocking Dependencies

- The `NineBall` class's dependencies, such as `this.container.table` and `Outcome` objects, will be mocked to isolate the logic of the rules engine during testing.
- This will allow for precise control over the state of the game for each test case.

### 4. Coverage

- Aim for high test coverage to ensure all edge cases and rule variations are adequately handled.
- Focus on comprehensive test cases for foul detection and game-winning conditions.
