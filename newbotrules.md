# Bot Rules State Fix

## Problem

The bot (`BotEventHandler`) calls `container.rules.foulReason()` and `container.rules.nextCandidateBall()` on the shared `Rules` instance. For snooker and three-cushion, these methods depend on turn-to-turn state that is only advanced when `rules.update(outcome)` is called — which only happens on the human's controller path. The bot never calls `update()`, so it reads stale state.

Affected rule sets:
- **Snooker**: `targetIsRed`, `previousPotRed` — determines legal first collision and which ball to target next
- **Three-cushion**: `cueball` — alternates between players each turn

Nine-ball and eight-ball are unaffected (stateless foul/target logic).

## Approach

### 1. Add `advanceState(outcome)` to the `Rules` interface (optional method)

```typescript
// rules.ts
advanceState?(outcome: Outcome[]): void
```

Pure state update only — no controller transitions, no UI side effects, no scoring.

### 2. Implement `advanceState` in Snooker

Updates `targetIsRed` and `previousPotRed` based on outcome, mirroring the logic already in `snookerrule()` but without calling `Session`, `container.notify`, `container.sendEvent`, or returning a `Controller`.

### 3. Implement `advanceState` in ThreeCushion

Switches `this.cueball` to `otherPlayersCueBall()` on a miss, mirroring the logic in `update()`.

### 4. Create a `BotContainer` stub

A lightweight wrapper around the real `Container` that:
- Exposes the real `table` (read access to ball positions is needed)
- No-ops `notify`, `sendEvent`, `sound`, `isSinglePlayer`

```typescript
class BotContainer {
  table: Table  // real shared table
  notify() {}
  sendEvent() {}
  sound = { playSuccess() {} }
  isSinglePlayer = false
  recorder = container.recorder  // needed by nextCandidateBall isFirstShot check
}
```

### 5. Bot owns its own `Rules` instance

In `BotEventHandler` constructor:

```typescript
this.botRules = RuleFactory.create(ruletype, new BotContainer(container))
```

### 6. Bot calls `advanceState` after each shot

In `handleStationary()`, after processing the outcome:

```typescript
this.botRules.advanceState?.(outcome)
```

Then replace all calls to `container.rules.foulReason()` and `container.rules.nextCandidateBall()` with `this.botRules.foulReason()` and `this.botRules.nextCandidateBall()`.

## Files to change

| File | Change |
|------|--------|
| `src/controller/rules/rules.ts` | Add optional `advanceState?(outcome: Outcome[]): void` |
| `src/controller/rules/snooker.ts` | Implement `advanceState` — update `targetIsRed`/`previousPotRed` without side effects |
| `src/controller/rules/threecushion.ts` | Implement `advanceState` — switch `cueball` on miss |
| `src/network/bot/eventhandler.ts` | Add `BotContainer` stub, create `botRules`, call `advanceState`, use `botRules` for queries |

No changes needed to nine-ball, eight-ball, or any shared game logic.

## What does not change

- The shared `container.rules` instance is never mutated by the bot
- Human player path is identical to today
- Scoring in `handleStationary()` stays as-is (bot scores via `session.addOpponentScore`)
- No double-counting risk since `botRules.update()` is never called
