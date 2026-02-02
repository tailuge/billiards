# Notification System

This document outlines the design and implementation of the notification system in the Billiards project. Originally conceived as a foul reporting mechanism, it has been expanded into a general-purpose notification and dialogue system.

## Objective

To provide clear, real-time feedback to the player regarding game state, rules, and events without obstructing the core gameplay (aiming and shooting).

## UI Implementation

The system utilizes a dedicated overlay within the 3D view container.

### HTML Structure (`dist/index.html`)

```html
<div id="viewP1" class="view3d">
    <!-- Existing Score Overlay -->
    <div id="snookerScoreOverlay">
        <div id="snookerScore"></div>
    </div>
    <!-- New Notification Overlay -->
    <div id="notificationOverlay">
        <div id="notification"></div>
    </div>
</div>
```

### CSS Strategy (`dist/index.css`)

- **`#notificationOverlay`**: Uses `pointer-events: none` to allow the user to click through the overlay and interact with the 3D table (aiming/dragging).
- **`#notification`**: Uses `pointer-events: auto`. While currently used for text, this allows future interactive elements (buttons for rematches, etc.) to capture input.
- **Visuals**: Centered at the top of the screen with a subtle drop shadow for readability against the green cloth.

## Notification Types

1.  **Game Rules (Fouls):**
    - "Foul! In-off"
    - "Foul! Wrong ball hit"
    - "Foul! No cushion hit after contact"
2.  **Game State:**
    - "You Win!"
    - "Nine-ball spotted"
    - "Player 2's Turn"
3.  **Interactive (Future):**
    - "Rematch?"
    - "Opponent wants to restart"

## Implementation Plan

### 1. TypeScript Manager
Create a `Notification` view class in `src/view/notification.ts` (or extend `Hud`) to manage the `innerText` and visibility of the notification element.

### 2. Event Integration
The `Controller` and `Rules` sets should trigger notifications via `GameEvent` or a direct call to the notification manager.

### 3. Recording & Replay
Like respots and fouls, notification events must be captured by `src/events/recorder.ts`. This ensures that during playback, the same messages appear at the exact same timestamp as the original shot.

## Implementation Plan

### 1. Codebase Changes

#### View Layer (`src/view/notification.ts`)
- Create a `Notification` class similar to `Hud`.
- Methods: `show(message: string, duration?: number)`, `clear()`, `showAction(message: string, callback: Function)`.
- Use `setTimeout` for transient messages to ensure they don't linger.

#### Controller Layer (`src/controller/`)
- Initialize the `Notification` view in `src/controller/init.ts`.
- Update `ControllerBase` to provide a notification channel to the rules engine.

#### Rules Integration (`src/controller/rules/`)
- Modify `Rules.ts` (the interface/base) to include a `getNotification()` or similar method.
- Update `NineBall`, `Snooker`, and `FourteenOne` to return specific strings when fouls or milestones (e.g., "Sunk the 9!") occur.
- Since the system supports 2P, ensures notifications are triggered on both clients via the existing `MessageRelay` sync.

#### Event Recording (`src/events/recorder.ts`)
- Add a `NotificationEvent` type.
- Ensure `Recorder.record()` captures these events so that during `Replay`, notifications appear at the correct frames.

### 2. Multi-player (1P/2P) Integration
- The system must distinguish between "Local" and "Remote" notifications if necessary (e.g., "Your Turn" vs "Opponent's Turn").
- Logic for notifications should reside primarily in the Rules engine, which is already deterministic across both clients in a 2P session.

### 3. Testing Strategy

#### Unit Tests
- **View Test**: Create `test/view/notification.spec.ts` to verify the DOM is updated correctly and the `setTimeout` clears the message.
- **Rules Test**: Update `test/rules/nineball.spec.ts` to verify that a foul condition returns the expected notification string.

#### Integration Tests
- **Recorder Test**: Verify that a sequence of `PlayShot` -> `Foul` -> `Notification` is recorded and can be played back in `test/controller/replay.spec.ts`.

## UI/UX Guidelines
- **Non-blocking:** Notifications must never interfere with the `mousedown`/`mousemove` logic used for aiming.
- **Transience:** Simple status notifications should fade out after a few seconds.
- **Clarity:** Use high-contrast colors (currently yellow/white with black shadow) to ensure visibility on all table colors.