# Plan: Record ScoreEvents While Preserving Replay Semantics

## Summary
Update the recorder to store `ScoreEvent` entries and ensure replay extraction (last shot and break) still targets the correct shot by skipping score entries when computing indices. Include ScoreEvents in replay sequences so score updates play during replays, while keeping break/last-shot link behavior correct.

## Public API / Interface Changes
- No new exported types or methods.
- Behavior changes in `Recorder`:
  - `record()` will include `EventType.SCORE`.
  - `last()` and `lastShot()` will ignore `SCORE` when choosing the “last shot”.
  - `breakLink()` / `currentBreak()`-derived sequences will handle trailing `SCORE` events to preserve include/exclude-last-shot behavior.

## Implementation Details (Recorder-Only)
1. Record ScoreEvents
- In `record()`, add `EventType.SCORE` to the list of recordable types.
- Keep `state` as `table.shortSerialise()` (consistent with other events).
- `pots`, `isPartOfBreak`, `time` remain as today (score entries will have `pots = 0`, etc.).

2. Centralize “last shot” indexing
- Add a small helper inside `Recorder` (private or local method) to find the last index that is not in a skip list.
- Use skip list `[EventType.RERACK, EventType.SCORE]` for “last shot” identification.
- Update `last()` to use this helper.

3. Include ScoreEvents in last-shot replay while skipping them for indexing
- Update `lastShot()` to:
  - Find the last non-skip entry index.
  - Build the replay event list as:
    - The last shot event.
    - Plus any trailing `ScoreEvent`s that occur after it (ignore trailing `RERACK`).
  - `ReplayEncoder.createState(entry.state, events)` with the new list.

4. Break replay extraction that respects include/exclude-last-shot
- Keep `currentBreak()` to return the full slice (including score events).
- In `breakLink(includeLastShot)`:
  - If `includeLastShot` is `false`, create a trimmed break copy:
    - Remove trailing `SCORE` and `RERACK` events so the last element is a real shot.
    - Let `LinkFormatter.breakLink()` pop the last shot as it already does.
  - If `includeLastShot` is `true`, pass through the full break slice (including score events).

## Test Cases / Scenarios (Manual)
1. ScoreEvent recorded
- Trigger a score update (via normal gameplay).
- Confirm `Recorder.entries` includes a `SCORE` event in chronological order.

2. Last-shot replay correctness
- Ensure last entry is a `SCORE` event.
- `lastShot()` should still replay the correct last shot and include its trailing `SCORE` events.

3. Break replay with includeLastShot = false
- Ensure break link excludes the final shot and its trailing score updates.
- Verify replay length and behavior match expectations.

4. Break replay with includeLastShot = true
- Ensure break replay includes all shots and associated score updates in sequence.

## Assumptions / Defaults
- ScoreEvents occur after the shot they correspond to.
- It is acceptable for whole-game replays to include ScoreEvents (even if link text “shot count” may count them; LinkFormatter change is out of scope per the constraint).
- Only `src/events/recorder.ts` will be edited.
