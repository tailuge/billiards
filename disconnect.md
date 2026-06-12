# Detecting Opponent Disconnection in Nchan

To identify when an opponent disconnects from the direct game data channel, monitor the WebSocket connection managed in `src/network/client/nchanmessagerelay.ts`.

## 1. Nchan Presence Events
If the Nchan server is configured to send presence notifications on the subscription channel, these will arrive via the `ws.onmessage` handler.
- **Action:** Look for JSON messages containing an `action` field.
- **Identifier:** A message with `"action": "unsubscribed"` typically indicates that a client has disconnected from the channel.
- **Implementation:** In the `ws.onmessage` callback, you can parse the message and check for this action to trigger a local UI notification or state change.

## 2. Local Connection Closure
The `ws.onclose` handler in `NchanMessageRelay` is triggered when the local client loses its connection to the Nchan server.
- While this primarily indicates a local network issue, it means that communication with the opponent is no longer possible.
- The existing implementation logs `"disconnected"` to the `NetworkLogger` and attempts an exponential backoff reconnection.

## 3. Silent Disconnections (Heartbeats)
If the opponent loses power or internet abruptly without the Nchan server detecting it immediately (and thus not sending an `unsubscribed` event), the connection may appear alive but idle.
- **Current State:** The direct game connection currently lacks a heartbeat (ping/pong) mechanism.
- **Recommendation:** To detect silent disconnections reliably, a periodic "ping" event could be broadcast. If no data or "pong" is received from the opponent within a timeout period, they can be considered disconnected.

## 4. Complementary Monitoring
Note that `LobbyIndicator` (used for the lobby and matchmaking) maintains a separate connection to monitor general user presence. It uses the `@tailuge/messaging` library to track if the `opponentClientId` is still among the active users in the same `tableId`. However, for real-time detection within the game loop itself, monitoring the `NchanMessageRelay` WebSocket is the most direct approach.
