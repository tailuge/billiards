# Notification System

This document outlines the design and implementation of the notification system for the Billiards project. The system provides real-time feedback to players regarding game state, rules, and events without obstructing core gameplay.

## Objective

Deliver clear, non-intrusive visual feedback for events such as:
- Rule violations (Fouls)
- Game state changes (Turn transitions, Game Over)
- Synchronization messages (Opponent actions)

## UI Design

The system uses an overlay positioned in the upper-center of the 3D view.

### DOM Structure
Already implemented in `dist/index.html`:
- `#notificationOverlay`: A full-width container centered at the top.
- `#notification`: The actual message box.

### CSS Strategy
Defined in `dist/index.css`:
- **Transparency**: `pointer-events: none` on the overlay ensures clicks pass through to the 3D table for aiming.
- **Interactivity**: `pointer-events: auto` on the message box allows for future interactive elements (e.g., "Rematch" buttons).
- **Legibility**: High-contrast text with a drop shadow for visibility against varied table colors.

---

## Implementation Plan

The implementation is divided into three sequential phases.

### Phase 1: Core Infrastructure (COMPLETED)
**Goal**: Establish the TypeScript classes and integration needed to display notifications on a single client.

1. **View Component (`src/view/notification.ts`)** (Done)
   - Create a `Notification` class (optionally extending `Hud`).
   - Implement `show(message: string, duration?: number)`: Updates the `#notification` element and handles automatic clearing via `setTimeout`.
   - Implement `clear()`: Immediately hides the notification.

2. **Container Integration (`src/container/container.ts`)** (Done)
   - Add a `notification: Notification` property to the `Container` class.
   - Instantiate it in the `Container` constructor alongside `Hud` and `Chat`.

3. **Controller Access** (Done)
   - Since `ControllerBase` has access to the `Container`, notifications can now be triggered from any state using `this.container.notification.show(...)`.

4. **Verification** (Done)
   - Unit tests implemented in `test/view/notification.spec.ts`.

### Phase 2: Network Synchronization (COMPLETED)
**Goal**: Ensure notifications are synchronized across both clients in multi-player mode.

1. **Event Definition (`src/events/notificationevent.ts`)** (Done)
   - Create `NotificationEvent` extending `GameEvent`.
   - Add `NOTIFICATION` to `EventType` in `src/events/eventtype.ts`.
   - Update `EventUtil.fromSerialised` to handle the new event type.

2. **Broadcasting** (Done)
   - Implement logic to broadcast `NotificationEvent` via the `MessageRelay` when a persistent notification is required for both players.
   - Update `Controller` handlers to process incoming `NotificationEvent`s and call the view layer.

### Phase 3: Game Logic Integration (COMPLETED)
**Goal**: Connect the notification system to the rules engine and game flow.

1. **Rules Engine Integration (`src/controller/rules/`)** (Done)
   - [x] Implement "Foul!" notification in `NineBall` using `container.notify()`.
   - [x] Rework the foul method so that the reason for the foul can be notified.
   - [x] Implement specific foul messages in `NineBall`,(e.g., "Foul! Wrong ball hit").
   - [x] Notification will show FOUL, reason, and ball in hand status. 
   - [x] Add a 'Game Over' notification with win/lose depending on potting the 9.
2. **Validation & Testing** (Done)
   - [x] Unit tests for `NineBall` foul notification.
   - [x] Integration tests in `nineball.spec.ts` to verify fouls trigger the correct notification strings.

---

## UI/UX Guidelines
- **Transience**: Informational messages should disappear after 2-3 seconds.
- **Persistence**: Critical messages (e.g., "Foul! Ball-in-hand") should remain until the next action.
- **Minimalism**: Keep text concise to avoid cluttering the view.


* Feedback For Nineball Notifications.

The notification overlay UX needs improving. It should have distinct parts for Foul/GameOver with a subtext for the reason (and possibly a third part e.g. ball in hand) possibly no a subtle translucent card. On game over it should also persist longer maybe 10 seconds and indicate win  or loss in 2 player mode. The game over might also show playername defeated opponent name. 
