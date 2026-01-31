# Important information.

This nineball game is hosted on a domain independant from the score tracking system. That system is hosted at https://scoreboard-tailuge.vercel.app/ .

# Nine-ball Game Outcome Reporting Plan

This document outlines a plan to report the outcome of a game to a backend service. This plan is based on the information provided in `SCORES.md` and the current codebase.

## 1. Objective

The goal is to send a `MatchResult` object to the `/api/match-results` endpoint when a game concludes.

## 2. Identified Files and Code Context

The following files are relevant to implementing this functionality:

*   **`src/controller/rules/nineball.ts`**: Contains game logic, including `isEndOfGame` to detect game end, and is one of the files where the "game over" message is currently generated.
*   **`src/controller/end.ts`**: The controller for the end-of-game state. This is where score reporting should be triggered from.
*   **`src/container/container.ts`**: The main application container, holding game state and player information.
*   **`SCORES.md`**: Specifies the API for submitting match results.

## 3. Proposed Implementation Steps

- [x] **Step 1: Define the `MatchResult` Type**
  Create a new file `src/model/matchresult.ts` to define the `MatchResult` interface as described in `SCORES.md`.

  ```typescript
  // src/model/matchresult.ts
  export interface MatchResult {
    id?: string;
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
    gameType: 'nineball' | 'snooker' | 'threecushion';
    timestamp?: number;
  }
  ```

- [x] **Step 2: Create a Score Reporting Service**
  To keep concerns separate, a new score reporting service will be created. This service will be responsible for communicating with the external scoreboard service. This is preferable to adding this functionality to the `MessageRelay`, which is responsible for real-time game event communication.

  A new file `src/network/client/scorereporter.ts` will be created:

  ```typescript
  // src/network/client/scorereporter.ts
  import { MatchResult } from "../../model/matchresult";

  export class ScoreReporter {
    private baseURL: string;

    constructor(baseURL: string) {
      this.baseURL = baseURL;
    }

    async submitMatchResult(result: MatchResult): Promise<void> {
      const url = `https://${this.baseURL}/api/match-results`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });
        if (!response.ok) {
          console.error("Failed to submit match result:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting match result:", error);
      }
    }
  }
  ```
  The `Container` will be responsible for instantiating the `ScoreReporter`.

- [ ] **Step 3: Trigger Score Reporting from the `End` Controller**
  The `End` controller will be modified to trigger score reporting when a game ends. A new method, `handleGameOver`, will be introduced to encapsulate the logic.

  **`src/controller/end.ts`**
  ```typescript
  // src/controller/end.ts
  import { MatchResult } from "../model/matchresult";
  // ... other imports

  export class End extends Controller {
    // ... existing methods

    override onFirst(): void {
      this.handleGameOver();
    }

    private handleGameOver(): void {
      // In the future, this method can be extended to handle single player game overs.
      if (this.container.isSinglePlayer) {
          // Future: Handle single player game over reporting if needed.
          return;
      }

      // This is a simplified approach. The actual implementation will need to
      // correctly identify the winner, loser, and their scores.
      const winnerId = this.container.id;
      const loserId = "opponent_id_placeholder"; 

      const result: MatchResult = {
        winner: winnerId,
        loser: loserId,
        winnerScore: this.container.rules.score, // This is likely incorrect for 2 players
        loserScore: 0, // Placeholder
        gameType: 'nineball'
      };

      // The score reporter would be on the container
      if (this.container.scoreReporter) {
        this.container.scoreReporter.submitMatchResult(result);
      }
    }
  }
  ```

## 4. Open Questions and Assumptions

*   **Player Identification**: The plan assumes there is a way to identify both the winner and the loser in a two-player game. The `container.id` provides the current player's ID, but a mechanism to get the opponent's ID is needed.
*   **Score Tracking**: The `nineball.ts` rules file seems to track a single score. For a two-player game, the scoring logic needs to be clarified to provide `winnerScore` and `loserScore` as required by the `MatchResult` interface. The scores in `SCORES.md` (`9` and `7`) suggest a race-to-N format, which is not what is currently implemented in `nineball.ts`.

This plan provides a more robust and extensible approach to integrate the score reporting functionality.