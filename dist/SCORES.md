# Match Results API Documentation (`/api/match-results`)

This API allows external teams and integrations to retrieve recent match history and submit new match results to the Scoreboard system.

## Base URL
`/api`

## Endpoints

### 1. Get Match History
Retrieves the most recent match results, sorted by completion time (newest first).

- **Endpoint:** `/match-results`
- **Method:** `GET`
- **Response Format:** JSON Array of `MatchResult` objects

**Example Response:**
```json
[
  {
    "id": "12345",
    "winner": "Alice",
    "loser": "Bob",
    "winnerScore": 9,
    "loserScore": 7,
    "gameType": "nineball",
    "timestamp": 1706284800000
  }
]
```

### 2. Submit Match Result
Records a completed match.

- **Endpoint:** `/match-results`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `winner` | string | Yes | Name of the winning player |
| `loser` | string | Yes | Name of the losing player |
| `winnerScore` | number | Yes | Score of the winner |
| `loserScore` | number | Yes | Score of the loser |
| `gameType` | string | No | Type of game (e.g., "nineball", "snooker"). Defaults to "nineball" if omitted. |

**Example Request:**
```bash
curl -X POST https://your-domain.com/api/match-results \
  -H "Content-Type: application/json" \
  -d 
  {
    "winner": "Alice",
    "loser": "Bob",
    "winnerScore": 9,
    "loserScore": 7,
    "gameType": "nineball"
  }
```

**Success Response (201 Created):**
Returns the created `MatchResult` object including the generated `id` and `timestamp`.

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data types.
- `500 Internal Server Error`: Server-side processing failure.

## Types

### MatchResult
```typescript
interface MatchResult {
  id: string;          // Unique identifier
  winner: string;      // Player name
  loser: string;       // Player name
  winnerScore: number; // Integer score
  loserScore: number;  // Integer score
  gameType: string;    // e.g., 'nineball', 'snooker', 'threecushion'
  timestamp: number;   // Unix timestamp (ms)
}
```
