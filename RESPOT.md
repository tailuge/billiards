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

## Evidence
A reproduction test suite was created in `test/repro_respot_bug.spec.ts` which demonstrates:
- `NineBall` failing to send a `WatchEvent` on respot.
- `Ball.serialise` failing to include the `state`.
- `Ball.updateFromSerialised` failing to update the state of an existing ball, leaving it in `InPocket` even after being moved back to the table.

## Recommended Fixes (Not Implemented)
1. **Nine-ball:** Update `NineBall.ts` to send a `WatchEvent` with the respotted nine-ball's state, similar to how Snooker does it.
2. **Core:** Update `Ball.serialise()` to include `this.state` and `Ball.updateFromSerialised()` to apply it.
3. **Core:** Ensure `Table.updateFromSerialised()` correctly handles the updated ball states to bring them back "on table".
