# Reconnection Architecture for Multiplayer Games

Currently, two-player games using the `NchanMessageRelay` are vulnerable to network interruptions. A disconnection leads to a fatal state where the client stops receiving updates, and there is no mechanism to catch up with missed events.

## 1. Analysis of Current Implementation

The `NchanMessageRelay` (in `src/network/client/nchanmessagerelay.ts`) initializes a `WebSocket` connection to the Nchan server.
- The `onclose` handler currently logs a warning but does not attempt to reconnect.
- Messages are processed as raw strings or blobs. While Nchan enriches these messages with metadata, it is not currently utilized for resumption.

## 2. Refined Reconnection Strategy

### Automatic Reconnection with Exponential Backoff
The `NchanMessageRelay` should be updated to maintain a "desired" subscription state.
- Upon an unexpected `onclose`, a reconnection attempt should be scheduled.
- Use exponential backoff (e.g., 1s, 2s, 4s, 8s, up to 30s) to re-establish the WebSocket connection.
- Reset the backoff logic once the connection is successfully re-opened.

### Message Deduplication using `meta.ts`
The Nchan server enriches all event JSON with a `meta.ts` field, representing a server-side timestamp for the message.

#### Last-Seen Tracking
The `NchanMessageRelay` should track the `meta.ts` of the last successfully processed message:
1. Parse the incoming event JSON to extract the `meta.ts` field.
2. Store this value in a class-level variable (e.g., `this.lastProcessedTimestamp`).

#### Filtering Replayed Messages
When reconnecting, Nchan may replay messages that the client has already seen (especially when using resumption protocols like `ws+meta.nchan`).
- **Deduplication Logic**: Before pushing any message to the `callback` (and subsequently the `Container`'s `eventQueue`), the relay must check if its `meta.ts` is greater than `this.lastProcessedTimestamp`.
- **Discarding**: Messages with a `meta.ts` less than or equal to the last processed timestamp should be discarded. This ensures that the game state is only updated with "new" information.

## 3. Implementation Plan for `NchanMessageRelay`

The following changes should be localized within the `network` directory:

| Task | Detail |
| :--- | :--- |
| **Track State** | Add `lastProcessedTimestamp: number` to `NchanMessageRelay`. |
| **Handle Reconnect** | Implement a `reconnect()` method in `NchanMessageRelay` that handles WebSocket re-initialization with exponential backoff. |
| **Filter Messages** | Update the `onmessage` handler to parse `meta.ts` and only execute the callback if the message is new. |
| **Resumption Protocol** | Switch to the `ws+meta.nchan` subprotocol to allow Nchan to provide message IDs for more efficient resumption. |

## 4. Integration with Game State

The `Container`'s deterministic physics and sequential `eventQueue` naturally handle the "burst" of messages that occur during a catch-up phase. So long as the `NchanMessageRelay` provides a clean, ordered stream of events (by filtering old ones via `meta.ts`), the game will accurately "fast-forward" to the current state upon reconnection.
