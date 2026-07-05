# Speedrun Page & API Specification

Companion to `speedrun-spec.md` (game changes **✅ done**). Covers the `dist/speedrun/` landing page, iframe overlay with timer, and the REST API contract for rankings.

**Game → page communication**: The game sends `postMessage` on failure (from `PlayShot.handleStationary`) and on success (from `End.onFirst`). The page owns the timer. No timing code in the game.

---

## 1. Files

```
dist/speedrun/
  index.html    — Landing page ✅
  speedrun.js   — Module: SVG rendering, iframe overlay, timer, postMessage ✅
  speedrun.css  — Card layout, overlay, timer, close button styles ✅
```

No server-side code — this spec defines the contract that the existing scoreboard app (`scoreboard-tailuge.vercel.app`) will implement.

---

## 2. Page Layout

### 2.1 Overall structure ✅

Single scrolling page with:
- **Header bar**: Title "Speedrun Challenge", player name (from `?userName=` URL param, default `"Anon"`).
- **CSS grid** of position cards (auto-fill, min 320px).
- **Iframe overlay** (`#gameOverlay`) — hidden by default, covers the full screen when active. Includes a close button (✕).

### 2.2 Position card (compact)

Each card is a self-contained unit:

```
┌──────────────────────────┐
│  [SVG table preview]     │
│  Position Title          │
│  Description line        │
│  [▶ Play]                │
│  ── Rankings ──          │
│  #1 Alice   12.45s  ▶    │
│  #2 Bob     15.32s  ▶    │
│  #3 Carol   18.10s  ▶    │
└──────────────────────────┘
```

- **SVG preview**: A small billiards table SVG showing ball positions. Generated inline by `speedrun.js` using the same pattern as exam.html SVGs.
- **Play button**: Labeled "▶ Play". Clicking it opens the iframe overlay.
- **Rankings list**: Top **3** fastest times for this position. Each entry shows rank, player name, time (formatted as `ss.tenths`), and a **▶** button to open the replay.
- Cards sit in a 2-column flex grid (→ 1 column on narrow screens). The page shows ~4 cards at a time.

### 2.3 Overlay close behavior

The iframe overlay has a **close button (✕)** for manual dismissal. It also auto-closes on receiving a `speedrun-result` postMessage (after a 300ms delay so the user sees the timer stop).

---

## 3. Position Data (SVG Format)

### 3.1 Format

Each speedrun position is defined as an SVG element with `data-json-shots` attribute, matching the existing exam page pattern:

```html
<svg class="billiards-table"
     data-json-shots='[{
       "balls": [
         {"id": 0, "pos": {"x": 0.0, "y": -0.3, "z": 0}},
         {"id": 1, "pos": {"x": -0.86, "y": -0.24, "z": 0}},
         {"id": 2, "pos": {"x": -0.86, "y": 0.24, "z": 0}},
         {"id": 3, "pos": {"x": -0.86, "y": 0.0, "z": 0}},
         {"id": 4, "pos": {"x": 0.0, "y": 0.0, "z": 0}},
         {"id": 5, "pos": {"x": 0.72, "y": 0.0, "z": 0}},
         {"id": 6, "pos": {"x": 0.79, "y": 0.0, "z": 0}},
         {"id": 7, "pos": {"x": 0.85, "y": 0.03, "z": 0}},
         {"id": 8, "pos": {"x": 0.85, "y": -0.03, "z": 0}},
         {"id": 9, "pos": {"x": 0.91, "y": 0.0, "z": 0}}
       ],
       "ruleType": "nineball",
       "shot": {
         "cueBallId": 0,
         "angle": 0,
         "power": 0.5,
         "offset": {"x": 0, "y": 0},
         "elevation": 0
       }
     }]'
     data-position-id="nineball-break"
     data-label="Nineball Break"
     data-description="Standard nineball rack. Fastest break wins.">
```

### 3.2 Key attributes

| Attribute | Purpose |
|---|---|
| `data-json-shots` | Ball positions + ruleType + initial shot params. The `ruleType` field drives per-SVG table rendering and ball colors (extracted by `svg.js`). Also used to construct the iframe URL. |
| `h3.card-title` | Display name shown on the card. Also contributes to the content-hash position ID. |

**Position IDs are derived**, not explicit. `speedrun.js` hashes `data-json-shots` into a stable ID (e.g. `p2a3k9f`), cached on `card.id`. Same pattern as exam's `qIdForBlock()`. No `data-position-id` attribute needed.

### 3.3 SVG rendering

`speedrun.js` calls `initDiagrams()` from `../diagrams/svg.js` (same as exam pages). No argument needed — `svg.js` extracts `ruleType` from each SVG's `data-json-shots` and renders the correct table type + ball colors per card. Mixed ruleTypes (nineball + snooker) on one page work correctly.

For the iframe URL, the `init` param is extracted from `data-json-shots`, and **all original page query params are passed through** to the game:
```js
const config = JSON.parse(svg.dataset.jsonShots)[0]
const init = JSON.stringify(config.balls.flatMap(b => [b.pos.x, b.pos.y]))
const initShot = JSON.stringify(config.shot)
const passThrough = window.location.search.replace(/^\?/, "&")
const url = `../index.html?ruletype=${config.ruleType}&speedrun&practice&init=${encodeURIComponent(init)}&initShot=${encodeURIComponent(initShot)}${passThrough}`
```

### 3.4 Current cards

The page has three position cards: **9-Ball on The Pockets** (nineball), **Snooker Clearance** (snooker), and **Line up 32** (snooker). More positions are added by copying the `<article class="speedrun-card">` pattern — no manual `id` needed (auto-derived from content hash).

---

## 4. Iframe Overlay

### 4.1 Structure

```html
<div id="gameOverlay">
  <div class="iframe-container">
    <div class="timer-display" id="timerDisplay">0.0s</div>
    <iframe id="gameIframe" src=""></iframe>
  </div>
</div>
```

### 4.2 Timer ✅

- **Location**: Inside the overlay, at **top-center**, above the iframe.
- **Style**: White-on-dark monospace, font-size 2.2rem, text-shadow. Format: `s.s` (e.g. `0.0s`, `12.5s`).
- **Behavior**: Starts when the Play button is clicked (before iframe loads). Updates every 100ms using `performance.now()`. Stops on receiving `speedrun-result` message. Resets to `0.0s` on next play.

### 4.3 Opening the iframe

When a "▶ Play" button is clicked:

1. Read the SVG's `data-json-shots`, `data-position-id`, `data-label`.
2. Extract `init`, `initShot`, `ruleType` from the JSON.
3. Construct the iframe URL: `../index.html?ruletype=…&speedrun&practice&init=…&initShot=…&playername=…`.
4. Set iframe `src`, add `active` class to overlay, start timer.

The existing `practice` mode is used because the game has `init + initShot` logic for practice mode — no game changes needed for the iframe to render the correct ball positions.

### 4.4 Receiving results (postMessage) ✅

The game sends two message shapes (see `speedrun-spec.md` §5):

**Failure** (from `PlayShot.handleStationary`):
```json
{ "type": "speedrun-result", "status": "fail", "reason": "Cue ball potted" }
```
**Success** (from `End.onFirst`, after match result uploaded):
```json
{ "type": "speedrun-result", "status": "complete", "matchResult": {...}, "replayUrl": "..." }
```

Current implementation:
- **Fail**: Closes overlay immediately, shows `#resultModal` (fail variant) with "Attempt Failed" + reason + time + OK button (no auto-dismiss). ✅
- **Success**: Closes overlay immediately, shows `#resultModal` (success variant) with "🏆 Success!" + time + rank placeholder + OK button (no auto-dismiss). ✅
- **API POST** not yet wired (TODO).

### 4.5 Success modal ✅

On a successful speedrun clear, shows the unified `#resultModal` with success styling:

```
┌─────────────────────────┐
│       🏆 Success!       │
│                         │
│      Time: 12.5s        │
│      Rank: —            │
│                         │
│         [OK]            │
└─────────────────────────┘
```

- Shows time taken (from elapsed timer value)
- Shows leaderboard rank (placeholder "—" until API integration)
- Green title styling via `#resultModal.success .result-card h2`
- OK button dismisses; no auto-dismiss
- Shares the `#resultModal` div with the fail variant (CSS class toggle: `.fail` vs `.success`)

---

## 5. REST API Contract

### 5.1 Base URL

```
https://scoreboard-tailuge.vercel.app/api/speedrun-results
```

No versioning. CORS allowed (the GitHub Pages origin already has CORS for the existing scoreboard API).

### 5.2 POST — Submit a result

**Endpoint**: `POST /api/speedrun-results`

**Request body**:
```json
{
  "positionId": "nineball-break",
  "playerName": "Alice",
  "timeSec": 12.45,
  "ruleType": "nineball",
  "state": "crushed-replay-state-string-here"
}
```

| Field | Type | Description |
|---|---|---|
| `positionId` | string | Stable position ID from `data-position-id`. |
| `playerName` | string | Player name from `?playername=` or default `"Anon"`. |
| `timeSec` | number | Elapsed time in seconds with decimal (e.g. `12.45`). |
| `ruleType` | string | e.g. `"nineball"`. |
| `state` | string | The crushed/encoded replay state param for reconstructing the replay URL. |

**Response** (201 Created):
```json
{
  "id": "abc123def",
  "playerName": "Alice",
  "timeSec": 12.45,
  "positionId": "nineball-break",
  "ruleType": "nineball",
  "date": "2026-07-04T12:00:00Z"
}
```

The server generates a unique `id` (uid) and returns it.

**Error responses**:
- `400` — Missing required fields.
- `500` — Server error.

### 5.3 GET — List top results per position

**Endpoint**: `GET /api/speedrun-results`

Returns all stored results, grouped by position.

**Response** (200 OK):
```json
[
  {
    "id": "abc123def",
    "playerName": "Alice",
    "timeSec": 12.45,
    "positionId": "nineball-break",
    "ruleType": "nineball",
    "date": "2026-07-04T12:00:00Z"
  },
  {
    "id": "ghi789jkl",
    "playerName": "Bob",
    "timeSec": 15.32,
    "positionId": "nineball-break",
    "ruleType": "nineball",
    "date": "2026-07-04T13:00:00Z"
  }
]
```

The response is a flat array. The client groups by `positionId` and:
- Sorts by `timeSec` ascending (fastest first).
- Shows only the **top 3** per position.
- Stores the `id` on each ranking entry for replay lookup.

**Note**: The server should only retain top 3 per position to keep the response small. Simpler: return all and let client filter.

### 5.4 GET — Single result (with replay data)

**Endpoint**: `GET /api/speedrun-results/{id}`

**Response** (200 OK):
```json
{
  "id": "abc123def",
  "playerName": "Alice",
  "timeSec": 12.45,
  "positionId": "nineball-break",
  "ruleType": "nineball",
  "date": "2026-07-04T12:00:00Z",
  "replayUrl": "https://tailuge.github.io/billiards/dist/index.html?ruletype=nineball&state=..."
}
```

The `replayUrl` is reconstructed by the server or client from the stored `state` + known base URL.

**Error**: `404` if id not found.

### 5.5 Dedup / replacement

No dedup. Each POST creates a new record. The speedrun page may show the user's most recent result alongside the global top 3.

---

## 6. speedrun.js Module

### 6.1 Responsibilities

| # | Task | Status |
|---|------|--------|
| 1 | **Parse URL params** — read `?userName=` (same as main app). Default to `"Anon"`. Pass all params through to game iframe. | ✅ |
| 2 | **Render SVGs** — call `initDiagrams()` (per-SVG ruleType, mixed types work). | ✅ |
| 3 | **Derive position IDs** — hash `data-json-shots` into stable ID, cached on `card.id`. | ✅ |
| 4 | **Fetch rankings** — `GET /api/speedrun-results`, group by `positionId`, sort, show top 3. | TODO |
| 5 | **Handle Play clicks** — construct iframe URL with passthrough params, open overlay, start timer. | ✅ |
| 6 | **Handle postMessage** — on `speedrun-result`: stop timer, close overlay after 300ms, show `#resultModal` (fail or success). | ✅ |
| 7 | **POST result** — `POST /api/speedrun-results` with timeSec + matchResult + replayUrl. | TODO |
| 8 | **Handle replay clicks** — on clicking a ranking entry, open `replayUrl` in new tab. | TODO |

### 6.2 SVG rendering

Uses `initDiagrams()` from `../diagrams/svg.js`. Each SVG's `data-json-shots` contains its `ruleType` — `svg.js` extracts it per-element for correct table type and ball colors. Mixed ruleTypes (nineball + snooker) on one page work correctly.

---

## 7. Implementation Status

### Step 0: Game changes ✅ DONE
- `Session.speedrunMode`, browser query param detection, `PlayShot` failure postMessage, `End` success postMessage. 576 tests pass.

### Step 1: `dist/speedrun/index.html` ✅ DONE
- HTML skeleton with header, player name display, one nineball position card, iframe overlay with close button + timer.

### Step 2: `dist/speedrun/speedrun.js` — Core features ✅ DONE
- SVG rendering via `initDiagrams()` (per-SVG ruleType from `data-json-shots`).
- Content-hash `positionId()` for API position IDs.
- Iframe overlay open/close.
- Timer (start on click, 100ms update, `performance.now()`).
- postMessage listener.
- Query param passthrough to game URL.

### Step 3: `dist/speedrun/speedrun.css` ✅ DONE
- Card grid layout, overlay, timer, close button styles.

### Step 4: API integration TODO
- `POST /api/speedrun-results` on speedrun complete.
- `GET /api/speedrun-results` to fetch rankings.
- Rankings list rendering in cards.
- Replay links.

### Step 5: Implement the API on the scoreboard server TODO
- `POST /api/speedrun-results` — store result.
- `GET /api/speedrun-results` — list all results.
- `GET /api/speedrun-results/{id}` — single result with replayUrl.

### Step 6: Test end-to-end TODO
- Open `dist/speedrun/index.html` locally.
- Click Play → iframe opens with the game at the correct position.
- Play a shot → game sends `speedrun-result` → overlay closes.

---

## 8. Open Questions / Future

- **Rank display**: Currently shows placeholder "—". Will show real rank from API POST response once integrated.
- **More positions**: Copy the `<article class="speedrun-card">` pattern and set `data-json-shots` with the desired position. No manual `id` needed — `positionId()` derives a stable hash.
- **Replay URL format**: The base URL for reconstruction could be the page's own origin, or a configurable constant.
- **Server cleanup**: The server should cap at top N per position to keep the response small.
