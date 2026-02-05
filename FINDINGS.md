# Controller & Event Review Findings

## Scope
- Focused on `src/controller/*` and `src/events/*` to understand event flow, controller transitions, and replay/spectate behaviors.

## Highlights
- The controller layer is a clear finite-state machine: `Controller` defines the event contract, and concrete controllers transition by returning the next controller instance. `ControllerBase` centralizes shared input behavior, which keeps per-state logic compact.
- Event classes map cleanly to controller entry points via `applyToController`, so the dispatch surface is explicit and easy to trace.

## Findings & Improvements
1. **Replay abort still leaves scheduled shot timers active.**
   - `Replay` schedules hit events via `setTimeout` in `playNextShot`, but `handleAbort` only transitions to `End` without clearing `this.timer`.
   - If an abort arrives while a timer is pending, the timeout can still enqueue a `HitEvent` after the replay is supposedly terminated.
   - Consider clearing the pending timeout in `handleAbort` to avoid stray events.

2. **Spectate subscriptions have no teardown when leaving the mode.**
   - `Spectate` subscribes to `MessageRelay` in the constructor and never unsubscribes.
   - If the controller is replaced (e.g., by a future mode change) or re-entered, multiple subscriptions will accumulate and duplicate incoming events.
   - Consider adding a cleanup hook or unsubscribe in the transition path.

3. **EventHistory slice behavior is surprising when sequence IDs are missing.**
   - `EventHistory.from()` and `EventHistory.after()` use `slice(index)` where `index` can be `-1` if no match is found, which returns the last element instead of an empty list.
   - If sequence IDs ever desync between clients, this can cause replay logic to drop most history unexpectedly.
   - A guard for `index === -1` would make the failure mode more predictable.

4. **Replay assumes a non-empty shot list on construction.**
   - `Replay` calls `playNextShot` unconditionally in the constructor when not in retry mode, but `playNextShot` will attempt `AimEvent.fromJson(shot)` even if the shot list is empty.
   - This can throw when a replay is created without any recorded shots (e.g., an early abort).
   - Consider checking `this.shots.length` before starting the playback loop.
