# Per-Player Cues: Two Pre-instantiated Cues with Visibility Toggling and Shared Transform Group

This document describes the chosen design for showing a unique cue
styling/geometry for each player in a 2-player match, together with the plan to
make the in-game cue geometry a visual duplicate of `dist/cue.html`.

---

## 1. Chosen Approach: Two Pre-instantiated Cues with Group-Based Visibility Toggling

To support distinct styles for each player, two separate `Cue` instances (`cueP1` and `cueP2`) are fully pre-instantiated at startup and added to a shared parent transform node (`cuesGroup` / `cueRoot`). At runtime, we simply toggle their visibility (`.visible = true` / `.visible = false`).

### Group hierarchy:

```text
table
└── cuesGroup                 ← the thing you always aim/transform
    ├── cueP1                 ← fixed visual geometry
    └── cueP2                 ← fixed visual geometry
```

### Key Advantages:
*   **Zero Aiming Logic Redirection:** There is no need to redirect existing aiming logic from:
    ```typescript
    this.cue.rotation...
    this.cue.position...
    this.cue.tilt...
    ```
    to a dynamic `activeCue`. Instead, the existing conceptual cue object behaves directly as the shared transform parent (`cuesGroup` or `cueRoot`).
*   **Separation of State and Visuals:** This design cleanly separates the visual identity from the gameplay state. The parent group handles the physical state (aiming, positioning, rotation, power, and animation transforms), while the child meshes handle appearance and identity.
*   **Outstanding Runtime Performance:** Toggling `.visible` in Three.js is extremely fast. When `.visible` is `false`, Three.js completely bypasses frustum culling, CPU matrix world updates (`updateMatrixWorld`), and GPU draw-call submission for that entire sub-tree.
*   **No On-the-Fly Creation Overhead:** Since both cues are pre-instantiated at startup, there is zero garbage collection pressure or runtime instantiation lag when turns switch.
*   **Maximum Flexibility:** Each player can have completely different 3D models, textures, shaders, and geometry. Player 1 can use a traditional wooden cue, while Player 2 uses a futuristic carbon-fiber model.

---

## 2. Shared Transform Group (`cuesGroup` / `cueRoot`)

To ensure flawless aiming and animation behavior, `cuesGroup` is the sole runtime transform node.

### Essential Invariant:
> The parent group represents the physical cue's current aim/position; the children represent only its appearance.

### Important Consequences:
1.  **Independent Local Transforms Prohibited:** The two cue meshes (`cueP1` and `cueP2`) must not have independent local transforms. Their local position, rotation, and scale must remain at their default/same identity coordinates:
    ```typescript
    cueP1.position.set(0, 0, 0)
    cueP1.rotation.set(0, 0, 0)
    cueP2.position.set(0, 0, 0)
    cueP2.rotation.set(0, 0, 0)
    ```
2.  **All Transforms on Parent:** All physical positioning, rotation, tilting, and forward penetration stroke animation are applied exclusively to `cuesGroup`:
    ```typescript
    cuesGroup.rotation...
    cuesGroup.position...
    cuesGroup.translateOnAxis...
    ```
    Since both children are mounted under the same coordinate system, rotating/translating the parent produces identical aiming behavior without any duplicate code paths.

---

## 3. Implementation Blueprint

### Pointer Locations:

1.  **`src/view/cue.ts`**: The main controller for the cue's representation, shadow, helper line, and movement calculations. This now represents the `cuesGroup` / `cueRoot`.
2.  **`src/model/table.ts`**: Currently holds and instantiates the single `cue` reference (`this.cue = new Cue()`). It will now instantiate the `cuesGroup` containing `cueP1` and `cueP2`.
3.  **`src/container/container.ts`**: Responsible for driving the active turn via `this.inferActivePlayer(controller)`.

### Steps:

1.  Update `src/model/table.ts` (or `Cue` controller) to hold both visual children inside a single parent group (`cuesGroup`):

    ```typescript
    // In Cue or Table representation
    cuesGroup = new THREE.Group()
    cueP1 = createCue(..., paramsP1)
    cueP2 = createCue(..., paramsP2)

    cuesGroup.add(cueP1)
    cuesGroup.add(cueP2)
    ```

2.  Update visibility toggling on turn or controller transitions inside `src/container/container.ts` (or matching controller):

    ```typescript
    const activePlayer = this.inferActivePlayer(controller)
    cueP1.visible = activePlayer === 1
    cueP2.visible = activePlayer === 2
    ```

---

## 4. Geometry Changes: `cuemesh.ts` as the Visual Dual of `cue.html`

Make `src/view/cuemesh.ts` render the same cue as `dist/cue.html` by default (cue.html's defaults now; player preferences later). This is the per-player parameterization that §3 instantiates once per player.

### Params surface and defaults

-   Add a `CueParams` type and `DEFAULT_CUE_PARAMS` mirroring cue.html's `DEFAULT_STATE`:

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

-   Values are used as supplied — no clamping or validation; missing fields fall back to `DEFAULT_CUE_PARAMS`.

### Geometry port

Port cue.html's `cueGeometry` construction into `CueMesh.cueGeometry`:

-   `buttLength = length * buttRatio`; `shaftLength = length * (1 - buttRatio) - jointLength - ferruleLength`
-   4-point full splice (`createSpliceGeometries` + `addSpliceQuad`, N=24, P=4) — upper prongs in shaft wood, lower body in butt wood, triangular-wave seam
-   Butt bottom cap (`CircleGeometry`)
-   Joint collar cylinder (`buttRadius * 0.9`, length `jointLength`)
-   Tapered shaft (`tipRadius` → `jointRadius`), ferrule, tip (keep `tip.name = "cueTip"`)

The returned `Group` shape is unchanged, so `createCue`'s rotation / position / tilt logic and all existing `Cue` callers stay untouched.

### Materials and wood grain

-   Per-part `MeshPhongMaterial` with cue.html's colours/shininess, plus the `JOINT_STYLES` / `FERRULE_STYLES` specular maps (e.g. brass `#d9a62e`, shininess 150, specular `0xfff2c8`).
-   Procedural seeded wood-grain canvas texture (shaft seed 7, butt seed 11; 64×512, `RepeatWrapping (4,1)`, `SRGBColorSpace`) applied to shaft and butt when `grain` is true.
-   Materials are created per `createCue` call so each player's cue has independent materials — no shared-state mutation.

### createCue signature

-   `createCue(tip, but, length, opts?: CueParams)` — defaults to `DEFAULT_CUE_PARAMS`; backward compatible with existing callers.

### Length

-   Total cue length does not change: it stays `Cue.length = TableGeometry.tableX` (1.408 m on a default 10 ft table). Only the segment split changes. With defaults the new butt→ferrule spans exactly `length` (vs `0.997 * length` today) — about 4 mm longer on a 10 ft table, imperceptible.

### Out of scope (follow-ups)

-   Threading `Session.customParams` / `Session.opponentParams` (already parsed from `custom.*` / `opponent.custom.*` URL params in `Session.applyUrlParams`) into `CueParams` per player.
-   Validation: no new tests required; existing `yarn lint` / `yarn test` suffice (cue.spec.ts already exercises `createCue` / `baseTilt`).
