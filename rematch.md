# Rematch Table Size Propagation Analysis

This document provides a detailed technical analysis of why the `tableSize` parameter (and other game settings like custom `raceTo`) is not preserved during multiplayer rematches in `sagu` and `threecushion` rule types, and proposes architectural solutions to address this.

---

## 1. Problem Statement

When playing multiplayer Sagu or Three-Cushion on a custom small table (e.g., `tableSize=5`), upon game completion, clicking the **Rematch** button initiates a new game, but the table size defaults back to 10 (the default standard size). The custom `tableSize` parameter is lost during the rematch redirection flow.

---

## 2. Technical Analysis

By tracing the lifecycle of a rematch, the root cause is found in how rematch data is passed through the Lobby.

### 2.1 Rematch Button & URL Generation
At the end of a match, `MatchResultHelper` generates game-over buttons by calling `gameOverButtons.forMode`, which in turn delegates to `gameOverButtons.rematch` in `src/utils/gameover.ts`:

```typescript
  rematch(
    opponentId: string | undefined,
    opponentName: string | undefined,
    ruletype: string,
    nextTurnId: string | undefined
  ): string {
    if (!opponentId || !nextTurnId) return ""

    const url = new URL(LOBBY_URL)
    url.searchParams.set("opponentId", opponentId)
    if (opponentName) {
      url.searchParams.set("opponentName", opponentName)
    }
    url.searchParams.set("ruletype", ruletype)
    url.searchParams.set("nextTurnId", nextTurnId)

    return `<button type="button" class="notification-btn" data-notification-action="rematch" data-notification-url="${url.toString()}">Rematch</button>`
  }
```

* **Observation 1:** The rematch URL constructor only appends `opponentId`, `opponentName`, `ruletype`, and `nextTurnId` to the Lobby URL. It does not extract nor append the active game session's parameters, such as `tableSize` or `raceTo`, which are present in the current page's URL (`globalThis.location.search`).

### 2.2 Lobby Parameter Parsing
Upon redirection to `lobby.html`, the lobby client application (`lobby-app` / `Xe` class in `dist/lobby.js`) parses the search parameters:

```javascript
let e = new URLSearchParams(location.search),
    t = e.get("opponentId");
if (t) {
    this.#i = {
        opponentId: t,
        opponentName: e.get("opponentName") || t,
        ruleType: e.get("ruletype") || "nineball",
        nextTurnId: e.get("nextTurnId")
    };
    let i = new URL(location.href);
    i.searchParams.delete("opponentId"),
    i.searchParams.delete("opponentName"),
    i.searchParams.delete("ruletype"),
    i.searchParams.delete("nextTurnId"),
    history.replaceState(null, "", i)
}
```

* **Observation 2:** The lobby application strictly expects and extracts only the standard rematch keys (`opponentId`, `opponentName`, `ruletype`, `nextTurnId`). It completely discards any other parameters on the URL, and does not populate a custom game `options` field on the rematch tracking object `this.#i`.

### 2.3 Auto-Challenge Issuance
When the lobby successfully connects and resolves the opponent's presence, `#x()` auto-fires the rematch challenge using `#v()`:

```javascript
#x() {
    if (!this.#e.connected || !this.#i) return;
    let e = this.#i.opponentId;
    if (!this.#n && this.#e.users.some(t => t.userId === e)) {
        this.#v(e, this.#i.ruleType, this.#i.options, this.#i.nextTurnId);
    }
}
```

* **Observation 3:** Because `this.#i.options` was never populated from the query parameters, the third parameter of `#v` is passed as `undefined`. Consequently, no game configuration options are attached to the auto-challenge sent to the opponent.

---

## 3. Architectural Compatibility & Support

### Does the current architecture support propagating these parameters?
**Yes, fully.** The existing codebase has robust built-in support for propagating custom game configurations (such as custom `tableSize` and custom `raceTo`) through the lobby and into the gameplay client.

Here is why:
1. **Lobby Challenge Payload Support**: The lobby's internal messaging protocol accepts a custom `options` object:
   `challenge(opponentId, ruleType, options, nextTurnId)`
   When a challenge is sent with an `options` payload (e.g., `{ tableSize: "5", raceTo: "5" }`), it is broadcasted to the recipient and stored in `currentMatch.options`.
2. **Game URL Reconstruction**: When launching the game page, the lobby app constructs the play URL via the `je` function:
   ```javascript
   je({tableId, userId, userName, ruleType, isFirst, options, bot, lod, flip}) {
       let p = `...`;
       return Mt(p, options);
   }
   ```
   The `Mt` helper iterates over the `options` key-value pairs and appends them as query parameters directly to the destination game client's URL:
   ```javascript
   Mt = (url, options) => options ? Object.entries(options).reduce((t, [k, v]) => t + `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`, url) : url
   ```
3. **Gameplay Table Resizing Initialization**: The game client is already designed to dynamically parse and scale the table configuration directly from its URL query parameters using `TableConfig.tableSizeFromUrl()`:
   ```typescript
   static tableSizeFromUrl(): number {
     return parseFloat(urlParams.get("tableSize") || "10")
   }
   ```
   And `TableConfig.apply(this.rulename, TableConfig.tableSizeFromUrl())` correctly scales the physics engine, collision boundaries, and meshes.

Therefore, the underlying network, lobby, and gameplay architectures are fully compatible with custom configurations during a rematch. The blocker is simply that **these options are omitted during the rematch URL generation and not parsed by the lobby's rematch handler**.

---

## 4. Proposed Solutions

To preserve the `tableSize` parameter (and other custom game parameters like `raceTo`) during a rematch, we can implement one of the following approaches.

### Option A: Explicit Query Parameter Passing
This approach explicitly targets known game session parameters (such as `tableSize` and `raceTo`) to carry them over.

1. **Modify Game Client URL Generation (`src/utils/gameover.ts`)**:
   In `rematch(...)`, retrieve active custom params from the current window's URL and append them to the redirect URL:
   ```typescript
   const currentParams = new URLSearchParams(globalThis.location?.search ?? "")
   const tableSize = currentParams.get("tableSize")
   if (tableSize) {
     url.searchParams.set("tableSize", tableSize)
   }
   const raceTo = currentParams.get("raceTo")
   if (raceTo) {
     url.searchParams.set("raceTo", raceTo)
   }
   ```

2. **Modify Lobby Client Parameter Parsing (`dist/lobby.js`)**:
   Update the lobby app's URL constructor parsing block to extract these parameters and store them in `options` on the rematch tracking object `this.#i`:
   ```javascript
   this.#i = {
       opponentId: t,
       opponentName: e.get("opponentName") || t,
       ruleType: e.get("ruletype") || "nineball",
       nextTurnId: e.get("nextTurnId"),
       options: {
           tableSize: e.get("tableSize") || undefined,
           raceTo: e.get("raceTo") || undefined
       }
   };
   ```

---

### Option B: Generic Parameter Propagation (Recommended)
This approach dynamically handles any arbitrary custom game parameters, making it completely future-proof if new game modes or options are introduced later.

1. **Modify Game Client URL Generation (`src/utils/gameover.ts`)**:
   Filter out standard environment parameters (such as `userId`, `userName`, `tableId`, `websocketserver`, `first`, and `spectator`) and append all other query parameters as custom options:
   ```typescript
   const systemParams = new Set(["userId", "userName", "tableId", "websocketserver", "first", "spectator"])
   const currentParams = new URLSearchParams(globalThis.location?.search ?? "")
   for (const [key, val] of currentParams.entries()) {
     if (!systemParams.has(key)) {
       url.searchParams.set(key, val)
     }
   }
   ```

2. **Modify Lobby Client Parameter Parsing (`dist/lobby.js`)**:
   Update the lobby app to gather all non-lobby query parameters dynamically into an `options` object:
   ```javascript
   const lobbySystemParams = new Set(["opponentId", "opponentName", "ruletype", "nextTurnId", "userId", "userName"])
   const options = {}
   for (const [key, val] of e.entries()) {
       if (!lobbySystemParams.has(key)) {
           options[key] = val;
       }
   }
   this.#i = {
       opponentId: t,
       opponentName: e.get("opponentName") || t,
       ruleType: e.get("ruletype") || "nineball",
       nextTurnId: e.get("nextTurnId"),
       options: Object.keys(options).length > 0 ? options : undefined
   };
   ```

Both options leverage the existing, fully-supported messaging architecture without requiring any database modifications or breaking changes to the communication protocol. Option B is recommended for its generality and maintainability.
