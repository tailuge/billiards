# Architectural Plan: Per-Player Custom Cues in 2-Player Mode

This document outlines the design and implementation approach for displaying a different cue styling for each player in 2-player multiplayer matches.

---

## 1. Architectural Motivation & GPU Efficiency

In a Three.js-based rendering engine, managing multiple `Cue` instances or frequently adding/removing/toggling different cue meshes in the scene graph is highly inefficient.

### Why a Single Dynamic Cue Object is Superior:
- **WebGL State Changes:** Toggling the visibility of multiple large mesh groups or constantly adding and removing them from the scene graph forces the WebGL renderer to update its state, re-evaluate frustum culling, and perform redundant draw calls.
- **GPU Memory & Draw Efficiency:** It is much more GPU-efficient to instantiate a **single, pre-existing `Cue` object** and dynamically mutate properties on its existing materials (such as `color`, `emissive`, or `roughness`) on the fly.
- **Consistency:** Since only one player can aim and take a shot at any given moment, a single cue object perfectly mirrors the physical game state, simplifying position tracking and rendering logic.

---

## 2. Tracking Turn State & Player Indices

To know when to swap the cue styling, we must identify which player is currently active.

### Active Turn Tracking:
- **`src/container/container.ts`:**
  - Turn transitions are detected inside `Container.updateController(controller)`.
  - The currently active player slot (1 or 2, corresponding to the HUD) is determined dynamically using the helper method `Container.inferActivePlayer(controller)`.
  - The local player's network role and active slot are mapped via:
    - `myHudSlot()` (returns `1` or `2` based on local slot)
    - `opponentHudSlot()` (returns the opposite slot)

### Player Session State:
- **`src/network/client/session.ts`:**
  - `Session.getInstance()` stores multiplayer context such as `playerIndex` (representing who is player 0 vs player 1), user IDs, and custom game parameters.

---

## 3. Identifying Cue Materials

In `src/view/cuemesh.ts`, the 3D representation of the cue is constructed inside the static method `cueGeometry()`. It consists of four distinct sub-meshes, each with its own `MeshPhongMaterial`:

1. **Butt Material (`ebonyMat`):** Standard color `0x1a1a1a` (dark ebony wood).
2. **Shaft Material (`ashWoodMat`):** Standard color `0xd2b48c` (light ash wood).
3. **Ferrule Material (`ferruleMat`):** Standard color `0xe5e5e5` (metallic ferrule).
4. **Tip Material (`tipMat`):** Standard color `0x4a7c9a` (blue chalked tip).

---

## 4. Concrete Implementation Steps

To support unique cue styles for each player without changing the underlying architecture, the following steps are proposed:

### Step 4.1: Store Material References on the Cue Mesh Group
Modify the cue generation in `src/view/cuemesh.ts` to name the meshes or attach direct references to the materials so they can be modified dynamically after creation. For example, assign names to the meshes in `cueGeometry`:
```typescript
butt.name = "cueButt"
shaft.name = "cueShaft"
ferrule.name = "cueFerrule"
tip.name = "cueTip" // already present
```

### Step 4.2: Implement dynamic material updates in `src/view/cue.ts`
Add a method `updateCueStyle(playerIndex: number)` on the `Cue` class. This method will traverse the cue's 3D object to locate the meshes by name and modify their material color properties:
```typescript
updateCueStyle(playerIndex: number) {
  const cueBody = this.cueBody
  if (!cueBody) return

  // Locate the meshes
  const butt = cueBody.getObjectByName("cueButt") as Mesh
  const shaft = cueBody.getObjectByName("cueShaft") as Mesh

  if (butt && shaft) {
    const buttMat = butt.material as MeshPhongMaterial
    const shaftMat = shaft.material as MeshPhongMaterial

    if (playerIndex === 0) {
      // Style for Player 1: Classic dark ebony & ash wood
      buttMat.color.setHex(0x1a1a1a)
      shaftMat.color.setHex(0xd2b48c)
    } else {
      // Style for Player 2: Dynamic premium rosewood or custom color
      buttMat.color.setHex(0x5c2c16) // Redwood/Rosewood tone
      shaftMat.color.setHex(0xe3dac9) // Ivory/Maple tone
    }
  }
}
```

### Step 4.3: Trigger Cue Updates on Turn Transition
Within `Container.updateController(controller)` inside `src/container/container.ts`, whenever a controller transition occurs, trigger the cue style update matching the current turn:
```typescript
const activePlayer = this.inferActivePlayer(controller)
// activePlayer is 0 (none/stationary), 1 (P1's turn), or 2 (P2's turn)
if (activePlayer !== 0) {
  // Update cue material colors based on active turn (0-indexed)
  this.table.cue?.updateCueStyle(activePlayer - 1)
}
```

---

## 5. Conclusion

This approach achieves the goal of showing unique cues for each player with **zero rendering overhead**. It preserves all physics determinism, avoids any scene-graph pollution, and ensures a smooth, highly performant experience on both desktop and mobile devices.
