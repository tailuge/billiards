# Fix: spectator declares game-over at the wrong race target

Status: proposal only. No code has been changed.

## Summary

In spectate mode, `threecushion`/`libre`/`sagu` games show `GAME OVER` as soon
as a score reaches the spectator's **local** race target, which defaults to 7
and knows nothing about the real game's `raceTo` / `handicap_*` settings.
Spectators therefore see a bogus end-of-game banner (and an `End` controller)
mid-game, with no way back except reload.

Meanwhile the authoritative signal — the pair of `GameOver` notifications
broadcast at the true end (the winner sends `YOU LOST`, the loser sends
`YOU WON`, both with `share: true`) — already arrives on the spectator's
socket and is thrown away one layer up. Observed traffic at end of game:
two `NOTIFICATION` messages, one `YOU LOST` and one `YOU WON`, each with
player-specific rematch buttons.

Proposal: stop spectators from self-declaring game-over on score, and instead
end the spectated game only when the first broadcast `GameOver` arrives.
Either notification is a valid end signal — no winner declaration is needed —
and it is rendered with the generic spectator treatment (`GAME OVER` +
Back to Lobby button). The second notification is then harmless.

## How it works today

1. The spectator subscribes to the full table channel (`spectateTable`
   receives retained + live traffic, i.e. everything both players publish).
2. `Spectate`'s subscribe callback (`spectate.ts:28-45`) decodes every message
   but only queues `Hit`/`Aim`/`Score`/`PlaceBall`/`Break`/`Rerack` into the
   event queue. `NotificationEvent` (and `ConcedeEvent`) are parsed and then
   dropped.
3. Each player's client ends the real game via
   `MatchResultHelper.presentGameEnd` (`matchresult.ts:notifyEndState`): the
   winner shows `YOU WON` locally and broadcasts `YOU LOST`
   (`sendLossNotification`: `sendScoreUpdate` + `GameOver` `NotificationEvent`),
   while the loser shows `YOU LOST` locally and broadcasts `YOU WON`
   (`sendWinNotification`: `ScoreEvent` + `GameOver` `NotificationEvent`).
   Both broadcasts have `share: true`, so both reach the spectator's socket;
   only the score updates survive the filter in (2).
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

There is also an ordering hazard confirming the diagnosis: each sender emits
its final score (`sendScoreUpdate`/`ScoreEvent`) **before** its `GameOver`
notification (`matchresult.ts:sendWinNotification`/`sendLossNotification`), so
the bogus local declaration always wins the race against the true signal.

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

No further plumbing is needed. `ConcedeEvent` stays dropped.

### 2. Never self-declare game-over as a spectator

In `controllerbase.ts` `handleScore`, skip the auto-end blocks for
spectators:

```ts
if (!Session.isSpectator() && !this.container.replayMode && this.name !== "End") {
  // ... unchanged threecushion/sagu/libre and snooker checks
}
```

One condition; the player, bot and replay paths are untouched.

### 3. Show the banner on any incoming `GameOver`

Spot any `GameOver` and show the spectator banner: `GAME OVER` + Back to
Lobby button. Ignore the broadcast's title/buttons — no winner declaration.

```ts
override handleNotification(event: NotificationEvent): Controller {
  const data = event.data
  if (typeof data !== "string" && data.type === "GameOver") {
    return super.handleNotification(
      new NotificationEvent(
        {
          type: "GameOver",
          title: t("GAME OVER"),
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

This reuses the `notifySpectator` copy (`matchresult.ts:154`): `GAME OVER` +
lobby button.

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

- **Table rendering fidelity** (see `fixwatchaim.md`). This change only fixes
  *when* the spectated game is declared over.
- **Rematch for spectators.** Banner is Back to Lobby only.
