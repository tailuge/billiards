# Opponent Disconnection Detection Proposal

## Overview
In 2-player multiplayer mode, it is important to know if the opponent has disconnected or left the game. This can be achieved by leveraging the presence information already provided by the nchan-based messaging system.

## Detection Mechanism
The `@tailuge/messaging` library maintains a lobby presence list. The `LobbyIndicator` component already joins this lobby and receives updates via `onUsersChange` whenever the list of online users changes.

### 1. Presence Data
Each user in the lobby broadcasts a `PresenceMessage` containing:
- `userId`: The unique ID of the player.
- `tableId`: (Optional) The ID of the table they are currently at.

### 2. Identifying the Opponent
The `Session` object stores the `opponentClientId` and the current `tableId`.

### 3. Monitoring Logic
The `LobbyIndicator.onUsersChange` callback provides the full list of online users. We can determine the opponent's status by:
1. Filtering the list for users whose `tableId` matches the current game's `tableId`.
2. Checking if the `opponentClientId` is present in this filtered list.

If the opponent is missing from the list, they have disconnected, closed their tab, or navigated away from the game page.

## Proposed Implementation

### LobbyIndicator Enhancement
Modify `LobbyIndicator` to:
- Expose a method to register an opponent status listener: `onOpponentStatusChange(callback: (online: boolean) => void)`.
- In its `onUsersChange` handler, compare the current set of users at the table against the `opponentClientId` from `Session`.
- Invoke the registered callback whenever the opponent's online status changes.

### Container Integration
The `Container` (or `BrowserContainer`) should:
- Register a listener with `LobbyIndicator` during initialization.
- When notified that the opponent is offline:
    - Use `this.notifyLocal` to show an "Opponent disconnected" message (e.g., as an `Info` or `Warning` notification).
- When notified that the opponent is back online:
    - Use `this.notifyLocal` to show an "Opponent reconnected" message.

## Edge Cases and Considerations
- **Network Flakiness**: Nchan heartbeats and pruning intervals (typically 60-90s) mean there might be a delay in detecting a disconnect.
- **Spectators**: Presence data currently does not distinguish between players and spectators at a table. However, since we track the specific `opponentClientId`, we can accurately monitor the opponent player specifically.
- **Initial Connection**: The detection should only start once the game has successfully begun and both players have initially exchanged client IDs.
