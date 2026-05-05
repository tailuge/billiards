# Rematch Flow Documentation

This document describes how the rematch functionality is implemented using query parameters to maintain state between the game and the lobby.

## Overview

The rematch flow allows players to play multiple games against each other, maintaining a running match score and game options. This state is passed between the billiards game and the external lobby via URL query parameters.

## Interface: `RematchInfo`

The core state is encapsulated in the `RematchInfo` interface:

```typescript
interface RematchInfo {
  opponentId: string;    // Client ID of the opponent
  opponentName: string;  // Name of the opponent
  ruleType: string;      // The game rule (e.g., "nineball", "snooker")
  lastScores: {
    userId: string;
    score: number;
  }[];                   // Running total of games won by each player
  nextTurnId: string;    // The ID of the player who should break next
  options?: Record<string, string>; // Additional game options (e.g., "raceTo", "reds")
}
```

## Query Parameters

When redirecting to the lobby or initializing a game, the following query parameters are used:

- **`rematch`**: A JSON-encoded string representing the `RematchInfo` object.
- **`userId`**: The current player's unique client ID.
- **`userName`**: The current player's display name.
- **`raceTo`**: (Optional) For Three-Cushion billiards, the number of points to win the match.
- **`reds`**: (Optional) For Snooker, the number of red balls on the table.

## The Rematch Process

### 1. Game Completion
When a game ends, `MatchResultHelper.presentGameEnd` is called. It updates the `rematchInfo` in the current `Session`:
- If no `rematchInfo` exists, a new one is created, initializing the scores.
- If it already exists, the winner's score is incremented.
- The `nextTurnId` is set to the loser of the current game.

### 2. User Action
A "Rematch" button is displayed in the game-over notification. Clicking this button triggers `Rematch.navigate(session)`.

### 3. Redirection to Lobby
The game redirects the browser to the lobby URL (defined by `LOBBY_URL` in `src/utils/gameover.ts`) with the following parameters:
```
https://scoreboard-tailuge.vercel.app/game?userId=<myId>&userName=<myName>&rematch=<encodedRematchInfo>
```

### 4. New Game Initialization
When the lobby redirects back to the game (e.g., `dist/index.html`), it includes the `rematch` parameter in the URL.

The `BrowserContainer` initializes the `Session` and reads the `rematch` info:
- `Rematch.fromURL(params)` parses the `rematch` query parameter.
- If present, a "Match Score" notification is displayed to the players at the start of the new game.
- The game uses the `nextTurnId` to determine who breaks.

## Example

An encoded `rematch` parameter might look like this (decoded for readability):

```json
{
  "opponentId": "G_12345",
  "opponentName": "Alice",
  "ruleType": "nineball",
  "lastScores": [
    { "userId": "G_67890", "score": 1 },
    { "userId": "G_12345", "score": 0 }
  ],
  "nextTurnId": "G_12345",
  "options": {}
}
```

Full URL example:
```
https://tailuge.github.io/billiards/dist/index.html?userId=G_67890&userName=Bob&rematch=%7B%22opponentId%22%3A%22G_12345%22%2C...%7D
```
