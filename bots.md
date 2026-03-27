# Bot Interface Proposal

This document outlines a refactored architecture for the bot system to support multiple bot implementations with a clean interface.

## 1. The `Bot` Interface

The core of the new system is the `Bot` interface. It represents a stateless decision engine that takes the current table state and game rules as input and produces a sequence of actions.

```typescript
import { Table } from "../../model/table"
import { Rules } from "../../controller/rules/rules"
import { GameEvent } from "../../events/gameevent"

/**
 * Interface for bot implementations.
 * A bot is responsible for deciding its next action(s) based on the table state.
 */
export interface Bot {
  /**
   * Decides the next action(s) for the bot to take.
   * @param table The current state of the table.
   * @param rules The rules of the current game mode.
   * @returns A sequence of GameEvents (e.g., PlaceBallEvent followed by HitEvent).
   */
  decide(table: Table, rules: Rules): GameEvent[]
}
```

## 2. Refactored `BotEventHandler`

The `BotEventHandler` will now focus on the "housework" and game flow management. Its responsibilities include:

- **Turn Management**: Deciding when it's the bot's turn to act.
- **Rule Interpretation**: Detecting fouls, scoring, and respotting balls.
- **Game End Reporting**: Submitting match results to the server.
- **Relay Interaction**: Communicating with the `BotRelay` to publish event sequences.

### Core Loop

When it's the bot's turn (e.g., upon `STARTAIM` or `PLACEBALL` events), the `BotEventHandler` calls the current bot's `decide` method:

```typescript
class BotEventHandler {
  private currentBot: Bot = new ClawBot()

  handle(event: GameEvent): void {
    switch (event.type) {
      case EventType.STARTAIM:
      case EventType.PLACEBALL:
        const actions = this.currentBot.decide(this.container.table, this.container.rules)
        this.publishSequenceToPlayer(actions)
        break
      // ... handle other game flow events like BEGIN and STATIONARY
    }
  }
}
```

## 3. Implementation Examples

### `NoobBot` (Basic)
A bot that takes random shots with low power.

```typescript
export class NoobBot implements Bot {
  decide(table: Table, rules: Rules): GameEvent[] {
    const hit = this.generateRandomShot(table)
    return [hit]
  }
}
```

### `ClawBot` (Competitive)
The current implementation refactored into the `Bot` interface, using `AimCalculator` to find the best cut angle.

```typescript
export class ClawBot implements Bot {
  private calculator = new AimCalculator()

  decide(table: Table, rules: Rules): GameEvent[] {
    const targetBall = rules.nextCandidateBall()
    const aimPoint = this.calculator.getAimPoint(table.cueball.pos, targetBall.pos)
    const hit = this.calculator.generateRandomShot(table, 0, aimPoint)

    // If we have ball-in-hand, prepend a PlaceBallEvent
    if (rules.allowsPlaceBall() && !table.cueball.onTable()) {
       const pos = rules.placeBall()
       return [new PlaceBallEvent(pos), hit]
    }

    return [hit]
  }
}
```

## 4. Rationale

- **Clean Interface**: Adding a new bot is as simple as implementing the `Bot` interface.
- **Separation of Concerns**: Game rules and housekeeping (scoring, foul detection) are handled centrally in `BotEventHandler` and `Rules`.
- **Statelessness**: Bots don't need to track game state between shots, making them easier to test and reason about.
- **Flexible Playstyles**: Different bot implementations can be easily swapped during a session (e.g., for difficulty scaling).
