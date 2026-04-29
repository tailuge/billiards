# Three-Cushion Proximity Indicator (Practice Mode)

## Overview

The proximity indicator (already coded) shows when the cue ball is within 4R of a target ball. This document describes the logic for when to emit proximity outcomes and trigger sounds.

## Proximity Outcome Rules

Emit `OutcomeType.Proximity` in `Table.advance()` when:

1. **Practice mode only** (guard: skip if not practice mode)
2. **2 balls in motion** (cue ball + one other)
3. **Cue ball hit ≥3 cushions** this shot
4. **Distance < 4R** to stationary target ball
5. **Not duplicate**: Don't add proximity if last outcome was proximity **unless** current distance is closer by R

## Sound Triggers

Proximity has two key transitions for sound:

1. **First shown**: When proximity indicator becomes visible (transition from hidden to shown)
2. **Ball in proximity**: When cue ball enters the 4R threshold

Use existing outcome-based sound system (like collision sounds) to trigger proximity sounds.

## Implementation Notes

- Indicator visual: `src/view/proximityindicator.ts` [DONE]
- Outcome emission: `Table.checkProximity()` in `advance()`
- Practice mode guard: Check controller type or practice flag
- Distance tracking: Store last proximity distance to implement "closer by R" rule

## Files to Modify

| File | Change |
|---|---|
| `src/model/table.ts` | Add practice mode guard, 2-ball + 3-cushion checks, "closer by R" logic in `checkProximity()` |
| `src/controller/controllerbase.ts` or sound handler | Add proximity sound triggers for the two key transitions |
