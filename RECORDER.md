# Recorder.ts Refactoring Review

## Current Responsibilities (Complexity Analysis)
The `Recorder` class is currently doing too many things, which violates the Single Responsibility Principle:
1.  **State Tracking:** Maintains arrays of `shots` (events) and `states` (table snapshots).
2.  **Logic & Rules Integration:** Interacts with `container.rules` to determine break starts, end of games, and scores.
3.  **URL Generation:** Constructs complex replay and high-score URLs.
4.  **String Processing:** Manages `JSONCrush` compression and custom URI encoding.
5.  **UI Interaction:** Pushes `ChatEvent`s to display links as "pills" in the chat.

## Proposed Refactoring & Improvements

### 1. Extract URL/Encoding Logic
The complex URI encoding and link generation should be moved to a helper or a dedicated class.
- **New Utility:** `src/utils/replay-encoder.ts`
- **Move:** `fullyEncodeURI`, `generateLink`, `generateHiScoreLink`, and `JSONCrush` logic.
- **Why:** This logic is purely about string manipulation and external integration, not recording.

### 2. Extract Link Formatting
The logic for creating the "pills" and determining the icons/colors of links should be moved.
- **New Class:** `src/view/link-formatter.ts`
- **Move:** `lastShotLink`, `breakLink`, `wholeGameLink`.
- **Why:** This is "View" logic. The recorder should just provide the data (the state object); how it's presented to the user should be elsewhere.

### 3. Decouple from Rules
The recorder shouldn't need to know about `isPartOfBreak` or `isEndOfGame` directly.
- **Improvement:** Pass the necessary boolean flags into `updateBreak` instead of the recorder polling the rules.
- **Why:** Makes the recorder easier to test in isolation and less dependent on specific game rule implementations.

### 4. Data Structure Improvement
The parallel `shots` and `states` arrays are brittle.
- **Improvement:** Consider a single `HistoryEntry` interface:
  ```typescript
  interface HistoryEntry {
    state: number[];
    event: GameEvent;
    timestamp: number;
  }
  ```
- **Constraint Check:** This is an internal change; as long as the `state()` method still returns the same JSON structure, the protocol is preserved.

## Preservation of Protocol
To ensure existing replays still work, the output of the following methods must remain IDENTICAL:
- `wholeGame()`
- `lastShot()`
- `currentBreak()`
- `state()` (The private helper that builds the JSON object)

The JSON structure (with keys `init`, `shots`, `start`, `now`, `score`, `wholeGame`, `v`) must not change.

## Logic Extraction Summary
- **Recording Engine:** Keep in `recorder.ts`. Focus on `record()` and `updateBreak()`.
- **Formatting Engine:** Extract to `ReplayLinkView`. Focus on icons (`⚈`, `⚆`), colors, and chat integration.
- **Serialisation Engine:** Extract to `ReplayProtocol`. Focus on `JSONCrush`, `fullyEncodeURI`, and the `state` object construction.
