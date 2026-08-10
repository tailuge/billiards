# Architectural Analysis: Single Cue Material Mutation vs. Two Cues with Visibility Toggling

This document evaluates two different design approaches for showing a unique cue styling/geometry for each player in a 2-player multiplayer match.

---

## 1. Comparing the Approaches

### Approach A: Single Cue with Material Mutation
In this approach, only a single `Cue` instance exists in the scene. On turn transitions, we traverse the cue mesh hierarchy and mutate material properties (e.g., `material.color.setHex()`).

*   **Pros:**
    *   **Minimal Memory Footprint:** Only one set of 3D geometries and materials are kept in CPU/GPU memory.
    *   **No Scene-Graph Pollution:** The hierarchy remains as simple as possible.
*   **Cons:**
    *   **Geometry Constraints:** Both players are strictly locked to the same 3D cue geometry. If Player 2 wants a different cue shape (e.g., a custom grip, a different shaft taper, or unique ornaments), mutating materials is insufficient.
    *   **Complexity:** Requires maintaining material references or performing scene traversal to find and alter materials on active turn changes.

### Approach B: Two Pre-instantiated Cues with Visibility Toggling (`.visible`)
In this approach, two distinct `Cue` instances (`cueP1` and `cueP2`) are fully created at startup and added to the Three.js scene. At runtime, we simply toggle their visibility (`.visible = true` / `.visible = false`).

*   **Pros:**
    *   **Outstanding Runtime Performance:** Toggling `.visible` in Three.js is extremely fast. When `.visible` is set to `false`, Three.js completely bypasses frustum culling, CPU matrix world updates (`updateMatrixWorld`), and GPU draw-call submission for that entire sub-tree.
    *   **No On-the-Fly Creation Overhead:** Since both cues are pre-instantiated at startup, there is zero garbage collection pressure or runtime instantiation lag when turns switch.
    *   **Maximum Flexibility:** Each player can have completely different 3D models, textures, shaders, and animations. Player 1 can use a traditional wooden cue, while Player 2 uses a futuristic carbon-fiber model.
    *   **Code Simplicity:** Simple boolean toggling replaces material-finding/traversal logic.
*   **Cons:**
    *   **Slightly Higher Startup Memory:** Keeping two simple geometries/materials sets in memory (which is negligible for a low-poly cue model).

---

## 2. Verdict: Is the Toggling Intuition Good?

**Yes, your intuition is excellent!**

In WebGL/Three.js development, pre-instantiating separate assets and toggling `.visible` is considered **best practice** for swapping complex objects. It provides a perfect balance of performance and flexibility. Since a cue's geometry is lightweight, the memory difference is microscopic, while the gain in flexibility (allowing entirely distinct cue models) and ease of implementation is substantial.

---

## 3. Implementation Blueprint & Pointers

Below are the pointers and files involved if you wish to implement either approach.

### Pointer Locations:
1.  **`src/view/cue.ts`**: The main controller for the cue's representation, shadow, helper line, and movement calculations.
2.  **`src/model/table.ts`**: Currently holds and instantiates the single `cue` reference (`this.cue = new Cue()`).
3.  **`src/container/container.ts`**: Responsible for driving the active turn via `this.inferActivePlayer(controller)`.

---

### Implementation A: Single Cue Material Mutation
If we want to minimize memory and keep only one cue:

1.  **Modify `src/view/cuemesh.ts`** to name the sub-meshes:
    ```typescript
    butt.name = "cueButt"
    shaft.name = "cueShaft"
    ```
2.  **Add an update method in `src/view/cue.ts`**:
    ```typescript
    updateStyleForPlayer(playerIndex: number) {
      const butt = this.cueBody?.getObjectByName("cueButt") as Mesh
      if (butt) {
        const mat = butt.material as MeshPhongMaterial
        mat.color.setHex(playerIndex === 0 ? 0x1a1a1a : 0x5c2c16)
      }
    }
    ```
3.  **Invoke in `src/container/container.ts`** within `updateController()`:
    ```typescript
    const active = this.inferActivePlayer(controller)
    if (active !== 0) {
      this.table.cue?.updateStyleForPlayer(active - 1)
    }
    ```

---

### Implementation B: Two Pre-instantiated Cues with Visibility Toggling (Recommended)
If we want maximum modeling flexibility and simple state management:

1.  **Update `src/model/table.ts`** to hold both cues:
    ```typescript
    cueP1!: Cue
    cueP2!: Cue
    // Add both to the active cues array/references
    ```
2.  **Update `Table.addToScene()` in `src/model/table.ts`** to mount both:
    ```typescript
    addToScene(scene) {
      // Add balls, etc.
      if (this.cueP1) scene.add(this.cueP1.mesh)
      if (this.cueP2) scene.add(this.cueP2.mesh)
    }
    ```
3.  **Implement a wrapper property/method on `Table`** to easily access the "active" cue:
    ```typescript
    get activeCue(): Cue {
      return this.currentTurnPlayerIndex === 0 ? this.cueP1 : this.cueP2
    }
    ```
4.  **Toggle visibility in `src/container/container.ts`** on controller transitions:
    ```typescript
    const active = this.inferActivePlayer(controller)
    if (active === 1) {
      this.table.cueP1.mesh.visible = true
      this.table.cueP2.mesh.visible = false
    } else if (active === 2) {
      this.table.cueP1.mesh.visible = false
      this.table.cueP2.mesh.visible = true
    }
    ```

Both approaches are fully compatible with the existing architecture, but **Approach B (Visibility Toggling)** is highly recommended if you plan to support custom cue geometries or cosmetic shop items in the future.
