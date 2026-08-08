# Design Proposal: Custom Cue Customization in Multiplayer Mode

This design proposal outlines an extensible and simple approach to support custom cue customization (such as custom colors) for players. In 2-player mode, the cue’s visual appearance dynamically transitions and changes depending on which player is currently playing the shot.

No code modifications are made under this proposal. This document merely acts as a blueprint plan/guide for future implementation.

---

## 1. Custom Cue Specification Format (`custom.cue`)

To keep configuration lightweight, extensible, and easy to parse, custom cue specifications are stored in a simple JSON-based format named `custom.cue` (which is standard JSON under the hood).

### Example `custom.cue`
```json
{
  "butt": {
    "color": "#1a1a1a",
    "shininess": 80
  },
  "shaft": {
    "color": "#d2b48c",
    "shininess": 50
  },
  "ferrule": {
    "color": "#e5e5e5",
    "shininess": 100
  },
  "tip": {
    "color": "#4a7c9a",
    "shininess": 5
  },
  "glow": {
    "color": "#00ff00",
    "enabled": false
  }
}
```

### Extensibility Advantages
- **Component-Level Specification:** Allows styling individual segments of the cue (butt, shaft, ferrule, tip) independently.
- **Support for More Parameters:** Can easily be extended to include material roughness, metalness, textures, custom patterns, or glowing particle shaders without breaking backward compatibility.

---

## 2. Multi-Player Propagation & Synchronization via URL Query Parameters

In 2-player mode, players' custom configurations are read from URL query parameters and populated into the active game `Session`.

### Loading Cue Data from `custom.` and `opponent.custom.` Parameters

The `Session` class (`src/network/client/session.ts`) provides a built-in mechanism in `applyUrlParams(params: URLSearchParams)` that automatically parses all URL query parameters matching certain prefixes:
- Parameters starting with `custom.` are saved to the local `session.customParams` dictionary.
- Parameters starting with `opponent.custom.` are saved to the local `session.opponentParams` dictionary.

For example, when a multiplayer match is launched, the page URL is constructed with:
`?custom.cueColor=%23ff0000&opponent.custom.cueColor=%230000ff`

Inside `Session`, these map to:
- `this.customParams["cueColor"] = "#ff0000"` (representing the current player's custom cue color)
- `this.opponentParams["cueColor"] = "#0000ff"` (representing the opponent's custom cue color)

This makes retrieving player-specific custom cue specifications trivial, without requiring any complex message broker handshakes.

---

## 3. How Turn State is Known

To switch cue colors dynamically, the client must know which player's turn is active. The active turn is tracked automatically by the `Container` and `Controller` lifecycle.

### Turn-Tracking Mechanism
1. **Controller States:** When a player is planning or shooting, the active controller is an instance of `Aim`, `PlaceBall`, or `PlayShot`. When they are watching the opponent, the active controller is an instance of `WatchAim` or `WatchShot`.
2. **`Container.inferActivePlayer`:** Inside `src/container/container.ts`, the container uses the following helper function to infer the active player based on the current controller state:
   ```typescript
   inferActivePlayer(controller: Controller = this.controller): ActivePlayer {
     if (
       controller instanceof Aim ||
       controller instanceof PlaceBall ||
       controller instanceof PlayShot
     ) {
       return this.myHudSlot() // 1 or 2 (self)
     }
     if (controller instanceof WatchAim || controller instanceof WatchShot) {
       return this.opponentHudSlot() // 2 or 1 (opponent)
     }
     return 0 // Neutral / spectator / initialization
   }
   ```
3. **Turn Transition Trigger:** When a state transition occurs in `Container.updateController(controller)`, the container infers the active player and invokes `setHudActivePlayer(active)`. This is the perfect central hook to trigger the custom cue mesh material change.

---

## 4. Single Object Material Re-binding vs. Multiple Cue Objects in Three.js

We can choose between two main structural approaches to update the cue's appearance in Three.js:
1. **Single Cue Object (Material Re-binding):** A single cue mesh exists on the table. When the turn switches, we update the existing material properties or re-bind new materials on the same geometry.
2. **Two Cue Objects (Visibility Toggling):** Create two separate cue mesh instances in the scene (e.g., `cueP1` and `cueP2`). When the turn switches, we toggle their visibility: `cueP1.visible = true; cueP2.visible = false;`.

### Performance & Architectural Comparison

| Attribute | Single Object (Changing Materials) | Multiple Objects (Visibility Toggling) |
| :--- | :--- | :--- |
| **Memory Footprint** | **Excellent.** Minimal memory usage since geometry and mesh node structures are shared/re-used. Only materials or basic material properties are altered. | **Low-Moderate.** Two distinct Three.js Node hierarchies, geometry groups, and separate materials exist in memory. |
| **GPU/Draw Call Efficiency** | **Excellent.** No additional scene graph overhead. The number of nodes/vertices processed remains exactly the same. Modifying uniform values (like `.color`) is extremely fast. | **Excellent.** Three.js ignores hidden objects (`visible = false`) during frustum culling and the rendering pass. Thus, there is zero draw call penalty for the hidden cue. |
| **Implementation Simplicity** | **High.** Requires traversing the `cueBody` child meshes at runtime on turn change and mutating material properties (e.g., `material.color.setHex()`). | **High.** Simplifies instantiation. You create two independent `Cue` objects on startup with fixed materials, and simply swap which one is added/visible in the scene. |
| **State Preservation** | **Slightly Complex.** Since there is only one cue mesh, if a player's color changes, you must ensure the transition doesn't interfere with active hit animations or spin offset calculations. | **Trivial.** Each cue object maintains its own local position, rotation, and animation state independently if desired, though usually the cue is bound to the current aim state anyway. |

### Recommendation: Single Cue Object with Material Property Modification (Most Efficient)
In Three.js, changing uniform properties (such as color, roughness, and shininess) on existing `MeshPhongMaterial` instances is extremely efficient and does not trigger shader recompilation, as long as the material program/type remains the same.

To achieve maximum efficiency:
- Create the cue meshes once on startup.
- Instantiate dedicated materials for Player 1 and Player 2 (or a pool of materials).
- On turn switch, simply swap the `.material` references on the children of `cueBody` (e.g., `shaftMesh.material = p1ShaftMaterial;`). This re-associates the GPU-uploaded geometry with the correct material parameters in $O(1)$ time, avoiding any costly scene graph reconstruction or memory leaks.
