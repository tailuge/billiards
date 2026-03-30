# Nine Ball Practice Mode Analysis

## Rule Deductions
The requirement "any ball any order except the 9 that must be last" for practice mode implies the following deviations from standard Nine Ball rules:
1. **Relaxed Hit Order**: The "Wrong ball hit first" foul is relaxed for balls 1 through 8. Any of these balls can be the first ball struck by the cue ball, regardless of their numerical order.
2. **9-Ball Restriction**: The 9-ball remains special. It can only be the first ball struck if no other object balls (1-8) remain on the table. Striking the 9-ball first while balls 1-8 are present is still a foul.
3. **Win Condition**: The game only ends when the 9-ball is potted AND it is the last object ball on the table.
4. **Early 9-ball Respot**: If the 9-ball is potted while other object balls remain (even on a legal shot), it must be respotted. The player's turn continues if no foul occurred.

## Minimal Changes
To implement this minimally and avoid changing many function signatures or the `Rules` interface, we will use the `Session` singleton to carry a `practiceMode` flag.

### 1. Session State (`src/network/client/session.ts`)
- Add a `practiceMode` boolean property to the `Session` class.
- Update `Session.init` to accept this flag.
- Add a static `Session.isPracticeMode()` helper.

### 2. Initialization (`src/container/browsercontainer.ts`)
- Detect the `practice` flag from URL search parameters (e.g., `?practice=true`).
- Pass this flag to `Session.init()`.

### 3. Foul Logic (`src/controller/rules/nineball.ts`)
Modify the static `NineBall.foulReason` method:
- If `Session.isPracticeMode()` is true, a "Wrong ball hit first" foul is only triggered if the first ball hit is the 9-ball AND other object balls (1-8) are still on the table.
- Hitting any ball 1-8 first becomes legal regardless of which is the "lowest".

### 4. Game End & Respot Logic (`src/controller/rules/nineball.ts`)
- Modify `NineBall.isEndOfGame`: If in practice mode, return `true` only if the 9-ball is potted and no other object balls are on the table.
- Modify `NineBall.handlePot`: If in practice mode and the 9-ball is potted but `isEndOfGame` is `false`, call `respotNineBall()` and broadcast the `RerackEvent` to ensure the view and other players are updated.
