# Bot Rule Reorg Plan

## Goal

Move legal target selection out of `BotEventHandler` and into the `Rules` implementations so:

- human aim hints and bot targeting share one source of truth
- bot code stops reconstructing rule legality locally
- bot rule state remains self-contained in `botRules`
- snooker / three-cushion edge cases stop drifting between paths

## Target Design

Keep the bot strategy input small and geometry-focused:

```ts
interface BotShotContext {
  table: Table
  cueBall: Ball
  validTargetBalls: Ball[]
  ballInHand: boolean
}
```

Change `Rules` to expose legal targets directly:

```ts
candidateBalls(): Ball[]
nextCandidateBall(): Ball | undefined
```

`candidateBalls()` becomes the rule-owned legal target set.

`nextCandidateBall()` becomes optional convenience for human aim assistance and should usually derive from `candidateBalls()`.

## Why Remove `p1type`

`candidateBalls()` should not take `p1type`.

Reason:

- the bot already owns its own `botRules` object
- that rules object should already represent the bot's perspective
- legality should come from rule state, not extra external parameters

This is especially important for:

- eightball: bot group should be reflected in bot-side rule state
- snooker: red/colour phase should come from bot rule state
- threecushion: active cue ball should come from bot rule state

## Proposed Interface Change

Update `src/controller/rules/rules.ts`:

```ts
candidateBalls(): Ball[]
nextCandidateBall(): Ball | undefined
```

Then remove the now-unnecessary optional `p1type` from `nextCandidateBall`.

The old shape:

```ts
nextCandidateBall(p1type?: number): Ball | undefined
```

becomes:

```ts
candidateBalls(): Ball[]
nextCandidateBall(): Ball | undefined
```

## Rules Implementation Plan

### EightBall

Add `candidateBalls()` that returns:

- open table: all object balls except the 8
- group still remaining: only that group
- group cleared: only the 8

Then make `nextCandidateBall()` choose from `candidateBalls()`, likely closest for pocket play.

Important:

- `isMyType()` should read bot-owned rule state, not require caller-provided type
- if needed, introduce explicit player-group state on the rule object instead of depending on `Session.p1type`

### NineBall

Add `candidateBalls()` returning:

- lowest on-table object ball only

Then make `nextCandidateBall()` return the first element or `undefined`.

### Snooker

Add `candidateBalls()` returning:

- first shot: `[]`
- after potting a red: all colours
- reds still on table: all reds
- reds gone: next colour in sequence only

Then make `nextCandidateBall()` choose:

- closest from reds
- closest from colours after a red
- first/lowest sequential colour once reds are gone

This keeps the current human behavior intact while giving the bot the correct legal set.

### ThreeCushion

Add `candidateBalls()` returning:

- first shot: `[]`
- otherwise all on-table balls except the active cue ball

Then make `nextCandidateBall()` choose from that set, likely furthest.

## BotEventHandler Changes

After rule changes land:

1. Delete bot-local helpers:
   - `validTargetBalls()`
   - `validEightBallTargets()`
   - `validNineBallTargets()`
   - `validSnookerTargets()`
   - `validThreeCushionTargets()`
   - `isEightBallType()`

2. Build `BotShotContext` using:

```ts
{
  table: this.container.table,
  cueBall: this.botRules.cueball,
  validTargetBalls: this.botRules.candidateBalls(),
  ballInHand: false,
}
```

3. Keep bot orchestration unchanged:
   - scoring
   - foul handling
   - respots
   - turn transitions
   - event publishing

## Strategy Layer Changes

No major interface change needed.

Strategies should continue to consume:

- `cueBall`
- `validTargetBalls`
- `table`

Target picking policy remains local to the strategy:

- pocket games: usually closest legal target
- threecushion: usually furthest legal target

## State Ownership Follow-Up

This reorg works best if bot legality comes entirely from `botRules`.

That suggests a follow-up cleanup:

- reduce direct dependence on `Session` for bot-only rule decisions
- store enough state on the rules object to answer `candidateBalls()` correctly

Likely areas:

- eightball group ownership
- any snooker targeting phase already tracked on the rule object
- threecushion active cue ball already tracked on the rule object

This follow-up is desirable but not required for the first reorg pass.

## Suggested Implementation Order

1. Add `candidateBalls()` to the `Rules` interface.
2. Implement `candidateBalls()` in all four rules.
3. Rewrite each `nextCandidateBall()` to derive from `candidateBalls()`.
4. Update call sites to remove `p1type` from `nextCandidateBall`.
5. Replace bot-local valid-target helpers with `this.botRules.candidateBalls()`.
6. Update tests for:
   - eightball open/group/8-ball cases
   - snooker reds/colours/sequential colours
   - nineball lowest-ball targeting
   - threecushion active cue-ball exclusion

## Expected Benefits

- less duplicated rule logic
- fewer bot-only regressions
- clearer separation:
  - rules define legality
  - bots define geometry
- easier future bots, since they consume stable legal targets instead of re-deriving game state
