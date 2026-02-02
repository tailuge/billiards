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

### 5. Using PlaceBallEvent for Synchronization
An alternative "low impact" solution is to extend the `PlaceBallEvent`. Since a `PlaceBallEvent` is already sent after almost every foul (where respots typically occur), it could carry the necessary synchronization data.

#### The `allTable` parameter
The `PlaceBallEvent` constructor currently takes two arguments: `pos` and `allTable`.
```typescript
constructor(pos, allTable)
```
- **`pos`**: The initial position for the cue ball placement.
- **`allTable`**: A boolean flag. Analysis shows that this flag is **currently unused** in the codebase. It is assigned and serialized but never read by any controller or rule logic.

It was likely intended to distinguish between "Ball in hand anywhere" vs "Ball in hand behind the baulk line", but this logic is currently handled by the `Rules` objects (`NineBall.allowsPlaceBall()` etc.).

#### Proposed Extension
We could repurpose `allTable` or add a new optional field (e.g., `respottedBalls`) to `PlaceBallEvent`. 
- **Mechanism:** When a foul occurs and balls are respotted, the shooter's machine includes the IDs and new positions of these balls in the `PlaceBallEvent`.
- **Receiver Logic:** When the opponent's machine handles `PlaceBallEvent`, it updates the positions and **crucially sets the state to `Stationary`** for all balls listed in the event.
- **Benefit:** This avoids introducing a new event type (`RespotEvent`) and ensures synchronization happens automatically as part of the standard foul transition flow.

## Implementation Plan: PlaceBallEvent Strategy

### 1. Update `PlaceBallEvent` Class
- **Change Constructor:** Modify the second argument to accept an optional object containing respot details.
  ```typescript
  // Old
  constructor(pos, allTable: boolean)
  
  // New
  constructor(pos, respot?: { id: number, pos: Vector3 })
  ```
- **Serialization:** Update `EventUtil` to handle this object structure.

### 2. Update Rule Controllers
- **NineBall:**
  ```typescript
  if (nineBallPotted) {
    this.respotNineBall();
    const nineBall = this.container.table.balls.find(b => b.label === 9);
    // Send cue ball position (zero) AND the 9-ball's new valid position
    this.container.sendEvent(new PlaceBallEvent(zero, { 
      id: 9, 
      pos: nineBall.pos 
    }));
  }
  ```

### 3. Update Receivers
- **Logic:**
  ```typescript
  handlePlaceBall(event: PlaceBallEvent) {
    if (event.respot) {
      const ball = this.container.table.balls.find(b => b.id === event.respot.id);
      if (ball) {
        ball.pos.copy(event.respot.pos); // Deterministic placement
        ball.state = State.Stationary;   // Fixes "ghost ball"
        ball.vel.copy(zero);
        ball.rvel.copy(zero);
      }
    }
    // ...
  }
  ```
- **Simplicity:** This removes the need for the receiver to know *why* or *how* the ball was respotted (e.g., foot spot logic); it just puts it where it's told.

### 4. Verification
- **Test:** Update `test/repro_respot_bug.spec.ts` to assert that:
  1. `PlaceBallEvent` carries the correct ID and Position.
  2. The receiver updates the ball's position AND state.
