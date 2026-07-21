# Plan: Replace `NchanMessageRelay` with `@tailuge/messaging`

## Goal

Remove the bespoke Nchan transport code in `src/network/client/nchanmessagerelay.ts` and replace it with a new `MessageRelay` implementation that delegates to `NchanClient` from `@tailuge/messaging` (already a dependency at v1.29.0).

## Current state

### `NchanMessageRelay` — bespoke code being removed

Implements `MessageRelay` interface using:
- **Raw WebSocket** for subscribe (`/subscribe/table/{channel}`)
- **Raw HTTP POST** via `fetch` for publish (`/publish/table/{channel}`)
- Manual reconnection with exponential backoff
- Manual timestamp-based deduplication (`meta.ts`)
- Blob/ArrayBuffer decoding
- `getOnlineCount()` via `/publish/presence/lobby` (dead code — never called in production)

### `MessageRelay` interface (`src/network/client/messagerelay.ts`)

```typescript
export interface MessageRelay {
  subscribe(channel: string, callback: (message: string) => void, prefix?: string): void
  publish(channel: string, message: string, prefix?: string): void
  getOnlineCount(): Promise<number | null>  // ← dead code, will be removed
}
```

Implementors: `NchanMessageRelay`, `BotRelay`, `InMemoryMessageRelay` (test mock)

### Consumers of `NchanMessageRelay`

| File | How used |
|---|---|
| `src/container/browsercontainer.ts:initMultiplayer()` | `new NchanMessageRelay(wss)` → `this.messageRelay` |
| `src/controller/init.ts:handleBegin()` | fallback: `this.container.relay ?? new NchanMessageRelay()` |
| `src/controller/spectate.ts` | receives `MessageRelay` via constructor; calls `.subscribe()` |

### How `MessageRelay` is used at runtime

- **`subscribe(channel, callback)`**: `channel` = `tableId`, `callback` receives raw `EventUtil.serialise()` strings, which are parsed via `EventUtil.fromSerialised()` into `GameEvent` objects.
- **`publish(channel, message)`**: `message` is `EventUtil.serialise(event)` — a raw JSON string. Called via `BrowserContainer.broadcast()` which sets `event.clientId` and `event.playername` before serializing.
- **`getOnlineCount()`**: Defined but never called in production code. Lobby presence is handled separately by `LobbyIndicator` via `MessagingClient`.

### `@tailuge/messaging` — target API

Key class: **`NchanClient`** (low-level transport used internally by `MessagingClient`)

```typescript
// Relevant methods:
class NchanClient {
  constructor(server: string)                          // e.g. "https://billiards-network.onrender.com"
  setVersion(version: string): void                    // optional

  // Table communication
  subscribeTable(tableId: string, onMessage: (data: string) => void): Subscription
  publishTable<T>(tableId: string, message: Omit<TableMessage<T>, "senderId">, senderId: string, options?): Promise<void>
}

interface Subscription {
  stop: () => void
  ready: Promise<void>
  onReconnect?: () => void
}

interface TableMessage<T = unknown> {
  type: string
  senderId: string
  data: T
  meta?: Meta
}
```

Key differences from current approach:
- `publishTable()` wraps data in a `TableMessage` envelope (adds `type`, `senderId`, `meta`)
- `subscribeTable()` callback receives the **raw JSON string** of the full `TableMessage` envelope
- Built-in reconnection (exponential backoff, 8s–60s, max 10 attempts)
- Built-in deduplication (via internal `MessageDeduplicator`)
- No `getOnlineCount()` equivalent (handled via `Lobby` abstraction)

## Design decisions

### 1. Adapt to `TableMessage` envelope format

**Publish side**: Parse the serialized event string to extract `type`, then call `nchan.publishTable(channel, {type, data: parsedEvent}, senderId)`. This wraps the event in the `TableMessage` envelope.

**Receive side**: The callback from `subscribeTable` receives the raw `TableMessage` JSON string. Parse it, extract `data`, re-serialize `data` back to a string, and pass to the game callback.

This keeps the `MessageRelay` interface unchanged (raw strings in both directions), isolating the format adaptation within the new relay class.

### 2. Remove `getOnlineCount()` from `MessageRelay`

It is dead code (never called in production). All tests that mock `MessageRelay` will drop the `getOnlineCount` property. The `LobbyIndicator` already handles presence/online count through `MessagingClient.joinLobby()`.

### 3. Use `NchanClient` directly (not `MessagingClient` + `Table`)

- `NchanClient` is the right abstraction level — it's the thin transport wrapper, matching what `NchanMessageRelay` is today.
- Using `Table` would require a `MessagingClient` instance and `joinTable()` lifecycle, overcomplicating the game loop.
- `LobbyIndicator` already has its own `MessagingClient` for lobby concerns; keeping table transport separate is fine for now (could unify later).

## Implementation steps

### Step 1: Create `src/network/client/messagingmessagerelay.ts`

```typescript
import { NchanClient } from "@tailuge/messaging"
import { MessageRelay } from "./messagerelay"
import { Session } from "./session"

export class MessagingMessageRelay implements MessageRelay {
  private readonly nchan: NchanClient
  private readonly subscriptions = new Map<string, ReturnType<NchanClient["subscribeTable"]>>()

  constructor(server: string = "wss://billiards-network.onrender.com") {
    const url = server.replace(/^(https?|wss?):\/\//, "")
    const httpProtocol = server.startsWith("ws://") || server.startsWith("http://") ? "http" : "https"
    this.nchan = new NchanClient(`${httpProtocol}://${url}`)
  }

  subscribe(channel: string, callback: (message: string) => void, prefix?: string): void {
    const key = `${prefix ?? "table"}/${channel}`
    // Clean up any existing subscription first
    this.subscriptions.get(key)?.stop()
    const sub = this.nchan.subscribeTable(channel, (rawString: string) => {
      // Unwrap TableMessage envelope
      try {
        const envelope = JSON.parse(rawString)
        // envelope = { type, senderId, data, meta }
        callback(JSON.stringify(envelope.data))
      } catch {
        // Not JSON or unexpected format, pass through as-is
        callback(rawString)
      }
    })
    this.subscriptions.set(key, sub)
  }

  publish(channel: string, message: string, prefix?: string): void {
    const session = Session.getInstance()
    let type = "unknown"
    let data: unknown = message
    try {
      const parsed = JSON.parse(message)
      type = parsed.type || "unknown"
      data = parsed
    } catch {
      // Raw string, pass as data
    }
    // Fire-and-forget (matches current behavior where publish doesn't await)
    this.nchan.publishTable(channel, { type, data }, session.clientId).catch((error) => {
      console.error("Publication error for table", channel, error)
    })
  }
}
```

### Step 2: Remove `getOnlineCount()` from `MessageRelay` interface

Edit `src/network/client/messagerelay.ts` — drop the `getOnlineCount` line.

### Step 3: Remove `getOnlineCount()` from other implementations

- `src/network/bot/botrelay.ts` — delete the method
- `test/mocks/inmemorymessagerelay.ts` — delete the method

### Step 4: Update consumers

- `src/container/browsercontainer.ts`:
  - Change import: `NchanMessageRelay` → `MessagingMessageRelay`
  - Change usage: `new NchanMessageRelay(wss)` → `new MessagingMessageRelay(wss)`
- `src/controller/init.ts`:
  - Change import: `NchanMessageRelay` → `MessagingMessageRelay`
  - Change usage: `new NchanMessageRelay()` → `new MessagingMessageRelay()`

### Step 5: Delete old files

- `src/network/client/nchanmessagerelay.ts`
- `test/network/client/nchanmessagerelay.spec.ts`

### Step 6: Update test mocks

Files with `MessageRelay` mocks that include `getOnlineCount`:
- `test/controller/spectate.spec.ts` — 3 occurrences of `getOnlineCount: () => Promise.resolve(null)`
- `test/controller/spectate_sniff.spec.ts` — 1 occurrence
- `test/view/lobbyindicator.spec.ts` — may need update if it mocks `MessageRelay`

### Step 7: Validate

```bash
yarn lint        # tsc --noEmit + eslint
yarn test        # full test suite
yarn prettify    # format
```

## Risk assessment

| Risk | Mitigation |
|---|---|
| `NchanClient` reconnection behavior differs from old manual logic | Built-in backoff (8s→60s, 10 retries) is more robust; old was 1s→30s unbounded |
| `TableMessage` envelope breaks event parsing | Adapter unwraps on receive, rewraps on publish; game code sees same raw format |
| Double-encoding of event `type` field | Event has `type: "Hit"`, envelope also has `type: "Hit"` — fine, they serve different purposes |
| Spectate mode breaks (uses fallback `new NchanMessageRelay()`) | New `MessagingMessageRelay` default constructor matches old behavior |
| Tests for removed `nchanmessagerelay.spec.ts` | Covered by existing `messagerelay.spec.ts` + new tests for `messagingmessagerelay` |

## Files changed summary

| File | Change |
|---|---|
| `src/network/client/messagingmessagerelay.ts` | **NEW** — wraps `NchanClient` |
| `src/network/client/messagerelay.ts` | Remove `getOnlineCount()` |
| `src/network/client/nchanmessagerelay.ts` | **DELETE** |
| `src/network/bot/botrelay.ts` | Remove `getOnlineCount()` |
| `src/container/browsercontainer.ts` | Update imports/usage |
| `src/controller/init.ts` | Update imports/usage |
| `test/network/client/nchanmessagerelay.spec.ts` | **DELETE** |
| `test/mocks/inmemorymessagerelay.ts` | Remove `getOnlineCount()` |
| `test/controller/spectate.spec.ts` | Remove `getOnlineCount` from mocks |
| `test/controller/spectate_sniff.spec.ts` | Remove `getOnlineCount` from mocks |
