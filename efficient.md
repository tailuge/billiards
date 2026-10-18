# Efficient WATCHAIM payloads

Scope: the `WATCHAIM` message only. No other event type changes, no transport change.

## Goal

Replace the verbose ball list in a `WATCHAIM` event:

```json
{ "balls": [{ "pos": { "x": -0.7201825976371765, "y": 0.00021959836885798723, "z": 0 }, "id": 0 }, ...] }
```

with a compact, lossless binary representation for arbitrary-length sequences of double `(x, y)` coordinate pairs, encoded as an unpadded base64url string:

```json
{ "type": "WATCHAIM", "json": { "balls": "1|AAEC...", "aim": { ...unchanged... } } }
```

Key characteristics:

- **Lossless binary compression**: Coordinates are packed as raw IEEE 754 little-endian `float64` pairs without rounding, truncation, or drift. Packed binary representation reduces payload size by ~70% (from ~75 bytes per ball in verbose JSON down to ~21.3 bytes in base64url).
- **Variable ball counts across rule types**: The ball count is dynamically derived from byte length (`N = bytes / 16`). Different game rule types have different ball counts:
  - Three-cushion: 3 balls (48 bytes / 6 doubles)
  - Sagu: 4 balls (64 bytes / 8 doubles)
  - Nine-ball: 10 balls (160 bytes / 20 doubles)
  - Eight-ball: 16 balls (256 bytes / 32 doubles)
  - Snooker: 22 balls (352 bytes / 44 doubles)
  The format natively supports any arbitrary `N` pairs without requiring rule-type metadata in the message.
- **Contract & indexing**: Ball order follows table array order (`this.balls[0..N-1]`); ball `id` is mapped to index (`i / 2`); `z` is reconstructed as `0` for table-level positioning.
- **Minimal change**: `json.balls` changes type from `Array<{pos, id}>` to `string` on the wire. All other fields in `json` (such as `aim` and `rerack`) remain untouched.

## Format

`"1|<payload>"`

- `1` — format version prefix.
- `<payload>` — unpadded base64url string (`+` → `-`, `/` → `_`, trailing `=` stripped). Same RFC 4648 §5 URL-safe alphabet treatment as `src/utils/replay-codec.ts`.
- Bytes — little-endian float64 pairs `x0, y0, x1, y1, …`, written using `DataView.setFloat64(offset, value, true)` to ensure architecture-independent endianness.
- Length contract: Byte length must be non-zero and a multiple of 16 (`16 * N` bytes for `N` balls).

`z` is omitted from the wire format because balls on the table share the surface plane `z = 0`; IDs are omitted because table array index order is the contract. This holds only while every ball is on the surface — see open review item **Z1**.

## Hook point

Both directions belong in `src/events/eventutil.ts`, which is already the serialise/deserialise boundary for every event:

- `EventUtil.serialise`: when the event is a `WatchEvent` and `event.json.balls` is an array, encode `balls` into the base64url string.
- `EventUtil.fromJson`: when the parsed event is `WATCHAIM` and `parsed.json.balls` is a string, decode coordinates back into the `Array<{pos, id}>` shape before calling `WatchEvent.fromJson`.

Why here:

- Producers (`src/controller/rules/*.ts`, `src/controller/init.ts`, `src/network/bot/boteventhandler.ts`) and consumers (`src/controller/watchshot.ts`, `src/model/table.ts`) remain completely untouched.
- The in-memory shape does not change: `Table.updateFromSerialised`, `Ball.updateFromSerialised`, and `handleWatch` receive the exact `{pos: {x, y, z: 0}, id}` structure they expect, indexing correctly into `this.balls[b.id]`.
- Recorder and replay hold `GameEvent` domain objects and `shortSerialise()` state arrays, not wire frames, so they are unaffected.

## Sketch

```ts
// src/utils/wire-codec.ts
const PREFIX = "1|"

function toBase64url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function fromBase64url(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function encodeCoords(coords: number[]): string {
  const bytes = new Uint8Array(coords.length * 8)
  const view = new DataView(bytes.buffer)
  coords.forEach((val, i) => view.setFloat64(i * 8, val, true))
  return PREFIX + toBase64url(bytes)
}

export function decodeCoords(s: string): number[] {
  if (!s.startsWith(PREFIX)) {
    throw new Error("unsupported wire version")
  }
  const bytes = fromBase64url(s.slice(PREFIX.length))
  if (bytes.length === 0 || bytes.length % 16 !== 0) {
    throw new Error("bad coordinate blob length")
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const count = bytes.length / 8
  const out: number[] = new Array(count)
  for (let i = 0; i < count; i++) {
    out[i] = view.getFloat64(i * 8, true)
  }
  return out
}
```

Encode at `EventUtil.serialise`:

```ts
if (
  event.type === EventType.WATCHAIM &&
  Array.isArray((event as WatchEvent).json?.balls)
) {
  const { balls, ...rest } = (event as WatchEvent).json
  return JSON.stringify({
    ...event,
    json: {
      ...rest,
      balls: encodeCoords(balls.flatMap((b) => [b.pos.x, b.pos.y])),
    },
  })
}
return JSON.stringify(event)
```

Decode at `EventUtil.fromJson`:

```ts
case EventType.WATCHAIM: {
  let json = parsed.json
  if (typeof json?.balls === "string") {
    const coords = decodeCoords(json.balls)
    const balls = []
    for (let i = 0; i < coords.length; i += 2) {
      balls.push({
        pos: { x: coords[i], y: coords[i + 1], z: 0 },
        id: i / 2,
      })
    }
    json = { ...json, balls }
  }
  return WatchEvent.fromJson(json)
}
```

Supplying `z: 0` matters: `Ball.updateFromSerialised` copies components through `Vector3.copy`, which stores `undefined` verbatim if the source has no `z`, and `pocket.ts` then compares against `undefined` forever. The decoder must emit a complete vector.

## Impact sites

| File | Role | Change |
| --- | --- | --- |
| `src/utils/wire-codec.ts` | new codec | add `encodeCoords`, `decodeCoords` |
| `src/events/eventutil.ts` | `serialise` / `fromJson` | pack `balls` on serialize, unpack on deserialize |
| `src/controller/rules/{threecushion,sagu,eightball,nineball,snooker}.ts` | producers | none |
| `src/controller/init.ts` | producer / consumer | none |
| `src/network/bot/boteventhandler.ts` | producer | none |
| `src/controller/watchshot.ts` | consumer | none |
| `src/model/table.ts` | `updateFromSerialised` | none |
| `src/network/client/messagingmessagerelay.ts` | transport | none, payload is opaque |
| `src/events/recorder.ts`, `src/utils/replay-encoder.ts` | recording | none, events are objects |
| `src/view/link-formatter.ts` | replay links | none, separate codec |

## Compatibility & Version Skew

- Backward compatibility and version skew between client versions are explicitly out of scope.
- No staged rollout, negotiation handshake, or peer version gating is needed.
- Recorder and replay are unaffected: `Recorder.record` stores `GameEvent` objects and `shortSerialise()` state arrays, not wire frames.

## Failure handling

- If decode fails (bad version prefix, corrupted base64, byte length not a positive multiple of 16), log the error and drop/ignore the frame.
- No artificial "expected ball count" check is enforced during decode, since ball counts naturally vary from 3 to 22 depending on the game rule type.

## Compression Rationale

- Why not DEFLATE / gzip? High-entropy 64-bit IEEE 754 floating-point mantissas on small payloads (48–352 bytes) cannot be compressed effectively by dictionary-based algorithms like LZ77/DEFLATE, which actually increases payload size (e.g. 352 bytes expands to ~357 bytes).
- Binary double packing directly achieves the optimal lossless compression ratio (~70% reduction) with zero compression latency and exact bit-for-bit fidelity.

## Tests

- Codec round-trip across variable ball counts:
  - 3 balls (Three-Cushion: 48 bytes)
  - 4 balls (Sagu: 64 bytes)
  - 10 balls (Nine-Ball: 160 bytes)
  - 16 balls (Eight-Ball: 256 bytes)
  - 22 balls (Snooker: 352 bytes)
- Lossless float64 precision: exact bitwise preservation of `0`, `-0`, fractional values, negative coordinates, and table extremes.
- Error rejection: unknown version prefix, bad base64, empty payload, and misaligned byte lengths (`bytes.length % 16 !== 0`).
- Integration round-trip: `EventUtil.serialise` → `EventUtil.fromSerialised` preserves exact ball positions and IDs for all rule types.

## Open review items

### Z1 — `z` is not zero for balls in pockets (deferred, not fixed)

Status: **TODO, deliberately not fixed in this change.** The format as specified
above drops `z` and reconstructs `z = 0`, so it is not lossless for frames
emitted after a pot.

- `Table.serialise()` includes every ball in `this.balls`, not just balls still
  on the table (`src/model/table.ts:189-194`), and `Ball.serialise()` clones the
  full position vector including `z` (`src/model/ball.ts:165-170`).
- A potted ball rests at `pos.z = restingDepth - R`, where
  `restingDepth = -3 * R - (R * ball.id) / 4` (`src/model/physics/pocket.ts:44-54`),
  so its `z` is a negative, id-dependent value, never `0`.
- Mid-game `WATCHAIM` frames are emitted straight after pots in eight-ball
  (`src/controller/rules/eightball.ts:312`), nine-ball
  (`src/controller/rules/nineball.ts:139`) and snooker
  (`src/controller/rules/snooker.ts:299`), and those frames therefore carry
  sunk balls.
- If such a frame is applied, `Ball.updateFromSerialised` copies the position
  wholesale (`src/model/ball.ts:176-181`) and `BallMesh.updatePosition` copies it
  onto the mesh (`src/view/ballmesh.ts:106-109`), so a reconstructed `z = 0`
  would render potted balls back on the cloth at the pocket mouth.

Current impact is latent rather than visible: only `Init.handleWatch`
(`src/controller/init.ts:66-71`) applies `json.balls`, and that frame is sent at
match start when every ball is on the surface (`src/controller/init.ts:51`).
`WatchShot.handleWatch` (`src/controller/watchshot.ts:76-84`) ignores the ball
list apart from the legacy `rerack` branch. The bug would become live as soon
as `WATCHAIM` ball positions are treated as authoritative (resync, drift
correction, or a `rerack`-bearing watch frame).

Resolution options, when this item is picked up:

1. Encode `z` as a third `float64` per ball (24 bytes → 32 base64url chars per
   ball), keeping the format genuinely lossless.
2. Keep two coordinates and reconstruct the resting depth from ball id, which
   duplicates `Pocket.restingDepth` on the client and breaks if that formula
   changes.
3. Keep two coordinates, accept the visual change, and document it explicitly
   rather than describing the format as lossless.
4. **Chosen: keep two coordinates; receiver keeps its own `z` for potted balls.**
   The wire carries `x, y` only (16 bytes per ball, format unchanged). `z` is
   decided on receipt from the receiver's local ball state, which is never sent:

   - If the local ball is potted (`state === InPocket` or `State.Falling`, i.e.
     `!ball.onTable()`), leave `pos.z` as it is. The receiver's own simulation
     has already placed the ball at its resting depth.
   - Otherwise set `pos.z = 0`.

   Where it lives: `Ball.updateFromSerialised` (`src/model/ball.ts`) copies `x`
   and `y` only, and sets `z` to 0 unless the ball is potted. `EventUtil.fromJson`
   then emits `{ pos: { x, y }, id }` with no `z`. Because `Vector3.copy` would
   overwrite `z` with `undefined`, the copy must be explicit, not `pos.copy`.

   Risks to verify before this is accepted:

   - Lossless only when the receiver has already simulated the same pot. If the
     sender has a potted ball that the receiver still has on the table (for
     example a late joiner or a frame that arrives before the local pot), that
     ball is set to `z = 0` and reappears at the pocket mouth. This is the Z1
     bug again, so the rule is "best effort", not exact.
   - Mid-game frames are the only case where this matters. `Init.handleWatch`
     runs at match start with every ball on the surface, so the rule has no
     effect there.
   - `Table.updateFromSerialised` indexes `this.balls[b.id]`, which assumes
     `Ball.id` equals table index. That holds only because `worker.ts` resets
     `Ball.id = 0`. See the note in the Z1 review.

   Tests to add: a potted local ball keeps its `z` after a `WATCHAIM` apply; an
   on-table local ball gets `z = 0`; and a remote potted ball that is still
   on the table locally is documented as the known divergence case.
