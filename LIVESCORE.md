# Live Score Options for 2-Player Games

This document outlines several approaches for implementing live score tracking and display in 2-player games, keeping in mind the desire for minimal payload overhead.

## Current State
- **Rule classes** (`NineBall`, `Snooker`) track `score` and `currentBreak` locally.
- **Active player** updates their score in `PlayShot.handleStationary` via `rules.update(outcome)`.
- **Passive player** (watcher) does NOT currently update rule state during `WatchShot.handleStationary`.
- **Final scores** are reported via `MatchResult` at the end of the game.

---

## Option 1: Explicit Score Sync (Recommended)
Add a small integer pair `[p1Score, p2Score]` to existing events that trigger on state transitions.

### Implementation
- Modify `GameEvent` or specific events (`StartAimEvent`, `WatchEvent`) to include a `scores?: [number, number]` field.
- The active player includes their current view of the scores whenever they send these events.

### Pros
- **Robust**: No chance of desync between players.
- **Low Overhead**: Adding 2 integers to a payload that already contains large JSON arrays (ball positions) is negligible.
- **Simple UI**: The HUD just reads these values and updates.

### Cons
- Slight modification to the serialisation protocol.

---

## Option 2: Event-Driven Updates
Send a dedicated `ScoreEvent` whenever a score-changing event occurs (pot or foul).

### Implementation
- Create a new `ScoreEvent` type.
- Active player sends this event in `handlePot` or `handleFoul`.

### Pros
- **Efficient**: Only sent when scores actually change.
- **Clean**: Separates game physics from game logic transmission.

### Cons
- Adds a new event type to handle.

---

## Option 3: Passive Rule Calculation
The watching player runs the same rule logic as the active player.

### Implementation
- Update `WatchShot.handleStationary` to call `this.container.rules.update(outcome)`.
- **Critical**: `Rules.update` must be modified to NOT send network events if the current instance is a watcher.

### Pros
- **No Payload Changes**: Fully preserves the current communication protocol.

### Cons
- **Drift Risk**: If the physics simulation differs slightly between clients (e.g., floating point nuances), scores could diverge.
- **Complexity**: Requires careful guarding of side effects in Rule classes.

---

## UI Suggestions
- **Dynamic HUD**: Update `Hud.ts` to support two-player scores.
- **Format**: `Player 1: 42 | Player 2: 24`
- **Break Info**: Keep the current "Break" display but integrate it better with the main score.

## Implementation Plan (if Option 1 is chosen)
1. Add `scores?: number[]` to `GameEvent` base class.
2. In `Rules.ts`, add a `getScores()` method.
3. In `Container.sendEvent()`, automatically attach scores if available.
4. Update `WatchShot` to apply received scores to the local `Rules` instance.
5. Create a new HUD component for dual score display.
