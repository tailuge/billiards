# Per-Player Cues: Two Pre-instantiated Cues with Visibility Toggling

This document describes the chosen design for showing a unique cue
styling/geometry for each player in a 2-player match, together with the plan to
make the in-game cue geometry a visual duplicate of `dist/cue.html`.

---

## 1. Chosen Approach: Two Pre-instantiated Cues with Visibility Toggling

Two distinct `Cue` instances (`cueP1` and `cueP2`) are fully created at startup
and added to the Three.js scene. At runtime, we simply toggle their visibility
(`.visible = true` / `.visible = false`).

*   **Outstanding Runtime Performance:** Toggling `.visible` in Three.js is
    extremely fast. When `.visible` is `false`, Three.js completely bypasses
    frustum culling, CPU matrix world updates (`updateMatrixWorld`), and GPU
    draw-call submission for that entire sub-tree.
*   **No On-the-Fly Creation Overhead:** Since both cues are pre-instantiated
    at startup, there is zero garbage collection pressure or runtime
    instantiation lag when turns switch.
*   **Maximum Flexibility:** Each player can have completely different 3D
    models, textures, shaders, and geometry. Player 1 can use a traditional
    wooden cue, while Player 2 uses a futuristic carbon-fiber model.
*   **Code Simplicity:** Simple boolean toggling replaces
    material-finding/traversal logic.
*   **Slightly Higher Startup Memory:** Keeping two simple
    geometries/material sets in memory (which is negligible for a low-poly cue
    model).

## 2. Implementation Blueprint

### Pointer Locations:

1.  **`src/view/cue.ts`**: The main controller for the cue's representation,
    shadow, helper line, and movement calculations.
2.  **`src/model/table.ts`**: Currently holds and instantiates the single `cue`
    reference (`this.cue = new Cue()`).
3.  **`src/container/container.ts`**: Responsible for driving the active turn
    via `this.inferActivePlayer(controller)`.

### Steps:

1.  Update `src/model/table.ts` to hold both cues, each built with its player's
    cue params (see §3):

    ```typescript
    cueP1!: Cue
    cueP2!: Cue
    ```

2.  Update `Table.addToScene()` in `src/model/table.ts` to mount both:

    ```typescript
    addToScene(scene) {
      // Add balls, etc.
      if (this.cueP1) scene.add(this.cueP1.mesh)
      if (this.cueP2) scene.add(this.cueP2.mesh)
    }
    ```

3.  Implement a wrapper property/method on `Table` to easily access the
    "active" cue:

    ```typescript
    get activeCue(): Cue {
      return this.currentTurnPlayerIndex === 0 ? this.cueP1 : this.cueP2
    }
    ```

4.  Toggle visibility in `src/container/container.ts` on controller
    transitions:

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

---

## 3. Geometry Changes: `cuemesh.ts` as the Visual Dual of `cue.html`

Make `src/view/cuemesh.ts` render the same cue as `dist/cue.html` by default
(cue.html's defaults now; player preferences later). This is the per-player
parameterization that §2 instantiates once per player.

### Params surface and defaults

-   Add a `CueParams` type and `DEFAULT_CUE_PARAMS` mirroring cue.html's
    `DEFAULT_STATE`:

    | param          | default   |
    |----------------|-----------|
    | `shaftColour`  | `#d2b48c` |
    | `buttColour`   | `#0d0d0d` |
    | `jointColour`  | `#2b2f36` |
    | `jointLength`  | `0.004` (4 mm collar) |
    | `ferruleColour`| `#e5e5e5` |
    | `ferruleLength`| `0.015` (1.5 cm ferrule) |
    | `buttRatio`    | `0.4` |
    | `grain`        | `true` |

-   Values are used as supplied — no clamping or validation; missing fields
    fall back to `DEFAULT_CUE_PARAMS`.

### Geometry port

Port cue.html's `cueGeometry` construction into `CueMesh.cueGeometry`:

-   `buttLength = length * buttRatio`;
    `shaftLength = length * (1 - buttRatio) - jointLength - ferruleLength`
-   4-point full splice (`createSpliceGeometries` + `addSpliceQuad`, N=24,
    P=4) — upper prongs in shaft wood, lower body in butt wood, triangular-wave
    seam
-   Butt bottom cap (`CircleGeometry`)
-   Joint collar cylinder (`buttRadius * 0.9`, length `jointLength`)
-   Tapered shaft (`tipRadius` → `jointRadius`), ferrule, tip (keep
    `tip.name = "cueTip"`)

The returned `Group` shape is unchanged, so `createCue`'s rotation / position
/ tilt logic and all existing `Cue` callers stay untouched.

### Materials and wood grain

-   Per-part `MeshPhongMaterial` with cue.html's colours/shininess, plus the
    `JOINT_STYLES` / `FERRULE_STYLES` specular maps (e.g. brass `#d9a62e`,
    shininess 150, specular `0xfff2c8`).
-   Procedural seeded wood-grain canvas texture (shaft seed 7, butt seed 11;
    64×512, `RepeatWrapping (4,1)`, `SRGBColorSpace`) applied to shaft and butt
    when `grain` is true.
-   Materials are created per `createCue` call so each player's cue has
    independent materials — no shared-state mutation.

### createCue signature

-   `createCue(tip, but, length, opts?: CueParams)` — defaults to
    `DEFAULT_CUE_PARAMS`; backward compatible with existing callers.

### Length

-   Total cue length does not change: it stays `Cue.length =
    TableGeometry.tableX` (1.408 m on a default 10 ft table). Only the segment
    split changes. With defaults the new butt→ferrule spans exactly `length`
    (vs `0.997 * length` today) — about 4 mm longer on a 10 ft table,
    imperceptible.

### Out of scope (follow-ups)

-   Threading `Session.customParams` / `Session.opponentParams` (already
    parsed from `custom.*` / `opponent.custom.*` URL params in
    `Session.applyUrlParams`) into `CueParams` per player.
-   Validation: no new tests required; existing `yarn lint` / `yarn test`
    suffice (cue.spec.ts already exercises `createCue` / `baseTilt`).
