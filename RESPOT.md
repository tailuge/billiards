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

## Resolution (2026-02-02)

### Nineball Fix
Implemented the `PlaceBallEvent` strategy:
- Updated `PlaceBallEvent` to accept an optional `respot` object containing the ID and position of a respotted ball.
- Updated `NineBall.ts` to include the 9-ball's new position in the `PlaceBallEvent` when it is respotted after a foul.
- Updated `WatchShot.ts` to handle `PlaceBallEvent` by checking for `respot` data. If present, it updates the ball's position and explicitly sets its state to `Stationary`, fixing the "ghost ball" issue.

### Snooker Fix
Implemented a targeted fix in the `WatchShot` controller to handle existing `WatchEvent`s used by Snooker:
- Updated `WatchShot.handleWatch` to detect "rerack" events (used by Snooker respot).
- It now iterates over the balls in the event payload and explicitly sets their state to `Stationary` if they are part of the update. This fixes the "ghost ball" issue for Snooker without needing to change `PlaceBallEvent` usage for non-BIH fouls.

### Verification
- Added regression tests in `test/rules/nineball.spec.ts` to verify `PlaceBallEvent` payload.
- Added new test suite `test/controller/watchshot.spec.ts` to verify that `WatchShot` correctly updates ball state for both `PlaceBallEvent` (Nineball) and `WatchEvent` (Snooker).