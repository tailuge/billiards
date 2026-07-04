# Speedrun Challenge — Specification (Game Changes Only)

## 1. Overview

Add a speedrun challenge mode to the billiards game. Triggered via `&speedrun` query param. Communicates results back to a parent iframe via `postMessage`. A companion landing page at `dist/speedrun/` handles the timer, position selection, and rankings — **no HUD/timer changes in the game itself**.

**Two game-side intercept points, both rule-agnostic:**

| Intercept | Where | What |
|---|---|---|
| Failure detection | `PlayShot.handleStationary()` | After `rules.update()`, if foul or miss → `postMessage` fail to parent. Game continues normally; parent kills iframe in ~ms. |
| Success notification | `End.onFirst()` | After MatchResult is uploaded to scoreboard → `postMessage` complete to parent with matchResult + replayUrl. |

**State**: `Session.speedrunMode` boolean, accessed via `Session.isSpeedrunMode()`. Same pattern as `isExamMode()`, `isBotMode()`, `isPracticeMode()`.

**Zero rule changes**. Uses `rules.foulReason(outcome)` from the Rules interface — works for NineBall, EightBall, Snooker, and any future ruletype.

---

## 2. Trigger & Query Parameters

| Param | Example | Required | Notes |
|---|---|---|---|
| `speedrun` | `&speedrun` | yes (flag) | Activates speedrun mode |
| `init` | `&init=[x1,y1,…]` | yes | Existing format (see `Rack.fromInitParam`) |
| `ruletype` | `&ruletype=nineball` | optional | Defaults to `"nineball"` |
| `playername` | `&playername=Alice` | optional | Default `"Anon"` |
| `practice` | `&practice` | recommended | Enables `initShot` handling for exact ball placement |
| `initShot` | `&initShot={…}` | recommended | Initial shot params (cue angle, power, etc.) |

**Example iframe URL:**
```
?ruletype=nineball&speedrun&practice&init=[0.5,-0.3,…]&initShot={…}&playername=Alice
```

---

## 3. Game Flow (Two Intercept Points)

### 3.1 PlayShot.handleStationary() — Failure detection

After `rules.update(outcome)` has processed the shot (updating `currentBreak`, score, etc.), check for speedrun failure. The existing `rules.update()` call is not skipped — internal state must be updated. We only intercept to send a message.

```
PlayShot.handleStationary(_):
    outcome = table.outcome
    nextController = rules.update(outcome)   // normal processing
    // ... existing score/recorder updates ...

    if Session.isSpeedrunMode():
        foul = rules.foulReason(outcome)
        if foul:
            parent.postMessage({type:"speedrun-result", status:"fail", reason: foul})
        elif Outcome.potCount(outcome) === 0:
            parent.postMessage({type:"speedrun-result", status:"fail", reason: "No pot"})
        // else: pots were made, continue playing
        // CRITICAL: always return nextController — game carries on

    return nextController
```

**On failure, the game does NOT stop or transition to End.** It continues normally (returns whatever `rules.update()` produced — Aim, PlaceBall, etc.). The parent page receives the postMessage and closes the iframe in milliseconds. This is the same pattern as the exam diagram postMessage already in `PlayShot.handleStationary()`.

Both checks are **rule-agnostic**:
- `rules.foulReason(outcome)` → works for NineBall, EightBall, Snooker, ThreeCushion
- `Outcome.potCount(outcome) === 0` → generic "no pots made" check

### 3.2 End.onFirst() — Success notification

When the player pots the winning ball, `rules.update(outcome)` returns `End` (via `MatchResultHelper.presentGameEnd()`). `End.onFirst()` already submits the MatchResult to the scoreboard and encodes the replay data.

At the **end** of `End.onFirst()`, add:

```
if Session.isSpeedrunMode() and result and MatchResultHelper.isWinner(result):
    gameState = recorder.wholeGame()
    replayUrl = linkFormatter.getReplayUri(gameState)
    parent.postMessage({
        type: "speedrun-result",
        status: "complete",
        matchResult: result,
        replayUrl
    })
```

This fires **after** `scoreReporter.submitMatchResult(result)` so the scoreboard has the result by the time the parent gets the message.

---

## 4. Session State

Add to `Session`:

```ts
readonly speedrunMode: boolean = false

static isSpeedrunMode(): boolean {
    return Session.getInstance().speedrunMode
}
```

Detected in `BrowserContainer` constructor:
```ts
this.speedrun = params.has("speedrun")
// ... passed to Session.init() alongside other mode flags ...
```

No need to pass through `ContainerConfig` or `Container` — the mode is on `Session`, accessible from any controller.

---

## 5. postMessage Protocol (iframe → parent)

### Failure (from PlayShot)

```json
{
  "type": "speedrun-result",
  "status": "fail",
  "reason": "Cue ball potted"
}
```

Possible reasons: `"Cue ball potted"`, `"Wrong ball hit first"`, `"No ball hit"`, `"No cushion after contact"`, `"No pot"`.

### Success (from End)

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

**No time field in either message** — the parent page tracks and displays elapsed time.

---

## 6. What Is NOT Changed

- **No rules changes** — NineBall, EightBall, Snooker rules untouched
- **No MatchResult changes** — no time fields
- **No HUD/HTML/CSS changes** — normal "YOU WON"/"FOUL" notifications still appear
- **No new controller** — reuse existing `PlayShot` and `End`
- **No timing code** in the game — parent page owns the clock

---

## 7. Files Changed (Phase 1 — Game) ✅ DONE

| File | Lines | Change |
|---|---|---|
| `src/network/client/session.ts` | +8 | `speedrunMode` field, `isSpeedrunMode()` static, `init()` wiring |
| `src/container/browsercontainer.ts` | +4 | `params.has("speedrun")` detection, pass to `Session.init()` |
| `src/controller/playshot.ts` | +13 | Import `Outcome`, foul/miss check → `postMessage` fail |
| `src/controller/end.ts` | +15 | After match result upload → `postMessage` complete with replayUrl |

**Total: ~40 lines across 4 files. All 576 existing tests pass. Zero rule changes.**

---

## 8. dist/speedrun/ Page (Phase 2 — TODO)

See `speedrun-api-spec.md` for the landing page, position cards, iframe overlay, timer, and REST API contract. The page:
- Starts a timer when the game iframe loads
- Listens for `speedrun-result` postMessage
- On fail: closes overlay, shows failure reason
- On complete: stops timer, closes overlay, POSTs result to API, updates rankings

---

## 9. Open Questions

- **Rankings API**: Scoreboard server needs `POST/GET /api/speedrun-results`. Separate implementation.
- **Snooker positions**: Should be smaller challenges (e.g. "clear the colours") rather than full-table clears.
- **Early exit**: No cancel mechanism. Parent can always close the iframe.
