# Important information.

This nineball game is hosted on a domain independant from the score tracking system. That system is hosted at https://scoreboard-tailuge.vercel.app/ . As such I would expect a class to handle the upload.

# Nine-ball Game Outcome Reporting Plan

This document outlines a plan to report the outcome of a two-player nine-ball game to a backend service. This plan is based on the information provided in `SCORES.md` and the current codebase.

## 1. Objective

The goal is to send a `MatchResult` object to the `/api/match-results` endpoint when a two-player nine-ball game concludes.

## 2. Identified Files and Code Context

The following files are relevant to implementing this functionality:

*   **`src/controller/rules/nineball.ts`**: This file contains the game logic for nine-ball, including the `isEndOfGame` method that detects the end of a game. The `update` method transitions the controller to the `End` state.
*   **`src/controller/end.ts`**: This is the controller for the end-of-game state. It is the ideal place to trigger the score reporting logic.
*   **`src/container/container.ts`**: The main container for the application, which holds the game state, player information (`id`, `isSinglePlayer`), and the `MessageRelay` instance for network communication.
*   **`SCORES.md`**: The document that specifies the API for submitting match results.

## 3. Proposed Implementation Steps

### Step 1: Define the `MatchResult` Type

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


### Step 3: Trigger Score Reporting from the `End` Controller

The `End` controller will be modified to trigger the score reporting when a game ends.

**`src/controller/end.ts`**
In the `onFirst` method of the `End` controller, we will check if the game is a two-player game. If so, we will construct the `MatchResult` object and call the `submitMatchResult` method on the `relay`.

```typescript
// src/controller/end.ts
import { MatchResult } from "../model/matchresult";
// ... other imports

export class End extends Controller {
  // ... existing methods

  override onFirst(): void {
    if (!this.container.isSinglePlayer) {
      this.reportScore();
    }
  }

  private reportScore(): void {
    // This is a simplified approach. The actual implementation will need to
    // correctly identify the winner, loser, and their scores.
    // The current implementation of nineball.ts does not seem to track scores
    // for two players in a way that maps directly to the MatchResult interface.
    // This will need further investigation.

    // For now, we assume the current player is the winner.
    const winnerId = this.container.id;
    // We need a way to get the opponent's ID.
    const loserId = "opponent_id_placeholder"; 

    const result: MatchResult = {
      winner: winnerId,
      loser: loserId,
      winnerScore: this.container.rules.score, // This is likely incorrect for 2 players
      loserScore: 0, // Placeholder
      gameType: 'nineball'
    };

    if (this.container.relay) {
      this.container.relay.submitMatchResult(result);
    }
  }
}
```

## 4. Open Questions and Assumptions

*   **Player Identification**: The plan assumes there is a way to identify both the winner and the loser in a two-player game. The `container.id` provides the current player's ID, but a mechanism to get the opponent's ID is needed.
*   **Score Tracking**: The `nineball.ts` rules file seems to track a single score. For a two-player game, the scoring logic needs to be clarified to provide `winnerScore` and `loserScore` as required by the `MatchResult` interface. The scores in `SCORES.md` (`9` and `7`) suggest a race-to-N format, which is not what is currently implemented in `nineball.ts`.

This plan provides a minimal approach to integrate the score reporting functionality. The open questions need to be addressed during implementation.

# Nine-ball 2-Player Game Outcome Reporting Plan

This document outlines a plan to report the outcome of a two-player nine-ball game to a backend service. This plan is based on the information provided in `SCORES.md`.

## 1. Objective

The goal is to send a `MatchResult` object to the `/api/match-results` endpoint when a two-player nine-ball game concludes.

## 2. Identified Files and Code Context

The following files are relevant to implementing this functionality:

*   **`src/controller/rules/nineball.ts`**: This file contains the game logic for nine-ball, including the `isEndOfGame` method that detects the end of a game. The `update` method transitions the controller to the `End` state.
*   **`src/controller/end.ts`**: This is the controller for the end-of-game state. It is the ideal place to trigger the score reporting logic.
*   **`src/container/container.ts`**: The main container for the application, which holds the game state, player information (`id`, `isSinglePlayer`), and the `MessageRelay` instance for network communication.
*   **`src/network/client/messagerelay.ts`**: The interface for network communication.
*   **`src/network/client/nchanmessagerelay.ts`**: The concrete implementation of the `MessageRelay` interface.
*   **`SCORES.md`**: The document that specifies the API for submitting match results.

## 3. Proposed Implementation Steps

### Step 1: Define the `MatchResult` Type

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

### Step 2: Enhance the `MessageRelay`

A new method will be added to the `MessageRelay` interface and its implementation to handle the submission of match results.

**`src/network/client/messagerelay.ts`**
```typescript
import { MatchResult } from "../../model/matchresult";

export interface MessageRelay {
  // ... existing methods
  submitMatchResult(result: MatchResult): Promise<void>;
}
```

**`src/network/client/nchanmessagerelay.ts`**
A new method `submitMatchResult` will be implemented. This method will send a `POST` request to the `/api/match-results` endpoint.

```typescript
// src/network/client/nchanmessagerelay.ts

// ... imports

export class NchanMessageRelay implements MessageRelay {
  // ... existing implementation

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

### Step 3: Trigger Score Reporting from the `End` Controller

The `End` controller will be modified to trigger the score reporting when a game ends.

**`src/controller/end.ts`**
In the `onFirst` method of the `End` controller, we will check if the game is a two-player game. If so, we will construct the `MatchResult` object and call the `submitMatchResult` method on the `relay`.

```typescript
// src/controller/end.ts
import { MatchResult } from "../model/matchresult";
// ... other imports

export class End extends Controller {
  // ... existing methods

  override onFirst(): void {
    if (!this.container.isSinglePlayer) {
      this.reportScore();
    }
  }

  private reportScore(): void {
    // This is a simplified approach. The actual implementation will need to
    // correctly identify the winner, loser, and their scores.
    // The current implementation of nineball.ts does not seem to track scores
    // for two players in a way that maps directly to the MatchResult interface.
    // This will need further investigation.

    // For now, we assume the current player is the winner.
    const winnerId = this.container.id;
    // We need a way to get the opponent's ID.
    const loserId = "opponent_id_placeholder"; 

    const result: MatchResult = {
      winner: winnerId,
      loser: loserId,
      winnerScore: this.container.rules.score, // This is likely incorrect for 2 players
      loserScore: 0, // Placeholder
      gameType: 'nineball'
    };

    if (this.container.relay) {
      this.container.relay.submitMatchResult(result);
    }
  }
}
```

## 4. Open Questions and Assumptions

*   **Player Identification**: The plan assumes there is a way to identify both the winner and the loser in a two-player game. The `container.id` provides the current player's ID, but a mechanism to get the opponent's ID is needed.
*   **Score Tracking**: The `nineball.ts` rules file seems to track a single score. For a two-player game, the scoring logic needs to be clarified to provide `winnerScore` and `loserScore` as required by the `MatchResult` interface. The scores in `SCORES.md` (`9` and `7`) suggest a race-to-N format, which is not what is currently implemented in `nineball.ts`.

This plan provides a minimal approach to integrate the score reporting functionality. The open questions need to be addressed during implementation.
