# Handicap System Design Specification

This document outlines the design and implementation plan for a minimal and localized handicap system in the three-cushion (`threecushion`) and Sagu (`sagu`) game variations. Under this system, players win the game when they reach their individual handicap targets as specified in the URL query parameters.

---

## 1. Core Integration Strategy

To keep the changes clean and localized, we will integrate the handicap logic directly within:
1. **`Session` class (`src/network/client/session.ts`)**: To parse URL parameters, build a handicap map, and provide target lookup functions.
2. **`ThreeCushion` rule class (`src/controller/rules/threecushion.ts`)**: To override `isEndOfGame` based on individual handicap targets.
3. **`Sagu` rule class (`src/controller/rules/sagu.ts`)**: To update the final cushion-shot trigger condition (`score === target - 1`).
4. **`Container` class (`src/container/container.ts`)**: To display individual handicap values in the HUD alongside player names, e.g. `Luke(9)` and `Bob(7)`, and dynamically calculate the star (⭐) indicator threshold.

---

## 2. Game Engine Integration

### A. Parsing & Target Resolution (`src/network/client/session.ts`)

We parse `handicap_*` keys from URL query parameters. The suffix following `handicap_` represents the `userId` (which maps to `clientId` or `opponentClientId` on the game client).

We will add the following helper methods to the `Session` class:

```typescript
/**
 * Retrieves a map of user ID to handicap value from the URL query parameters.
 */
getHandicaps(): Record<string, number> {
  if (typeof globalThis.location === "undefined") {
    return {}
  }
  const params = new URLSearchParams(globalThis.location.search)
  const handicaps: Record<string, number> = {}
  for (const [k, v] of params) {
    if (k.startsWith('handicap_')) {
      const userId = k.replace('handicap_', '')
      handicaps[userId] = Number.parseInt(v) || 5
    }
  }
  return handicaps
}

/**
 * Resolves the race target for a specific player by their client ID.
 * - If no player has a handicap specified, returns the default ThreeCushionConfig.raceTo (7).
 * - If at least one player has a handicap specified, any player (or bot) without an explicit handicap defaults to 5.
 */
getRaceTargetForPlayer(clientId: string): number {
  const handicaps = this.getHandicaps()
  const hasAnyHandicap = Object.keys(handicaps).length > 0

  if (!hasAnyHandicap) {
    return ThreeCushionConfig.raceTo // No handicaps in URL -> standard scoring system
  }

  // If a handicap exists in URL for this client, use it; otherwise, default to 5 (handles opponent or bot)
  return handicaps[clientId] ?? 5
}
```

### B. Determining Winner Condition (`src/controller/rules/threecushion.ts`)

In `ThreeCushion.isEndOfGame`, instead of checking both players against `ThreeCushionConfig.raceTo` (which is hardcoded to 7), we check each player against their specific resolved race target:

```typescript
isEndOfGame(_: Outcome[]): boolean {
  const session = Session.getInstance()
  const p1ClientId = session.playerIndex === 0 ? session.clientId : session.opponentKey()
  const p2ClientId = session.playerIndex === 0 ? session.opponentKey() : session.clientId

  const p1Target = session.getRaceTargetForPlayer(p1ClientId)
  const p2Target = session.getRaceTargetForPlayer(p2ClientId)

  const { p1: s1, p2: s2 } = session.orderedScoresForHud()

  return s1 >= p1Target || s2 >= p2Target
}
```

### C. Final Cushion-Shot Trigger (`src/controller/rules/sagu.ts`)

Under Sagu rules, a player must score their final point via a valid 3-cushion shot. This condition triggers when their score is at `target - 1`. We update `isSuccessfulShot` to use their individual handicap target:

```typescript
isSuccessfulShot(outcomes: Outcome[]): boolean {
  const session = Session.getInstance()
  const myCurrentScore = session.myScore()
  const myTarget = session.getRaceTargetForPlayer(session.clientId)

  if (myCurrentScore === myTarget - 1) {
    return !this.foulReason(outcomes) && this.isSaguThreeCushionShot(outcomes)
  }
  return !this.foulReason(outcomes) && this.hitsBothReds(outcomes)
}
```

---

## 3. HUD Scoring & Player Display (`src/container/container.ts`)

Both players must see the handicap details clearly displayed in the HUD. We will modify `updateScoreHud` to append the target handicap in parentheses next to the player's name and to correctly position the final match-point star (⭐).

### HUD Modification in `updateScoreHud`:

```typescript
updateScoreHud(p1: number, p2: number, b: number, active?: ActivePlayer) {
  const session = Session.getInstance()
  session.updateScoresFromNetwork(p1, p2, b)
  const orderedScores = session.orderedScoresForHud()
  this.hudScores = orderedScores

  const orderedNames = session.orderedNamesForHud()

  // Format handicap append next to player names
  const isHandicapRule = this.rules.rulename === "sagu" || this.rules.rulename === "threecushion"
  const handicaps = session.getHandicaps()
  const hasHandicaps = isHandicapRule && Object.keys(handicaps).length > 0

  let p1Target = ThreeCushionConfig.raceTo
  let p2Target = ThreeCushionConfig.raceTo

  if (hasHandicaps) {
    const p1ClientId = session.playerIndex === 0 ? session.clientId : session.opponentKey()
    const p2ClientId = session.playerIndex === 0 ? session.opponentKey() : session.clientId

    p1Target = session.getRaceTargetForPlayer(p1ClientId)
    p2Target = session.getRaceTargetForPlayer(p2ClientId)

    if (orderedNames.p1Name) {
      orderedNames.p1Name = `${orderedNames.p1Name}(${p1Target})`
    }
    if (orderedNames.p2Name) {
      orderedNames.p2Name = `${orderedNames.p2Name}(${p2Target})`
    }
  }

  if (this.rules.rulename === "eightball" && session.p1type !== 0) {
    const typeLabel = session.p1type === 1 ? "solids" : "stripes"
    const mySlot = session.playerIndex === 0 ? "p1Name" : "p2Name"
    if (orderedNames[mySlot]) {
      orderedNames[mySlot] = `${orderedNames[mySlot]}(${typeLabel})`
    }
  }

  const hideScore = this.rules.hideScoreHud?.() ?? false
  const isSagu = this.rules.rulename === "sagu"

  // Dynamic Star trigger (one point away from individual target)
  const p1Star = isSagu && orderedScores.p1 === p1Target - 1
  const p2Star = isSagu && orderedScores.p2 === p2Target - 1

  this.hud.updateScores(
    orderedScores.p1,
    orderedScores.p2,
    orderedNames.p1Name,
    orderedNames.p2Name,
    hideScore ? 0 : b,
    hideScore,
    p1Star,
    p2Star
  )
  this.setHudActivePlayer(active ?? this.inferActivePlayer())
}
```

---

## 4. Key Edge-Cases Handled Automatically

1. **No handicaps specified**: If the URL does not contain any `handicap_*` keys, `getHandicaps()` returns an empty dictionary. `getRaceTargetForPlayer()` will return the existing `ThreeCushionConfig.raceTo` target (7) for both players, preserving standard game behavior.
2. **Only one player specifies handicap**: If Player A specifies a handicap (e.g. `handicap_Alice=18`) but Player B does not, Player A's target will be 18, and Player B's target will default to `5` since `handicaps[opponentId]` is undefined.
3. **Challenging Bot**: When a player challenges a bot under handicap mode (e.g. player is `Bob` with `handicap_Bob=15`), the bot's clientId is `"bot"`. Since there is no `handicap_bot` in the URL, the bot's target resolves to `5`, exactly as requested.

---

## 5. Phased Implementation Approach

### Phase 1: Core Handicap Support in `Session`
- Introduce `getHandicaps()` and `getRaceTargetForPlayer()` on the `Session` class.
- Verify parsing with direct unit tests targeting the `Session` helper methods.

### Phase 2: Game Engine Win Condition Overrides
- Update `ThreeCushion.isEndOfGame` to evaluate scores against dynamic targets.
- Update `Sagu.isSuccessfulShot` to check for match points (`target - 1`) dynamically.

### Phase 3: HUD Name Formatting & Star Logic
- Modify `Container.updateScoreHud` to append handicaps to user names and dynamically compute the Sagu star (⭐) threshold.
- Verify HUD updates through local visual tests or mockup configurations.

### Phase 4: Verification and Unit Testing
- Write regression tests in `test/rules/threecushion.spec.ts` and `test/rules/sagu.spec.ts` mock-injecting query parameters to cover:
  - Both players with specified handicaps.
  - One player with a handicap and one defaulting to 5.
  - Challenges against a bot with player handicap.
  - Standard gameplay fallback when no handicaps are specified in the URL.
