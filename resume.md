# resume.md — Resuming a 2-player game after a full page refresh

## Status

**Phase 1 (save-only, no behaviour change) is implemented:**

- `src/utils/resumestore.ts` — `ResumeStore` (save/load/clear/noteMsgId),
  keyed `resume.<clientId>`, stale-`tableId` guard, no fallback handling.
  Watermark kept on `Session.lastMsgId` (reset per game).
- `MessagingMessageRelay` + `MessageRelay` interface — subscribers now
  receive `(message, msgId?)`; `BotRelay` unaffected.
- `BrowserContainer.netEvent(e, msgId?)` notes the watermark before the
  self-echo check.
- `Container.sendScoreUpdate(..., nextControllerName?)` writes the snapshot
  unconditionally before the `changed` guard (`saveResumeEntry`), gated to
  networked non-spectator/bot/replay games; `PlayShot.handleStationary`
  passes `nextController.name`.
- `End.onFirst` clears the slot.
- Tests: `test/utils/resumestore.spec.ts`, msgId cases in the relay spec.

**Phase 2 (implemented):** restore path in `BrowserContainer` (`tryResume`,
called after subscribe but before connect so the filter arms first),
watermark skip in `netEvent`, controller-by-name construction
(`resumeController`: `Aim`/`WatchAim`/`PlaceBall`), entry retained on load
(restore is idempotent; cleanup via `End`, next save, tableId guard).
Decisions applied: `playerIndex` is re-derived from the URL (`first` flag) and
is no longer stored in the payload; no watermark-missed fallback logic —
drop-until-seen only (if the watermark never appears, messages stay dropped;
accepted as-is). Manual verification of refresh scenarios pending.

## Goal

After a full refresh (or accidental tab close + reopen) of a 2-player network
game, restore the local game to the correct controller and table state without
restarting the rack, using `localStorage` only.

**Non-goals:** mid-shot recovery (velocities/spin are not serialised and don't
need to be), refreshing while your *own* shot is in flight (after the `HIT` is
published but before the turn boundary settles — the stored entry is still the
previous turn boundary and cannot re-simulate it; this diverges and is
deferred to **Future work** below), spectator resume, bot/practice/drill
games, cross-device resume.

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

Key: `resume.<clientId>` — one slot per player, not per table. Two players
sharing a browser (or two local test iframes) have distinct `userId`s, so
their slots never collide, and a player's new game simply overwrites their own
old slot. The payload still carries `tableId` so a stale tab (reopened after
the same client started a fresh game) is detected and ignored on load. No TTL,
no prefix scan, no explicit cleanup of other table ids.

```jsonc
{
  "tableId": "nchan-channel-id",     // validation: discard if this tab's tableId differs (stale tab)
  "controller": "WatchAim",          // "Aim" | "WatchAim" | "PlaceBall" (PlaceAllBalls is drill-only, never in 2-player)
  "tablejson": { ... },              // table.serialise() — stationary
  "score": { "p1": 3, "p2": 1, "b": 2, "active": 1 },
  "p1type": 1,                       // Session.p1type at save time (eightball group assignment)
  "msgId": "nchan-msg-id-watermark"  // last message id we processed
}
```

No schema version field until a second version exists. `ruletype` comes from
the URL and is not stored; `tableId` is stored only for the stale-tab
validation below. `playerIndex` is not stored either — the URL carries both
players' identities (`userId`/`userName`, `opponent.userId`/`opponent.userName`)
plus the `first` flag, so on load the refresher's role is re-derived exactly as
a live join assigns it (`first` present → playerIndex 0, else 1).
`PlaceAllBalls` appears in the controller enum for completeness but is
drill-only (`DrillPanel`) and never returned by 2-player `rules.update`, so it
won't occur in practice.

**Why `p1type` must be stored:** eightball group assignment (solids/stripes)
is set incrementally via events (`ControllerBase.handleScore`,
`controllerbase.ts:49-54`) — typically at a turn boundary *earlier* than the
snapshot, so its broadcast has msgId ≤ watermark and the replay filter drops
it. Restoring without `p1type` leaves `Session.p1type === 0` (unassigned) and
the resumed eightball game cannot determine ball groups. On restore, seed
`Session.p1type` from the payload before entering the stored controller.
(`nextCandidateBall` in `eightball.ts:96` reads it from `Session`.)

### Validation on load

Discard the entry when its stored `tableId` doesn't match the current tab's
`tableId` — a stale tab reopened after the same client started a fresh game.
(The new game already overwrote the slot, so this is just a cheap guard.)

Also delete the entry when the `End` controller is reached (game over) — never
resume into a finished game. The delete belongs in `End.onFirst`, not the
score path: `sendScoreUpdate` fires before end-of-game is known and the `End`
controller isn't returned through it (`src/controller/playshot.ts:43`).

## Write path

One hook, at the point a turn boundary settles. `Container.sendScoreUpdate`
(`src/container/container.ts:322`) is the natural place: it fires with the
post-shot score/active player and every rules outcome (`pot`, `foul` →
`PlaceBallEvent`, `miss` → `StartAimEvent`) passes through it. At that moment
the table is stationary, so `table.serialise()` is valid.

**Caveat: the save must NOT be gated on the `changed` check.**
`sendScoreUpdate` only broadcasts a `ScoreEvent` when score/HUD values
actually changed (`container.ts:322-331`), but a turn can settle with
unchanged score digits (e.g. a foul with no pot still flips active player —
though `activePlayer` is part of the changed check, other future paths may not
be). Write the snapshot unconditionally at the top of the hook, before the
`changed` guard.

Also store `Session.p1type` in the payload here (see *Payload* above) — it is
the only Session state not recoverable from table/score/controller, and it
must be captured on every write since group assignment can change mid-game
(open table → first legal pot).

`sendScoreUpdate` is called from `PlayShot.handleStationary`
(`src/controller/playshot.ts:43`), i.e. **only on the shooter's client** — the
watcher does not write at the opponent's turn boundaries. That is fine, not a
bug: the watcher's entry is written at their own last shot, when the stored
controller is already `WatchAim` (the opponent's next turn), and any later
turns are reconstructed from the buffer replay (opponent `HIT` → `WatchShot`,
then `ScoreEvent`/`StartAimEvent`). A watcher therefore refreshes at most one
shot behind, and the replay catches them up.

The controller name to store is the one `rules.update` returned / will return
(`Aim`, `WatchAim`, `PlaceBall`).

The watermark needs the `msgId` of the last *received* message — see plumbing
below. Because the write happens at shot resolution, several seconds after the
`HIT` was published, our own `HIT` echo has always arrived by then, so the
watermark naturally covers our own shot; the only messages with a larger msgId
are our own turn-boundary broadcasts, which self-echo suppression drops (they
are already reflected in the snapshot). Writes happen in **every 2-player
mode, agnostic of rule type**, and
nowhere else. The gate is the negation of the existing single-player check
(`browsercontainer.ts:144`): networked session (`wss` set) and not spectator,
not bot, not replay. Practice/drill are local 1-player modes and fall outside
it automatically — do **not** key the gate off `practiceMode`, which defaults
to true for every non-nineball ruletype (`browsercontainer.ts:90`).

## Restore path

In `BrowserContainer`, after URL params are parsed and before `Init` runs:

1. Read `resume.<clientId>`; validate `tableId` matches. On any
   miss, fall through to the existing fresh-game path untouched.
2. `table.updateFromSerialised(entry.tablejson)` (velocities zero — fine, the
   snapshot is stationary by construction).
3. Seed score/HUD from `entry.score`, and seed `Session.p1type` from
   `entry.p1type` (see *Payload* — the group-assignment event that originally
   set it has msgId ≤ watermark and will never replay).
4. Instantiate the stored controller directly (`Aim`, `WatchAim`, `PlaceBall`)
   instead of letting `Init` broadcast a fresh `WatchEvent`
   (`src/controller/init.ts:65`). `playerIndex` is re-derived from the URL
   (`first` present → 0, else 1) — same assignment a live join produces; the
   stored `active` in score decides whose turn the HUD shows.
5. Install the watermark in the net event path. Replay is in-order, so no
   comparison is needed (and lexicographic `<=` on `ts.sequence`-style ids
   would be wrong anyway): **drop every message until the exact watermark
   msgId is seen, then process everything after it.** No fallback logic: if
   the watermark never appears (e.g. truncated buffer) messages stay dropped —
   accepted as-is, keeping the filter to one comparison.
6. **Keep self-echo suppression on during replay.** `netEvent` drops events
   whose `clientId` equals our own (`browsercontainer.ts:324`); that stays.
   The snapshot already reflects our own turn-boundary broadcasts
   (`ScoreEvent`/`StartAimEvent`/`PlaceBallEvent`), so replaying them would be
   redundant. The only reason to bypass self-echo would be to re-process our
   own in-flight `HIT`, which is out of scope (see non-goals) — so no bypass
   is added.
7. **Retain the stored entry on load — do not consume-and-clear.** Restore is
   idempotent: the same entry plus the same buffer (≥ watermark) replays to
   the same state, so a second reload without a new shot re-resumes from the
   same boundary instead of falling back to a fresh rack (which the
   `WatchEvent` handshake would then propagate to the opponent too). Cleanup
   stays with `End.onFirst`, the next save, and the tableId guard.
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

All `localStorage` access in the resume store is direct — no try/catch, no
private-mode/quota fallback. If storage is unavailable or an entry is corrupt,
resume fails and a fresh game starts; not coding for that case.

### Preferred end state: push this into @tailuge/messaging

The watermark filter in `netEvent` is the most error-prone piece of this
design. The lib could absorb it entirely:

- `joinTable`/`spectateTable` accept a `resumeFromMsgId` option — Nchan
  supports positional subscribe (`last_id`), so the buffer would replay *only
  messages after the watermark* and the app-side filter disappears.
- Expose `table.lastMsgId`. The lib already records every msgId it sees in
  `seenMsgIds` (`table.js` `handleIncomingMessage`), but no `lastMsgId` getter
  exists yet — it would need to be added — so the app could read it at save
  time instead of needing the relay signature change above.

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

### Why a new game never resumes into the old one

Keying by `clientId` means a new game writes to the same slot and simply
overwrites the old entry — no stale resume survives. Defence in depth: the
entry is deleted at `End` and rejected on load if its stored `tableId`
doesn't match the current tab. (`tableId` is a client-generated channel id
created fresh per challenge, `lobby.js:199`, so it changes every game.)

## Effort estimate

| Item | Size |
|---|---|
| `ResumeStore` util (get/put/clear, no fallback) + light unit tests | ~0.25 day |
| Relay msgId surfacing | trivial (<10 lines) |
| `BrowserContainer`: restore path, watermark skip, gate | ~1 day |
| Write hook in `sendScoreUpdate` + delete in `End.onFirst` | ~0.25 day |
| Controller-by-name construction (`Aim`/`WatchAim`/`PlaceBall`) | ~0.25 day |
| Light-touch tests + manual pass: refresh scenarios × rule types | ~0.5 day |

**Total: ~2–2.5 developer-days** (no fallback code, deliberately light
testing). The optional `@tailuge/messaging` change
(`resumeFromMsgId` + `lastMsgId`) is **not required** for the MVP and would
remove roughly half of the `BrowserContainer` item if done later.

## Edge cases

- **Opponent shot in flight at refresh:** covered for the refresher (their
  `HIT` replays with a newer msgId). The *opponent* is unaffected — they just
  see us rejoin (`onOpponentRejoined` hook already exists,
  `messagingmessagerelay.ts:64`); no special handling needed on either side.
- **Own shot in flight at refresh:** out of scope for now — a refresh after
  our `HIT` is published but before the turn boundary settles restores the
  *previous* boundary and drops the in-flight shot, while the opponent (who
  simulated it) waits forever for the shooter's boundary broadcasts. Real and
  diverging; recovery is designed but not implemented — see **Future work**
  below.
- **Buffer truncation:** Nchan buffers are bounded (~2000). For a 2-player
  game a turn boundary is written every few messages, so the watermark stays
  well inside the buffer for any realistic session; accepted as out of scope.
- **Break-off placement constraint after resume:** `NineBall.placeBall`
  clamps via `isFirstShot(this.container.recorder)` (`nineball.ts:53`), and
  the Recorder is not part of the snapshot — so after a resume,
  `isFirstShot` may return a wrong answer and misapply/miss the baulk-line
  clamp on ball-in-hand placement. **Out of scope for now: the Recorder /
  first-shot mechanism is changing in other planned work; revisit this once
  that lands rather than patching around it here.**
- **`End.onFirst` delete must fire on both clients:** verify `End` is entered
  locally on each client (via replayed end-of-game events), not only on the
  shooter's — otherwise one side keeps a resumable entry for a finished game
  (harmless due to the tableId guard, but stale).
- **Ball-in-hand / break-off:** `PlaceBall` restores fine from the snapshot;
  the pending `PlaceBallEvent` need not be re-sent by the opponent (the
  restored controller already expects placement).
- **Threecushion/Sagu cue-ball ownership (fixed):** each player owns their own
  cue ball (p1 → `balls[0]`, p2 → `balls[1]`) and role assignment normally
  happens once in `Init.handleWatch` via `rules.secondToPlay()`. Resume bypasses
  `Init`, so a refreshed second player would keep the fresh-rules default and
  aim/fire/score with the wrong ball. `tryResume` therefore calls
  `rules.secondToPlay()` when `!first` before constructing the stored
  controller — exactly what a live join does; no-op for other rules. Ownership
  is static per role, so role + controller name fully determine the correct
  ball at any turn boundary; no payload change needed.
- **Both players refresh:** each restores its own entry; both then replay the
  buffer consistently because the watermark + deterministic controllers are
  per-client.
- **Stale entry after starting a new game:** a new game writes to the same
  `resume.<clientId>` slot, overwriting the old entry; no explicit
  invalidation needed.

## Future work: recovering an own in-flight shot

Refreshing while our own shot rolls is the one remaining divergence, and it is
a real one: rolling time is long (multi-second shots are normal), so over a
session a crash or connection issue inside that window is statistically
likely. Observed failure: the refresher restores the *previous* boundary
(start-of-shot positions) believing it is still their turn; the opponent
finished simulating via `WatchShot` and now waits forever for the boundary
broadcasts (`ScoreEvent`/`StartAimEvent`) that only `PlayShot.handleStationary`
on the shooter's client ever sends. Both clients diverge.

The key observation that makes local recovery feasible: **the shot is fully
determined by (pre-shot stationary table + hit params), and we already have
both.**

- The stored entry *is* the pre-shot state — balls do not move between a turn
  boundary and the shot taken during that turn.
- The published `HitEvent` carries everything needed to re-simulate
  (`cueBallId`, angle, power, offset, elevation).
- We can assume the `HIT` reached the opponent (publishes are reliable/
  retried by the library outbox). So this is purely about **local** recovery:
  re-simulate the shot on reload, then resolve the turn as the shooter again —
  running `rules.update` normally and publishing fresh boundary broadcasts.
  No protocol change; the opponent just waits a little longer for a boundary
  that arrives late instead of never.

Sketch: at `HIT` publish time, record the hit params in the resume payload (or
a sibling slot) as a "pending shot"; on load, if a pending shot exists, apply
the entry snapshot, replay the hit locally through `PlayShot`'s normal path,
and continue. Clear the pending marker when the next boundary settles.

### Issues any solution must handle

1. **Never re-publish the `HIT`.** The opponent already processed it; a second
   copy double-simulates. Recovery replays the hit *locally only* — but the
   nchan buffer will also redeliver our own `HIT` (msgId > watermark), which
   self-echo suppression drops. Decide deliberately whether recovery consumes
   the stored params (simplest) or the replayed echo (bypassing suppression
   for exactly that one message — fiddly).
2. **Where the pending hit is captured.** The current save hook fires at the
   previous boundary, before the in-flight shot exists. Either extend
   `saveResumeEntry` with a pending-hit field written at publish time, or let
   the watermark filter pass our own `HIT` through to a recovery handler.
   Both keep writes shooter-side only.
3. **Rules resolution happens once, by exactly one client.** The refresher
   becomes the resolver again and broadcasts fresh boundary events; the
   opponent never saw originals, so there are no duplicates to suppress — but
   if *both* players refreshed mid-shot, nobody resolves. Accept (same class
   as today).
4. **Determinism.** Re-simulation must match what the opponent watched:
   same physics code + same params is deterministic, but the recovered run
   must not depend on local state the refresh discarded (Recorder/first-shot,
   cue spin visuals are fine to differ).
5. **UI during recovery.** The player should watch their shot again
   (`WatchShot`-style playback from the restored snapshot), not stare at a
   frozen aim view for the seconds the re-simulation takes.
6. **Cleanup coherence.** The pending marker must be cleared when the shot
   resolves (next boundary save supersedes it) and at `End`, or a stale
   pending hit would replay an old shot onto a much later resume.
7. **Interaction with Recorder/first-shot work.** Same caveat as the
   break-off clamp above: outcome-dependent rules paths that read the
   Recorder may still be wrong post-resume; revisit together.
8. **Heavier alternatives rejected:** watcher-takeover protocols (race-prone
   against the returning player) and server-side arbitration (no server logic
   today). The lib-level `resumeFromMsgId` positional subscribe would simplify
   the watermark but does nothing for this case by itself.

## Testing

Deliberately light touch — no fake-relay harness, no two-container
integration rig:

- Unit: `ResumeStore` save/load round-trip, watermark capture, per-client
  keying, stale `tableId` rejection, clear (no fallback/quota tests).
- Unit: relay passes `meta.msgId` through to subscribers.
- Manual: play a few shots in a 2-player game, refresh, confirm the entry in
  devtools (`resume.<clientId>`); repeat once with eightball after a group is
  assigned to confirm `p1type` is captured. The restore path itself gets a
  manual pass when phase 2 lands.

## Summary of changes

1. ✅ `MessagingMessageRelay`: surface `meta.msgId` to subscribers.
2. ✅ `BrowserContainer`: track latest msgId; watermark skip in `netEvent`
   (self-echo suppression retained); restore path (`tryResume`) before the
   relay connects, before `Init` can run; seed `Session.p1type` on restore;
   `playerIndex` re-derived from the URL `first` flag (not stored).
3. ✅ `Container.sendScoreUpdate` (via `ResumeStore`): writes the snapshot
   entry unconditionally (not gated on the `changed` check), including
   `Session.p1type`; `End.onFirst`: deletes it.
4. ✅ New util `src/utils/resumestore.ts`: get/put/clear + tableId validation,
   keyed `resume.<clientId>`.

No protocol changes; everything else reuses the existing controller flow.
