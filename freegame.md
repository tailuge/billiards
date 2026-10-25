# Free Game (Straight Rail) — Implementation Plan

Reference: https://en.wikipedia.org/wiki/Straight_rail (also "straight rail", "three-ball
billiards", "the free game").

## Rules to implement

- Three balls: white and yellow cue balls (one per player) plus a red object ball; each
  player strikes only their own cue ball.
- A point is a carom: the shooter's cue ball contacts both other balls during one stroke.
  No cushion requirement, no pockets.
- A carom keeps the shooter at the table; a shot without a carom ends the inning. First
  to the race target wins.
- Corner limit (tunable house rule): at most **2** consecutive caroms may be scored with
  the three balls in a corner zone. The next shot must drive a ball out of the zone; a
  third corner carom is a foul.

## Design: standalone `FreeGame`, no inheritance

New file `src/controller/rules/freegame.ts`:

```ts
export class FreeGame implements Rules {
  ...
}
```

It does **not** extend `ThreeCushion` (unlike `Sagu`/`Drill`), so it inherits none of the
three-cushion behaviour that would otherwise have to be overridden: proximity rings and
proximity scoring, the three-cushion point test, the solo win-deferral latch, the drill
hooks. `src/controller/rules/rules.ts` needs no change.

Copied from `ThreeCushion` (verbatim unless the row says otherwise), because the code is
rule-independent:

| Member | Content |
| --- | --- |
| `rack()` | `Rack.fromInitParam(Rack.three())` — already white/yellow/red, nothing to add |
| `tableGeometry()` | `TableConfig.apply(this.rulename, TableConfig.tableSizeFromUrl())` |
| `scaleTableModel(scene)` | the carom table model scaling |
| `table()` | geometry, `Camera.configureForRule(this.rulename)`, `new Table(this.rack())`, `proximityEnabled = false` always (not even in practice), `this.cueball = table.cueball` |
| `asset` | `"models/threecushion.min.gltf"` (same table model) |
| `secondToPlay()`, `otherPlayersCueBall()`, `startTurn()` | cue-ball assignment and break bookkeeping |
| `allowsPlaceBall()` / `placeBall()` / `respot()` | `false` / `zero` / `[]` |
| `handleGameEnd()` | `MatchResultHelper.presentGameEnd(container, this.rulename, ...)` |

New logic (see the next sections): `update()`, `getAmountScored()`, `isPartOfBreak()`,
`isEndOfGame()`, `foulReason()`, plus the corner-zone helpers.

Deliberately absent: `initialController`, `hideScoreHud`, `advanceState` (all optional on
`Rules`) and the `winDeferred` latch — free game ends the moment the target is reached.

`rulename = "freegame"`.

## Scoring

`Outcome.isCaromPoint(cueBall, outcomes)` in `src/model/outcome.ts` (already in place):

```ts
static isCaromPoint(cueBall: Ball, outcomes: Outcome[]): boolean {
  const hits = new Set<Ball>()
  for (const o of Outcome.cueBallFirst(cueBall, outcomes)) {
    if (
      o.type === OutcomeType.Collision &&
      o.ballA === cueBall &&
      o.ballB !== null
    ) {
      hits.add(o.ballB)
    }
  }
  return hits.size >= 2
}
```

- Same contact normalization as the three-cushion test (a collision recorded as
  `ballB === cueBall` is flipped by `cueBallFirst`), just without the cushion count.
  Two *distinct* balls must be contacted; order is irrelevant; cushions before, between or
  after do not matter.
- `>= 2` rather than `=== 2`, so a rack with more than three balls cannot produce a
  false negative when the cue ball also contacts a third ball.
- Deliberately a separate method rather than an `isCaromPoint(cushions)` parameter on
  `isThreeCushionPoint`: three-cushion scoring counts its cushions *before* the second
  contact and has a proximity second pass, so a shared method would need mode-dependent
  branches, and the id-based port in `sensitivity.ts` (`isThreeCushionScored`) would stay
  three-cushion-specific either way. If cushion variants (one-cushion, balkline limits)
  are added later, merge then: add `requiredCushions`, count cushions alongside the
  contact set and let `isThreeCushionPoint` delegate.
- `cueBallFirst` mutates the array it is given, exactly as it already does for the
  three-cushion path. One call per shot, as today.
- Leave `isThreeCushionPoint` untouched so three-cushion, sagu and drill keep their
  behaviour.

`getAmountScored()` is `1` when `isPartOfBreak()` holds and `0` otherwise — no proximity
multiplier, so no `Session.isPracticeMode()` branch. `isPartOfBreak()` is the carom test
minus a corner foul (see below). `isEndOfGame()` mirrors `ThreeCushion.isTargetReached()`;
that helper is private, so write it again here: map `session.playerIndex` / `clientId` /
`opponentClientId` to the p1/p2 targets and compare against `orderedScoresForHud()`.

## Corner-zone rule

**Geometry.** Four corner zones, one per corner: a square of side `CORNER_ZONE` measured
along both cushions from the corner.

```ts
const CORNER_ZONE_LIMIT = 2 // caroms allowed in a corner before the next one is a foul
const CORNER_ZONE = R * 6 // tunable, see open items
```

The test works on ball centres, so `CORNER_ZONE` must be well above `R` — a centre can
never come closer than `R` to a cushion. A ball is in a zone when
`|x| > TableGeometry.tableX - CORNER_ZONE` and `|y| > TableGeometry.tableY - CORNER_ZONE`;
the four zones are just the sign quadrants of `(x, y)`.

**Pre-shot table.** The rule needs the table *before* the shot, which the recorder already
holds: `container.recorder.entries[container.recorder.last()]?.state` is
`Table.shortSerialise()`, a flat `[x0, y0, x1, y1, ...]` array in `container.table.balls`
order (ball `i` at `2i` / `2i + 1`).

**Corner run, derived from the recorder.** No counter field is kept on the class: the
verdict comes from the recorded entries, so it survives the bot's separate rule instance
and any order in which events are dispatched.

```ts
/** Consecutive corner caroms that ended just before the shot at `last`. */
private cornerRun(last: number): number
```

Walk `entries` backwards from `last - 1`; an entry counts when `entry.isPartOfBreak` is
true and its `state` has all three balls in one corner zone; stop at the first entry that
does not count.

**Foul test** (`foulReason`): the shot is a corner foul when it is a carom and
`cornerRun(recorder.last()) >= CORNER_ZONE_LIMIT`; return a message such as
`"Foul: third carom in the corner"`, else `null`. Pure, so asking twice gives the same
answer — which matters because `PlayShot` asks `isPartOfBreak` immediately after `update`.

**`isPartOfBreak`** is the carom test *without* a foul. That marks an offending shot as
not part of the break, which both ends the break in the ball tray and stops the corner
run at the foul, so the count cannot leak into the next inning.

**`update()` order** matters: evaluate the foul first, otherwise the third corner carom
scores before it is judged.

1. carom and not a foul → score the point (see Scoring);
2. carom and a foul → no points, no penalty, `container.notify({ type: "Foul", title:
   "FOUL", subtext })`, then the inning ends like a miss;
3. no carom → inning ends like a miss.

## Turn flow

Mirrors `ThreeCushion` minus the deferral:

- carom: `sound.playSuccess`, `sendEvent(new WatchEvent(table.serialise()))`,
  `currentBreak += 1`, `Session.getInstance().addMyScore(1)`, `handleGameEnd(true)` when
  the target is reached, else `new Aim(container)`.
- miss or foul: `startTurn()`, then `isSinglePlayer` → switch to
  `otherPlayersCueBall()`, set `table.cue.aim.i`, `new Aim(container)`; two player →
  `sendEvent(new StartAimEvent())`, `new WatchAim(container)`.

## Wiring

| File | Change |
| --- | --- |
| `src/controller/rules/rulefactory.ts` | `case "freegame": return new FreeGame(container)` |
| `src/view/tablegeometry.ts` (`configureForRule`) | add `"freegame"` to the carom branch: UMB dimensions, `hasPockets = false` |
| `src/view/camera.ts` (`configureForRule`) | add `"freegame"` to the carom branch |
| `src/controller/controllerbase.ts` (`handleScore`) | add `"freegame"` to the `isEndOfGame` rulename list, so the watching client also ends |
| `src/network/client/matchresult.ts` (`getScoreSubtext`) | add `"freegame"` to the carom branch for the score/average line |
| `src/container/browsercontainer.ts` (~371) | show the `Race to: {score}` line for `"freegame"` too |
| `src/utils/utils.ts` (`ruleTypeMap`) | display emoji/title for `"freegame"` (cosmetic; lobby and spectator labels) |
| `src/container/container.ts` (`applyHandicapTargets`) | optional: include `"freegame"` in `isHandicapRule` so URL handicaps show in the HUD; the rules honour them through `getRaceTargetForPlayer` either way |

No change needed, and why:

- `src/utils/i18n.ts` — rule names are not translated; the foul text stays in the source
  language like `Sagu`'s.
- `src/container/container.ts` analysis menu, `src/container/browsercontainer.ts`
  drill/analysis mapping — both are three-cushion only.
- `src/sensitivity.ts`, `src/seedlink.ts`, `view/assets.ts` (default cloth; the 5ft size
  already reuses the three-cushion cloth), `dist/diagrams/export.html` — three-cushion
  tooling.
- Lobby tiles and landing pages (`dist/lobby.js` bundle, `dist/arena.html`, the
  per-language pages) are built outside `src`; until a tile exists the mode is reachable
  at `?ruletype=freegame`.

## Bot

The shot strategies are three-cushion strategies, so the bot plays free game legally but
not strongly — enough to be playable.

- `boteventhandler.ts` constructor and `buildShotContext()`: add `"freegame"` to the
  `threecushion`/`sagu` lists that use `table.balls[1]` as the bot's cue ball.
- `validTargetBalls()`: `case "freegame": return this.validFreeGameTargets()` — the object
  balls (on table, minus `balls[1]`), the same shape as `validThreeCushionTargets`.
- `handleFoul()`: `ballInHand` must be `false` for free game, so the corner foul takes the
  existing `StartAimEvent` path and ends the bot's inning without offering a place-ball.
- `foulReason` and `getAmountScored` need no bot special case: both are derived from the
  shared recorder, so the bot's own rule instance returns the same verdict.
- No corner-aware target filter for now: the bot would need the corner count to plan
  around it, and playing into the foul is a fair outcome.

## Tests

`test/model/outcome.spec.ts` (already in place, covers the helper on its own):

- two contacts, zero cushions → carom; cushions ignored, including a reversed contact
  order;
- one contact → no carom; the same ball twice → no carom;
- collisions that do not involve the striker's cue ball are ignored;
- regression guard: `isThreeCushionPoint` still demands 3 cushions before the second
  contact.

`test/rules/freegame.spec.ts` (setup copied from `test/rules/threecushion.spec.ts`:
`Session.init`, `Container` with `Assets.localAssets()`, `PlayShot` + `StationaryEvent`):

- carom with no cushions keeps the break and returns `Aim` (single player) and does not
  broadcast `StartAimEvent` (two player);
- no carom gives 0 points, `currentBreak === 0` and the opponent's turn;
- corner: seed recorder entries (`{ state, event, pots, isPartOfBreak, time }`, the two
  preceding corner caroms flagged `isPartOfBreak: true`) with all three balls in a corner —
  the third corner carom resolves to a foul: score unchanged, inning over, `Foul`
  notification; a first and second corner carom still score;
- the run restarts when a shot's pre-shot state has a ball outside the zone, and when a
  carom is made with the cue ball outside every zone;
- reaching the target ends the game immediately (no deferral).

`test/network/bot/...`: `validTargetBalls()` for freegame returns both object balls, and a
corner foul publishes no `PlaceBallEvent`.

Then `yarn lint`, `yarn test` and `yarn prettify`.

## Open items

1. **Corner criterion.** Britannica describes the classic straight-rail limit on *both
   object balls* in the corner triangle ("crotch"), allows *three* caroms and only loses
   the turn on the third. This plan implements the version asked for (cue ball in the
   zone, limit 2, foul) and additionally requires both object balls in that same zone, so
   that the clause "either object ball leaving the zone resets the count" has an effect.
   Confirm which reading is wanted — it is one predicate either way.
2. **Zone size.** No published dimension was found for the corner triangle on a UMB
   table, so `CORNER_ZONE` is a game constant (`R * 6` is a starting guess), not a
   rulebook transcription.
3. **Foul cost.** Assumed: no points, no penalty, no ball-in-hand — only the inning ends.
   `Sagu` subtracts a point; say so if free game should too.

## Order

1. `Outcome.isCaromPoint` with tests — done.
2. `FreeGame` (class, corner verdict, target check) and `RuleFactory`.
3. Wiring: geometry, camera, HUD/end-of-game, match result, `ruleTypeMap`.
4. Bot cases.
5. `yarn lint`, `yarn test`, `yarn prettify`.
