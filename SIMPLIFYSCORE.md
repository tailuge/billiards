# Simplified Score HUD Refactor Plan

The objective is to improve the Snooker HUD and scoring logic without introducing global side effects that break other game rules (like NineBall).

## Core Requirements
- HUD must show both total score and current break.
- Remove `updateBreak` calls that only show break from `snooker.ts` instead use a call that shows score and break.
- Ensure local score updates are reflected immediately and do so by calling update hud locally and then sending score notification. A helper function that can be used by all rules to update local and send score notification.
 
Work step by step running tests frequently to check changes are working.

` for network syncing/recording.
    - **CRITICAL**: Do NOT modify `Container.sendEvent` to push to the local queue automatically, as this breaks logic that expects events to be processed exactly once or in a specific order. 
    - This code change should not affect the way events are recorded or played back.


## Verification
1. Run `yarn test` to ensure no regressions in `NineBall` or `Snooker`.
2. Verify Replays:
    - Scores are recorded and played back correctly.

