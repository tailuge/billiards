# Simplify Score Tracking via Session-Owned Scores (clientId-keyed)

## Summary
Replace `Container`’s tuple-based score state (`scores: [number, number]`) with a `Session`-owned score model keyed by player identity (`clientId`).
Use explicit APIs like “add to my score” and “add to opponent score” so rules stop doing index math (`Session.playerIndex()` and `1 - index`).
Perform a single cutover: remove tuple usage everywhere in one PR, including rules, HUD updates, replay score extraction, and match-result logic.

## Goals
- Remove complex score-array index logic from gameplay/rules.
- Make score mutations explicit and readable:
- update my score
- update opponent score
- read my/opponent score
- Keep multiplayer and bot mode behavior consistent under the same API.
- Reduce LOC and cognitive overhead in score-related code paths.

## Non-goals
- No wire protocol redesign for network events beyond score payload shape changes needed internally.
- No gameplay rule behavior changes.
- No scoreboard backend API behavior changes.

## Public API / Interface / Type Changes

### 1) `Session` becomes score owner
File: `src/network/client/session.ts`

Add a score-state model to `Session`:
- `scoreByClientId: Record<string, number>`
- `selfClientId: string` (existing `clientId`)
- `opponentClientId?: string` (derived when opponent is known)

Add explicit score methods:
- `initializeScores(): void`
- `setOpponentClientId(clientId: string): void`
- `myScore(): number`
- `opponentScore(): number`
- `setMyScore(score: number): void`
- `setOpponentScore(score: number): void`
- `addMyScore(delta: number): void`
- `addOpponentScore(delta: number): void`
- `getScoreByClientId(clientId: string): number`
- `setScoreByClientId(clientId: string, score: number): void`
- `orderedScoresForHud(): { p1: number; p2: number }`
- `orderedNamesForHud(): { p1Name?: string; p2Name?: string }`

Implementation defaults:
- unknown score key resolves to `0`
- in bot mode, assign synthetic opponent key once (e.g. `"bot"`) and name `"ClawBot"`

### 2) Remove `Container.scores` tuple and add session-forwarding helpers
File: `src/container/container.ts`

Remove:
- `scores: [number, number] = [0, 0]`

Add helper methods so rules/controller stay clean:
- `getMyScore()`
- `getOpponentScore()`
- `addMyScore(delta: number)`
- `addOpponentScore(delta: number)`
- `setScoresFromNetwork(p1: number, p2: number, breakScore: number)` (maps ordered network scores into Session state)
- `getOrderedScores(): { p1: number; p2: number }`

Update existing HUD/event methods:
- `updateScoreHud(...)` to read names/scores from Session helpers
- `sendScoreUpdate(...)` compares against ordered scores from Session instead of tuple indices

### 3) Rules API cleanup to remove tuple return
File: `src/controller/rules/rules.ts`

Change:
- remove `getScores(): [number, number]`

Reason:
- score source of truth is now Session; rules mutate scores through container/session helpers.

### 4) `PlayShot` score send flow update
File: `src/controller/playshot.ts`

Replace:
- `const [s1, s2] = this.container.rules.getScores()`
with:
- read ordered scores from container/session helper and emit `ScoreEvent`.

### 5) `ScoreEvent` remains ordered for network/UI
File: `src/events/scoreevent.ts`

Keep ordered payload (`p1`, `p2`, `b`) for compatibility with remote HUD updates.
Container maps ordered values into Session state on receive (`setScoresFromNetwork`).

## Detailed Implementation Plan

### Step 1: Session score model and identity wiring
- Extend `Session` with score map and helper methods listed above.
- Initialize self score in `Session.init(...)`.
- On opponent discovery in network flow (`src/container/browsercontainer.ts:netEvent`), call:
- `session.setOpponentClientId(event.clientId)`
- preserve existing `opponentName` assignment.
- For bot mode in `Session.init(..., botMode=true)`, establish opponent key/name immediately.

### Step 2: Container score API cutover
- Remove tuple field from `Container`.
- Refactor HUD update pipeline:
- compute p1/p2 ordering via Session methods.
- keep current name display semantics (`self/opponent` ordering based on local perspective).
- Update `sendScoreUpdate` change detection to use ordered snapshot from Session + `currentBreak`.

### Step 3: Refactor rules to explicit score operations
Files:
- `src/controller/rules/snooker.ts`
- `src/controller/rules/nineball.ts`
- `src/controller/rules/threecushion.ts`

Replace mutations:
- `this.container.scores[Session.playerIndex()] += X` -> `this.container.addMyScore(X)`
- `this.container.scores[1 - index] += foul` -> `this.container.addOpponentScore(foul)`

End condition reads:
- three-cushion race checks use ordered/session score helpers.

Remove `getScores()` implementations from all rules.

### Step 4: Update scoring consumers outside rules
Files:
- `src/network/client/matchresult.ts`
- `src/events/recorder.ts`
- any remaining `container.scores[...]` callsite from `rg`

Refactors:
- match winner/loser calculation uses ordered scores from Session/container helpers.
- single-player subtext uses `myScore()`.
- replay whole-game score uses `myScore()`.
- remove dependence on `Session.playerIndex()` for score reads where unnecessary.

### Step 5: Keep remote score sync deterministic
- `ScoreEvent` handling (`ControllerBase.handleScore` -> `Container.updateScoreHud`) should route via `setScoresFromNetwork`.
- Ensure local receive path in 2p reflects network order consistently on both peers.

### Step 6: Dead-code cleanup
- Delete obsolete tuple/index helper logic.
- Remove no-longer-needed `Session.playerIndex()` usages in score pathways (retain only where turn-order logic still needs it).

## Test Plan

### Unit tests to update/add
1. `test/server/session.spec.ts`
- initializes self score at `0`
- opponent key assignment works
- `addMyScore` / `addOpponentScore` increments correctly
- unknown opponent score defaults to `0`

2. `test/rules/snooker.spec.ts`
- score increments/fouls now validated via session-driven helpers
- existing winner-by-score cases still pass with same visible text

3. `test/rules/threecushion.spec.ts`
- race-to end condition works with session-owned scores

4. `test/rules/matchresult.spec.ts`
- winner/loser and score formatting based on session score model (including playerIndex=1 case)

5. `test/network/bot/eventhandler.spec.ts` (or nearest bot coverage)
- bot mode score updates use same APIs and produce expected winner/score outcomes

6. `test/controller/*` impacted by removed `getScores()` and container tuple
- ensure no compile/runtime breaks in `PlayShot` and score events

### Full checks
- `yarn lint`
- `yarn test`

## Acceptance Criteria
- No `scores: [number, number]` in `Container`.
- No score mutations via array indexing in rules.
- Readable score mutations at call sites (`addMyScore`, `addOpponentScore`).
- 2p mode still resolves opponent identity and score display correctly after first opponent message.
- Bot mode uses same score API without special-case tuple/index logic.
- All tests and lint pass.

## Assumptions / Defaults Chosen
- Canonical score identity key is existing `clientId` (no new `playerId` protocol field).
- Session is authoritative score owner.
- Single cutover in one PR (no compatibility shim for `container.scores`).
- Ordered `p1/p2` score payload remains for HUD/network continuity, with mapping handled in `Container` + `Session`.
