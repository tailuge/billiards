# Analysis of 2-Player Startup Unreliability (under slow connections with `&first`)

This document explains why the 2-player startup sequence in multiplayer mode remains unreliable when the player with the slow connection has the `&first` query parameter, why the `bothJoined` callback alone is insufficient to guarantee synchronization, and suggests robust architectural solutions to fix the issue.

---

## Executive Summary

In multiplayer matches, the game utilizes a single `BeginEvent` to transition both players from the initial connection/joining state (`Init`) into the active game controllers (e.g., `PlaceBall`, `Aim`, `WatchAim`).

The current startup sequence exhibits an **asymmetric design**:
- **Player A (with `&first`)**: Does not send `BeginEvent`. They act purely reactively, waiting in `Init` for the opponent to send a `BeginEvent` to kick off the game.
- **Player B (without `&first`)**: Is responsible for broadcasting the `BeginEvent` once they believe both players have joined the table.

When **Player A has a slow connection**, this asymmetric, fire-and-forget approach breaks down due to server/network race conditions and hardcoded timeouts.

---

## Why the `bothJoined` Callback is Insufficient (Under the Hood)

It is easy to assume that waiting for the `bothJoined` promise to resolve on both clients should be sufficient. However, at the network and protocol layers, several issues prevent this from being reliable under slow network conditions:

### 1. The Subscription Handshake Race Condition (Server vs. Client Subscription)
When the slower Player A (with `&first`) connects to the table, their client sends a subscription/join request to the messaging server (e.g., Nchan or equivalent server).
1. The server receives Player A's join request.
2. The server instantly registers Player A as present on the table channel and **notifies Player B** that both players are now joined.
3. On Player B's client, the native `@tailuge/messaging` `bothJoined` promise resolves.
4. Player B **immediately** broadcasts `BeginEvent()`.
5. At this exact millisecond, **Player A's connection is still completing its subscription handshake** with the server. Although the server registered the presence, the socket connection might not have fully established or Player A's client might not be fully ready to receive and route messages.
6. The server receives Player B's broadcast and tries to forward it to Player A. Because Player A is not yet fully subscribed/active at the server-level delivery layer, the `BeginEvent` message is **dropped** or lost.
7. Player A finally completes their connection handshake and sits in the `Init` state waiting for a `BeginEvent` that has already been sent and lost.

This is a classic race condition: **the join event resolves faster on the fast player's side than the slow player's channel subscription becomes active to receive messages.**

### 2. The Hardcoded Timeout Deadlock (8000ms Limit)
In `src/container/browsercontainer.ts`, the connection loop is implemented as follows:
```typescript
if (this.wss) {
  if (this.messageRelay instanceof MessagingMessageRelay && !this.replay) {
    try {
      await this.messageRelay.awaitBothJoined(8000)
    } catch (e) {
      NetworkLogger.logGame(
        `net: ${this.playername} bothJoined wait timed out`
      )
    }
  }
  if (!this.first) {
    this.broadcast(new BeginEvent())
  }
}
```

If Player A's connection is extremely slow and takes more than **8 seconds** to establish:
1. Player B's `awaitBothJoined(8000)` times out.
2. The error is caught, and Player B **proceeds anyway**!
3. Since Player B does not have `&first` (`!this.first` is true), Player B broadcasts `BeginEvent()`.
4. Since Player A is still offline/connecting, this broadcast is sent into the void.
5. After 10 seconds, Player A finally finishes connecting. Their `awaitBothJoined()` resolves immediately (since Player B is already online).
6. Player A does not broadcast anything because they are `this.first === true`.
7. **Deadlock**:
   - Player A is stuck in the `Init` controller waiting for a `BeginEvent` that they missed.
   - Player B is stuck in the `Init` controller waiting for Player A's first-turn state sync (`WatchEvent`), but Player A will never send it because they are still waiting to start.

### 3. Lack of Handshaking and Acknowledgment
The `BeginEvent` is broadcasted as a fire-and-forget message. There is no feedback loop:
- Player B has no way of knowing if Player A actually received the `BeginEvent`.
- Player A has no way of requesting a re-broadcast or signaling that they are now ready if they joined late.

---

## Suggested Architectural Fixes

To make the 2-player startup sequence 100% reliable under any latency or connection speed, we suggest the following modifications:

### Fix A: The Slow Player (First Player) Initiates
Rather than having the fast player (non-first) send the trigger to the slow player, invert the roles:
- The player with `&first` should be the one to broadcast the `BeginEvent` once they are fully connected, initialized, and have successfully resolved `awaitBothJoined()`.
- Since the slow player is the one who initiates, the fast player (who has already been connected and waiting) is guaranteed to have their subscription fully active and will never miss the message.

```typescript
// In BrowserContainer.ts:
if (this.wss) {
  await this.messageRelay.awaitBothJoined() // wait indefinitely or handle timeout with a retry UI
  if (this.first) {
    this.broadcast(new BeginEvent())
  }
}
```

### Fix B: Bidirectional Readiness Handshake (Recommended)
Introduce a simple state synchronization or keep-alive handshake during the `Init` state:
1. When a player is ready, they broadcast a periodic `ReadyEvent` (e.g., every 1-2 seconds).
2. When a client in the `Init` state receives a `ReadyEvent` from the opponent, they respond with their own `ReadyEvent` or a `BeginEvent`.
3. Once a client receives a `ReadyEvent` / `BeginEvent` and has sent theirs, they transition out of the `Init` state.
4. This active retry mechanism completely eliminates the susceptibility to dropped messages or network latency spikes.

### Fix C: Handle `awaitBothJoined` Timeout Gracefully
If `awaitBothJoined` times out on Player B's side, Player B should **not** broadcast `BeginEvent()`. Instead:
- They should display a "Waiting for opponent..." UI overlay with a "Retry Connection" button.
- Alternatively, keep waiting on the `bothJoined` promise indefinitely without a hard timeout that triggers a blind, broken broadcast.
