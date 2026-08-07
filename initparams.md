# Implementation Plan: Passing Opponent Info via Query Parameters and Removing Sniff Code

## Overview
Currently, the opponent's `userId` (clientId) and `userName` (playername) are sniffed dynamically from incoming network events in `BrowserContainer.netEvent(...)` and set on `Session`.

We will transition to passing opponent parameters explicitly via URL query parameters (`opponent.userName`, `opponent.userId`, and `opponent.custom.*` for custom attributes like `cue`, `wall`, etc.) during initialization. We will populate `Session` directly from these URL query parameters and remove the passive sniffing code from `BrowserContainer.netEvent(...)`. Additionally, we will parse own `custom.*` parameters into `Session.customParams`.

---

## 1. Query Parameter & Session Architecture

### Proposed Query Parameters
Primary parameters parsed from URL query strings (`globalThis.location.search`):
- `opponent.userId` → Canonical `Session.opponentClientId`
- `opponent.userName` → Canonical `Session.opponentName`
- `opponent.custom.*` → Extensible opponent attributes stored in `Session.opponentParams` (e.g., `opponent.custom.cue=1` → `{ cue: "1" }`)
- `custom.*` → Extensible own attributes stored in `Session.customParams` (e.g., `custom.cue=2` → `{ cue: "2" }`)

*(Note: The codebase currently sets `opponentId` and `opponentName` when constructing rematch / challenge URLs in `src/utils/gameover.ts` and `src/view/lobbyindicator.ts`. As part of this update, these URL constructors will also be updated to use `opponent.userId` and `opponent.userName`.)*

### Session Structure & Parameter Parsing
In `src/network/client/session.ts`:
- **Consolidate Session Fields (No Aliases):**
  - Use existing `opponentClientId?: string` and `opponentName?: string` directly as canonical properties. Drop `opponentUserId` / `opponentUserName`.
  - Add `opponentParams: Record<string, string>` to store extracted `opponent.custom.*` values.
  - Add `customParams: Record<string, string>` to store extracted own `custom.*` values.
- **URL Parameter Extraction Logic:**
  - `opponent.userId` → Sets `opponentClientId` (falling back to legacy `opponentId` if present).
  - `opponent.userName` → Sets `opponentName` (falling back to legacy `opponentName` if present).
  - **Dot-Separated Custom Namespace Parsing (`opponent.custom.` & `custom.`):**
    - Iterate over URL search parameters:
      - Match keys starting with `opponent.custom.` → strip the `"opponent.custom."` prefix and insert key-value into `session.opponentParams` (e.g. `opponent.custom.cue=1` becomes `session.opponentParams['cue'] = '1'`).
      - Match keys starting with `custom.` → strip the `"custom."` prefix and insert key-value into `session.customParams` (e.g. `custom.cue=2` becomes `session.customParams['cue'] = '2'`).

---

## 2. Removal of Sniffing Code

In `src/container/browsercontainer.ts`:
- **Remove Sniffing:** Remove dynamic assignment in `netEvent(e: string)`:
  ```typescript
  // REMOVE THESE SNIFFING LINES:
  if (event.clientId) {
    Session.getInstance().setOpponentClientId(event.clientId)
  }
  if (event.playername) {
    Session.getInstance().opponentName = event.playername
  }
  ```
- **Retain VS Notification & Game Logic:** `netEvent(...)` will continue using `Session.getInstance().opponentName` and `Session.getInstance().opponentClientId` (established at initialization via query params, bot setup, or replay state) to display notifications and track score state.

---

## 3. URL Helpers & Match/Lobby Integration

Update URL construction helpers to emit the new parameter names:
- `src/utils/gameover.ts`: Update `rematch(...)` to output `opponent.userId` and `opponent.userName` search params instead of legacy `opponentId` and `opponentName`.
- `src/view/lobbyindicator.ts`: Update challenge link generation to set `opponent.userId` and `opponent.userName`.

---

## 4. Compatibility & Replay Support

1. **Bot Mode & Single Player:**
   - Bot mode will continue setting default opponent details (`ClawBreak` / `bot`) if `opponent.userName` / `opponent.userId` is not specified in query params.
2. **Replay Mode:**
   - Replay state parsing in `BrowserContainer.startReplay(...)` will continue setting `session.opponentName` from recorded state (`breakState.players.player2`) when replaying historic games.

---

## 5. Execution & Verification Steps (Future Code Phase)

1. Modify `src/network/client/session.ts` to parse `opponent.userId`, `opponent.userName`, `opponent.custom.*`, and `custom.*` into `Session`.
2. Update `src/container/browsercontainer.ts` to remove opponent sniffing from `netEvent(...)`.
3. Update `src/utils/gameover.ts` and `src/view/lobbyindicator.ts` to set `opponent.userId` and `opponent.userName`.
4. Run standard repository checks:
   - `yarn test`
   - `yarn lint`
   - `yarn prettify`

---

example url pair for testing:

- Bob

http://localhost:8080/?websocketserver=ws://localhost:80&userName=Bob&userId=Bob-v81ix&ruletype=eightball&tableId=23a00948&lod=2&opponent.userId=Alice-v81ix&opponent.userName=Alice&opponent.custom.cue=0


- Alice

http://localhost:8080/?websocketserver=ws://localhost:80&userName=Alice&userId=Alice-v81ix&ruletype=eightball&tableId=23a00948&first=true&lod=2&custom.cue=1&opponent.userId=Bob-v81ix&opponent.userName=Bob
