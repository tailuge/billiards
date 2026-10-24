# Free Game (Straight Rail) Ruletype: Implementation Plan

Reference: https://en.wikipedia.org/wiki/Straight_rail (also "straight rail", "three-ball billiards", "the free game").

## Rules to implement

- Three balls (red object ball, one cue ball per player: white and yellow). Each player strikes only their own cue ball.
- A point (carom/cannon) is scored when the assigned cue ball hits both other balls in one stroke. No cushion requirement.
- Shoot until you miss; a miss or foul ends the inning. Games run to a target (`raceTo`).
- **Corner zones (initial rule):** while the cue ball is in a corner zone, at most **2** consecutive cannons may be scored there. The next shot must move one of the balls out of that zone, or it is a foul. Either object ball leaving the zone resets the count. The limit is a named constant so it can be tuned later.

## Current structure (what the change touches)

- `src/controller/rules/rulefactory.ts`: `RuleFactory.create` switches on ruletype. Add `"freegame"` here.
- `src/controller/rules/rules.ts`: the `Rules` interface. The plan needs no new required members; corner state can live in the rule class.
- `src/controller/rules/threecushion.ts`: closest existing model (ball assignment, `update`, `isEndOfGame`, `nextCandidateBall`, `table`, `rack`, `asset`). Decide whether `FreeGame` extends `ThreeCushion` (like `Sagu`/`Drill`) or implements `Rules` directly. Extending inherits a lot of behavior, including proximity and three-cushion-specific scoring, which would need overriding.
- `src/model/outcome.ts`: `Outcome.isThreeCushionPoint` requires 3 cushions. Add a carom check (cue ball hits both object balls, no cushion count) alongside it.
- `src/utils/threecushionconfig.ts`: `raceTo` target, reused by free game.
- `src/container/container.ts` (lines ~345-349, ~584) and `src/container/browsercontainer.ts` (lines ~104-148, ~371): ruletype-specific branches for race target and mode selection.
- `src/controller/controllerbase.ts` (~63), `src/network/client/matchresult.ts` (~280), `src/view/camera.ts` (~31), `src/view/tablegeometry.ts` (~23): ruletype checks. Add `"freegame"` where it should behave like the carom games.
- `src/network/bot/boteventhandler.ts` (~72, ~131, ~170, ~238, ~505): bot target selection per ruletype (`validThreeCushionTargets`). Add a free-game target list and bot behavior.
- `src/utils/utils.ts` (`ruleTypeMap`), `src/utils/i18n.ts`, `src/seedlink.ts`: display name, emoji and i18n strings.
- `src/sensitivity.ts`: scoring helpers mirror `isThreeCushionScored`; confirm whether free game needs its own helper for analysis.

## Corner-zone logic (new)

1. **Zone geometry:** define the four corner zones from the UMB World Rules of Carom Billiard dimensions. Look up the exact figures before implementing.
2. **Detection:** a shot is "in a corner" when the cue ball is inside a zone at the start of the shot.
3. **State:** keep a per-rule counter `cornerCannons` of consecutive cannons made while the cue ball is in a zone, plus a flag that a ball must leave.
4. **Limit:** on the third consecutive corner cannon, or on a shot from a corner while the flag is set, call `foulReason` with a clear message. Otherwise increment the counter. A foul ends the inning with no points.
5. **Reset:** clear the counter when a shot ends with no corner cannon, or when either object ball has moved out of the zone.

## Single player practice and bot play

- **Single player / practice:** the `isSinglePlayer` branch in `ThreeCushion.update` shows the pattern. Free game does not show the proximity indicator, including in practice mode.
- **Two players:** rely on the same turn flow as `ThreeCushion` (`WatchAim`, `StartAimEvent`, `Session.addMyScore`).
- **Bot:** add a `case "freegame"` in `boteventhandler.ts` that filters targets through the corner-zone rule, so the bot does not plan a third corner cannon or a shot that leaves the zone unchanged.

## Tests

Place tests in the matching domains (per `AGENTS.md`):
- `test/model/outcome*.spec.ts` (or new spec): carom point without cushions; no point when the cue ball hits only one ball.
- `test/controller/rules/freegame.spec.ts`: corner counter increments, the third corner cannon is a foul, a ball leaving the zone resets the counter, and a non-corner shot resets it.
- `test/network/bot/...`: bot target filter respects the corner rule.
- Run `yarn lint`, `yarn test`, `yarn prettify`.

## Decisions

- **Ball that must leave the zone:** either object ball. Either one leaving resets the count.
- **Zone size:** UMB World Rules of Carom Billiard dimensions.
- **Zone check:** the cue ball's position at the start of the shot.
- **Foul:** the inning ends with no points.
- **Target score:** reuse `ThreeCushionConfig.raceTo`.
- **Proximity indicator:** not shown for free game, including in practice.

## Suggested order

1. Add the carom point check in `outcome.ts` with tests.
3. Add `FreeGame` rule class and register it in `rulefactory.ts`, with corner-zone state and tests.
4. Wire container, camera, table geometry, match result and ruletype maps.
5. Add bot target handling and tests.
6. Run `yarn lint`, `yarn test` and `yarn prettify`.
