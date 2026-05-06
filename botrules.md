# Proposed Changes to Rules Interface for Generic Bot Support

To enable the bot to play any game variant without rule-specific logic, the `Rules` interface should be refined and rationalized.

## Phased Approach

### Phase 1 — Interface Refactoring (no bot changes)

Refactor the `Rules` interface and all implementing classes so the interface is clean and consistent. The bot (`BotEventHandler`) is **not touched** in this phase. The goal is a stable, well-defined interface that Phase 2 can build on.

#### 1a. Add `foulReason(outcome: Outcome[]): string | null`

Instance method on the interface. Each rule class implements its own foul logic.

- `NineBall`: wraps the existing `static foulReason(table, outcome)` using `this.container.table`
- `EightBall`: already has an instance `foulReason(outcome)` — no change needed
- `Snooker`: derive from `SnookerUtils.calculateFoul`
- `ThreeCushion`: always returns `null` (no fouls)

The static `NineBall.foulReason(table, outcome)` is kept as an internal implementation detail; the new instance method delegates to it.

#### 1b. Add `getAmountScored(outcome: Outcome[]): number`

New method with no conflicts. Returns the score value for a shot outcome:

- `NineBall` / `EightBall`: `Outcome.potCount(outcome)`
- `Snooker`: sum of ball values for legally potted balls
- `ThreeCushion`: `Outcome.isThreeCushionPoint(this.cueball, outcome) ? 1 : 0`

#### 1c. Add `respot(outcome: Outcome[]): Ball[]`

Returns the balls that were moved so callers can broadcast a `RerackEvent`.

**Name collision in Snooker**: `Snooker` already has a `private respot(outcome): void`. This private method must be renamed (e.g. `respotColours`) before the public interface method is added.

- `NineBall`: extracts and returns the nine-ball respot logic from `respotAndBroadcastNineBall()`; the broadcast stays in the rule class for now
- `Snooker`: delegates to `SnookerUtils.respotAllPottedColours`, returns moved balls
- `EightBall`: returns empty array (no automatic respot)
- `ThreeCushion`: returns empty array

#### 1d. Make `asset` a readonly property

`asset(): string` becomes `readonly asset: string` on the interface. Each class sets it as a field. `Assets` and `view.ts` access it as a property instead of a method call.

This is safe: `Assets` constructs a null-container `Rules` instance solely to read `tableGeometry()` and `asset()`. Converting `asset()` to a property has no impact on that usage.

#### What is NOT in Phase 1

**`setupTable()` consolidation is deferred.** Merging `table()`, `rack()`, and `tableGeometry()` is not straightforward:

- `Assets` creates a `Rules` instance with `null` container (`RuleFactory.create(ruletype, null)`) purely to call `tableGeometry()` and read `asset` — before any game state exists. A `setupTable()` that requires a container would break this.
- `rack()` is called internally by `table()` in each class and is also tested directly.
- `ThreeCushion.table()` already calls `this.tableGeometry()` internally; others do not.

These can be consolidated in a later phase once the asset-loading path is decoupled from the `Rules` interface.

**`secondToPlay()` / `otherPlayersCueBall()` rename is deferred.** The proposed `getStartingCueBall(playerIndex)` does not cleanly map to the existing semantics:

- `secondToPlay()` is called in `init.ts` when the second multiplayer player joins; it mutates `this.cueball` on `ThreeCushion` to `balls[1]`.
- `otherPlayersCueBall()` is called in `WatchAim`'s constructor to set `table.cueball` — it returns the *other* player's active ball, not a starting ball.

These are two distinct concerns. Renaming them to a single `getStartingCueBall(playerIndex)` would be misleading and requires changes to `init.ts` and `WatchAim`. Defer to a dedicated multiplayer-turn phase.

#### Phase 1 success criteria

- `Rules` interface has three new methods: `foulReason`, `getAmountScored`, `respot`
- `asset()` method replaced by `readonly asset` property across interface and all implementations
- All rule classes implement the updated interface
- `Snooker`'s private `respot()` renamed to avoid collision
- `yarn lint` and `yarn test` pass with no regressions
- `BotEventHandler` is unchanged

---

### Phase 2 — Bot Refactoring

Once the interface is stable, simplify `BotEventHandler` to use only interface methods:

- Replace `NineBall.foulReason(table, outcome)` → `rules.foulReason(outcome)`
- Replace inline nine-ball respot logic → `rules.respot(outcome)`
- Replace `Outcome.potCount(outcome)` score update → `rules.getAmountScored(outcome)`
- `rules.isPartOfBreak(outcome)` already on interface — no change needed

This removes the `NineBall` import and all `if (nineBallPotted)` checks from the bot.

---

## Revised Rules Interface (target after Phase 1)

```typescript
export interface Rules {
  // Metadata
  readonly rulename: string
  readonly asset: string          // was asset(): string

  // State
  cueball: Ball
  currentBreak: number
  previousBreak: number

  // Lifecycle
  table(): Table                  // unchanged
  rack(): Ball[]                  // unchanged
  tableGeometry(): void           // unchanged (consolidation deferred)
  secondToPlay(): void            // unchanged (rename deferred)
  otherPlayersCueBall(): Ball     // unchanged (rename deferred)
  startTurn(): void
  update(outcome: Outcome[]): Controller

  // Game Logic (new)
  foulReason(outcome: Outcome[]): string | null
  getAmountScored(outcome: Outcome[]): number
  respot(outcome: Outcome[]): Ball[]

  // Navigation
  nextCandidateBall(): Ball | undefined
  isPartOfBreak(outcome: Outcome[]): boolean
  isEndOfGame(outcome: Outcome[]): boolean

  // Ball Placement
  allowsPlaceBall(): boolean
  placeBall(target?: Vector3): Vector3

  // Turn Management
  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller
}
```

### Risk summary

| Change | Complexity | Risk |
|---|---|---|
| `foulReason(outcome)` instance method | Low | Low |
| `getAmountScored(outcome)` | Low | Low |
| `respot(outcome): Ball[]` | Medium — Snooker private name collision | Medium |
| `asset` as readonly property | Low | Low |
| `setupTable()` consolidation | High — `Assets` uses null-container Rules | Deferred |
| `getStartingCueBall(playerIndex)` | Medium — two distinct call sites, misleading semantics | Deferred |
