# Speedrun Challenge — Specification

## 1. Overview

Add a speedrun challenge mode to the billiards game. The mode is triggered via URL query parameters and communicates results back to a parent iframe via `postMessage`. Results include elapsed time and a replay link. A companion landing page at `dist/speedrun/` allows users to pick initial positions, view rankings, and **displays the timer** — no HUD changes in the game itself.

**Trigger**: `&speedrun` query param (alongside `&init=[...]` for ball positions).

**Minimal intervention**: The existing rule controllers (NineBall, EightBall, Snooker) are **not** modified. The game's HTML/CSS/JS for the HUD is **not** changed. The speedrun behaviour is added at the **PlayShot.handleStationary()** interception point and in the **End** controller. The timer display lives entirely on the speedrun landing page.

---

## 2. Trigger & Query Parameters

| Param | Example | Required | Notes |
|---|---|---|---|
| `speedrun` | `&speedrun` | yes (flag) | Activates speedrun mode |
| `init` | `&init=[x1,y1,x2,y2,…]` | yes | Initial ball positions (existing format, see `Rack.fromInitParam`) |
| `ruletype` | `&ruletype=nineball` | optional | Defaults to `"nineball"` |
| `playername` | `&playername=Alice` | optional | Player name for result upload. Default `"Anon"` |

### Example URL

```
?ruletype=nineball&speedrun&init=[0.5,-0.3, -0.8,-0.2,…]&playername=Alice
```

---

## 3. Supported Ruletypes

| Ruletype | Win condition | Failure condition |
|---|---|---|
| `nineball` | Pot the 9-ball legally | Any foul, or miss (no pot) on any shot |
| `eightball` | Pot the 8-ball after clearing assigned group | Any foul, or miss (no pot) on any shot |
| `snooker` | Clear all reds + colours from the init setup | Any foul, or miss (no pot) on any shot |

**Run scope**: Includes the break shot. The init position is the full setup (e.g. the rack). The run continues until success (winning ball potted) or failure (foul or miss).

---

## 4. Timer

The elapsed-time clock is **entirely handled by the speedrun landing page** (`dist/speedrun/`). The game has **no awareness of time at all**.

- **Start**: The speedrun page starts a timer when it opens the game iframe.
- **Stop**: The speedrun page stops the timer when it receives a `speedrun-result` postMessage (success or fail).
- **Display**: The speedrun page formats and displays the elapsed time as `ss.tenths` (e.g. `12.5`, `103.2`).

This means the game code has **zero changes** related to timing — no start time storage, no elapsed time computation, no match result fields for time.

### Why no in-game time tracking?

- Eliminates all time-related code changes in the game.
- The speedrun page has full control over timer accuracy, display, and format.
- No need to modify the `MatchResult` interface or the score reporter.
- The game's only job: play the game and message the outcome.

---

## 5. Game Flow & Interception

### 5.1 PlayShot.handleStationary() — Speedrun check

When the controller is `PlayShot` and `&speedrun` is active, after the balls settle:

1. **Check for foul**: If `rules.foulReason(outcome) !== null`, the run has failed.
   - Determine the reason string (e.g. `"Cue ball potted"`, `"No ball hit"`, `"Wrong ball hit first"`).
   - `postMessage` to parent: `{ type: "speedrun-result", status: "fail", reason: "…" }`
   - Transition to `End` controller (or a new minimal speedrun-end state).

2. **Check for miss**: If no foul but also no pots (`Outcome.potCount(outcome) === 0`), the run has failed.
   - `postMessage` to parent: `{ type: "speedrun-result", status: "fail", reason: "No pot" }`
   - Transition to `End` controller.

3. **Check for win**: If the rule detects end-of-game (`rules.isEndOfGame(outcome)` and no foul), the run has succeeded.
   - Construct the MatchResult (normal game end flow — no time fields needed).
   - Construct a **full replay URL** (the current page URL with the encoded state).
   - `postMessage` to parent:
     ```json
     {
       "type": "speedrun-result",
       "status": "complete",
       "matchResult": { … },
       "replayUrl": "https://…/index.html?ruletype=nineball&state=…"
     }
     ```
   - Submit the MatchResult to the existing scoreboard API (`/api/match-results`) — same as normal game end (no time fields added).
   - The game's normal "YOU WON" notification still appears in-game.

### 5.2 End controller — Speedrun enhancement

When the `End` controller initialises in speedrun mode, the normal game-over notification is shown (does not need modification). The important work (postMessage + optional API upload) happens in `PlayShot.handleStationary()` or in `End.onFirst()`.

**Design decision: where to put the speedrun logic?**

Option A (recommended — minimal):
- Add speedrun checks directly in `PlayShot.handleStationary()` before returning `nextController`.
- On success: compute time, build replay URL, postMessage, submit MatchResult, then return the normal `End` controller.
- On fail: postMessage with reason, then return the `End` controller.

Option B:
- Add a wrapper layer that intercepts the stationary event chain.
- Keep PlayShot unchanged.

The spec recommends Option A as it's minimal and aligns with the "rules untouched" principle.

### 5.3 No time tracking in the game

The game does **not** track, compute, or report any elapsed time. The parent page controls the timer entirely.

No start time storage is needed in the game.

---

## 6. MatchResult — No Changes

The `MatchResult` interface is **unchanged**. No new fields are needed because the game does not handle timing. The speedrun page records the time locally and may submit it to the rankings API separately (out of scope for this spec).

---

## 7. postMessage Protocol (iframe → parent)

### Success message

```json
{
  "type": "speedrun-result",
  "status": "complete",
  "matchResult": {
    "winner": "Alice",
    "winnerScore": 1,
    "ruleType": "nineball"
  },
  "replayUrl": "https://tailuge.github.io/billiards/dist/index.html?ruletype=nineball&state=..."
}
```

### Failure message

```json
{
  "type": "speedrun-result",
  "status": "fail",
  "reason": "Cue ball potted"
}
```

**Note**: No time field in either message — the parent page tracks and displays the time.

Possible reasons: `"Cue ball potted"`, `"Wrong ball hit first"`, `"No ball hit"`, `"No cushion after contact"`, `"No pot"`.

---

## 8. dist/speedrun/ Page

### 8.1 Location & structure

A new static HTML page at `dist/speedrun/index.html` with:

```
dist/speedrun/
  index.html    — Landing page with position selection + rankings
  speedrun.js   — JS module for page logic
```

### 8.2 Page layout

- **Header**: Title "Speedrun Challenge", brief description. Player name shown from URL param or default.
- **Timer display**: A prominent clock showing elapsed time (starts when iframe opens, updated by the page itself or from game's reported time). Format: `ss.tenths`.
- **Position cards**: One card per initial position per ruletype. Each card contains:
  - Position name/description (e.g. "Nineball Break", "Eightball Mid-Table")
  - A "Play" button
  - Rankings list: top times for that position (name, time, date) fetched from scoreboard API
  - Latest personal result (from this session)
- **Iframe overlay**: When "Play" is clicked, opens an iframe overlay (same pattern as `dist/exam/`).
  - Iframe URL: `../index.html?ruletype=…&speedrun&init=[…]&playername=…`
  - Close button (optional, user can also refresh).
- **Timer while playing**: While the iframe overlay is open, the speedrun page displays a live timer (started when iframe loads, stopped on `speedrun-result` message).
- **Auto-close on result**: On receiving `speedrun-result` postMessage, close the iframe overlay, stop the timer, and update the position card with the result.

### 8.3 Initial positions

Hardcoded as a JS data array in `speedrun.js`. 1–2 conceptually described positions per ruletype (specific coordinates defined during implementation).

Example structure:

```typescript
const SPEEDRUN_POSITIONS = [
  {
    id: "nineball-break",
    ruleType: "nineball",
    label: "Nineball Break",
    description: "Standard nineball rack. Pot the 9-ball as fast as possible.",
    init: [/* x1,y1, x2,y2, … */],
  },
  {
    id: "nineball-mid",
    ruleType: "nineball",
    label: "Nineball Mid-Table",
    description: "Cue ball and 9-ball in open position.",
    init: [/* … */],
  },
  // eightball, snooker positions...
]
```

### 8.4 Rankings display

Per position, show a list of top results (e.g. top 10), sorted by time ascending (fastest first).

Each ranking entry shows:
- Rank number
- Player name
- Time (formatted as ss.tenths, e.g. `12.45s`)
- Date (optional)

The rankings are fetched from the scoreboard API:
```
GET https://scoreboard-tailuge.vercel.app/api/speedrun-rankings?position=nineball-break&limit=10
```

(Implementation of this API endpoint is out of scope for this spec — it belongs to the separate scoreboard app.)

### 8.5 Style

Minimal/utility style. Clean HTML with basic CSS. No heavy framework. Light background, simple cards, readable fonts (system-ui stack). Iframe overlay with dark backdrop (same as exam pattern).

---

## 9. Implementation Steps (Ordered)

### Phase 1: Core game changes (only 2 steps)

1. **Detect `&speedrun`** — expose a boolean flag (e.g. `globalThis.isSpeedrun`) or pass it through the existing config/container path.
2. **Add speedrun logic to `PlayShot.handleStationary()`** — on foul/miss: postMessage with reason + end the game. On win: postMessage with result + replay URL + submit MatchResult normally.

**No changes to MatchResult, no time tracking, no HUD/HTML/CSS changes. The game just sends a message when the run ends.**

### Phase 2: Iframe parent / landing page

5. **Create `dist/speedrun/index.html`** — static HTML page with header, timer display, position cards, rankings slots, iframe overlay.
6. **Create `dist/speedrun/speedrun.js`** — JS module with position data, iframe management, timer logic, postMessage listener, rankings rendering.
7. **Style the speedrun page** — minimal CSS (inline or small stylesheet).

---

## 10. Open Questions / Future Considerations

- **Rankings API**: The scoreboard server needs a `GET /api/speedrun-rankings` endpoint (and probably a `POST /api/match-results` on the same endpoint already handles storage). This is a separate implementation for the scoreboard app.
- **Snooker speedrun positions**: Since snooker "clear table" is long, speedrun init positions for snooker should be smaller challenges (e.g. "clear the colours", "pot red + position on black") rather than full-table clears.
- **Early exit**: Currently no mechanism to cancel mid-run. Could add an abort button later.
- **Multiple init positions per ruletype**: The spec allows 1–2 per ruletype, expandable later.
- **Local storage for personal bests**: Could be added to the speedrun page to track the user's own best times per position between visits.
