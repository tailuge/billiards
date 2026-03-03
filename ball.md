# Ball Position Usage in HitEvent

This report documents the current usage of ball positions within the `HitEvent` payload across the application.

## Overview
The `HitEvent` is used to trigger a shot. It carries a `tablejson` payload which, depending on the source, may contain the full state of the table (all balls) or only the aim/cue parameters.

## Analysis of Payload Usage

### Instances where ALL balls are sent:
- **`src/controller/aim.ts` (`playShot`)**: When a human player takes a shot, the `HitEvent` is initialized with `table.serialise()`. This includes the positions of every ball on the table.
- **`src/network/bot/aimcalculator.ts` (`generateRandomShot`)**: When the bot calculates and takes a shot, it similarly sends the full results of `table.serialise()`.

### Instances where NO (other) balls are sent:
- **`src/controller/replay.ts` (`playNextShot`)**: During a replay, the `HitEvent` is initialized with `table.cue.aim`. This `AimEvent` contains only the hitting ball's position, angle, power, and spin offset. It does **not** include the positions of other balls.

### Instances where SOME balls are sent:
- **None**: Currently, the system either sends the full table state or only the hitting ball's aim data. There are no intermediate states where a subset of balls is sent.

## Redundancy and Optimization
In many cases, sending the full table state in every `HitEvent` is unnecessary. Since the simulation is deterministic, clients should remain in sync if they start from the same initial state.

### Findings:
1. **Redundancy**: The `HitEvent` in `Aim` and `Bot` controllers sends all ball positions even though these positions were already synchronized during the `Aim` phase (via `AimEvent` or `WatchEvent`).
2. **Synchronization**: The system already handles `HitEvent` payloads that lack the `balls` array (as seen in `Replay`), making it safe to optimize the payload by removing the full `table.serialise()` call.
3. **Proposed Optimization**: Standardize `HitEvent` to only carry the `AimEvent` data by default. Full table state should only be sent via specific synchronization events (like `RerackEvent` or a dedicated sync event) when a discrepancy is detected or required by game rules (e.g., after potting).

## Proposed Optimization Plan

To reduce network overhead and eliminate redundant data transmission, the following steps are proposed:

1.  **Standardize `HitEvent` Payload**:
    -   Modify `Aim.playShot()` in `src/controller/aim.ts` to send `this.container.table.cue.aim` instead of `this.container.table.serialise()`.
    -   Modify `AimCalculator.generateRandomShot()` in `src/network/bot/aimcalculator.ts` to send `table.cue.aim` (or a reconstructed `AimEvent`) instead of `table.serialise()`.

2.  **Ensure Robustness in `Table.updateFromSerialised`**:
    -   Verify that `updateFromSerialised` in `src/model/table.ts` correctly handles cases where `data.balls` is missing or empty.
    -   Ensure the hitting ball's position is always updated from `data.aim.pos` if `data.aim` is present, providing a final sync point before the hit.

3.  **Verification**:
    -   Test in `Replay` mode (which already uses the optimized format) to ensure no regressions.
    -   Test in `Bot` mode to ensure the bot can still trigger shots correctly without sending the full table state.

## Conclusion
The `HitEvent` currently over-transmits data in standard gameplay. Transitioning to an aim-only payload for the hit event would reduce network overhead without impacting the deterministic simulation, as the system already relies on deterministic physics for synchronized ball movement.
