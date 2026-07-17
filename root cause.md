# Sagu Billiards Game Match Target Discrepancy - Root Cause Analysis

## Executive Summary
During a Sagu (Korean Four-Ball) match played with a URL-configured target score (`raceTo=5`), the game HUD correctly showed a star (⭐) when a player reached **4 points** (indicating match point). However, the next point was successfully scored without completing the required 3-cushion carom shot, bringing the player's score to **5 points**, and the game did not terminate.

This issue is caused by a structural inconsistency in how the **match target (race limit)** is resolved in the codebase. While the **HUD rendering logic** correctly references the URL parameter `raceTo` via `ThreeCushionConfig.raceTo`, both the **Sagu rules validation** (`isSuccessfulShot`) and the **game termination checks** (`isEndOfGame`) retrieve the player's target score by calling `Session.getRaceTargetForPlayer()`. When no handicap query parameters (such as `handicap_<clientId>=X`) are provided in the URL, `getRaceTargetForPlayer` returns a hardcoded default value of `7`, completely ignoring `ThreeCushionConfig.raceTo`.

---

## Detailed Code Investigation

### 1. Match Target Parsing and Setting (`BrowserContainer`)
In `src/container/browsercontainer.ts`, the URL-specified `raceTo` parameter is correctly parsed and assigned:
```typescript
ThreeCushionConfig.raceTo =
  Number.parseInt(params.get("raceTo") ?? "7") || 7
```
For the user's URL, `ThreeCushionConfig.raceTo` is correctly initialized to `5`.

### 2. Match Target Resolution for Rule Logic (`Session`)
In `src/network/client/session.ts`, the `getRaceTargetForPlayer` method is defined as follows:
```typescript
getRaceTargetForPlayer(clientId: string): number {
  const handicaps = this.getHandicaps()
  const hasAnyHandicap = Object.keys(handicaps).length > 0

  if (!hasAnyHandicap) {
    return 7 // ThreeCushionConfig.raceTo is 7
  }

  // If a handicap exists in URL for this client, use it; otherwise, default to 5 (handles opponent or bot)
  return handicaps[clientId] ?? 5
}
```
**The Flaw**:
If there are no `handicap_` query parameters in the URL, `hasAnyHandicap` is `false`. In this case, `getRaceTargetForPlayer` returns the literal hardcoded number `7` (accompanied by a comment stating that it represents `ThreeCushionConfig.raceTo`, which is incorrect because it does not actually reference the `ThreeCushionConfig.raceTo` property).

### 3. Star (⭐) Indicator Rendering Logic (`Container`)
In `src/container/container.ts`, `updateScoreHud` computes the target scores used for HUD display:
```typescript
let p1Target = ThreeCushionConfig.raceTo
let p2Target = ThreeCushionConfig.raceTo

if (hasHandicaps) {
  // ... gets targets via session.getRaceTargetForPlayer ...
}
```
Since there are no handicap parameters in the URL, `hasHandicaps` is `false`. Thus, both `p1Target` and `p2Target` remain set to `ThreeCushionConfig.raceTo` (which is `5`).

The HUD star display checks are computed as:
```typescript
const p1Star = isSagu && orderedScores.p1 === p1Target - 1
const p2Star = isSagu && orderedScores.p2 === p2Target - 1
```
For `p1Target = 5`, `p1Target - 1 = 4`. Therefore, when the player reaches **4 points**, the star indicator correctly becomes visible next to their score in the HUD.

### 4. Rule Validation Logic (`Sagu`)
In `src/controller/rules/sagu.ts`, a 3-cushion shot is required on match point:
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
At score `4`, Sagu checks if the player is at match point:
* `myCurrentScore` is `4`.
* `myTarget` is retrieved via `session.getRaceTargetForPlayer(session.clientId)`. Since there are no handicap parameters, this returns `7`.
* Sagu evaluates `myCurrentScore === myTarget - 1` (i.e. `4 === 6`), which is `false`.
* As a result, the 3-cushion match-point requirement is bypassed. A normal shot that only contacts both red balls (`this.hitsBothReds`) is allowed, scoring a point and moving the score to `5`.

### 5. Match Termination Logic (`ThreeCushion`)
The game termination check is inherited by Sagu from `ThreeCushion` in `src/controller/rules/threecushion.ts`:
```typescript
isEndOfGame(_: Outcome[]): boolean {
  const session = Session.getInstance()
  // ... resolves p1ClientId and p2ClientId ...
  const p1Target = session.getRaceTargetForPlayer(p1ClientId)
  const p2Target = session.getRaceTargetForPlayer(p2ClientId)

  const { p1: s1, p2: s2 } = session.orderedScoresForHud()

  return s1 >= p1Target || s2 >= p2Target
}
```
Because `session.getRaceTargetForPlayer()` is used to fetch the targets:
* Both `p1Target` and `p2Target` are resolved to `7`.
* When the player reaches `5` points, `s1 >= p1Target` evaluates to `5 >= 7`, which is `false`.
* Thus, the game does not terminate.

---

## Conclusion
The bug stems from `Session.getRaceTargetForPlayer()` hardcoding `7` as the default target instead of dynamically returning the parsed `ThreeCushionConfig.raceTo` value when no player-specific handicaps are defined.

This leads to a mismatch where:
1. The **HUD** correctly uses `ThreeCushionConfig.raceTo = 5`, displaying the star at `4` points (5 - 1).
2. The **Rule Engine & End of Game Logic** incorrectly use the hardcoded default `7`, requiring the player to score standard caroms up to `6` points (7 - 1) before enforcing the 3-cushion requirement, and requiring `7` points to terminate the game.
