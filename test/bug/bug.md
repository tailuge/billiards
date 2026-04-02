# Analysis of Sync State and Tripwire Log

## 1. The Tripwire Mismatch (False Alarm Resolved)

The recent tripwire log indicating `recorder_hit_aim_mismatch` showcased a $2^{-27}$ numerical variance (specifically, a distance of `7.6293e-9`) between the internal cueball position and an external event aim position. 

### Root Cause
1. In `PlaceBall` mode, human players clamp the physical cueball explicitly to a `Float32` value (`-0.7204999923706055`) by calling `cueball.fround()` right before taking the aim.
2. In Bot matches (`botMode: true`), the `BotEventHandler` relocated the cueball upon a foul but previously **failed to call `.fround()`**. This left the Bot simulating using `Float64` precision (e.g., exactly `-0.7205`).
3. The Bot automatically packaged an `AimEvent` containing the raw `Float64` vector math and broadcasted it across the network. 
4. The remote client's `Recorder` executed the tripwire logic by comparing its native memory (clamped to Float32 early in the process) against the received `HitEvent` payload (Float64). The strict threshold of `1e-9` tripped instantly.

### The Fix
This was fixed by inserting `.fround()` directly into `BotEventHandler.handlePlaceBall()`. The Bot architecture now successfully mirrors the human flow of intentionally clamping ball positions down to Float32 before transitioning out of ball-in-hand phases, permanently aligning the simulation baselines.

---

## 2. Approach for Resolving 2-Player Initialisation Flow

While the jitter desync theory was inaccurate—because `WatchEvent(table.serialise())` actually transfers the entire jittered rack state flawlessly upon connection—there is a structural anomaly regarding how the game communicates its starting positions over the network.

### The Double-Send Anomaly
Right now, the full initial state of all balls is pushed over the network **twice** by the starting player:
1. **Via `WatchEvent`**: Sent right when the game transitions from `Init` to `PlaceBall`. Player 2 successfully consumes this and perfectly mimics the jittered rack.
2. **Via `BreakEvent(table.shortSerialise())`**: Sent immediately after Player 1 confirms the placement of the cueball. However, Player 2 has already transitioned into the `WatchAim` controller. Because `WatchAim` doesn't possess a `handleBreak` override, it inherits the base controller logic that simply **drops the event on the floor** (`return this;`). Player 2 only salvages the correct cueball location because an `AimEvent` happens to follow immediately after.

### Next Steps: Rationalising Initial Sync

Having `BreakEvent` transmit the entire positional array only for it to be completely ignored by the networked opponent is confusing and prone to masking future desync bugs. 

To rationalise the 2-Player startup state, we should implement one of the following architectural approaches:

**Approach A: Explicit Pre-Shot Network Agreement (Recommended)**
Instead of ignoring the `BreakEvent`, we should allow the networked opponent to actively consume it. 
* Add `handleBreak(event: BreakEvent)` to the `WatchAim` controller.
* When Player 2 receives the event, force a `table.updateFromShortSerialised(event.init)` block.
* **Why:** This acts as a strict, hard-boundary sync check right before the shot is simulated. It guarantees that regardless of how the balls were moved or jittered during `PlaceBall` setup, both clients explicitly snap to identical Float32 arrays before any physics are calculated.

**Approach B: Relegate `BreakEvent` strictly to Replays**
If the only purpose of embedding `table.shortSerialise()` into a `BreakEvent` is to provide a clean slate for the local `Recorder` and replay system to save matches:
* Cease broadcasting the `BreakEvent` over the network via `PlaceBall`. 
* Push the `BreakEvent` payload strictly to the local `eventQueue` or the `Recorder` instance.
* Allow `PlaceBallEvent` and `AimEvent` to be the sole mechanisms representing cueball location transfers over the network. 
* **Why:** Simplifies the network traffic footprint and eliminates the anti-pattern of broadcasting a heavyweight array payload to a client that is hardcoded to drop it.
