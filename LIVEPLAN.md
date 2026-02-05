# Live Score Plan (Option 2)

## Summary
Introduce a dedicated `ScoreEvent` that carries a minimal payload for totals and current break, plus session-side P1/P2 mapping based on the `BeginEvent` sender. Phase 1 lays the infrastructure; Phase 2 uses it in snooker; replay score support is deferred.

## Important API / Interface Changes
- Add `EventType.SCORE`.
- Add `ScoreEvent` with compact payload:
  - `s: [number, number]` total scores (P1, P2)
  - `b: number` current break for the active player
- Add `handleScore(event: ScoreEvent)` to `Controller` and a default implementation in `ControllerBase`.
- Extend `Session` with P1/P2 mapping fields and player index:
  - `p1Name?: string`, `p2Name?: string`, `playerIndex?: 0 | 1`

## Phase 1 — Infrastructure Only
1. **Event plumbing**
   - Create `src/events/scoreevent.ts` with `s` and `b` only.
   - Add `SCORE` to `src/events/eventtype.ts`.
   - Update `src/events/eventutil.ts` to parse and instantiate `ScoreEvent`.
   - Extend `src/controller/controller.ts` with `handleScore`.
   - Implement `handleScore` in `src/controller/controllerbase.ts` to update container score state and HUD.

2. **Container score state**
   - Add `scoreTuple: [number, number]` and `currentBreak: number` to `Container`.
   - Add `updateScores(s, b)` to set state and update HUD.

3. **HUD display**
   - Extend `src/view/hud.ts` with `updateScores(p1Name, p2Name, s, b)`.
   - Keep `updateBreak` for existing uses.
   - Display `P1Name: X | P2Name: Y` and `Break: b` when `b > 0`.

4. **P1/P2 mapping (BeginEvent sender = P1)**
   - In `BrowserContainer`, before sending `BeginEvent` (when `!first`), set:
     - `Session.p1Name = Session.playername`
     - `Session.playerIndex = 0`
   - In `netEvent`, on receiving `BEGIN`:
     - `Session.p1Name = event.playername`
     - `Session.p2Name = Session.playername`
     - `Session.playerIndex = 1`
   - When any event arrives with `playername`, fill missing `p1Name` or `p2Name` based on `playerIndex`.

## Phase 2 — Snooker Integration (Use Infrastructure)
1. **Add frame score tracking**
   - In `src/controller/rules/snooker.ts`, add:
     - `frameScores: [number, number] = [0, 0]`
     - `activeIndex: 0 | 1` derived from `Session.playerIndex` when local is active

2. **Emit ScoreEvent on score changes**
   - Add `emitScoreEvent()` helper that:
     - Computes totals (`frameScores`, plus current break for the active player)
     - Sends `ScoreEvent([p1Total, p2Total], currentBreak)` only when values change

3. **Hook emission into scoring paths**
   - On pots: update `currentBreak`, update `frameScores`, emit
   - On foul: add points to opponent, reset `currentBreak`, emit
   - On switch player / miss: reset `currentBreak`, emit to clear break

4. **Receiver handling**
   - `handleScore` updates `Container` score state and HUD using Session names

## Phase 3 — Replay Score (Deferred)
- Decide later whether to:
  - Record `ScoreEvent` in the `Recorder` and apply during `Replay`, or
  - Attach final scores only in replay state
- Ensure replay doesn’t break if `ScoreEvent` appears in shot lists

## Tests / Scenarios
- Multiplayer snooker with two tabs
  - BeginEvent sender is P1; receiver is P2
- Potting sequence
  - P1 score increases; Break increases
- Foul
  - Opponent score increases; Break resets to 0
- Turn switch
  - Break resets; no score delta
- Spectator
  - ScoreEvent does not crash spectate

## Assumptions / Defaults
- P1/P2 mapping by BeginEvent sender (per your preference)
- ScoreEvent payload uses compact keys: `s`, `b`
- Break display is global; no per-player break tagging
- Replay score updates deferred until Phase 3
