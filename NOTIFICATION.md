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

The implementation is broken into two phases. Phase 1 focuses on building the core infrastructure for displaying, sending, and recording notifications. Phase 2 will integrate this system with the game rules engines.

### Phase 1: Notification Infrastructure

This phase covers the foundational work to get notifications appearing on-screen, synchronized in 2P games, and captured for replays.

#### 1. View Layer (`src/view/notification.ts`)
- **Objective:** Create a `Notification` class to manage the DOM element.
- **Details:**
    - Create a class similar to `Hud`.
    - Implement methods: `show(message: string, duration?: number)`, `clear()`. The `duration` parameter will use `setTimeout` to automatically hide transient messages.
    - Add a `showAction(message: string, actions: { [label: string]: Function })` method for future interactive dialogs (e.g., "Rematch?").

#### 2. Controller Integration
- **Objective:** Make the notification system accessible to the rest of the application.
- **Details:**
    - Instantiate the `Notification` view in `src/container/browsercontainer.ts`.
    - Update `ControllerBase` to hold a reference to the notification instance, making it available to all controller states and rules engines.

#### 3. Event Recording & Replay (`src/events/`)
- **Objective:** Ensure notifications are saved and replayed correctly.
- **Details:**
    - Define a `NotificationEvent` in `src/events/` to encapsulate the message content and timing.
    - Update `src/events/recorder.ts` to capture `NotificationEvent`s.
    - Ensure the `Replay` controller can process these events to display messages during playback.

#### 4. Testing Strategy (Phase 1)
- **Unit Test (`test/view/notification.spec.ts`):** Verify that calling `show()` updates the DOM and that `setTimeout` is correctly used for clearing.
- **Integration Test (`test/controller/replay.spec.ts`):** Record a sequence of events including a `NotificationEvent` and verify it appears during replay.

---

### Phase 2: Rules and Game Logic Integration

With the infrastructure in place, this phase focuses on generating meaningful notifications from the game's rules engines.

#### 1. Rules Engine Integration (`src/controller/rules/`)
- **Objective:** Trigger notifications for fouls, game state changes, and other events.
- **Details:**
    - Modify the `Rules` interface (`src/controller/rules/rules.ts`) to provide a mechanism for the rules engine to emit notifications.
    - Update specific rule implementations (`NineBall`, `Snooker`, `FourteenOne`) to generate notification strings for events like:
        - Fouls ("Foul! Wrong ball first.")
        - Game milestones ("Player 1 wins!")
        - Ball-in-hand status.

#### 2. Multi-player Considerations (1P/2P)
- **Objective:** Ensure notifications are relevant to the current player.
- **Details:**
    - The `Rules` engine is deterministic and runs on both clients, so foul notifications will be inherently synchronized.
    - For player-specific messages (e.g., "Your Turn" vs. "Opponent's Turn"), the logic will reside in the `Controller` state transitions, which already manage turn-taking.

#### 3. Testing Strategy (Phase 2)
- **Rules Unit Tests:**
    - Update `test/rules/nineball.spec.ts`, `snooker.spec.ts`, etc.
    - In test scenarios that result in a foul or game end, assert that the `Rules` engine produces the expected notification message.

## UI/UX Guidelines
- **Non-blocking:** Notifications must never interfere with the `mousedown`/`mousemove` logic used for aiming. This is achieved with `pointer-events: none` on the overlay container.
- **Transience:** Simple status notifications should fade out after a few seconds.
- **Clarity:** Use high-contrast colors (currently yellow/white with black shadow) to ensure visibility on all table colors.