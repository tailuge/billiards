# Investigation into Non-Deterministic Ball Positions

## Findings

The physics engine is designed to be deterministic by using `Math.fround` (32-bit float precision) for all state updates during simulation. However, several areas were identified where this determinism can be broken, particularly around manual ball placement and event recording.

### 1. Inconsistent Rounding in `PlaceBall` Controller
In `src/controller/placeball.ts`, the `moveTo` and `handleInput` methods update the cue ball's position using standard 64-bit floating point arithmetic:
```typescript
this.moveTo(0, input.t * this.placescale)
// ...
const ballPos = this.container.table.cueball.pos.add(delta)
```
These positions are never passed through `Math.fround` while the user is moving the ball. When the ball is finally "placed", the current 64-bit position is recorded.

### 2. No-op `roundCueBallPosition` Method
The `Table.roundCueBallPosition` method in `src/model/table.ts` is currently a no-op:
```typescript
roundCueBallPosition() {
  const pos = this.cueball.pos.clone()
  if (this.overlapsAny(pos)) {
    return
  }
  this.cueball.pos.copy(pos) // Copies identical values, no rounding applied
}
```
This method was likely intended to ensure the cue ball's position matches the physics engine's required precision after manual placement or respotting.

### 3. Lack of explicit `fround` in Replay initialization
When a replay starts or a `PlaceBallEvent` is handled in `src/controller/replay.ts`, the ball positions are copied directly from the event data:
```typescript
this.container.table.cueball.pos.copy(place.pos)
```
Although `Table.advance` calls `ball.fround()` at the *end* of each step, the very first collision detection at the *start* of the first step uses the un-rounded values. This can lead to different collision outcomes if a ball is placed extremely close to another ball or a cushion.

### 4. Precision Jitter in `Rack`
The `Rack` class uses `Math.random()` to add "noise" to ball positions. While this is fine for the initial rack, if the random seed is not perfectly synced or if `Rack.jitter` is called in a non-deterministic way between live and recording, it could cause discrepancies.

### 5. Serialization and `shortSerialise`
`Table.shortSerialise` uses standard 64-bit floats. If these values are transmitted and then re-parsed from JSON, they should remain accurate to 32-bit float precision, but they aren't explicitly forced back to 32-bit until the first physics step completes.

---

## Suggestions

1.  **Fix `roundCueBallPosition`**: Update `Table.roundCueBallPosition` to actually apply `Math.fround` to the cue ball's coordinates.
    ```typescript
    roundCueBallPosition() {
      this.cueball.fround();
      // Ensure it still doesn't overlap after rounding
      if (this.overlapsAny(this.cueball.pos)) {
        // Handle edge case if rounding causes overlap
      }
    }
    ```

2.  **Apply `fround` in `PlaceBall`**: Ensure that `PlaceBall.placed()` or `moveTo()` applies `fround` to the position before it is used for collision detection or recorded in an event.

3.  **Enforce 32-bit precision on event application**: In `Replay` and `WatchShot`, whenever a ball position is updated from an event (like `PlaceBallEvent` or `RerackEvent`), immediately call `ball.fround()` on the affected balls.

4.  **Audit `shortSerialise` usage**: Ensure that any code path that sets ball positions from a serialized state (like `updateFromShortSerialised`) calls `fround()` on all balls immediately after setting their positions.

5.  **Consolidate Rounding Utilities**: Ensure the custom `round()` function in `utils.ts` (which rounds to 4 decimal places) is not being confused with `Math.fround` (32-bit float). The physics engine should exclusively rely on `Math.fround` for deterministic simulation.
