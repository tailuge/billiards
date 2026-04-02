# Analysis of Tripwire Log and Root Cause

## 1. The Full Initial State Sync (Is it happening?)

You asked: *"the player who goes first is supposed to send the full initial state to the other, is that happening?"*

The answer is **Yes... mostly**. 
When the game starts (in `src/controller/init.ts`), Player 1 generates the jittered rack and natively sends a `WatchEvent` containing the FULL serialized state (`this.container.table.serialise()`). Player 2 receives this event and calls `table.updateFromSerialised(event.json)`, successfully storing the exact randomly jittered positions for every single ball.

**However, there's a dropped event post-placement:**
After Player 1 finishes placing the cueball around the baulk line, they send a `BreakEvent(this.container.table.shortSerialise())`. This event *contains* the full array of `X, Y` coordinates of all balls again! 
But Player 2 is currently in the **`WatchAim`** controller. `WatchAim` lacks a `handleBreak` method of its own, so it inherits from `Controller.handleBreak` (`src/controller/controller.ts`), which completely **drops the event** (`return this;`). 
Player 2 only ends up getting the updated cueball position because Player 1 immediately sends an `AimEvent` afterwards, which Player 2 *does* process by copying the `AimEvent.pos` directly into the local `cueball.pos`.

## 2. The Tripwire Mismatch

The tripwire fired with a discrepancy exactly equal to the Float32 vs Float64 precision gap ($2^{-27}$ padding). Why?

If this was a Bot game (`botMode: true`), here is exactly what went wrong mathematically:
1. The human controllers (`PlaceBall`) remember to call `this.container.table.cueball.fround()` when the ball is laid down, forcefully crushing the cueball's internal coordinate into `Float32` (saving it locally as `-0.7204999923706055`).
2. The `BotEventHandler`'s `handlePlaceBall` logic ignores this and NEVER calls `fround()`.
3. The Bot then pushes an `AimEvent` & `HitEvent` using the raw, exact mathematical float `-0.7205` to the network.
4. On Player 2's side, the `Recorder` handles the `HitEvent` locally. Comparing Player 2's local `cueball.pos` (clamped to Float32 precision earlier in initialization) against the `aim.x` embedded in the remote `HitEvent` (raw Float64 precision from the Bot).

The tripwire possesses a hard-coded 1e-9 tolerance limit. The Float32 representation of `-0.7205` happens to be explicitly `7.629394560559888e-9` units mathematically away. **The tripwire triggers on a floating-point quantization mismatch.**
