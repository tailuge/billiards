# Live Score Plan (Minimal & Clean)

## Summary
Implement a dedicated `ScoreEvent` to synchronize scores in multiplayer games. This approach ensures consistency, supports recording/replay automatically, and provides a clean UI for both 1-player and 2-player modes.

## Phase 1: Event & HUD Infrastructure

### 1. New Event: `ScoreEvent`
- **File**: `src/events/scoreevent.ts`
- **Type**: `EventType.SCORE`
- **Payload**: `[number, number, number]` // [p1Score, p2Score, breakScore]
- **Behavior**:
  - `applyToController` calls `controller.handleScore(this)`.

### 2. View: `Hud` Updates
- **File**: `src/view/hud.ts`
- **Method**: `updateScores(p1: number, p2: number, breakScore: number, p1Name: string, p2Name?: string)`
- **Logic**:
  - **1-Player Mode** (no `p2Name`): Keep existing behavior (Show "Break: X" or single score).
  - **2-Player Mode**: Display standard scoreboard: `Name1: X | Name2: Y`.
  - **Break**: Display current break prominently if > 0.

### 3. Container & Controller
- **Container**: Add state `scores: [number, number]` to track latest known scores.
- **Controller**: Add `handleScore(event)` to `ControllerBase`.
  - Updates `Container.scores`.
  - Calls `container.hud.updateScores(...)`.

## Phase 2: Game Logic Integration

### 1. Rules Interface
- **File**: `src/controller/rules/rules.ts`
- **Change**: Add `getScores(): [number, number]` to the interface.
- **Default**: Return `[this.score, 0]` for single-player rules.

### 2. Rule Implementations (Snooker, etc.)
- **Logic**:
  - Track scores for both players: `scores: [number, number] = [0, 0]`.
  - Use `Session.playerIndex` (default 0 if no session) to determine which index in `scores` to update during the active player's turn.
  - When a pot occurs, update `scores[index] += value`.
  - When a foul occurs, update `scores[1 - index] += foulPoints`.
  - On `startTurn()`, the *active* player resets their `currentBreak` and adds it to their total score in `scores[index]`.

### 3. Emission (The "Glue")
- **Location**: `PlayShot.handleStationary` (or where `rules.update` is called).
- **Logic**:
  - The active player computes the latest `scores` and `currentBreak`.
  - Emits `ScoreEvent(scores[0], scores[1], currentBreak)`.
  - Receiver (watcher) updates their local `scores` and `currentBreak` state via `handleScore`.

## Phase 3: Replay & Recording (Automatic)
- By using `ScoreEvent` (a `GameEvent`), the `Recorder` automatically serializes it.
- During `Replay`, `ScoreEvent` will be processed by the `Controller`, updating the HUD in sync with the playback.
- **Requirement**: Ensure `Replay` controller delegates `handleScore` to `ControllerBase` (or implements it).

## Verification
- **1-Player**: HUD looks normal. Events emitted but P2 score is 0.
- **2-Player**: HUD shows split scores. Both clients stay in sync via events.
- **Spectator**: Receives `ScoreEvent` and updates HUD passively.