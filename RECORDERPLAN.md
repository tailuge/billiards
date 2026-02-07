# Recorder Improvement Plan

## Analysis

The current `Recorder` implementation manages game history using two parallel arrays (`shots` and `states`). This structure has several drawbacks:

1.  **Brittleness**: Maintaining two independent arrays requires careful synchronization. Any mismatch in pushes or pops leads to corrupted replay data.
2.  **Metadata Loss**: Important information about each shot (like the number of balls potted) is processed during `updateBreak` but is not stored in the `Recorder`'s state. It is only used to generate temporary UI links.
3.  **Limited History Navigation**: Tracking only the `breakStart` index for the current break makes it difficult to retrieve or analyze previous breaks or specific segments of the game.
4.  **Implicit Logic**: Methods like `last()` rely on hardcoded event type checks (e.g., skipping `RERACK`) which are scattered and non-extensible.
5.  **Replay Preparation**: Preparing a "state" for the `ReplayEncoder` requires slicing and indexing across multiple arrays, which is more complex than necessary.

## Proposed Design

### 1. Unified Entry Structure
Replace the separate arrays with a single array of `RecordEntry` objects.

```typescript
interface RecordEntry {
  state: number[];      // Table state (short serialise) BEFORE the event
  event: GameEvent;     // The event itself (or the Aim component of a HIT)
  pots: number;         // Number of balls potted in this shot (updated post-shot)
  isPartOfBreak: boolean; // Whether this shot was part of a scoring break
  time: number;         // Timestamp of the event
}
```

### 2. Simplified Storage
The `Recorder` will hold:
- `entries: RecordEntry[]`
- `gameStartTime: number`
- `currentBreakStart: number | undefined`

### 3. Refactored Methods

#### `record(event: GameEvent)`
- Captures the current `table.shortSerialise()`.
- If the event is a `HIT`, it extracts the `AimEvent` (consistent with current behavior for replays).
- Creates a new `RecordEntry` with default `pots: 0` and `isPartOfBreak: false`.
- Pushes the entry to `entries`.

#### `updateBreak(outcome, isPartOfBreak, ...)`
- Identifies the last "shot" entry (usually the last entry in the array).
- Updates its `pots` count using `Outcome.potCount(outcome)`.
- Updates its `isPartOfBreak` status.
- Manages `currentBreakStart` index as before, but pointing into the unified array.

#### `getEntries(n: number, filter?: EventType[])`
- A new utility to step back through `entries`.
- Can be used to retrieve the last `n` shots, skipping irrelevant events like `RERACK` or `SCORE` if requested.

#### `lastShot()` / `currentBreak()` / `wholeGame()`
- These will remain in the public interface to maintain compatibility.
- Implementation will change to derive data from the `entries` array.
- `currentBreak()` will use `entries.slice(currentBreakStart)` and `entries[currentBreakStart].state`.

## Advantages
- **Robustness**: One array means no synchronization issues.
- **Rich History**: Storing `pots` and `isPartOfBreak` per entry allows for queries like "find the last break of at least 3 pots" by scanning the history.
- **Flexibility**: "Stepping back" for N items becomes a simple array operation or a filtered scan.
- **Maintainability**: The logic for what constitutes a "shot" or "break" is centralized.

## Constraints Adherence
- **Interface**: No changes to the existing public method signatures.
- **Code**: No modifications to `recorder.ts` or other files will be made during this planning phase.
- **Scope**: Focuses strictly on the internal data structure and historical querying capability.
