# Fix: spectator declares game-over at the wrong race target

Status: proposal only. No code has been changed.

## Summary

In spectate mode, `threecushion`/`libre`/`sagu` games show `GAME OVER` as soon
as a score reaches the spectator's **local** race target, which defaults to 7
and knows nothing about the real game's `raceTo` / `handicap_*` settings.
Spectators therefore see a bogus end-of-game banner (and an `End` controller)
mid-game, with no way back except reload.

Meanwhile the authoritative signal — the winner's `GameOver` notification,
sent exactly once at the true end — already arrives on the spectator's socket
and is thrown away one layer up.

Proposal: stop spectators from self-declaring game-over on score, and instead
end the spectated game only when the broadcast `GameOver` notification arrives,
rendered with the spectator treatment (`GAME OVER` + lobby button).

## How it works today

1. The spectator subscribes to the full table channel (`spectateTable`
   receives retained + live traffic, i.e. everything both players publish).
2. `Spectate`'s subscribe callback (`spectate.ts:28-45`) decodes every message
   but only queues `Hit`/`Aim`/`Score`/`PlaceBall`/`Break`/`Rerack` into the
   event queue. `NotificationEvent` (and `ConcedeEvent`) are parsed and then
   dropped.
3. The winner's client ends the real game via
   `MatchResultHelper.presentGameEnd` (`matchresult.ts`), which calls
   `sendWinNotification`/`sendLossNotification`: a final `ScoreEvent` followed
   by a `NotificationEvent` with `type: "GameOver"`. Both reach the spectator's
   socket; only the `ScoreEvent` survives the filter in (2).
4. That `ScoreEvent` runs `ControllerBase.handleScore` (`controllerbase.ts`),
   which for `threecushion`/`sagu`/`libre` checks `rules.isEndOfGame([])` — a
   pure local score-vs-target comparison via
   `Session.getRaceTargetForPlayer()`.
5. The target comes from the **spectator's own URL**:
   `BrowserContainer` sets `ThreeCushionConfig.raceTo` from
   `params.get("raceTo") ?? "7"` (`browsercontainer.ts:106-108`), and
   `getRaceTargetForPlayer` reads `handicap_*` from
   `globalThis.location.search` (`session.ts`), falling back to that default
   when no handicaps are present. The spectate link does not carry the real
   game's race settings, so the check fires at 7 (or a 5/7 mix) regardless of
   the actual race.

There is also an ordering hazard confirming the diagnosis: the winner sends
the final `ScoreEvent` **before** the `GameOver` notification
(`matchresult.ts:sendWinNotification`/`sendLossNotification`), so the bogus
local declaration always wins the race against the true signal.

## Proposed change

Three small edits, all in the spectator/receive path. No wire-format, send
sites, or player-side logic changes.

### 1. Forward `GameOver` notifications in `Spectate`

In `spectate.ts`, add `NotificationEvent` to the forwarded types so the
authoritative end-of-game broadcast reaches the event queue:

```ts
if (
  event instanceof HitEvent ||
  event instanceof AimEvent ||
  event instanceof ScoreEvent ||
  event instanceof PlaceBallEvent ||
  event instanceof BreakEvent ||
  event instanceof RerackEvent ||
  event instanceof NotificationEvent
) {
  this.container.eventQueue.push(event)
}
```

`ControllerBase.handleNotification` already renders it (and backfills
`highBreaks`), so no further plumbing is needed. `ConcedeEvent` deliberately
stays dropped: the conceder's opponent runs `handleConcede` → `handleGameEnd`
locally, which emits the same `GameOver` notification, so concedes are covered
indirectly with no extra handling.

### 2. Never self-declare game-over as a spectator

In `controllerbase.ts` `handleScore`, skip the auto-end blocks for
spectators — both the carom block and the snooker block (the latter reads the
spectator's possibly-stale local table, same class of mirage):

```ts
if (!Session.isSpectator() && !this.container.replayMode && this.name !== "End") {
  // ... unchanged threecushion/sagu/libre and snooker checks
}
```

One condition; the player, bot and replay paths are untouched.

### 3. Render the incoming `GameOver` as a spectator

The broadcast payload carries the players' remote buttons (a rematch URL
addressed to the opponent via `getRemoteGameOverButtons`), which is wrong for
a spectator to display. Override `handleNotification` in `Spectate` to map an
incoming `GameOver` onto the existing spectator treatment instead of showing
it verbatim:

```ts
override handleNotification(event: NotificationEvent): Controller {
  const data = event.data
  if (typeof data !== "string" && data.type === "GameOver") {
    return super.handleNotification(
      new NotificationEvent(
        {
          type: "GameOver",
          title: t("GAME OVER"),
          subtext: typeof data.subtext === "string" ? data.subtext : undefined,
          icon: "🏆",
          extra: gameOverButtons.lobby,
          share: true,
          duration: 0,
        },
        event.duration
      )
    )
  }
  return super.handleNotification(event)
}
```

This mirrors `MatchResultHelper.notifySpectator` (`matchresult.ts:154`),
which is currently dead code for networked spectators — the local
score-threshold path in (2) always fires first. After this change it becomes
the single way a spectated game ends, reusing its exact copy and buttons.

## Tests

Minimal: extend `test/controller/spectate.spec.ts` (follows the existing
fake-relay pattern there). No new test files.

- **Score no longer ends a spectated game.** With `Session.init(..., spectator
  = true)`, feed `handleScore` a `ScoreEvent` at/above the default target
  (e.g. 7–3 on `threecushion`) and assert the controller stays `Spectate`
  (does not transition to `End`).
- **Broadcast `GameOver` ends it.** Capture the subscribe callback from a fake
  `MessageRelay`, push a serialised `GameOver` `NotificationEvent` through
  `EventUtil.serialise` → callback, and assert a `NotificationEvent` lands in
  `container.eventQueue` (i.e. the filter in (1) forwards it).

Existing coverage that must keep passing unchanged: `test/controller/spectate.spec.ts`,
`spectate_sniff.spec.ts`, `watchshot.spec.ts`, and the rules specs for
`threecushion`/`libre`/`sagu` (player-side game-over is untouched).

## Verification

Per `AGENTS.md`:

```
yarn lint      # tsc --noEmit + eslint
yarn test      # or: yarn jest test/controller/spectate.spec.ts
yarn prettify
```

The change is one filter line, one guard condition and one small override, so
lint plus the two specs above are the meaningful gates.

## Out of scope

- **Stale-spectator table state** (spectator physics diverging, `WATCHAIM`
  payloads being dropped — see `fixwatchaim.md`). This change only fixes
  *when* the spectated game is declared over, not how faithfully it is
  rendered.
- **Presence-based end detection** (`onOpponentLeft`, lobby status dots,
  `End`'s 60s lobby-leave timer). Available as a fallback hint that players
  left, but not game-end-specific, so not a trigger.
- **Polling the scoreboard** for `submitMatchResult` posts. Heavier than
  watching the relay message that already arrives.
- **Snooker spectator end-of-game.** The snooker block is disabled for
  spectators by the same guard in (2), so a cleared table also ends only via
  the broadcast `GameOver`. If snooker's sender path ever skips the
  notification, that is a separate sender-side gap.
- **Rematch for spectators.** The spectator banner offers "Back to Lobby"
  only, matching `notifySpectator` today. Letting a spectator challenge one of
  the players from the end banner is a product decision, not taken here.
