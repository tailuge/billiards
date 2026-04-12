# Analysis: Missing Final Break in Notification

## Issue
At the end of a game, if a player wins with a shot that completes a break, that break is visible in the ball tray but missing from the "High Breaks" list in the "YOU WON" or "GAME OVER" notification.

## Root Cause
The notification is triggered by `MatchResultHelper.presentGameEnd` which is called *inside* `rules.update(outcome)`. However, the recorder only adds the final break to the tray *after* `rules.update` returns to `PlayShot.handleStationary`.

By the time the notification is rendered, the tray hasn't been updated with the final winning break.

## Proposed Fix (Minimal & Decoupled)
The fix involves updating the notification with the latest breaks once the game has fully transitioned to the `End` state. This ensures that the recorder has finished its work and the tray is fully populated.

### 1. Update `src/view/notification.ts`
Add a public method to update only the high breaks in the existing notification footer.
```typescript
  updateHighBreaks(highBreaks?: NotificationHighBreak[]) {
    const footer = this.element.querySelector(".notification-footer");
    if (footer) {
      // Find or create the high-breaks container within the footer
      let container = footer.querySelector(".notification-high-breaks");
      if (!container) {
        container = document.createElement("div");
        container.className = "notification-high-breaks";
        footer.prepend(container);
      }
      container.innerHTML = highBreaks 
        ? highBreaks.slice(0, 3).map(hb => this.renderHighBreakButton(hb)).join("") 
        : "";
    }
  }
```
*(Note: `renderHighBreakButton` will be extracted from `renderHighBreaks` for reusability)*

### 2. Update `src/network/client/matchresult.ts`
Make `getHighBreaks` public so it can be called from the `End` controller.
```typescript
  public static getHighBreaks(container: Container): NotificationHighBreak[] { ... }
```

### 3. Update `src/controller/end.ts`
In `onFirst()`, fetch the latest breaks and update the notification.
```typescript
  override onFirst(): void {
    // ... existing logic ...
    const highBreaks = MatchResultHelper.getHighBreaks(this.container);
    this.container.view.notification.updateHighBreaks(highBreaks);
  }
```

## Benefits
- **Surgical**: No changes to complex scoring or recorder logic.
- **Robust**: Works for all game-ending scenarios (shots, concessions, etc.).
- **Deterministic**: Leverages the natural lifecycle of the `End` controller.
