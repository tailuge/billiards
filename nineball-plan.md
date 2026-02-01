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
