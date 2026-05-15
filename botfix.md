# Bot Snooker Respot Fix

## Bug Analysis
The bot in snooker mode incorrectly respots potted colours even when no reds remain on the table.

### Root Cause
In `BotEventHandler.handleStationary` (src/network/bot/boteventhandler.ts):

```typescript
    if (this.container.rules.rulename !== "threecushion") {
      this.botRules.advanceState?.(outcome)
    }
    if (pots > 0) {
      // ...
      const respotted = this.botRules.respot(outcome)
      // ...
    }
```

The bot calls `advanceState` before `respot`.
In `Snooker.advanceState` (src/controller/rules/snooker.ts):

```typescript
    if (this.targetIsRed) {
      // ...
    } else {
      this.previousPotRed = false
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0
    }
```

If the bot was targeting a colour (not targetIsRed), `advanceState` immediately updates `targetIsRed` based on whether reds remain. If no reds remain, `targetIsRed` stays `false`.

However, `Snooker.respot` currently relies on `SnookerUtils.respotAllPottedColours` which ALWAYS respots all colours:

```typescript
  respot(outcome: Outcome[]): Ball[] {
    return SnookerUtils.respotAllPottedColours(this.container.table, outcome)
  }
```

In normal play (not bot), `snookerrule` (which calls `targetColourRule`) handles respotting correctly because it has its own logic:

```typescript
    if (this.previousPotRed) {
      this.respotColours(outcome) // Respot if it was a colour-after-red
      // ...
    }
```

The bot's generic `handleStationary` loop doesn't know about these snooker-specific nuances and relies on `respot(outcome)` to "do the right thing".

## Suggested Solution

### 1. Fix Call Order in `BotEventHandler`
The `BotEventHandler` should determine which balls to respot BEFORE advancing the game state.

**File:** `src/network/bot/boteventhandler.ts`
```typescript
<<<<<<< SEARCH
    if (this.container.rules.rulename !== "threecushion") {
      this.botRules.advanceState?.(outcome)
    }
    if (pots > 0) {
      if (this.handleEightBallEarlyPot(outcome)) {
        return
      }
      const respotted = this.botRules.respot(outcome)
=======
    const respotted = pots > 0 ? this.botRules.respot(outcome) : []
    if (this.container.rules.rulename !== "threecushion") {
      this.botRules.advanceState?.(outcome)
    }
    if (pots > 0) {
      if (this.handleEightBallEarlyPot(outcome)) {
        return
      }
>>>>>>> REPLACE
```

### 2. Make `Snooker.respot` State-Aware
Update `Snooker.respot` to only return colours that actually need respotting based on the current state (if reds remain OR if it's the "colour-after-red" part of the break).

**File:** `src/controller/rules/snooker.ts`
```typescript
<<<<<<< SEARCH
  respot(outcome: Outcome[]): Ball[] {
    return SnookerUtils.respotAllPottedColours(this.container.table, outcome)
  }
=======
  respot(outcome: Outcome[]): Ball[] {
    if (this.previousPotRed || SnookerUtils.redsOnTable(this.container.table).length > 0) {
      return SnookerUtils.respotAllPottedColours(this.container.table, outcome)
    }
    return []
  }
>>>>>>> REPLACE
```

This ensures that `respot()` returns an empty array when we are in the "clearing the colours" phase of snooker, which is what the bot needs.
