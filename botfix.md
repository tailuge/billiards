# Bot Snooker Respot Fix

## Bug Analysis
The bot in snooker mode incorrectly respots potted colours even when no reds remain on the table and the colour is being potted as part of the final clearing sequence.

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

The bug occurs because the bot calls `advanceState` before `respot`. In snooker rules, `advanceState` clears the `previousPotRed` flag and updates the next required ball type. By the time `this.botRules.respot(outcome)` is called, the rules object has already transitioned to the next state, losing the context of the shot just played.

Additionally, `Snooker.respot` is currently a stateless pass-through to `SnookerUtils.respotAllPottedColours`, which ALWAYS respots all colours. While this is correct for fouls, it is incorrect for legal pots during the final clearing phase.

## Suggested Solution (Minimal)

The recommended fix is to reorder the operations in `BotEventHandler` and add a minimal snooker-specific check to determine if respotting is required *before* the game state is advanced. This avoids changing the core `Snooker` rules which are verified for human player use.

### Fix in `BotEventHandler.handleStationary`

**File:** `src/network/bot/boteventhandler.ts`

Note: `Snooker` and `SnookerUtils` are already imported in this file.

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
      respotted.forEach((ball) => ball.fround())
      this.handlePot(pots, outcome)
      return
    }
=======
    const snooker =
      this.container.rules.rulename === "snooker"
        ? (this.botRules as Snooker)
        : null
    const shouldRespot =
      !snooker ||
      snooker.previousPotRed ||
      SnookerUtils.redsOnTable(this.container.table).length > 0
    const respotted =
      pots > 0 && shouldRespot ? this.botRules.respot(outcome) : []

    if (this.container.rules.rulename !== "threecushion") {
      this.botRules.advanceState?.(outcome)
    }
    if (pots > 0) {
      if (this.handleEightBallEarlyPot(outcome)) {
        return
      }
      respotted.forEach((ball) => ball.fround())
      this.handlePot(pots, outcome)
      return
    }
>>>>>>> REPLACE
```

### Why this is the best approach:
1.  **Minimality:** It keeps bot-specific workarounds within the `BotEventHandler`, avoiding changes to the core `Snooker` rules.
2.  **Correctness:** It evaluates the need for respotting using the state *at the time of the shot*, before `advanceState` modifies it.
3.  **Preserves Existing Behavior:** By checking `!snooker || shouldRespot`, it ensures that other game modes (like 8-ball and 9-ball) continue to use their existing respotting logic without change.
