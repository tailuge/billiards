# Three-Cushion Proximity Indicator (Practice Mode)

## Overview

The proximity indicator (already coded) shows when the cue ball is within 4R of a target ball. This document describes the logic for when to emit proximity outcomes and trigger sounds.

## ProximityIndicator API

- `show()` - Make indicator visible (called when preconditions are met)
- `hide()` - Hide indicator
- `setProximity(distance)` - Update filled rings based on distance to ball

## Proximity Outcome Rules

Emit `OutcomeType.Proximity` in `Table.advance()` when:

1. **Practice mode only** (guard: skip if not practice mode)
2. **Preconditions met**: 2 balls in motion + cue ball hit ≥3 cushions this shot
3. **Distance < 4R** to stationary target ball
4. **Not duplicate**: Don't add proximity if last outcome was proximity **unless** current distance is closer by R

The indicator is **shown** (`show()`) when preconditions (2 balls in motion + 3 cushions) are met.

## Outcome Storage

`Outcome.proximity(ballA, ballB, distance)` stores the distance in the `incidentSpeed` field. This allows:
- Sound system to access distance for volume/pitch variation
- "Closer by R" logic to compare distances between outcomes

## Sound Triggers

Proximity has two key transitions for sound:

1. **First shown**: When proximity indicator becomes visible (transition from hidden to shown via `show()`)
2. **Ball in proximity**: When cue ball enters the 4R threshold

Use existing outcome-based sound system (like collision sounds) to trigger proximity sounds.

## Implementation Notes

- Indicator visual: `src/view/proximityindicator.ts` [DONE]
- Outcome emission: `Table.checkProximity()` in `advance()`
- Practice mode guard: Check controller type or practice flag
- Distance tracking: Store distance in `Outcome.incidentSpeed` field

## Files to Modify

| File | Change |
|---|---|
| `src/model/outcome.ts` | Update `proximity()` factory to accept distance parameter [DONE] |
| `src/model/table.ts` | Add practice mode guard, precondition checks (2-ball + 3-cushion), "closer by R" logic in `checkProximity()`, call `show()` and `setProximity(distance)` |
| `src/controller/controllerbase.ts` or sound handler | Add proximity sound triggers for the two key transitions |
