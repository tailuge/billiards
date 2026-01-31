
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

- [x] **Step 3: Trigger Score Reporting from the `End` Controller**
  The `End` controller will be modified to trigger score reporting when a game ends. To ensure clean state transitions, the `End` controller should be instantiated with the final game outcome.

  **`src/controller/end.ts`**
  ```typescript
  // src/controller/end.ts
  import { MatchResult } from "../model/matchresult";

  export class End extends Controller {
    private result?: MatchResult;

    constructor(container: Container, result?: MatchResult) {
      super(container);
      this.result = result;
    }

    override onFirst(): void {
      if (this.result && this.container.scoreReporter) {
        this.container.scoreReporter.submitMatchResult(this.result);
      }
    }
  }
  ```
  The rule controllers (e.g., `NineBall`) will calculate the `MatchResult` upon detecting the end of the game and pass it when creating the `End` controller.

- [x] **Step 4: Enhance Game Event Protocol with Player Names**
  Modify the `GameEvent` protocol to include the `playername` alongside `clientId`. This allows for direct identification of players within game events.
    *   Added an optional `playername` property to the base `GameEvent` class in `src/events/gameevent.ts`.
    *   Updated `EventUtil` in `src/events/eventutil.ts` to handle serialization/deserialization of `playername`.
    *   Updated `BrowserContainer.broadcast` to set `playername` from the current session.
    *   Updated `Session` in `src/network/client/session.ts` to store `opponentName`.
    *   Updated `BrowserContainer.netEvent` to populate `Session.getInstance().opponentName` when receiving events from other clients.

## 4. Open Questions and Assumptions

*   **Player Identification**: The winner and loser can now be identified using `Session.getInstance().playername` and `Session.getInstance().opponentName`. The `opponentName` is automatically populated in the `Session` singleton as soon as any `GameEvent` is received from the other player via the network.

## 5. Architectural Considerations: End Controller vs. Rules

*   **Note on Centralization**: It is considered superior to implement the final `MatchResult` reporting within the `End` controller rather than inside individual rulesets (e.g., `nineball.ts`, `snooker.ts`). 
    *   **Pros**: Avoids code duplication across different game variants. The `End` controller acts as a universal "sink" for game completion logic.
    *   **Implementation**: The `End` controller can be updated with a constructor that accepts an optional "result state" (e.g., who won).
*   **Feasibility**: This is highly feasible. When a ruleset detects `isEndOfGame()`, it transitions to the `End` state. Passing the winner/loser context during this transition ensures the `End` controller has everything it needs to trigger `scoreReporter.submitMatchResult()`.
*   **Future Proofing**: All gametypes (Nine-ball, Snooker, Three-cushion) will eventually send game results. Using the `End` controller ensures a consistent reporting mechanism regardless of the specific ruleset being played.

## 6. Relevant URL Query Parameters


The following URL query parameters are used to configure the game's behavior and features:

*   **`name`**: Player's name. Defaults to an empty string if not provided.
*   **`tableId`**: Identifier for the game table (multiplayer sessions). Defaults to "default".
*   **`clientId`**: Identifier for the client. Defaults to "default".
*   **`state`**: Used for replay functionality.
*   **`ruletype`**: Determines the game rules (e.g., "nineball", "snooker", "threecushion"). Defaults to "nineball".
*   **`websocketserver`**: Its presence triggers 2-player (multiplayer) mode and specifies the WebSocket server address.
*   **`cushionModel`**: Determines the cushion physics model used.
*   **`spectator`**: Its presence (e.g., `?spectator`) indicates the user is in spectator mode.
*   **`first`**: Its presence (e.g., `?first`) is used in multiplayer initiation logic (e.g., `if (!this.first && !this.spectator)`).