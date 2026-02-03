# Snooker Foul Notifications Plan

## Overview

Implement foul notifications for Snooker, following the pattern established in NineBall. Currently, Snooker uses `console.log()` for fouls; this will be replaced with proper UI notifications via `container.notify()`.

## Current State Analysis

### NineBall Implementation (Reference)

- **File**: `src/controller/rules/nineball.ts`
- **Pattern**:
  - `foulReason(outcome)` - returns specific reason string
  - `handleFoul(outcome, reason)` - calls `container.notify()` with structured object:
    ```typescript
    {
      type: "Foul",
      title: "Foul!",
      subtext: reason,           // Specific reason
      extra: "Ball in hand"     // Additional info
    }
    ```

### Snooker Current Implementation

- **File**: `src/controller/rules/snooker.ts`
- **Issues**:
  - `foulCalculation()` returns points only, not reasons
  - `foul()` method called at lines 118, 133, 141 but no notification
  - Uses `console.log()` at lines 244, 283 instead of notifications
  - `targetRedRule()` and `targetColourRule()` call `foul()` without notification

## Foul Scenarios in Snooker

From `test/rules/snooker.spec.ts`, the following foul scenarios exist:

1. **White Potted** - Cue ball goes into pocket
2. **No Ball Hit** - No collision with any ball
3. **Wrong Ball Hit First** - Hit colour when targeting red, or wrong colour
4. **Multiple Colours Potted** - More than one colour potted in one shot
5. **Wrong Colour Potted** - Potted colour different from target
6. **Colour Potted Without Prior Red** - Colour potted when `previousPotRed` is false

## Implementation Plan

### Step 1: Add `foulReason()` Method to Snooker Class

Create a method that analyzes the outcome and returns a human-readable foul reason. This method should be similar to NineBall's `foulReason()` but adapted for snooker rules.

**Input**: `outcome: Outcome[]`, `info: any` (from SnookerUtils.shotInfo)
**Output**: `string | null` - reason string or null if no foul

**Scenarios to detect**:

- White potted → "White potted"
- No first collision → "No ball hit"
- Wrong ball hit first → "Hit [colour] instead of [target]"
- Multiple colours potted → "Potted [colours]"
- Wrong colour potted → "Potted [wrong] instead of [target]"

### Step 2: Add Utility Functions to SnookerUtils

The `SnookerUtils.shotInfo()` already provides useful data:

- `firstCollision` - first ball hit
- `legalFirstCollision` - whether hit was legal
- `whitePotted` - whether cue ball potted
- `pots` - number of pots

We'll need additional utility functions to:

- Get colour name from ball ID (1-6 = Yellow, Green, Brown, Blue, Pink, Black)
- Determine what should have been targeted

### Step 3: Modify Existing Foul Methods

Update the following methods to include notifications:

1. **`foul(outcome, info)`** (line 141):
   - Add call to `this.container.notify()` before respot and switch player

2. **`targetRedRule()`** (line 72):
   - When calling `foul()` at line 83, ensure notification happens

3. **`targetColourRule()`** (line 93):
   - When calling `foul()` at lines 102, 108, 133, ensure notification happens

### Step 4: Remove Console Logging

Replace `console.log()` calls:

- Line 244: `console.log(\`foul, ${this.foulPoints} to opponent\`)`
- Line 283: `console.log(\`foul, ${this.foulPoints} to opponent\`)`

### Step 5: Add Unit Tests

Add tests in `test/rules/snooker.spec.ts` to verify notifications.

## File Changes Summary

| File                                   | Changes                                                                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/controller/rules/snooker.ts`      | Add `foulReason()` method, update `foul()`, `targetRedRule()`, `targetColourRule()` to call notifications, remove console.log statements |
| `src/controller/rules/snookerutils.ts` | Add utility functions for colour names and foul reasons                                                                                  |
| `test/rules/snooker.spec.ts`           | Add tests for foul notifications                                                                                                         |

## Notification Format

All snooker fouls should use:

```typescript
{
  type: "Foul",
  title: "Foul!",
  subtext: "<specific reason>",
  extra: "Ball in hand",  // Always true for snooker fouls
}
```

## Ball ID to Colour Mapping

- 1: Yellow
- 2: Green
- 3: Brown
- 4: Blue
- 5: Pink
- 6: Black
- 7+: Reds
