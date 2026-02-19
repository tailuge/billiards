## Bot Infrastructure

### Objective

Add infrastructure to support playing against a bot, leveraging the existing event system. The bot will react to events and generate responses, following the same flow as the well-tested 2-player mode.

---

### Architecture

#### Event Flow

The bot participates in the event system as a "virtual opponent":

```
Human finishes turn → AIM/PLACEBALL event (bot's turn) → Bot processes → Bot sends AIM/HIT events → Human's turn
```

**Turn Detection**: Bot's turn begins when it receives an `AimEvent` or `PlaceBallEvent` addressed to it.

**Timing**: Bot should simulate human timescale with a few seconds of "aiming" before sending `HitEvent`.

#### Table State

`AimEvent` carries ball positions (`pos`) and `HitEvent` carries full table state (`tablejson`). The bot needs this state to make decisions.

**Solution**: In bot mode, the human player's client includes full table state in relevant events. The bot receives the same events and parses state from them. No separate state synchronization needed.

#### Message Relay Architecture

Introduce a `BotMessageRelay` that implements `MessageRelay` interface:

- **Local queue mode**: Events from human are queued for bot processing; bot responses are queued back to game
- **Optional WSS passthrough**: Can optionally publish to nchan for spectators, making bot games watchable

This keeps the existing `broadcast` callback pattern unchanged. The relay sits between the game and the message transport.

#### Container Configuration

Replace positional constructor arguments with a configuration object:

```
ContainerConfig {
  element
  log
  assets
  ruletype?
  keyboard?
  id?
  relay?: MessageRelay
  scoreReporter?: ScoreReporter
  bot?: Bot (future)
}
```

This addresses the "too many arguments" warning and provides extension points for bot mode.

#### Session Extension

Add bot mode indicator to `Session`:
- `botMode: boolean` - whether playing against bot
- Could be set via URL param `bot=true`

#### Debug Overlay

A debug console (similar to notification overlay) for:
- Showing bot mode is active
- Logging incoming/outgoing events
- Displaying bot decision reasoning (future)
- Toggle via hotkey or shown by default in bot mode

---

### URL Parameters

| Param | Purpose |
|-------|---------|
| `bot=true` | Enable bot mode |
| `botDelay=3000` | Optional: override aiming delay (ms) |

---

### Phased Implementation

#### Phase 1: Prep Work (No Behavior Change)
- Refactor `BrowserContainer` to use config object
- Refactor `Container` to use config object
- Verify all tests pass, no regression

#### Phase 2: Debug Overlay
- Create `BotDebugOverlay` component
- Wire to hotkey
- Show/hide functionality

#### Phase 3: Bot Mode Activation
- Add `botMode` to `Session`
- Parse `bot=true` URL param
- Display indicator when bot mode active
- Bot remains dormant (no actual bot logic)

#### Phase 4: Message Relay Integration
- Create `BotMessageRelay` implementing `MessageRelay`
- Wire into Container when bot mode enabled
- Log events to debug overlay
- Still no bot decision logic

#### Phase 5: Bot Core (Future)
- Bot decision engine
- Aiming strategy
- Timing simulation

---

### Files Affected

| File | Change |
|------|--------|
| `src/container/container.ts` | Config object pattern |
| `src/container/browsercontainer.ts` | Config object, bot mode detection |
| `src/network/client/session.ts` | Add `botMode` property |
| `src/network/bot/botmessagerelay.ts` | New file |
| `src/network/bot/botdebugoverlay.ts` | New file |
| `dist/index.html` | Debug overlay element |

---

### Open Questions

1. Should bot games be publishable to WSS for spectators? (Recommend: yes, as option)
2. Should bot difficulty be configurable via URL param? (Future consideration)
