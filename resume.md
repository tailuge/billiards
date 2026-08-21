# resume.md — Resuming a 2-player game after a full page refresh

## Goal

After a full refresh (or accidental tab close + reopen) of a 2-player network
game, restore the local game to the correct controller and table state without
restarting the rack, using `localStorage` only.

**Non-goals:** mid-shot recovery (velocities/spin are not serialised and don't
need to be), spectator resume, bot/practice/drill games, cross-device resume.

## Current behaviour after refresh

`BrowserContainer` rebuilds everything from URL params
(`src/container/browsercontainer.ts:73`) and `Init` starts a fresh rack. The
only persistence today is `anonId` (`src/utils/uid.ts:8`). Replay links
(`state=` query param) exist but are for shared/recorded games, not live ones.

Two facts make resume cheap:

1. **Nchan replays the channel buffer from `oldest` on every (re)join**
   (`node_modules/@tailuge/messaging/dist/table.d.ts:54`). After a refresh the
   client's dedup set is empty, so *every* buffered table message is
   re-delivered to us, in order, each carrying a server-assigned
   `meta.msgId`.
2. **Shots are simulated locally from hit params** (`WatchShot`), and
   `table.serialise()` (`src/model/table.ts:189`) round-trips stationary ball
   positions + cue aim via `updateFromSerialised` (`table.ts:212`).

## Design: turn-boundary snapshot + receive watermark

Store, at each turn boundary, a stationary table snapshot plus the `msgId` of
the **last message received** (a watermark). On reload: restore the snapshot,
enter the controller implied by the stored score/turn, then feed the replayed
buffer through the normal event path, dropping anything at or before the
watermark. Anything *newer* — including an opponent's `HIT` that was in flight
when we refreshed — is processed by the ordinary controllers exactly as if it
had just arrived.

### Why not "snapshot at start of last shot + msg id of that shot"

The original idea (pre-shot snapshot + the shot's msg id) has one real
problem:

- **Silent rules replay is fragile.** Resuming from a pre-shot snapshot means
  re-simulating the shot and re-running `rules.update(outcome)` with broadcasts
  suppressed. Rules state is built incrementally across turns (break
  assignments, fouls, ball-in-hand), so a single replayed update does not
  reconstruct multi-turn state.

(The sender *can* know its own msgId: self-echo is suppressed by clientId in
`netEvent`, after the relay, so `MessagingMessageRelay.onMessage` sees the
shooter's own publishes too.)

A turn-boundary snapshot avoids the rules-replay problem entirely: no
simulation on resume, no suppressed broadcasts, and the controller to re-enter
is a stored string.

### Payload

Key: `resume.<tableId>`. The `tableId` alone is sufficient: it is the Nchan
channel name, so it uniquely identifies the game session — everything else in
the URL (`ruletype`, `userId`, ...) is either re-derived from the URL on load
or validated against the payload before restore. A single fixed prefix keeps
the store tidy and makes "clear all resume state" a prefix scan. Per-table
keying means two concurrent games in different tabs never collide.

```jsonc
{
  "savedAt": 1774892219839,          // Date.now() at write, for expiry
  "controller": "WatchAim",          // "Aim" | "WatchAim" | "PlaceBall" | "PlaceAllBalls"
  "tablejson": { ... },              // table.serialise() — stationary
  "score": { "p1": 3, "p2": 1, "b": 2, "active": 1 },
  "msgId": "nchan-msg-id-watermark", // last message id we processed
  "playerIndex": 1                   // Session.playerIndex at save time
}
```

No schema version field until a second version exists; `ruletype`/`tableId`
are not stored — the key already carries `tableId` and `ruletype` comes from
the URL. Only `playerIndex` is genuinely not URL-derivable.

### Expiry

On load, discard the entry when any of these hold:

- `Date.now() - savedAt > TTL` (suggest 12h; a table left overnight is dead
  anyway),
- `playerIndex` doesn't match (both players sharing a browser would otherwise
  restore the wrong side).

Also delete the entry when the `End` controller is reached (game over) — never
resume into a finished game. The delete belongs in `End.onFirst`, not the
score path: `sendScoreUpdate` fires before end-of-game is known and the `End`
controller isn't returned through it (`src/controller/playshot.ts:43`).

## Write path

One hook, at the point a turn boundary settles. `Container.sendScoreUpdate`
(`src/container/container.ts:322`) is the natural place: it already fires with
the post-shot score/active player, runs on both clients, and every rules
outcome (`pot`, `foul` → `PlaceBallEvent`, `miss` → `StartAimEvent`) passes
through it. At that moment the table is stationary, so `table.serialise()` is
valid.

The controller name to store is the one `rules.update` returned / will return
(`Aim`, `WatchAim`, `PlaceBall`, `PlaceAllBalls`).

The watermark needs the `msgId` of the last *received* message — see plumbing
below. Writes happen in **every 2-player mode, agnostic of rule type**, and
nowhere else. The gate is the negation of the existing single-player check
(`browsercontainer.ts:144`): networked session (`wss` set) and not spectator,
not bot, not replay. Practice/drill are local 1-player modes and fall outside
it automatically — do **not** key the gate off `practiceMode`, which defaults
to true for every non-nineball ruletype (`browsercontainer.ts:90`).

## Restore path

In `BrowserContainer`, after URL params are parsed and before `Init` runs:

1. Read `resume.<tableId>`; validate per the expiry rules. On any
   miss, fall through to the existing fresh-game path untouched.
2. `table.updateFromSerialised(entry.tablejson)` (velocities zero — fine, the
   snapshot is stationary by construction).
3. Seed score/HUD from `entry.score`.
4. Instantiate the stored controller directly (`Aim`, `WatchAim`, `PlaceBall`,
   `PlaceAllBalls`) instead of letting `Init` broadcast a fresh `WatchEvent`
   (`src/controller/init.ts:65`). `playerIndex` comes from the URL/Session as
   today; the stored `active` in score decides whose turn the HUD shows.
5. Install the watermark in the net event path. Replay is in-order, so no
   comparison is needed (and lexicographic `<=` on `ts.sequence`-style ids
   would be wrong anyway): **drop every message until the exact watermark
   msgId is seen, then process everything after it.** If the watermark never
   appears (truncated buffer) everything replays — same as today's reconnect
   behaviour, and safe.
6. **Bypass self-echo during replay.** Normally `netEvent` drops events whose
   `clientId` equals our own (`browsercontainer.ts:324`). During buffer replay
   that check must be suspended: if we refreshed while *our own* shot was in
   flight, our replayed `HIT` would otherwise be dropped, we'd never
   re-simulate it, and we would diverge permanently from the opponent (who did
   simulate it). Processing our own hit params through `WatchShot` is fine —
   simulation is deterministic, which the architecture already relies on.
7. Clear the stored entry once consumed (a crash during resume then falls back
   to a fresh rack rather than a half-applied one).
8. Verify the post-restore `BeginEvent` broadcast (`browsercontainer.ts:310`)
   hitting the restored controller is a harmless no-op (`handleBegin` via
   `ControllerBase` for `Aim`/`WatchAim`; check `PlaceBall`).

From here the existing machinery does the rest: Nchan replays the buffer, the
watermark filters the past, and a `HIT` newer than the watermark drives
`WatchAim.handleHit` → `WatchShot` exactly like a live shot.

## msgId plumbing (small, contained change)

`MessagingMessageRelay.onMessage`
(`src/network/client/messagingmessagerelay.ts:44`) currently forwards only
`msg.data` and drops `msg.meta.msgId`. Change the subscriber signature to pass
`{ data, msgId }` (or attach msgId to the serialised envelope) so
`BrowserContainer` can (a) track the latest seen msgId for the write path and
(b) match the watermark on restore. `BotRelay` is unaffected (local
sequence, no msgId → never filters).

All `localStorage` access in the resume store is wrapped in try/catch
(private mode / quota errors) and falls through to a fresh game.

### Preferred end state: push this into @tailuge/messaging

The watermark filter in `netEvent` is the most error-prone piece of this
design. The lib could absorb it entirely:

- `joinTable`/`spectateTable` accept a `resumeFromMsgId` option — Nchan
  supports positional subscribe (`last_id`), so the buffer would replay *only
  messages after the watermark* and the app-side filter disappears.
- Expose `table.lastMsgId` (the lib already tracks every msgId it sees,
  `table.js:353`) so the app reads it at save time instead of needing the
  relay signature change above.

With that, changes 1–2 in the summary shrink to zero app-side filtering code.
Until then the plan above works standalone.

### Relationship to the lib's existing reconnect dedup

`Table.seenMsgIds` (`table.js:349`) is a per-`Table`-instance in-memory Map,
populated as messages arrive and FIFO-bounded. It suppresses duplicate
re-deliveries **within one session** (transport reconnects keep the same
`Table`). A page refresh constructs a new `Table` with an empty set, so the
full buffer replays from `oldest` — which is exactly what the watermark
design relies on. The two mechanisms compose cleanly at different layers:
the lib dedups re-deliveries it has already emitted this session; the app
watermark skips history from before the refresh, once, on first join. No
conflict, no double-filtering.

### Why a new game never enters resume

`tableId` is a client-generated channel id created fresh per challenge
(`lobby.d.ts:98`), so every new game has a new key and `resume.<tableId>`
misses → fresh-game path. Defence in depth: the entry is also deleted once
consumed, expires via TTL, and is rejected if `playerIndex` differs.

## Effort estimate

| Item | Size |
|---|---|
| `ResumeStore` util (get/put/clear, TTL, try/catch) + unit tests | ~0.5 day |
| Relay msgId surfacing | trivial (<10 lines) |
| `BrowserContainer`: restore path, watermark skip, replay-time self-echo bypass, gate | ~1 day |
| Write hook in `sendScoreUpdate` + delete in `End.onFirst` | ~0.25 day |
| Controller-by-name construction (`Aim`/`WatchAim`/`PlaceBall`/`PlaceAllBalls`) | ~0.25 day |
| Two-container integration test harness + tests | ~1–1.5 days |
| Manual pass: refresh scenarios × rule types | ~0.5 day |

**Total: ~3.5–4 developer-days**, assuming the fake-relay test harness is
built as part of this. The optional `@tailuge/messaging` change
(`resumeFromMsgId` + `lastMsgId`) is **not required** for the MVP and would
remove roughly half of the `BrowserContainer` item if done later.

## Edge cases

- **Opponent shot in flight at refresh:** covered for the refresher (their
  `HIT` replays with a newer msgId). The *opponent* is unaffected — they just
  see us rejoin (`onOpponentRejoined` hook already exists,
  `messagingmessagerelay.ts:64`); no special handling needed on either side.
- **Buffer truncation:** Nchan buffers are bounded (~2000). For a 2-player
  game a turn boundary is written every few messages, so the watermark stays
  well inside the buffer for any realistic session; accepted as out of scope.
- **Ball-in-hand / break-off:** `PlaceBall`/`PlaceAllBalls` restore fine from
  the snapshot; the pending `PlaceBallEvent` need not be re-sent by the
  opponent (the restored controller already expects placement).
- **Both players refresh:** each restores its own entry; both then replay the
  buffer consistently because the watermark + deterministic controllers are
  per-client.
- **Stale entry after opponent started a new game on same tableId:** a new
  game gets a new `tableId`, so the old entry simply expires via TTL; no
  explicit invalidation needed.

## Testing

- Unit: serialise → localStorage-shaped payload → `updateFromSerialised`
  round-trip for each rules type (positions + potted-ball absence).
- Unit: watermark replay drops everything before the exact watermark msgId,
  passes everything after, and degrades to full replay when absent (extend
  `test/` around `EventUtil.fromSerialised` / a fake relay).
- Unit: own-clientId events are processed during replay but suppressed in
  normal play.
- Integration-style (fake relay, two containers): play N shots, "refresh" one
  container (rebuild from stored entry + replayed buffer), assert both
  containers reach identical controller + score after the next shot.
- Manual: refresh mid-opponent-shot, refresh during own aim, refresh on
  ball-in-hand, expiry after TTL.

## Summary of changes

1. `MessagingMessageRelay`: surface `meta.msgId` to subscribers.
2. `BrowserContainer`: track latest msgId; watermark skip + replay-time
   self-echo bypass in `netEvent`; restore path before `Init`; gate on
   networked 2-player (not `practiceMode`).
3. `Container.sendScoreUpdate` (or a small `ResumeStore` util it calls):
   write the snapshot entry; `End.onFirst`: delete it.
4. New util `src/utils/resumestore.ts`: get/put/clear + TTL + schema
   validation, keyed `resume.<tableId>`.

No protocol changes; everything else reuses the existing controller flow.
