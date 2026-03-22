# Rematch Feature Implementation Plan

This document outlines the implementation plan for the rematch feature, which uses a query parameter to track match scores and session details across multiple games.

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

## 2. Session State Management
- Update the `Session` class in `src/network/client/session.ts` to include an optional `rematchInfo?: RematchInfo` property.
- Ensure `Session` provides access to the local user's ID (`clientId`) and current game scores to facilitate updates.

## 3. Initialization and Parsing
In `src/container/browsercontainer.ts`:
- In the `constructor`, extract the `rematch` query parameter from the URL.
- Parse the parameter using `JSON.parse(decodeURIComponent(rematchParam))`.
- Store the parsed object in `Session.getInstance().rematchInfo`.

## 4. Notifications
In `src/container/browsercontainer.ts`'s `onAssetsReady` method:
- If `Session.getInstance().rematchInfo` is present, trigger a local notification.
- **Notification Details**:
  - **Type**: `Info`
  - **Title**: `Match Score`
  - **Subtext**: Display the current series score (e.g., "Bob 2 - 1 Alex") simply display it no logic

## 5. UI: Game Over Screen
In `src/utils/gameover.ts`:
- Add a new button template to `gameOverButtons`:
  ```javascript
  rematch: '<button data-notification-action="rematch">Rematch</button>'
  ```
-  Determine the game winner using existing logic.
   Create an updated `rematchInfo` object:
     - Increment the `score` for the winner's `userId` in the `lastScores` array.
     - Set `nextTurnId` to the `userId` of the player who lost (to ensure they start the next game).
- Show the updated match score possiblyl using subtext of the notification
- Update `gameOverButtons.forMode(isSinglePlayer, hasRematch)` to include the `rematch` button if `hasRematch` is true and it's not a single-player/bot game.
- logic will work from winnner and losers perspective
  
In `src/network/client/matchresult.ts`:
- Update `notifyWin`, `notifyLoss`, and `sendLossNotification` to pass `!!session?.rematchInfo` to `gameOverButtons.forMode`.

## 6. Rematch Action Handling
In `src/view/notification.ts`, update `handleAction(action: string)`:
- Add a handler for the `"rematch"` action.
- **Logic**:
  1. Retrieve the current `rematchInfo` from the session.
  4. Encode the updated object: `encodeURIComponent(JSON.stringify(updatedRematch))`.
  5. Redirect the user to the lobby URL with the updated `rematch` parameter:
     - `globalThis.location.href = LOBBY_URL + "?rematch=" + encodedRematch;` (while also preserving `userId` and `userName` if present).

## 7. Verification
- Verify the "Match Score" notification appears correctly at the start of a game when the `rematch` parameter is present.
- Verify the "Rematch" button is visible on the game-over screen in multiplayer matches started with a rematch object.
- Verify that clicking "Rematch" correctly updates the scores and next turn ID, and redirects to the lobby with the new state.
