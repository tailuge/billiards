# Proposal: Modal Chat Input with Soft Blur

This proposal outlines options for implementing a modal chat input that captures keyboard input and applies a soft blur to the background, addressing the conflict with the 3D view's keyboard handler.

## Current State Analysis

- **Keyboard Handling**: The `Keyboard` class (`src/events/keyboard.ts`) attaches `keydown` and `keyup` listeners to the 3D canvas and calls `e.preventDefault()` and `e.stopImmediatePropagation()`.
- **Chat Input**: The text input (`#inputTextDiv` in `dist/index.html`) is toggled via `src/view/comment.ts`. It attempts to capture focus but is currently just an overlaid `div`.
- **Conflict**: When the input is visible, the canvas still holds the main keyboard listeners. While `Comment.ts` adds a listener to the input to stop propagation, the global game loop still processes keyboard events if the canvas remains focused or if events leak.

---

## Option 1: CSS Overlay & Manual Focus (Least Intrusive)

This approach uses CSS for the visual blur and depends on strict focus management.

### Implementation:
- **CSS**: Add a full-screen overlay behind the `#inputTextDiv` with `backdrop-filter: blur(5px)`.
- **Focus**: Force focus to `#inputText` when shown. Use a "focus trap" listener to prevent the user from tabbing out of the modal.
- **Keyboard**: Rely on `e.stopImmediatePropagation()` in the input listeners to prevent events from reaching the canvas.

### Pros:
- Minimal changes to TypeScript logic.
- Purely additive CSS.

### Cons:
- Fragile; if focus shifts to the body or canvas (e.g., via mouse click outside), game controls may reactivate.
- `backdrop-filter` can have performance impacts on older mobile devices.

---

## Option 2: HTML5 `<dialog>` Element

Utilize the native `<dialog>` element which provides built-in modality.

### Implementation:
- **HTML**: Change `#inputTextDiv` from a `div` to a `<dialog>` element.
- **JS**: Use `dialog.showModal()` instead of `hidden = false`.
- **CSS**: Style the `::backdrop` pseudo-element with `backdrop-filter: blur(5px)`.

### Pros:
- **Native Modality**: `showModal()` automatically handles focus trapping and prevents interaction with elements outside the dialog.
- **Built-in Backdrop**: Standard way to handle blurred/dimmed backgrounds.

### Cons:
- Requires updating the `Comment` class to handle the dialog API.
- Might require a shim for very old browsers (though support is now broad).

---

## Option 3: Formal Input State Management (The Correct Approach)

Introduce a state machine or a "priority" flag in the `Container` to explicitly manage which component has keyboard authority.

### Implementation:
- **State**: Add an `inputLocked` or `activeUI` property to `Container.ts`.
- **Keyboard Logic**: Modify `Keyboard.getEvents()` or the `Container.processEvents()` loop to return early or skip processing if `inputLocked` is true.
- **Interaction**: When the chat opens, it sets `container.inputLocked = true`. On close, it sets it to `false`.

### Pros:
- **Robust**: Decouples game logic from DOM focus. Even if the canvas technically receives an event, the game engine explicitly ignores it.
- **Extensible**: This same system can be used for other modal UIs (settings, help menus, etc.).
- **Clean**: Eliminates the "race condition" feel of relying on `stopImmediatePropagation`.

### Cons:
- Requires modifications to the core `Container` and `Keyboard` classes.
- Slightly more complex implementation.

---

## Recommendation

**Option 3** combined with **Option 2** is the ideal solution. Using the `<dialog>` element provides the best accessibility and browser-native modality, while the formal Input State in the `Container` ensures the game engine is explicitly aware that it should be "paused" or "ignoring input," providing a seamless user experience.
