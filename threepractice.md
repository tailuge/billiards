# Three-Cushion Proximity Indicator (Practice Mode)

## Overview

The proximity indicator (already coded) shows when the cue ball is within 4R of a target ball. This document describes the logic for when to emit proximity outcomes and trigger sounds.

## ProximityIndicator API

- `show()` - Make indicator visible (called when preconditions are met)
- `hide()` - Hide indicator
- `setProximity(distance)` - Update filled rings based on distance to ball

## Implementation Phases

### Phase 1: Show Indicator on 2 Balls in Motion ✓ COMPLETE

**Goal**: Show indicator at stationary target ball when 2 balls are in motion (practice mode only)

**Implementation details:**

1. **`Table.checkProximity()`** [DONE]:
   - Early out if indicator already visible (`this.proximityIndicator.group.visible`)
   - Guard: Skip if not practice mode (`Session.isPracticeMode()`)
   - Find balls in motion: `const moving = this.balls.filter(b => b.inMotion())`
   - Check if exactly 2 balls moving and one is cue ball
   - Find stationary target: `this.balls.find(b => !b.inMotion() && b !== this.cueball)`
   - If target exists: `this.proximityIndicator.showAt(target.pos)`
   - Called from `Table.advance()` every physics step

2. **Hide indicator after rules decided** [DONE]:
   - `ThreeCushion.update()` calls `this.container.table.proximityIndicator.hide()` at start
   - This happens when all balls are stationary and outcome is evaluated

**Files modified:**
- `src/model/table.ts` - Added `checkProximity()` method with early out, called from `advance()` [DONE]
- `src/controller/rules/threecushion.ts` - Added `hide()` call at start of `update()` [DONE]

**Behavior:**
- Indicator appears at stationary ball position when 2 balls are moving
- Indicator stays visible while balls are moving
- Indicator hidden when rules are decided (in `update()`)
- Only works in practice mode
- Assumes cue ball is always one of the moving balls

### Phase 2: Emit Proximity Outcomes (No Cushion Requirement Yet) ✓ COMPLETE

**Goal**: Generate `Outcome.proximity()` events when indicator is shown and cue ball is within 4R of target

**Implementation details:**

1. **In `Table`** [DONE]:
   - Added `proximityTarget: Ball | null` field to track the stationary target ball
   - When indicator first shown (2 balls in motion), store reference to stationary ball in `proximityTarget`
   - On subsequent `advance()` calls, check distance to `proximityTarget` and emit outcome if < 4R
   - Clear `proximityTarget` when indicator is hidden in `ThreeCushion.update()`

2. **In `Table.checkProximity()`** [DONE]:
   - If indicator already visible: check distance to `proximityTarget`, emit outcome if < 4R, then return
   - Otherwise: check for 2 balls in motion, show indicator and set `proximityTarget`

3. **Unit test** in `test/rules/threecushion.spec.ts` [DONE]:
   - Set up practice mode with Session.init
   - Create shot with 2 balls in motion (Rolling state), cue ball within 4R of stationary ball
   - Call `advance()` twice: first to show indicator and set target, second to emit outcome
   - Verify `Outcome.proximity()` is in outcomes array with correct balls and distance < 4R

**Files modified:**
- `src/model/table.ts` - Added `proximityTarget` field, updated `checkProximity()` logic [DONE]
- `src/controller/rules/threecushion.ts` - Clear `proximityTarget` in `update()` [DONE]
- `test/rules/threecushion.spec.ts` - Added unit test [DONE]

**Behavior:**
- Indicator shown when 2 balls in motion, target ball reference stored
- Proximity outcomes emitted continuously on each advance() while indicator visible and distance < 4R
- Target cleared when rules decided
- Test passes (438 total tests passing)

### Phase 3: Add 3-Cushion Requirement

Add cushion counting logic to only show indicator after cue ball hits ≥3 cushions.

### Phase 4: Add Deduplication

Implement "closer by R" deduplication logic for proximity outcomes.

### Phase 5: Dynamic Ring Updates

Call `setProximity(distance)` to show/hide filled rings based on current distance.

### Phase 6: Sound Integration

Add sound triggers for "first shown" and "ball in proximity" transitions.

## Proximity Outcome Rules (Full Implementation)

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
