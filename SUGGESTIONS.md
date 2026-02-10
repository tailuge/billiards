# AimInputs Refactoring Suggestions

## Problem Analysis

The `AimInputs` class is responsible for keeping visual UI elements (cue ball spin indicator, power slider, overlap indicator) synchronized with the underlying `Cue.aim` state. Currently, synchronization issues occur in:

1. **Replay mode**: When `Replay.playNextShot()` sets `cue.aim` directly and calls `updateAimInput()` (line 98)
2. **2-player mode**: When `WatchAim.handleAim()` receives `AimEvent` from opponent and sets `cue.aim` (line 19)
3. **State restoration**: When switching between controllers or restoring game state

The core issue is that the class has **bidirectional responsibilities**:
- **Input → Model**: User interactions update the underlying `Cue.aim` state
- **Model → View**: External state changes should update the visual elements

Currently, the "Model → View" path is incomplete and inconsistent.

---

## Current Architecture Issues

### 1. **Incomplete Synchronization Methods**

```typescript
updateVisualState(x: number, y: number)  // Only updates spin indicator
updatePowerSlider(power)                  // Only updates power slider
showOverlap()                             // Only updates overlap indicator
```

These methods are called individually and can get out of sync. There's no single "sync everything" method.

### 2. **Conditional Updates Create Gaps**

```typescript
updatePowerSlider(power) {
  power > 0 &&
    this.cuePowerElement?.value &&
    (this.cuePowerElement.value = power)
}
```

The condition `power > 0` means power=0 won't update the slider, potentially leaving stale values.

### 3. **No State Ownership**

The class doesn't own or track the "source of truth" - it relies on `container.table.cue.aim` but doesn't have a reliable way to detect when that state changes externally.

### 4. **Event Listeners Modify State Directly**

User interactions (click, wheel, etc.) directly modify `container.table.cue` state, making it hard to intercept and ensure consistency.

---

## Refactoring Suggestions

### Option 1: **Observer Pattern with Full Sync Method** (Recommended)

**Approach**: Add a comprehensive `syncFromModel()` method that updates ALL visual elements from the current `cue.aim` state.

**Changes**:
1. Add a `syncFromModel()` method that reads from `container.table.cue.aim` and updates all visual elements
2. Call this method whenever external code modifies `cue.aim` (Replay, WatchAim, etc.)
3. Keep existing user input handlers but ensure they also call `syncFromModel()` after state changes

**Benefits**:
- Minimal changes to existing code
- Clear separation: user inputs modify model, then sync view
- Easy to call from any controller that modifies aim state

**Implementation**:
```typescript
syncFromModel() {
  const aim = this.container.table.cue.aim
  this.updateVisualState(aim.offset.x, aim.offset.y)
  this.updatePowerSlider(aim.power / this.container.table.cue.maxPower)
  this.showOverlap()
}
```

**Usage in controllers**:
```typescript
// In Replay.playNextShot()
this.container.table.cue.aim = aim
this.container.table.cue.aimInputs.syncFromModel()

// In WatchAim.handleAim()
this.container.table.cue.aim = event
this.container.table.cue.aimInputs.syncFromModel()
```

---

### Option 2: **State Management with Getters/Setters**

**Approach**: Make `AimInputs` the single point of control for aim state changes.

**Changes**:
1. Move `aim` state into `AimInputs` or add setter methods
2. All modifications go through `AimInputs` methods
3. Methods automatically sync visual elements when state changes

**Benefits**:
- Guaranteed synchronization (can't modify state without updating view)
- Single source of truth
- Better encapsulation

**Drawbacks**:
- Requires more extensive refactoring
- Changes the ownership model (currently `Cue` owns `aim`)
- May conflict with serialization/networking code

---

### Option 3: **Reactive State with Proxy**

**Approach**: Use JavaScript Proxy to automatically detect changes to `cue.aim` and trigger visual updates.

**Benefits**:
- Automatic synchronization
- No need to remember to call sync methods

**Drawbacks**:
- More complex implementation
- Harder to debug
- May have performance implications
- Overkill for this use case

---

### Option 4: **Explicit State Snapshots**

**Approach**: Add methods to capture and restore complete aim state.

**Changes**:
```typescript
captureState(): AimState {
  return {
    offset: this.container.table.cue.aim.offset.clone(),
    angle: this.container.table.cue.aim.angle,
    power: this.container.table.cue.aim.power,
    pos: this.container.table.cue.aim.pos.clone()
  }
}

restoreState(state: AimState) {
  this.container.table.cue.aim.offset.copy(state.offset)
  this.container.table.cue.aim.angle = state.angle
  this.container.table.cue.aim.power = state.power
  this.container.table.cue.aim.pos.copy(state.pos)
  this.syncFromModel()
}
```

**Benefits**:
- Explicit control over state transitions
- Easy to test
- Works well with replay/undo systems

---

## Recommended Implementation Plan

### Phase 1: Add Comprehensive Sync (Low Risk)

1. **Add `syncFromModel()` method** to `AimInputs`
   - Calls all three update methods in sequence
   - Add defensive checks for null/undefined elements

2. **Replace `updateAimInput()` in `Cue`** to call the new method
   ```typescript
   updateAimInput() {
     this.aimInputs?.syncFromModel()
   }
   ```

3. **Add explicit sync calls** in problematic controllers:
   - `Replay.playNextShot()` after setting `cue.aim`
   - `WatchAim.handleAim()` after setting `cue.aim`
   - `Replay.retry()` after setting `cue.aim`

### Phase 2: Fix Conditional Logic (Medium Risk)

1. **Remove conditional in `updatePowerSlider()`**
   ```typescript
   updatePowerSlider(power) {
     if (this.cuePowerElement) {
       this.cuePowerElement.value = power
     }
   }
   ```

2. **Add bounds checking** to prevent invalid values
   ```typescript
   updatePowerSlider(power) {
     if (this.cuePowerElement) {
       this.cuePowerElement.value = Math.max(0, Math.min(1, power))
     }
   }
   ```

### Phase 3: Add State Validation (Optional)

1. **Add a `validate()` method** to check if visual state matches model state
   - Useful for debugging
   - Can be called in development mode

2. **Add logging** when sync is called to track state changes
   - Helps identify when/where sync issues occur

---

## Additional Improvements

### 1. **Separate Concerns**

Consider splitting `AimInputs` into:
- `AimInputController`: Handles user input events
- `AimVisualSync`: Handles visual synchronization
- `AimInputElements`: Manages DOM element references

### 2. **Add TypeScript Types**

```typescript
interface AimState {
  offset: Vector3
  angle: number
  power: number
  pos: Vector3
}

interface AimInputElements {
  cueBall: HTMLElement | null
  cueTip: HTMLElement | null
  cuePower: HTMLInputElement | null
  cueHit: HTMLButtonElement | null
  objectBall: HTMLElement | null
}
```

### 3. **Improve Disabled State Handling**

Currently `setDisabled()` only affects the hit button. Consider:
- Disabling all input elements in spectator/watch modes
- Visual indication (opacity, cursor) when inputs are disabled
- Prevent event handlers from modifying state when disabled

### 4. **Add Unit Tests**

Create tests for:
- Sync after external state changes
- User input updates both model and view
- Disabled state prevents modifications
- Edge cases (null elements, invalid values)

---

## Migration Strategy

1. **Start with Option 1** (Observer Pattern) - lowest risk, highest immediate value
2. **Add comprehensive tests** to catch regressions
3. **Monitor for sync issues** in 2-player and replay modes
4. **Consider Option 2** (State Management) if sync issues persist
5. **Refactor incrementally** - don't try to fix everything at once

---

## Testing Checklist

After refactoring, verify:

- [ ] Single player mode: spin/power inputs work correctly
- [ ] Replay mode: visual elements match replayed shots
- [ ] 2-player mode: opponent's aim is displayed correctly
- [ ] Switching between players updates visuals
- [ ] Spectator mode: inputs are disabled
- [ ] Power slider sync with mousewheel
- [ ] Overlap indicator updates on aim changes
- [ ] Retry from replay restores correct aim state
- [ ] PlaceBall mode doesn't interfere with aim inputs
