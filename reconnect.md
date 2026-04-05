# Reconnection Architecture for Multiplayer Games

Currently, two-player games using the `NchanMessageRelay` are vulnerable to network interruptions. A disconnection leads to a fatal state where the client stops receiving updates, and there is no mechanism to catch up with missed events.

## 1. Analysis of Current Implementation

The `NchanMessageRelay` (in `src/network/client/nchanmessagerelay.ts`) initializes a `WebSocket` connection to the Nchan server.
- The `onclose` handler currently logs a warning but does not attempt to reconnect.
- Messages are processed as raw strings or blobs, with no metadata (like sequence IDs) extracted from the transport layer.

## 2. Proposed Reconnection Strategy

### Automatic Reconnection with Exponential Backoff
The `NchanMessageRelay` should be updated to maintain a "desired" subscription state.
- When a `WebSocket` closes unexpectedly, a reconnection attempt should be scheduled.
- Use exponential backoff (e.g., 1s, 2s, 4s, 8s, up to a maximum of 30s) to avoid overwhelming the server during outages.
- Clear the backoff timer upon a successful `onopen`.

### Resumable Subscriptions using Nchan Metadata
Nchan supports a `ws+meta.nchan` subprotocol that bundles messages with metadata, including unique message IDs and timestamps.

#### Metadata Extraction
To enable resumption, we must:
1. Initialize the WebSocket with the `ws+meta.nchan` subprotocol:
   ```typescript
   const ws = new WebSocket(url, 'ws+meta.nchan');
   ```
2. Parse the Nchan message format. Messages arrive with a header:
   ```
   id: <message_id>
   content-type: <type>
   <empty line>
   <payload>
   ```
3. Store the `id` of the last successfully processed message in the `NchanMessageRelay`.

#### Requesting Missed Messages
Upon reconnection, the client can request messages starting from the last known ID using Nchan's resumption mechanisms (e.g., appending the ID to the WebSocket URL or using the `Last-Event-ID` header if supported by the client/server configuration). This ensures that any events published during the downtime are replayed to the reconnecting client.

## 3. Handling Replayed Events in the Container

The `Container` is well-suited for state recovery due to its deterministic design:
- **Deterministic Physics**: The `Table.advance` method uses a fixed time step and 32-bit float precision, ensuring that the same sequence of events produces the same physical state on all clients.
- **Event Queue**: Replayed events from Nchan should be pushed to the `eventQueue`.
- **Sequential Processing**: The `processEvents` loop only processes one event at a time when the table is stationary. This ensures that a burst of missed events (e.g., several `HitEvent` and `StationaryEvent` pairs) will be played back in the correct order, effectively "fast-forwarding" the game to the current state.

## 4. Peer Synchronization with RejoinEvent

The `RejoinEvent` should be used to ensure both clients are in sync after a reconnection:
- **Sequence Verification**: The `GameEvent` class already has a `sequence` property. Clients can use the `RejoinEvent` to compare their last processed sequence number with their opponent.
- **State Check**: If a significant divergence is detected (e.g., sequence numbers match but `stateCheck` hashes differ), the `RejoinEvent` could trigger a full table state synchronization (similar to a `WatchEvent`).

## 5. Summary of Changes

| Component | Responsibility |
| :--- | :--- |
| `NchanMessageRelay` | Implement exponential backoff, switch to `ws+meta.nchan`, and track/request message IDs. |
| `EventUtil` | Update to parse the Nchan metadata header before JSON-deserializing the `GameEvent`. |
| `Container` | Ensure the `eventQueue` correctly handles a burst of replayed events. |
| `RejoinEvent` | Implement the logic in `Controller` subclasses to handle and respond to rejoin requests. |
