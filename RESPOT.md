# Respot Bug Investigation Report

## Summary
The investigation confirmed that in 2-player mode, respotted balls (like the nine-ball in Nine-ball or colours in Snooker) are not correctly synchronized with the opponent. This is due to two distinct issues:
1. Missing network events in Nine-ball rules.
2. Missing ball state synchronization in the core physics/networking model.

## Findings

### 1. Nine-ball: Missing WatchEvent
In `src/controller/rules/nineball.ts`, when a foul occurs and the nine-ball is potted, the ball is respotted locally on the shooter's machine, but no event is sent to inform the opponent of this change.

```typescript
// src/controller/rules/nineball.ts
if (nineBallPotted) {
  this.respotNineBall(); // Updates local table state
}

if (this.container.isSinglePlayer) {
  return new PlaceBall(this.container);
}
this.container.sendEvent(new PlaceBallEvent(zero, true)); // ONLY sends cue ball placement
return new WatchAim(this.container);
```

The opponent only receives a `PlaceBallEvent`, which tells them to enter "ball in hand" mode but says nothing about the nine-ball. Since the opponent just finished simulating the shot where the nine-ball was potted, the nine-ball remains in the pocket on their screen.

### 2. General: Ball State Not Serialised
Even in games like Snooker where a respot event IS sent, the ball's `state` (e.g., `Stationary`, `InPocket`) is not part of the serialised data.

```typescript
// src/model/ball.ts
serialise() {
  return {
    pos: this.pos.clone(),
    id: this.id,
  };
}
```

When a ball is potted, its state is `InPocket`. When it is respotted, the shooter's machine sets it to `Stationary`. However, the opponent's machine receives the new position but retains the `InPocket` state.

### 3. "Ghost" Balls
A ball with the state `InPocket` returns `false` for `onTable()`. Many core functions, including collision detection and rule logic, check `onTable()`:

```typescript
// src/model/physics/collision.ts
static willCollide(a: Ball, b: Ball, t: number): boolean {
  return (
    (a.inMotion() || b.inMotion()) &&
    a.onTable() && // Returns false for InPocket balls!
    b.onTable() &&
    // ...
  );
}
```

This results in "ghost balls": the opponent might see the ball at the correct position on the table (because the `pos` was updated), but it will not collide with any other balls and will be ignored by game rules.

### 4. FourteenOne: Rerack Inconsistency
In `src/controller/rules/fourteenone.ts`, the `checkRerack` method sends a `WatchEvent` containing the full table state when a rerack occurs.

```typescript
// src/controller/rules/fourteenone.ts
checkRerack(table: Table) {
  // ...
  if (onTable.length === 1) {
    Rack.rerack(onTable[0], table);
    const state = table.serialise();
    const rerack = new WatchEvent({ ...state, rerack: true });
    this.container.sendEvent(rerack);
    // ...
  }
}
```

Since `table.serialise()` relies on `ball.serialise()`, it only includes positions. Any balls that were previously in a pocket on the opponent's machine will have their positions updated to the new rack, but will retain their `InPocket` state. This makes them "ghost balls" in FourteenOne as well, where they are visible in the new rack but cannot be hit.

## Evidence
...
- `Ball.updateFromSerialised` failing to update the state of an existing ball, leaving it in `InPocket` even after being moved back to the table.
- Analysis of `FourteenOne.ts` confirms it uses the same flawed serialisation for reracking.

## Recommended Fixes (Not Implemented)
1. **Nine-ball:** Update `NineBall.ts` to send a synchronization event (like `WatchEvent`) with the respotted nine-ball's information.
2. **Core:** Ensure that when a ball's position is updated from a network event after being in a pocket, its state is also updated to `Stationary`.

## Alternative Solution: RespotEvent
To minimize serialization data overhead (avoiding adding the `state` field to every ball in common `WatchEvent` payloads), a specialized `RespotEvent` could be introduced.

### Advantages:
- **Efficiency:** Only sends data for the specific balls being respotted rather than the entire table or adding fields to all balls.
- **Explicit State Transition:** The `RespotEvent` handler can explicitly set the ball's state to `Stationary` and its velocity to zero, resolving the "ghost ball" issue without requiring `state` to be included in general serialisation payloads.

### Considerations:
- **Controller Handling:** Controllers (especially `WatchAim` and `WatchShot`) must be updated to handle this new event type and update the table model accordingly.
- **Playback & Recording:** `src/events/recorder.ts` must be updated to record and playback `RespotEvent`. Since the recorder is used for shot replays and high scores, ensuring these events are captured is critical for visual accuracy during playback. If a ball is missing from the recorder's state because a respot wasn't captured, the replay will diverge from the original game.
