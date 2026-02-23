# Simple Score + Active Player HUD Plan

## Objective
Add a clear HUD highlight for the currently active player while keeping event payload changes minimal and replay-compatible.

## Constraints
- Do not add turn-state fields to all gameplay events.
- Keep existing replay files valid.
- Keep score ordering behavior (`p1`/`p2`) consistent with current `Session.playerIndex` logic.

## Chosen Approach
1. Infer active player from controller state for live transitions.
2. Extend `ScoreEvent` with an optional `active` field for deterministic replay/spectator playback.
3. Apply highlight via CSS class (`is-active`) on `#p1Score`/`#p2Score`.

## Data Model
- `ScoreEvent` now supports:
  - `p1: number`
  - `p2: number`
  - `b: number`
  - `active?: 0 | 1 | 2`
- Semantics:
  - `0` = unknown/none
  - `1` = p1 active
  - `2` = p2 active
- Backward compatibility:
  - Missing `active` defaults to `0` in deserialization.

## Active Player Resolution Rules
- Controller inference:
  - `Aim`, `PlaceBall`, `PlayShot` => local player active
  - `WatchAim`, `WatchShot` => opponent active
  - other controllers => no forced highlight (`0`)
- Slot mapping:
  - local slot is p1 unless `Session.playerIndex === 1`, then local slot is p2.
- Score updates:
  - `sendScoreUpdate` carries `active`.
  - score event is emitted when scores, break, or `active` changes.

## Replay / Spectator Strategy
- Replay:
  - consumes recorded `ScoreEvent.active` for deterministic highlight.
- Spectator:
  - processes incoming `ScoreEvent` so HUD highlight updates from network score stream.

## UI Styling
- Add `.is-active` style for score lines:
  - bolder font weight
  - slight brightness lift

## Validation
- Event serialization tests:
  - score event with `active`
  - legacy score event without `active`
- Controller/HUD tests:
  - controller transition highlights local/opponent correctly
  - score event `active` overrides inferred highlight as expected

