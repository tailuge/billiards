# Unified Solution for Iframe and Browser Back Button

In `exam.html` and `speedrun.html`, the game overlay uses an `iframe`. Currently, interactions with these overlays do not always play well with the browser's back button:

1.  **Exam**: Opening the overlay does not add a history state. Pressing 'back' while an exam shot is open navigates away from the exam page entirely.
2.  **Speedrun**: Opening the overlay adds a history state via `pushState`, but closing the overlay manually (via 'Close' or after a shot) does not remove that state from the history. This leaves a "dead" state where the back button does nothing but stay on the same page.
3.  **Iframe History**: Setting `iframe.src` can sometimes add entries to the session history, requiring multiple back-button presses to actually go back.

## Proposed Unified Solution

To provide a consistent and robust user experience, the following three-part strategy should be implemented in both `exam.js` and `speedrun.js`.

### 1. Unified History State Management

When opening the game overlay (on the 'Play' button click):

*   **Push State**: Use `history.pushState({ overlay: true }, "")` to mark that an overlay is now active in the browser history.
*   **Popstate Listener**: Implement a global `popstate` listener. If the event's state does not contain `overlay: true`, the listener should trigger the overlay's closing animation and cleanup.

### 2. Synchronized Manual and Automatic Closes

The UI should never close the overlay directly. Instead, it should request a history change:

*   **Quit/Close Buttons**: These should call `history.back()` instead of calling `closeOverlay()` directly.
*   **Automatic Completion**: When a shot is finished (e.g., the `stationary` or `speedrun-result` message is received), the handler should call `history.back()`.
*   **Decoupled Cleanup**: The actual logic for hiding the overlay and clearing the `iframe.src` should reside *only* in the function triggered by the `popstate` event. This ensures the UI is always in sync with the browser's back-forward state.

### 3. Avoiding Iframe History Bloat

To prevent the iframe's internal navigation from polluting the parent window's history:

*   **Use Replace**: When loading a new shot into the iframe, use `iframe.contentWindow.location.replace(url)` instead of setting `iframe.src = url`.
*   **Initial Load**: If the iframe does not yet have a document, `iframe.src` is acceptable for the very first load, but `location.replace` is preferred for all subsequent shot attempts.

## Expected Behavior

*   **Opening a shot**: Adds an entry to history.
*   **Pressing 'Back'**: Closes the shot overlay and returns to the list.
*   **Clicking 'Quit'**: Closes the shot overlay and removes the entry from history (via `history.back()`).
*   **Completing a shot**: Closes the overlay automatically and removes the entry from history.
*   **History remains clean**: The user can always use the browser's back button to return to the lobby or previous page without getting stuck in intermediate iframe states.
