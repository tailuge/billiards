# Scoreboard API Usage Guide

This guide describes how to integrate with the Scoreboard API hosted at `https://scoreboard-tailuge.vercel.app/`.

## Base URL
`https://scoreboard-tailuge.vercel.app`

## CORS Policy
The API supports Cross-Origin Resource Sharing (CORS) for:
- `https://tailuge.github.io`

Ensure your requests include the appropriate headers if calling from a browser.

---

## 1. Post Match Result
Submit a new match result, optionally including replay data.

**Endpoint:** `POST /api/match-results`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `winner` | string | Yes | Name/ID of the winner. |
| `winnerScore` | number | Yes | Final score of the winner. |
| `loser` | string | No | Name/ID of the loser (omit for solo games). |
| `loserScore` | number | No | Final score of the loser. |
| `gameType` | string | No | Type of game (e.g., `nineball`, `snooker`). Defaults to `nineball`. |
| `replayData` | string | No | A string blob containing the game replay. |

**Example Request:**
```javascript
const response = await fetch('https://scoreboard-tailuge.vercel.app/api/match-results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    winner: 'Player1',
    winnerScore: 10,
    loser: 'Player2',
    loserScore: 5,
    gameType: 'nineball',
    replayData: 'VlJ...compressed_replay_blob...'
  })
});

const result = await response.json();
console.log('Match ID:', result.id);
```

---

## 2. Get Match History
Retrieve a list of the most recent matches. The history is rolling and limited to the last 50 matches.

**Endpoint:** `GET /api/match-results`

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `gameType` | string | - | Filter results by game type. |
| `limit` | number | 50 | Number of results to return. |

**Example Response:**
```json
[
  {
    "id": "abc-123",
    "winner": "Player1",
    "loser": "Player2",
    "winnerScore": 10,
    "loserScore": 5,
    "gameType": "nineball",
    "timestamp": 1700000000000,
    "hasReplay": true
  }
]
```
*Note: The `hasReplay` flag indicates if a replay blob is available for retrieval.*

---

## 3. Retrieve Game Replay
Fetch the replay blob for a specific match. Replay data is stored separately to keep the history list lightweight.

**Endpoint:** `GET /api/match-replay`

**Query Parameters:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | string | Yes | The `id` of the match returned by the history API. |

**Example Request:**
```javascript
const matchId = 'abc-123';
const response = await fetch(`https://scoreboard-tailuge.vercel.app/api/match-replay?id=${matchId}`);

if (response.ok) {
  const replayBlob = await response.text();
  // Process the replay data...
} else if (response.status === 404) {
  console.error('Replay not found');
}
```

---

## Error Codes
- `400 Bad Request`: Missing required fields or invalid parameters.
- `404 Not Found`: Replay data not found for the provided ID.
- `405 Method Not Allowed`: Incorrect HTTP method used.
- `500 Internal Server Error`: Server-side issue.

## Implementation Plan: Add Replay Data to Match Result

This plan outlines the steps to include compressed game replay data in the match result upload. This allows for game replays to be stored and retrieved alongside match history.

### Goal
Include a compressed JSON representation of the entire game (`replayData`) in the `POST /api/match-results` payload.

### Files to Modify
1.  `src/network/client/matchresult.ts`
2.  `src/controller/rules/nineball.ts`
3.  `src/controller/rules/snooker.ts`
4.  `src/controller/rules/threecushion.ts`
5.  `src/controller/rules/fourteenone.ts`
6.  `src/network/client/scorereporter.ts` (Review only, no functional changes expected if interface is updated)

### Step-by-Step Implementation

#### 1. Update MatchResult Interface
**File:** `src/network/client/matchresult.ts`
- Add an optional `replayData` field to the `MatchResult` interface.
```typescript
export interface MatchResult {
  // ... existing fields
  replayData?: string;
}
```

#### 2. Generate and Attach Replay Data
**Files:** `src/controller/rules/*.ts` (e.g., `nineball.ts`, `snooker.ts`, etc.)
- In the `handleGameEnd` method (or equivalent where `MatchResult` is constructed):
    1.  Import `ReplayEncoder` from `../../utils/replay-encoder`.
    2.  Retrieve the full game state using `this.container.recorder.wholeGame()`.
    3.  Convert the state object to a JSON string.
    4.  Compress the JSON string using `ReplayEncoder.crush()`.
    5.  Assign the compressed string to `result.replayData`.

**Example Implementation (inside `handleGameEnd`):**
```typescript
import { ReplayEncoder } from "../../utils/replay-encoder";

// ... inside handleGameEnd
const result: MatchResult = {
  winner: ...,
  winnerScore: ...,
  gameType: ...,
  // ...
};

try {
  const gameState = this.container.recorder.wholeGame();
  const jsonState = JSON.stringify(gameState);
  result.replayData = ReplayEncoder.crush(jsonState);
} catch (e) {
  console.error("Failed to encode replay data", e);
}

return new End(this.container, isWinner ? result : undefined);
```

#### 3. Verify ScoreReporter
**File:** `src/network/client/scorereporter.ts`
- The `submitMatchResult` method typically uses `JSON.stringify(result)`.
- Verify that `replayData` is correctly included in the payload when `JSON.stringify` is called on the `MatchResult` object.
- No changes should be needed if it simply serializes the passed object, but ensure no manual property picking is happening that would exclude the new field.


