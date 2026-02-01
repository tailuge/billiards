I have completed the investigation after reverting the changes. My findings confirm that the `InPocket` state is indeed being overwritten during deserialization, which causes the balls to be incorrectly marked as `Stationary` even when they are positioned deep within a pocket.

### Findings

1.  **State Overwrite during Synchronization:**
    In 2-player mode, the active player and the watcher both simulate the physics independently during a shot. Both correctly mark potted balls as `InPocket`. However, when the active player starts the next shot, they send a `HitEvent` containing the table's state (`table.serialise()`). 
    *   `Ball.serialise()` does **not** include the `state` property.
    *   When the watcher receives this event, it calls `Ball.updateFromSerialised()`, which contains the following hardcoded line:
        ```typescript
        b.state = State.Stationary
        ```
    This overwrites the correctly simulated `InPocket` state with `Stationary`.

2.  **Physics Engine Failure to Re-detect:**
    Once a ball's state is overwritten to `Stationary` while it is deep in a pocket (at `z ≈ -3 * R`), the physics engine fails to re-mark it as `InPocket`. This is because `Pocket.willFall` calculates the 3D distance between the pocket center (at `z = 0`) and the ball's position. If the ball is already at the resting depth, this distance (at least `3 * R`) exceeds the pocket's detection radius (approx. `2.2 * R`).

3.  **Broken Game Logic:**
    Because the balls are now `Stationary` instead of `InPocket`, they are considered `onTable` by the game rules. This prevents the game from ending correctly and causes functions like `inPockets()` to return incorrect counts.

4.  **Other Overwrite Points:**
    *   `Table.halt()`: Also hardcodes `state = State.Stationary` for all balls, which would resurrect any potted balls if called during a game.
    *   `Table.updateFromShortSerialised()`: Used for replays/breaks, also hardcodes `Stationary` and resets `z` to 0.

### Conclusion

The `InPocket` state must be preserved or correctly inferred during deserialization. Since the physics engine cannot re-detect balls that are already at their resting depth, synchronizing the `state` property during `serialise`/`updateFromSerialised` is the most reliable fix to prevent the divergence between players.
