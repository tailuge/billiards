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

## 2. Multi-Player Propagation & Synchronization

In 2-player mode, each player loads their local `custom.cue` on startup. To make the opponent's cue visual visible to the other client, we can utilize URL parameters or network synchronization.

### Option A: URL Parameters (Easiest & Most Robust)
1. On page load, the client reads the local `custom.cue`.
2. The custom cue color values (e.g., `#ff0000` for P1, `#0000ff` for P2) are serialized as standard query parameters when entering the lobby:
   - `custom.cue.buttColor=#ff0000`
   - `custom.cue.shaftColor=#ffffff`
3. The rematch/lobby url propagation mechanisms in `src/utils/gameover.ts` and `Session` (`applyUrlParams`) already filter or load `custom.*` parameters into `session.customParams` (for self) and `session.opponentParams` (for opponent).
4. Both clients immediately know each other's custom cue configuration without needing additional peer-to-peer network messages.

### Option B: Handshake Presence Payload
1. During the initial lobby connection/join presence payload, each client publishes their `custom.cue` configuration under an `options` block (similar to how `tableSize` is handled in `LobbyIndicator`).
2. When the opponent presence changes, their custom cue parameters are cached in the local `Session` state.

---

## 3. Dynamic Three.js Material Color Updates

The visual representation of the cue is managed by `CueMesh` inside `src/view/cuemesh.ts` (generating the meshes) and `Cue` in `src/view/cue.ts` (handling position/rotation/animation updates).

### Accessing Meshes inside `Cue`
When the cue is generated via `CueMesh.createCue(...)`, the individual components are stored inside a Three.js `Group` (`cueBody`):
- `butt` is the first child (index `0` or name-matched).
- `shaft` is the second child (index `1`).
- `ferrule` is the third child (index `2`).
- `tip` is the fourth child (index `3`).

To dynamically change the cue color:
1. We can introduce a helper method `updateCueColors(spec)` on the `Cue` class:
   ```typescript
   class Cue {
     // ...
     updateCueColors(spec: CueSpec) {
       if (!this.cueBody) return;

       // Traverse or index children of cueBody to find meshes and update materials
       this.cueBody.traverse((child) => {
         if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
           if (child.name === "cueTip" && spec.tip) {
             child.material.color.set(spec.tip.color);
             child.material.shininess = spec.tip.shininess;
           } else if (child === this.buttMesh && spec.butt) {
             child.material.color.set(spec.butt.color);
             child.material.shininess = spec.butt.shininess;
           }
           // Repeat similarly for shaft and ferrule...
         }
       });
     }
   }
   ```

### Dynamic Switch on Turn Transitions
1. The active player state `ActivePlayer` (`0 | 1 | 2`) is managed inside `Container` and propagated via `setHudActivePlayer(active)`.
2. When `setHudActivePlayer` is invoked or when transitioning between states (e.g., in `updateController` when transitioning to `Aim` versus `WatchAim`):
   - If the active player is Player 1 (index 0 / my client), call `table.cue.updateCueColors(myCustomCueSpec)`.
   - If the active player is Player 2 (index 1 / opponent client), call `table.cue.updateCueColors(opponentCustomCueSpec)`.
3. This ensures that when a shot starts and the other player becomes active, the cue instantly morphs its colors/materials to reflect who is taking the shot.
