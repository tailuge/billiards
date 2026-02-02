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
The existing `ChatEvent` and `Chat` view can be used to display foul notifications.
- **Pros:** Low effort, leverages existing synchronization and UI.
- **Cons:** Foul messages might get lost in a busy chat; lacks "visual punch" of a dedicated foul indicator.

### 2. Dedicated "Toast" Notifications
Introduce a new notification mechanism (e.g., `NotificationEvent` or extending `ChatEvent` with a `type` field).
- **UI Implementation:** A "toaster" style overlay that appears briefly in the center or top of the screen.
- **Integration:** The `Chat` view or a new `NotificationView` could handle these events.

### 3. Implementation Plan
- **Rule Updates:** Modify `NineBall.ts`, `Snooker.ts`, etc., to push a `ChatEvent` (or new event type) when a foul is detected.
- **UI Update:** Enhance `src/view/chat.ts` or create a new component to render these as distinct notifications (e.g., using different colors or a temporary overlay).
- **Network:** Ensure the event is broadcast to the opponent so they know why they are suddenly placing the ball or starting their turn.

## Considerations for Recorder
Like respots, foul notifications should be captured by `src/events/recorder.ts` to ensure that when a game is replayed, the "Foul!" messages appear at the correct moments, making the playback educational and accurate.
