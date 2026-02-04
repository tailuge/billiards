# Lobby Rework Plan

This document outlines the steps to rework the lobby screen, specifically
addressing the "Create New Game" button visibility.

## Objective

Hide the "Create New Game" button if there is currently a game waiting
to start in the lobby. The button should reappear after a timeout
if no one joins the game.

## Proposed Implementation Steps

### 1. New Lobby Component

- Create `src/view/lobby.ts` (reworking the current `LobbyIndicator`).
- This component will handle the display of available games and the
  creation of new games.

### 2. Track Waiting Games

- Subscribe to the `lobby` channel via `MessageRelay`.
- Listen for messages indicating a game has been created:

  ```json
  { "action": "table_created", "tableId": "..." }
  ```

- Listen for messages indicating a game has been joined or expired:

  ```json
  { "action": "table_joined", "tableId": "..." }
  ```

### 3. Button Visibility Logic

- Maintain a local state `isGameWaiting`.
- When `table_created` is received, set `isGameWaiting = true`.
- When `table_joined` or `table_expired` is received, set `isGameWaiting = false`.
- Bind the visibility of the "Create New Game" button (ID `create-game`)
  to `!isGameWaiting`.

### 4. Timeout Mechanism

- To prevent the button from being hidden indefinitely (e.g., if a player
  creates a game but then leaves), implement a 30-second timeout.
- This 30-second value is chosen to align with the existing reconnection
  timeout in `src/network/NCHANUSAGE.md`.
- When `table_created` is received, start a timer:

  ```typescript
  this.timeoutId = window.setTimeout(() => {
    this.isGameWaiting = false;
    this.updateButtonVisibility();
  }, 30000);
  ```

- Clear the timer if `table_joined` is received before it expires.

### 5. Integration

- Update `src/container/container.ts` to instantiate the new `Lobby`
  component.
- Ensure it has access to the `MessageRelay`.

## Verification Plan

- Unit test for `Lobby` component state transitions.
- Mock `MessageRelay` to simulate `table_created` and `table_joined` messages.
- Verify that the button visibility toggles correctly.
- Verify that the 30-second timer correctly restores button visibility.
