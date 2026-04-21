# Proposed Changes to Rules Interface for Generic Bot Support

To enable the bot to play any game variant without rule-specific logic, the `Rules` interface should be refined and rationalized.

## 1. Core Logic & Scoring
These changes allow the bot to understand the state of the game after a shot without knowing the specific rules of Nine-Ball, Snooker, etc.

- **`foulReason(outcome: Outcome[]): string | null`**
  Standardizes foul detection. Currently, this is implemented inconsistently across rule classes. The bot can use this to notify players and decide on respotting/turn switching.
- **`getAmountScored(outcome: Outcome[]): number`**
  Replaces the assumption that 1 pot = 1 point. This is essential for Snooker (where balls have different values) and Three-Cushion (where points are not based on pots).
- **`respot(outcome: Outcome[]): Ball[]`**
  Encapsulates rule-specific ball respotting (e.g., 9-ball, Snooker colors, 8-ball). Returns an array of balls that were moved so the bot can broadcast a `RerackEvent`.

## 2. Interface Rationalization
The current interface has some "leaky abstractions" and sprawling setup methods.

- **Consolidate Setup**:
  Merge `table()`, `rack()`, `tableGeometry()`, and `asset()` into a more cohesive setup flow or a configuration object.
  - Proposed: `setupTable(): Table` which handles internal geometry and ball placement.
- **Generalize Multiplayer/Variant Hooks**:
  - Replace `secondToPlay()` and `otherPlayersCueBall()` with more generic methods like `onTurnChange(activePlayer: number)` or `getStartingCueBall(playerIndex: number)`.
  - This removes Three-Cushion specific logic from the core game loop.

## 3. Revised Rules Interface (Draft)

```typescript
export interface Rules {
  // Metadata
  readonly rulename: string;
  readonly asset: string;

  // State Management
  cueball: Ball;
  currentBreak: number;
  previousBreak: number;

  // Lifecycle
  setupTable(): Table;
  startTurn(): void;
  update(outcome: Outcome[]): Controller;

  // Game Logic
  foulReason(outcome: Outcome[]): string | null;
  getAmountScored(outcome: Outcome[]): number;
  respot(outcome: Outcome[]): Ball[]; // Returns balls moved for sync

  // Navigation
  nextCandidateBall(): Ball | undefined;
  isPartOfBreak(outcome: Outcome[]): boolean;
  isEndOfGame(outcome: Outcome[]): boolean;

  // Ball Placement (Ball-in-Hand)
  allowsPlaceBall(): boolean;
  placeBall(target?: Vector3): Vector3;

  // Player/Turn Management
  getStartingCueBall(playerIndex: number): Ball;
  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller;
}
```

## 4. Bot Refactoring
Once the interface is updated, `BotEventHandler` can be simplified:
- Use `rules.foulReason()` to detect fouls.
- Use `rules.respot()` to handle ball returns.
- Use `rules.getAmountScored()` to update `Session` scores.
- Use `rules.isPartOfBreak()` to determine if the bot takes another shot.

This removes all `if (nineBallPotted)` or `NineBall.foulReason` style checks from the bot's code.
