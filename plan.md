# Plan: Chat Protocol Augmentation & Line Drawing

## 1. Chat Protocol Augmentation
The `ChatEvent` will be augmented with an optional `line` property to support sharing drawn lines between players.

### Data Structure
A `ChatEvent` can now include a `line` object:
```json
{
  "type": "CHAT",
  "sender": "clientId",
  "message": "Optional message text",
  "line": {
    "p1": { "x": number, "y": number },
    "p2": { "x": number, "y": number },
    "colour": "hex_string"
  }
}
```

### Backward Compatibility
Older clients that do not recognize the `line` property will ignore it and only display the `message` (if any). This ensures the game remains stable across different versions.

## 2. Right-click to Draw
Players can draw a line on the table by right-clicking and dragging.

### Implementation Details
- **Interaction**: The `View` class will listen for `pointerdown`, `pointermove`, and `pointerup` events.
- **Trigger**: Right-click (`button === 2`) initiates line drawing.
- **Projection**: Screen coordinates are projected onto the table plane ($Z=0$) using a `THREE.Raycaster`.
- **Preview**: A temporary line is shown in the 3D scene while dragging.
- **Communication**: Upon release, a `ChatEvent` containing the line coordinates is broadcast via the `Container`.

## 3. Line Rendering
When a `ChatEvent` with a `line` property is received:
- The `ControllerBase.handleChat` method triggers `View.addLine`.
- `View.addLine` creates a `THREE.Line` in the 3D scene.
- The line is temporary and will be removed after a short duration (e.g., 5 seconds) to keep the table clean.
