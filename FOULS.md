# Foul Communication Investigation

## Current State
Fouls are correctly detected by the physics engine and game rules logic, but they are poorly communicated to the users.

### Nine-ball / Fourteen-one
- Fouls are detected in `isFoul()`.
- No visual or textual feedback is provided to either the shooter or the opponent.
- The game state simply transitions to `PlaceBall` (shooter) or `WatchAim` (opponent), which might be confusing without an explanation.

### Snooker
- Fouls are detected and points are calculated.
- Foul information is logged to the browser console (`console.log`), which is not visible to players.
- No `ChatEvent` or other UI notification is triggered.

```typescript
// Example from src/controller/rules/snooker.ts
if (this.foulPoints > 0) {
  console.log(`foul, ${this.foulPoints} to opponent`)
}
```

## Proposed Solution: Notification System

### 1. Extend Chat Protocol
The existing `ChatEvent` and `Chat` view can be used to display foul and status notifications.
- **Pros:** Low effort, leverages existing synchronization and UI.
- **Cons:** Messages might get lost in a busy chat; lacks "visual punch".

### 2. Dedicated "Toast" Notifications
Introduce a new notification mechanism (e.g., `NotificationEvent` or extending `ChatEvent` with a `type` field).
- **UI Implementation:** A "toaster" style overlay that appears briefly.
- **Mobile Friendly:** Should be positioned where it doesn't interfere with touch controls (e.g., top-center) and be legible on small screens.
- **Integration:** A dedicated `ToastView` or similar to handle these events.

### 3. Game Over & Status Notifications
The notification system should handle more than just fouls:
- **Game End:** "You Win!", "Opponent Wins", "Match Over".
- **Freeform Alerts:** General system messages or game status updates.
- **In-Game Events:** "Ball Potted!", "Safety Shot", "Maximum Break!".

## UI/UX Guidelines for Notifications
To ensure the system is helpful without being intrusive:
- **Location:** Top-center of the viewport is generally best for mobile, keeping the table area relatively clear for aiming and shot execution.
- **Duration:** 2-3 seconds for minor fouls, slightly longer (5 seconds) for game-over results.
- **Visuals:** Semitransparent backgrounds to maintain context of the game. Color-coding for different types (e.g., red for fouls, gold for wins, white for general info).
- **Non-blocking:** Notifications should never block input; they are purely informational overlays.

## Implementation Plan
- **Rule Updates:** Modify `NineBall.ts`, `Snooker.ts`, etc., to push notifications when significant events occur (fouls, win conditions).
- **View Update:** Create a `src/view/toast.ts` component to manage the lifecycle (show/fade-out) of these messages.
- **Network:** Ensure events are broadcast to both players.
- **Recorder:** Captured by `src/events/recorder.ts` for playback fidelity.

## Considerations for Recorder
Like respots, foul notifications should be captured by `src/events/recorder.ts` to ensure that when a game is replayed, the "Foul!" messages appear at the correct moments, making the playback educational and accurate.
