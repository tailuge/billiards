# Fix: WATCHAIM ships a table snapshot that nobody reads

Status: proposal only. No code has been changed.

## Summary

Every `WATCHAIM` event carries `{ balls, aim }`: a full snapshot of ball
positions, packed into a deflated base64 string by `EventUtil.serialise`, plus
the sender's aim.

Exactly one code path applies either field - `Init.handleWatch`, which runs once
per game while the second player is still in the `Init` controller (the Begin
handshake). Every other `WATCHAIM`, i.e. every one sent when a turn continues,
is decoded and then discarded - the ball positions and the aim alike.

Proposal: send an empty payload (`new WatchEvent({})`) from the turn-continuation
send sites, and keep `Table.serialise()` for the Begin handshake, the resume
snapshot and the iframe `postMessage`.

This is payload hygiene, not a synchronisation fix. It does not make two clients
agree on ball state (nothing does today); it stops pretending that they do, and
removes wasted work on both ends. See "Out of scope".

## How it works today

Role assignment happens once, at Begin:

1. The joining player (`playerIndex` 1) broadcasts `BEGIN`
   (`browsercontainer.ts:330`).
2. Both sides run `Init.handleBegin`. The first player sends
   `new WatchEvent(this.container.table.serialise())` (`init.ts:51`) and then
   leaves `Init` for `Aim`/`PlaceBall`.
3. The joiner is still in `Init`, so `Init.handleWatch` (`init.ts:66-72`) does
   `table.updateFromSerialised(event.json)`, sets `session.playerIndex = 1`,
   calls `rules.secondToPlay()` and enters `WatchAim`.

From that point on every `WATCHAIM` is a turn-continuation marker, not a
snapshot: after a scoring shot in carom (`libre.ts:86`, `threecushion.ts:91`,
`sagu.ts:167`), after a pot in pool/snooker (`eightball.ts:312` and `:332`,
`snooker.ts:284` and `:298`, `nineball.ts:139` and `:157`) and from the bot
(`boteventhandler.ts:443`).

Mid-game state travels in `HIT` instead, which uses `serialiseHit()` and
carries the cue ball only (`table.ts:196-205`). All other balls are each
client's own simulation; there is no full-state refresh during live play.

## What the receiver does with the payload

| Site | `json.balls` | `json.aim` |
| --- | --- | --- |
| `init.ts:66-72` `Init.handleWatch` | **Yes.** `table.updateFromSerialised(event.json)` is the only real consumer. | **Yes.** The same call assigns `cue.aim`. |
| `watchshot.ts:76-84` `WatchShot.handleWatch` | Only when `"rerack" in event.json` (`RerackEvent.applyBallinfoToTable`). **No producer of that shape exists** - every `WatchEvent` is built from `table.serialise()`, and `RerackEvent` is a separate type (`eightball.ts:323`, `nineball.ts:279`, `snooker.ts:388`). Dead branch. | No. |
| `watchaim.ts` | No override; base `Controller.handleWatch` (`controller.ts:64`) returns `this`. The constructor does not read `event.json` at all: it takes the cue ball from `rules.otherPlayersCueBall()` and moves the cue there (`watchaim.ts:13-17`). | No. |
| `aim.ts`, `playshot.ts`, `placeball.ts`, `end.ts`, `replay.ts` | Same base no-op. | No. |
| `spectate.ts:28-45`, `:65-79` | Decodes every message, reads `playername` for the name sniff only. `WATCHAIM` is never queued or applied. | No. |
| `boteventhandler.ts:115-133` | `switch (event.type)` has no `WATCHAIM` case - parsed, then dropped. | No. |
| `recorder.ts:31-45` | Never records `WATCHAIM`, so replays and share links never carry it. | No. |
| `event-log.ts:20-24` | Skips `WATCHAIM` entirely. | No. |

`Table.updateFromSerialised` (`table.ts:212-219`) applies the two fields
independently, `if (data.balls)` and `if (data.aim && this.cue)`. That is what
makes an empty payload safe for every receiver, and equally what would make an
aim-only payload half-apply on the one path that reads it.

The live opponent aim does not come from `WATCHAIM`. It arrives on the `AIM`
stream, which `WatchAim.handleAim` (`watchaim.ts:27`) and `spectate.ts:102`
assign to `cue.aim` directly. The aim carried by a continuation `WATCHAIM` is
the shooter's aim at the instant after the shot - already seen, and stale by the
time it lands.

So in live play the snapshot is inflated and materialised into 2N doubles on
every receiver (and on the bot relay), then thrown away.

## Where it is sent, and what must keep it

| Send site | Payload needed? |
| --- | --- |
| `init.ts:51` (Begin handshake) | **Yes.** The joiner's only full-table snapshot, and the message that assigns its role. |
| `libre.ts:86`, `threecushion.ts:91`, `sagu.ts:167` | No. |
| `eightball.ts:312`, `eightball.ts:332` | No. |
| `snooker.ts:284`, `snooker.ts:298` | No. |
| `nineball.ts:139`, `nineball.ts:157` | No. |
| `boteventhandler.ts:443` | No (the human receiver drops it; the bot itself ignores `WATCHAIM`). |

Three of those ten cannot reach another client even today: `eightball.ts:332`,
`snooker.ts:284` and `nineball.ts:157` sit inside `if (container.isSinglePlayer)`,
and `browsercontainer.ts:152` defines that as `!wss && !botMode && !replay`. In
that mode `Container.broadcast` is a no-op (`container.ts:114`) and
`BrowserContainer.broadcast` publishes only through a connected relay, so the
event is dropped before it is encoded. They are converted along with the rest
rather than special-cased; deleting them is a separate cleanup.

Other `serialise()` callers that must stay on the full form and are deliberately
not touched:

- `container.ts:459` `saveResumeEntry` - the post-refresh resume snapshot.
- `playshot.ts:60` - `postMessage` to an embedding parent frame, which is an
  external contract.
- `table.ts:208` `Table.fromSerialised`, and the tests that round-trip it.

## Proposed change

### 1. Send an empty payload at the turn-continuation sites

```ts
this.container.sendEvent(new WatchEvent({}))
```

at the ten sites listed above. `init.ts:51` stays
`new WatchEvent(this.container.table.serialise())`.

Why `{}` rather than an aim-only payload:

- `json.aim` is read by exactly one receiver, `Init.handleWatch` via
  `updateFromSerialised`. No continuation receiver applies it, and the `AIM`
  stream has already delivered the same value.
- Each continuation site fires while the receiver is in `Aim`, `WatchAim`,
  `WatchShot` or `PlaceBall`. None of them override `handleWatch`, so the json
  never reaches `updateFromSerialised` at all.
- Keeping `aim` would leave the one frame that is read (`Init`) half-adopting:
  aim applied, balls not. Adopting nothing is the more honest state.
- The payload must stay an object with the key omitted, not `undefined`:
  `WatchShot.handleWatch` does `"rerack" in event.json`, and `in` throws on
  `undefined`.

### 2. No receiver changes are required

- `updateFromSerialised` guards each field separately (`table.ts:212-219`), so
  `{}` is a no-op for positions and aim.
- `EventUtil.unpackWatchBalls` returns the json untouched when `balls` is not a
  string (`eventutil.ts:63-66`), so an absent key never reaches `decodeCoords`.
- `EventUtil.serialise` packs only when `Array.isArray(json.balls)`
  (`eventutil.ts:48-58`), so an empty payload goes out as plain JSON.
- `EventUtil.fromJson` still returns a `WatchEvent`, and `applyToController`
  still runs the same no-op handlers, so routing and sequencing are unchanged.

### 3. Do not implement this in `EventUtil`

A one-line condition in `EventUtil.serialise` (drop `balls` for `WATCHAIM`) would
also drop the Begin snapshot at `init.ts:51`, which is the only frame whose
positions are read. The codec cannot tell the two apart, so the decision has to
live at the send sites.

## Alternatives considered

- **`Table.serialiseAimOnly()`** (`{ aim: this.cue?.aim.copy() }`) - keeps the
  larger of the two unread fields, and makes `Init`'s half-adopt possible. It
  also has an inconsistent wire shape when `cue` is undefined, because
  `JSON.stringify` drops the `aim` key and the payload silently becomes `{}`.
- **Build the payload inline** - with an empty payload there is no shape left to
  centralise; `new WatchEvent({})` at each call site is clearer than a `Table`
  method that returns nothing.
- **Delete the packing codec** - not yet. The Begin handshake still needs it, and
  it is covered by `test/utils/wire-codec.spec.ts`.

## Behaviour changes and risks

1. **Refresh or rejoin without a resume entry.** A reloaded page lands in `Init`,
   and its only exit is `Init.handleWatch`. Today it would adopt the next
   mid-game `WATCHAIM`'s positions (and its role); with this change it adopts
   nothing and sits on its own rack until something else fixes it. The window is
   narrow: `ResumeHandler.tryResume` restores `Aim`/`WatchAim`/`PlaceBall`
   directly (`resumehandler.ts:34`), and `saveResumeEntry` runs at every turn
   boundary in networked play (`container.ts:459`), so the fall-through needs no
   entry, a stale table id, or a corrupt entry. The path is already broken in
   other ways (per-page `Rack.jitter`, no `vel`/`rvel` in the payload, ids
   inferred from array index). The real fix is an explicit snapshot request on
   join, which is a separate change.
2. **Rematch.** `End.handleBegin` returns `new Init(...)` (`end.ts:147-150`), and
   the host's re-handshake still sends `serialise()` at `init.ts:51`, so the new
   game's start snapshot is unaffected.
3. **Embedded/iframe consumers.** Untouched - `playshot.ts:60` keeps
   `serialise()`.

## Tests

Existing tests keep passing because `serialise()` is unchanged (notably
`test/model/table.spec.ts:161,174`, `test/utils/wire-codec.spec.ts:73-100`,
`test/events/aimevent.spec.ts:112-190`, `test/controller/*`). No test asserts
that a turn-continuation frame carries ball positions; the codec tests build
their own `WatchEvent(table.serialise())` rather than observing a broadcast.

Add:

- `test/utils/wire-codec.spec.ts`: `new WatchEvent({})` round-trips through
  `EventUtil.serialise` -> `EventUtil.fromSerialised` as a `WatchEvent` whose
  `json` has neither `balls` nor `aim`.
- `test/controller/watchshot.spec.ts`: `handleWatch` with an empty payload still
  transitions to `WatchAim`. This covers the `in` operator, which is the only
  way this change can throw.
- `test/model/table.spec.ts`: `updateFromSerialised({})` leaves every ball
  position, velocity and `cue.aim` untouched.
- `test/rules/libre.spec.ts` (or a shared helper): the continuation `WATCHAIM`
  emitted after a scoring shot has an empty payload, while the frame sent from
  `init.ts:51` still carries `balls`.

## Verification

Per `AGENTS.md`:

```
yarn lint      # tsc --noEmit + eslint
yarn test
yarn prettify
```

The change is one payload expression at ten call sites, so lint and the codec /
controller tests above are the meaningful gates.

## Out of scope

- **Not a desync fix.** The mid-game divergence reported for
  libre/threecushion/sagu comes from unsynchronised state and per-client physics
  configuration, not from this payload. Dropping the payload removes a
  misleading artefact; it does not add a snapshot, a checksum or a resync.
- **Full-state sync at turn boundaries** (all balls, `vel`/`rvel`, ids, physics
  config) - separate design, and the real fix for the reported problem.
- **The dead `"rerack"` branch** in `watchshot.ts:78-81` - worth deleting once
  it is clear nothing will send that shape, but unrelated to this change. It
  stays harmless here because an empty payload simply does not take the branch.
