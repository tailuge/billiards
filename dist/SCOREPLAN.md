# Nine-ball Game Outcome Reporting Plan

This document outlines a plan to report the outcome of a two-player nine-ball game to a backend service.
The target system is hosted at https://scoreboard-tailuge.vercel.app/ .

## 1. Objective

Send a `MatchResult` object to the `/api/match-results` endpoint when a two-player game (specifically nine-ball) concludes.

## 2. Architectural Changes

To support testable and extendable score reporting, we need to:
1.  **Define the Data Model**: Create a clear `MatchResult` interface.
2.  **Enhance Rules Tracking**: Update `Rules` to track scores for both players and identify the winner/loser.
3.  **Extend Network Layer**: Add a dedicated method to `MessageRelay` for result submission.
4.  **Decouple Reporting**: Create a `ScoreReporter` class to handle the logic, keeping `End` controller clean.

## 3. Implementation Steps

### Phase 1: Foundation
- [ ] **Define `MatchResult` Interface** in `src/model/matchresult.ts`.
- [ ] **Extend `MessageRelay` Interface** in `src/network/client/messagerelay.ts` with `submitMatchResult(result: MatchResult): Promise<void>`.
- [ ] **Implement `submitMatchResult`** in `src/network/client/nchanmessagerelay.ts`.

### Phase 2: Game State Enhancements
- [ ] **Update `Rules` Interface** in `src/controller/rules/rules.ts` to include:
    - `player1Score: number`
    - `player2Score: number`
    - `getWinner(): string | null`
    - `getLoser(): string | null`
- [ ] **Refactor `NineBall`** in `src/controller/rules/nineball.ts` to track individual player scores.
    - *Note:* Nine-ball is often "race to N". Current implementation is "pots counted". For MVP, report total pots per player.
- [ ] **Identify Players**: Ensure `Container` or `Session` has access to the opponent's name/ID for the `loser` field.

### Phase 3: Reporting Logic
- [ ] **Create `ScoreReporter`** in `src/network/score-reporter.ts`:
    - This class should take a `Container` and handle the construction and submission of `MatchResult`.
    - It should only trigger if `!container.isSinglePlayer`.
- [ ] **Trigger in `End.onFirst()`**:
    - Call `ScoreReporter.report(this.container)` when entering the `End` state.

### Phase 4: Verification
- [ ] **Unit Tests**: Add tests for `ScoreReporter` using a mock `MessageRelay`.
- [ ] **Integration Test**: Verify `NineBall` correctly identifies winner/loser state at `isEndOfGame`.

## 4. Technical Constraints & Notes
- **API URL**: `https://scoreboard-tailuge.vercel.app/api/match-results` (based on `SCOREPLAN.md` info).
- **Format**: JSON POST with `winner`, `loser`, `winnerScore`, `loserScore`, `gameType`.
- **Game Types**: Currently supports `nineball`, `snooker`, `threecushion`.

## 5. Open Questions
- How to retrieve the opponent's username? (Currently `Session` tracks own username, but opponent identification needs to be verified in the multi-player event flow).