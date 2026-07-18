# Innings and Scoring Average Tracking in Three-Cushion & Sagu

This document outlines design plans and architectural alternatives for tracking innings in Three-Cushion (`threecushion`) and Sagu (`sagu`) rule types, with the goal of calculating and presenting the scoring average per player in the game-over results notification.

---

## 1. Rules & Definitions

In carom cue sports, player performance is historically quantified by their **scoring average** (the number of successful points divided by the number of innings played).

### 1.1 Multiplayer / Bot Mode
* **Turn**: A sequence of one or more shots played by a single player during their visit to the table. A player's turn continues as long as they make successful, legal scoring shots. It ends immediately when they commit a foul or fail to score.
* **Inning**: A complete cycle where both players have had an opportunity to complete a turn.
  * Specifically, the completion of Player 2's turn (or a match-ending shot by either player) concludes the inning.
  * *Standard Billiard Rule*: If Player 1 wins the game on their turn in the top of the $N$-th inning, Player 1 has played $N$ innings while Player 2 has played $N-1$ innings. If Player 2 wins in the bottom of the $N$-th inning, both players have played $N$ innings.
* **Scoring Average**: Calculated individually for each player at the end of the game:
  $$\text{Average} = \frac{\text{Total Points Scored}}{\text{Innings Taken}}$$

### 1.2 Single Player Mode
* In Single Player practice mode, there is only one human player. However, to simulate standard carom play, the player alternates cue balls (switching between White and Yellow) upon missing.
* **Inning**: In Single Player mode, an inning corresponds to the rotation of cue balls. Switching from the White cue ball (`balls[0]`) to the Yellow cue ball (`balls[1]`) and back to the White cue ball completes 1 inning.
* **Virtual Players**: The simulation can treat the two cue balls as two distinct virtual players:
  * **White Cue Ball**: Represents "Player" (or Cue Ball A).
  * **Yellow Cue Ball**: Represents "Virtual Opponent" (or Cue Ball B).
* **Scoring Average**: Calculated separately for each cue ball:
  $$\text{Average}_{\text{white}} = \frac{\text{Points Scored with White}}{\text{Innings taken by White}}$$
  $$\text{Average}_{\text{yellow}} = \frac{\text{Points Scored with Yellow}}{\text{Innings taken by Yellow}}$$

---

## 2. Option 1: Live State Tracking (Active Stateful Approach)

Under this approach, we actively maintain mutable counters in the game state during play.

### 2.1 Where State Lives
The inning counters and starting player identifiers can be stored in the `Session` singleton (`src/network/client/session.ts`) to ensure easy access from both the rule controllers and the notification helpers.

```typescript
// Proposed fields to add to Session class:
public inningsByClientId: Record<string, number> = {}
public startingClientId?: string
```

### 2.2 Updating the State
The rules classes (`ThreeCushion` and `Sagu`) manage turn transitions in `advanceState` and `update`. We can increment the counters at these transition points:

1. **Game Initialization**:
   * Store the `clientId` of the starting player (whoever takes the break shot) as `startingClientId` in `Session`. Initialize the inning count for both players to `0` (or `1` for the active player).

2. **Turn Transitions** (inside `advanceState` in `threecushion.ts`/`sagu.ts`):
   * When a shot is unsuccessful, `advanceState()` switches the active cue ball. At this exact point, we increment the inning count for the player who is about to take their turn.
   ```typescript
   advanceState(outcomes: Outcome[]): void {
     if (!this.isSuccessfulShot(outcomes)) {
       this.cueball = this.otherPlayersCueBall()

       // Stateful inning update:
       const session = Session.getInstance()
       const nextPlayerId = this.getActivePlayerClientId()
       session.inningsByClientId[nextPlayerId] = (session.inningsByClientId[nextPlayerId] || 0) + 1
     }
   }
   ```
   * *Single Player Mode*: Map the white and yellow cue ball indices to virtual client IDs (e.g., `"white"` and `"yellow"`) and increment their respective counters when switching cue balls.

### 2.3 Network & Bot Synchronization
Since multiplayer matches sync table state and score events over the network, keeping mutable counters in sync requires care:
* **Option 1A (Local Computation)**: Both clients execute the same deterministic rules engine. If both clients process the turn transitions identically, their local `inningsByClientId` will naturally stay in perfect sync without additional network overhead.
* **Option 1B (Network Sync Payload)**: Include the current inning count in the score event payload. For example, extend `ScoreEvent` or update network messages to carry player innings, preventing any drift in laggy network conditions.

---

## 3. Option 2: Post-Processing via Recorder (Stateless Approach)

Instead of maintaining active mutable state throughout the match, we can reconstruct the turn history retroactively by analyzing the chronological sequence of shots stored in `Recorder` (`src/events/recorder.ts`).

### 3.1 Mechanics of the Recorder
The `Recorder` automatically appends every shot to its `entries: RecordEntry[]` array. For each shot, we can query:
1. `entry.event.i`: The cue ball index used for the shot (`0` for White, `1` for Yellow).
2. `entry.isPartOfBreak`: A boolean indicating whether the shot was successful (`true` for scoring, `false` for a miss or foul).

### 3.2 The Turn Reconstruction Algorithm
By iterating through `recorder.entries`, we can perfectly group shots into turns and count the innings.

#### Logic Rules:
* A new turn for a cue ball begins on the very first shot of the game, or whenever the cue ball index `i` changes from the previous shot in the sequence.
* For each unique turn started by a cue ball/player, we increment their individual inning count.

#### Proposed Algorithm Implementation:
```typescript
interface InningStats {
  whiteInnings: number
  yellowInnings: number
  whiteScore: number
  yellowScore: number
}

function calculateInningsFromRecorder(entries: RecordEntry[]): InningStats {
  let whiteInnings = 0
  let yellowInnings = 0
  let whiteScore = 0
  let yellowScore = 0

  let previousCueBallIndex: number | null = null

  for (const entry of entries) {
    if (entry.event.type !== EventType.AIM) {
      continue // Only evaluate shots (represented as Aim events in Hit records)
    }

    const currentCueBallIndex = (entry.event as any).i ?? 0

    // Detect a turn transition / first shot of a turn
    if (currentCueBallIndex !== previousCueBallIndex) {
      if (currentCueBallIndex === 0) {
        whiteInnings++
      } else {
        yellowInnings++
      }
      previousCueBallIndex = currentCueBallIndex
    }

    // Tabulate successful points scored on this shot
    if (entry.isPartOfBreak) {
      if (currentCueBallIndex === 0) {
        whiteScore++
      } else {
        yellowScore++
      }
    }
  }

  return { whiteInnings, yellowInnings, whiteScore, yellowScore }
}
```

### 3.3 Mapping to Multiplayer/Bot Identities
In multiplayer or bot games:
* `i === 0` (White) corresponds to the starting player (Player 1).
* `i === 1` (Yellow) corresponds to the second player (Player 2).
At the end of the game, we can map `whiteInnings` to Player 1's name and `yellowInnings` to Player 2's name.

---

## 4. Comparison of Alternatives

| Criteria | Option 1: Live State Tracking (Active) | Option 2: Post-Processing via Recorder (Stateless) |
| :--- | :--- | :--- |
| **State Complexity** | Adds new mutable properties to `Session` that must be carefully managed, initialized, and reset. | Completely stateless. No risk of stale/unreset variables between game restarts. |
| **Robustness** | Risk of state drift in multiplayer if network updates or packet drops disrupt local rules execution. | High robustness. The replay and history entries are already synced and verified; reconstruction is 100% deterministic. |
| **Implementation Scope** | Modifies `Session`, `ThreeCushion`, `Sagu`, and possibly network packet models. | Modifies only the calculation/notification presenting logic at game-over. |
| **UI Flexibility** | Easily supports rendering a live "Innings: X" counter on the active gameplay HUD. | Primarily suited for end-of-game statistics (though can be evaluated on-the-fly if needed). |
| **Testing** | Requires mocking multiple states and turn-transitions to test. | Easily testable by feeding mock `RecordEntry` arrays to a pure utility function. |

### Recommendation
**Option 2 (Post-Processing via Recorder)** is highly recommended. It maintains the codebase's functional and stateless architecture, leverages the existing robust recording structure without introducing mutable state, and avoids network synchronization complexities altogether.

---

## 5. UI Integration & Notification Display

Once the innings and averages are computed (via either Option 1 or Option 2), they can be beautifully presented to the user on the game-over screen.

### 5.1 Presentation Logic
In `MatchResultHelper.presentGameEnd` (located in `src/network/client/matchresult.ts`), the subtext for the `GameOver` notification is prepared.

We can extend `getScoreSubtext` to format the innings and averages:

```typescript
private static getScoreSubtext(container: Container, stats: InningStats): string {
  if (container.isSinglePlayer) {
    const p1Avg = stats.whiteInnings > 0 ? (stats.whiteScore / stats.whiteInnings).toFixed(2) : "0.00"
    const p2Avg = stats.yellowInnings > 0 ? (stats.yellowScore / stats.yellowInnings).toFixed(2) : "0.00"

    return `White: ${stats.whiteScore} (Avg: ${p1Avg} over ${stats.whiteInnings} inn)\n` +
           `Yellow: ${stats.yellowScore} (Avg: ${p2Avg} over ${stats.yellowInnings} inn)`
  }

  const { p1, p2 } = Session.getInstance().orderedScoresForHud()
  const p1Name = Session.getInstance().playerIndex === 0 ? "You" : (Session.getInstance().opponentName || "Opponent")
  const p2Name = Session.getInstance().playerIndex === 1 ? "You" : (Session.getInstance().opponentName || "Opponent")

  const p1Innings = Session.getInstance().playerIndex === 0 ? stats.whiteInnings : stats.yellowInnings
  const p2Innings = Session.getInstance().playerIndex === 1 ? stats.whiteInnings : stats.yellowInnings

  const p1Avg = p1Innings > 0 ? (p1 / p1Innings).toFixed(2) : "0.00"
  const p2Avg = p2Innings > 0 ? (p2 / p2Innings).toFixed(2) : "0.00"

  return `${p1Name}: ${p1} (Avg: ${p1Avg} / ${p1Innings} inn)\n` +
         `${p2Name}: ${p2} (Avg: ${p2Avg} / ${p2Innings} inn)`
}
```

### 5.2 Result Notification Mockup

When the match ends, the `GameOver` notification overlay will look like this:

#### Multiplayer Mockup
```
==================================
            🏆 YOU WON
==================================
           Score: 15 - 12

  You: 15 (Avg: 0.75 over 20 innings)
  Opponent: 12 (Avg: 0.63 over 19 innings)
==================================
```

#### Single Player Mockup
```
==================================
           GAME OVER
==================================
  White Ball: 10 (Avg: 1.25 over 8 innings)
  Yellow Ball: 8 (Avg: 1.00 over 8 innings)
==================================
```
