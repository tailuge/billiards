# Speedrun Page & API Specification

Companion to `speedrun-spec.md`. Covers the `dist/speedrun/` landing page, the REST API for rankings, and the data format for positions.

---

## 1. Files

```
dist/speedrun/
  index.html    — Landing page (static HTML)
  speedrun.js   — All logic (module)
```

No server-side code — this spec defines the contract that the existing scoreboard app (`scoreboard-tailuge.vercel.app`) will implement.

---

## 2. Page Layout

### 2.1 Overall structure

Single scrolling page with:
- **Header bar**: Title "Speedrun Challenge", player name (from `?playername=` URL param, default `"Anon"`).
- **2-column CSS grid** of position cards (flexes to 1 column on narrow screens).
- **Iframe overlay** (`#gameOverlay`) — hidden by default, covers the full screen when active.

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

### 2.3 No close button on overlay

The iframe overlay has **no close button**. It auto-closes when the game sends a `speedrun-result` message. If the iframe hangs, the user refreshes the page.

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
| `data-json-shots` | Ball positions + ruleType + initial shot params (reuses exam format). Used to render the SVG preview and to construct the iframe URL. |
| `data-position-id` | Stable ID for this position, sent in API calls (e.g. `nineball-break`). |
| `data-label` | Display name shown on the card. |
| `data-description` | Short description shown below the title. |

### 3.3 SVG rendering

`speedrun.js` renders each SVG using inline table drawing (simple table outline + ball circles). No dependency on `svg.js`. The speedrun page calls `renderSpeedrunDiagram(svgEl)` on page load.

For the iframe URL, the `init` param is extracted from `data-json-shots`:
```js
const config = JSON.parse(svg.dataset.jsonShots)[0]
const init = JSON.stringify(config.balls.flatMap(b => [b.pos.x, b.pos.y]))
const initShot = JSON.stringify(config.shot)
const ruleType = config.ruleType
const url = `../index.html?ruletype=${ruleType}&speedrun&practice&init=${encodeURIComponent(init)}&initShot=${encodeURIComponent(initShot)}&playername=${playerName}`
```

### 3.4 Start with one example

The page starts with **one nineball position card** in the HTML. More positions are added by copying the SVG + card pattern.

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

### 4.2 Timer

- **Location**: Inside the overlay, at **top-center**, above the iframe.
- **Style**: Large white-on-dark digital clock, font-size ~3rem, monospace digits. Format: `ss.tenths` (e.g. `12.5`, `103.2`).
- **Behavior**: Starts when the iframe loads (`iframe.onload`). Updates every 100ms using `performance.now()` or `Date.now()`. Stops on receiving `speedrun-result` message. Resets to `0.0s` when overlay closes.

### 4.3 Opening the iframe

When a "▶ Play" button is clicked:

1. Read the SVG's `data-json-shots`, `data-position-id`, `data-label`.
2. Extract `init`, `initShot`, `ruleType` from the JSON.
3. Construct the iframe URL: `../index.html?ruletype=…&speedrun&practice&init=…&initShot=…&playername=…`.
4. Set iframe `src`, add `active` class to overlay, start timer.

The existing `practice` mode is used because the game has `init + initShot` logic for practice mode — no game changes needed for the iframe to render the correct ball positions.

### 4.4 Receiving results (postMessage)

```js
window.addEventListener("message", (event) => {
  if (event.data.type !== "speedrun-result") return

  const { status, matchResult, replayUrl, reason } = event.data

  // Stop timer
  // Close overlay
  // Submit to server
  // Update card's ranking list
})
```

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

1. **Parse URL params** — read `?playername=` from the page URL. Default to `"Anon"`.
2. **Render SVGs** — call `renderSpeedrunDiagram(svgEl)` for each `.billiards-table` SVG on page load.
3. **Build cards** — for each SVG with `data-position-id`, create the card wrapper, extract `data-label` + `data-description`, add Play button, render rankings placeholder.
4. **Fetch rankings** — on page load, `GET /api/speedrun-results`, group by `positionId`, sort, show top 3 per position card.
5. **Handle Play clicks** — construct iframe URL, open overlay, start timer.
6. **Handle postMessage** — on `speedrun-result`:
   - Stop timer
   - Close overlay
   - `POST /api/speedrun-results` with the result data
   - Re-fetch rankings and update the card
7. **Handle replay clicks** — on clicking a ranking entry's ▶ button, `GET /api/speedrun-results/{id}`, open the returned `replayUrl` in a new tab.

### 6.2 SVG rendering function (`renderSpeedrunDiagram`)

```js
function renderSpeedrunDiagram(svgEl) {
  const jsonText = svgEl.dataset.jsonShots
  const config = JSON.parse(jsonText)[0]
  const balls = config.balls
  const isPool = config.ruleType !== "threecushion"

  // Set viewBox based on table geometry (same constants as svg.js)
  // Draw table outline, cushions, pockets (if pool)
  // Draw ball circles with appropriate colors
  // Add cue ball marker
}
```

Simplified table rendering: a rectangle for the table, some circles for balls. Not as feature-rich as `svg.js` but self-contained.

---

## 7. Implementation Order

### Step 1: Create `dist/speedrun/index.html`
- HTML skeleton with header, player name display, one example SVG + card, iframe overlay with timer.

### Step 2: Create `dist/speedrun/speedrun.js`
- SVG rendering function (table + balls).
- Card building (extract from SVGs, add play button, rankings placeholder).
- Iframe overlay open/close logic.
- Timer logic (start/stop/update).
- postMessage listener.
- API calls (POST + GET).
- Rankings display.
- Replay button (GET by uid → open URL).

### Step 3: Implement the API on the scoreboard server
- `POST /api/speedrun-results` — store result.
- `GET /api/speedrun-results` — list all results.
- `GET /api/speedrun-results/{id}` — single result with replayUrl.

### Step 4: Test end-to-end
- Open `dist/speedrun/index.html` locally.
- Click Play → iframe opens with the game at the correct position.
- Play a shot → game sends `speedrun-result` → overlay closes → result is displayed and POSTed.

---

## 8. Open Questions / Future

- **SVG colors**: Ball colors should match the ruletype (nineball uses specific colors per label).
- **Space to add more positions**: The HTML is designed so new positions are added by copying the SVG element and adjusting `data-json-shots`.
- **Replay URL format**: The base URL for reconstruction could be the page's own origin, or a configurable constant.
- **Server cleanup**: The server should cap at top N per position to keep the response small.
