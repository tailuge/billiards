# Rematch Feature Plan

This document outlines the implementation plan for the rematch feature using a compressed JSON query parameter to track match scores and facilitate return challenges.

## 1. Data Structure
Define the `RematchInfo` interface in `src/network/client/session.ts`:

```typescript
export interface RematchInfo {
  opponentId: string;
  opponentName: string;
  ruleType: string;
  lastScores: { userId: string; score: number }[];
  nextTurnId: string;
}
```

## 2. Session Update
- Add an optional `rematchInfo?: RematchInfo` property to the `Session` class in `src/network/client/session.ts`.

## 3. Initialization in BrowserContainer
In `src/container/browsercontainer.ts`:
- In the constructor, check for the `rematch` query parameter.
- If present, uncompress it using `JSONCrush.uncrush(rematchParam)` and `JSON.parse`.
- Store the resulting object in `Session.getInstance().rematchInfo`.
- In `onAssetsReady()`, if `rematchInfo` exists, show a local notification:
  - **Title**: `Match Score`
  - **Subtext**: e.g., `You 2 - 1 Alex` (derived from `lastScores` by matching `userId` against `session.clientId`).

## 4. Game Over UI
- In `src/utils/gameover.ts`:
  - Add `rematch: '<button data-notification-action="rematch">Rematch</button>'` to `gameOverButtons`.
  - Update `forMode(isSinglePlayer: boolean, hasRematch: boolean)` to return the rematch button if `hasRematch` is true and it's not a single-player/bot game.
- In `src/network/client/matchresult.ts`:
  - Update calls to `gameOverButtons.forMode` to pass `!!session?.rematchInfo`.

## 5. Handling Rematch Action
In `src/view/notification.ts`, update `handleAction(action: string)`:
- Add a case for `"rematch"`.
- Logic:
  1. Retrieve `rematchInfo` from `Session.getInstance()`.
  2. Determine the winner/loser of the current game (can be passed or inferred from the last game state).
  3. Create an updated `RematchInfo` object:
     - Increment the score in `lastScores` for the winner's `userId`.
     - Set `nextTurnId` to the loser's `userId`.
  4. Compress the updated object: `JSONCrush.crush(JSON.stringify(updatedRematch))`.
  5. Construct the lobby URL:
     - Use the same logic as the "lobby" action but add the `rematch` parameter.
     - Redirect: `globalThis.location.href = ...`.

## 6. Verification
- Verify that the match score notification appears at game start when the `rematch` param is present.
- Verify that the "Rematch" button appears only in games started via a rematch link.
- Verify that clicking "Rematch" redirects to the lobby with correctly updated scores and next turn info in a crushed JSON format.
