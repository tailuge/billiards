# Crash Analysis Report: 2-Player Crash after Rematch

## Overview
A crash occurred in a 2-player game where the `first` query parameter was missing from the URL. The crash manifested as a `TypeError: _ is not iterable` during the transition to a `Replay` state.

## Root Cause: Code Level
The crash occurs in the `Replay` constructor located in `src/controller/replay.ts`.

```typescript
// src/controller/replay.ts
export class Replay extends ControllerBase {
  // ...
  constructor(container, init, shots, _retry = false, delay = 1500, diagram?) {
    super(container)
    this.init = init
    this.diagram = diagram
    console.log(`init: ${JSON.stringify(init)}`)
    this.shots = [...shots] // <--- CRASH HERE if shots is undefined
    // ...
  }
}
```

The `shots` parameter is expected to be an array, but when it is `undefined`, the spread operator `[...shots]` fails with "TypeError: _ is not iterable".

## Trigger: Event Flow & Logic
The crash is triggered by a race condition resulting from the absence of the `first` URL parameter in a multiplayer session.

### 1. Dual Active Players
In `src/container/browsercontainer.ts`, the `initGameLoop` function handles the initial event broadcasting:

```typescript
// src/container/browsercontainer.ts
private initGameLoop() {
  if (this.wss) {
    // ...
    if (!this.first) {
      this.broadcast(new BeginEvent())
    }
  }
  // ...
}
```

If the `first` parameter is missing from the URL for **both** players, both players will broadcast a `BeginEvent` upon connecting. Consequently, both players receive a `BeginEvent` and transition from `Init` to their initial controller (usually `PlaceBall`) via `Init.handleBegin`.

### 2. Conflicting BreakEvents
Both players believe they are the active player. When Player A finishes placing the ball, they call `placed()`:

```typescript
// src/controller/placeball.ts
placed() {
  // ...
  this.container.sendEvent(
    new BreakEvent(this.container.table.shortSerialise())
  )
  this.container.view.camera.forceMode(this.container.view.camera.aimView)
  return new Aim(this.container)
}
```

The `BreakEvent` is instantiated with only the table state (`init`). The `shots` parameter defaults to `undefined`.

### 3. The Crash
Player A transitions to the `Aim` state. Player B (who also thinks they are first and might already be in the `Aim` state) receives Player A's `BreakEvent`.

The `Aim` controller handles the `BreakEvent` as follows:

```typescript
// src/controller/aim.ts
override handleBreak(breakEvent: BreakEvent): Controller {
  return new Replay(
    this.container,
    breakEvent.init,
    breakEvent.shots, // <--- shots is undefined
    breakEvent.retry,
    1500,
    breakEvent.diagram
  )
}
```

This calls the `Replay` constructor with `undefined` for `shots`, leading to the crash.

## Recommendations

### Short-term: Robustness
Make the `Replay` constructor robust against `undefined` or `null` shots by providing a default empty array:

```typescript
this.shots = [...(shots ?? [])]
```

### Long-term: Lobby/Protocol Fix
The lobby must ensure that exactly one player in a 2-player match is designated as `first=true` in the URL parameters. The rematch logic in `src/utils/gameover.ts` and the lobby's challenge handling should be audited to ensure the `nextTurnId` correctly translates to a `first=true` parameter for the appropriate player upon redirection.

The fact that `!this.first` triggers a `BeginEvent` suggests a "passive joiner" logic that fails if both players are "passive". A more robust handshake or a server-side assignment of the first player would prevent this state entirely.
