# Speedrun Leaderboard API

Base URL: `https://scoreboard-tailuge.vercel.app`

## Endpoints

### `GET /api/speedrun-results`

Returns all leaderboard entries across all positions.

**Response** `200`:

```json
[
  {
    "id": "abc123",
    "playerName": "Alice",
    "timeSec": 12.45,
    "ruleType": "nineball",
    "date": "2026-07-04T12:00:00Z",
    "positionId": "nineball-break"
  }
]
```

### `POST /api/speedrun-results`

Submit a new speedrun result. Only the fastest 3 distinct times per position are kept.

**Request** (JSON):

```json
{
  "positionId": "nineball-break",
  "playerName": "Alice",
  "timeSec": 12.45,
  "ruleType": "nineball",
  "state": "<replay data string>"
}
```

**Response** `201` — the updated entries for that position (top 3):

```json
[
  {
    "id": "abc123",
    "playerName": "Alice",
    "timeSec": 12.45,
    "ruleType": "nineball",
    "date": "2026-07-04T12:00:00Z"
  }
]
```

### `GET /api/speedrun-results/{id}`

Get the replay for a specific result. Redirects to the game viewer with the replay state loaded.

**Response** `307` — redirects to `https://billiards.tailuge.workers.dev/?ruletype=...&state=...`

**Errors**: `404` if the id is not found or its replay state is missing.

## Notes

- `timeSec` is in seconds (float).
- `state` is the game replay data string — stored separately from the leaderboard; never included in `GET` responses.
- Ties: entries with identical `timeSec` are all kept (may result in >3 entries per position).
- Only `GET /api/speedrun-results` is CDN-cached (30s). Other endpoints are not cached.
