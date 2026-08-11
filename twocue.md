# Per-Player Cues: Two Pre-instantiated Cues under a Common Root Group

This document describes the chosen design for showing a unique cue
styling/geometry for each player in a 2-player match, together with the plan to
make the in-game cue geometry a visual duplicate of `dist/cue.html`.

---

## 1. Chosen Approach: Two Pre-instantiated Cues under a Per-Cue Root Group

Two distinct `Cue` instances (`cueP1` and `cueP2`) are fully created at startup.
Each cue mounts all four of its sub-objects — the cue body (`mesh`), the aim
helper line (`helperMesh`), the place-ball indicator (`placerMesh`) and the
shadow (`shadowMesh`) — as children of a single per-cue root `Group` (`root`).
At runtime, we simply toggle the root's visibility
(`root.visible = true` / `root.visible = false`).

*   **Seamless, Atomic Toggling:** One boolean flips the entire cue — body,
    helper line, shadow and placer — so the inactive player's cue can never be
    half-visible. (Toggling the four sub-meshes individually would mean keeping
    four flags in sync and risks leaving the inactive player's helper line or
    shadow lingering on the table.)
*   **Aiming Animations Apply Unchanged, Once:** The transforms the sub-objects
    already share — `position = cue-ball pos` and `rotation.z = aim.angle` —
    are applied to the root instead of being written to three different
    objects (`mesh`, `helperMesh`, `shadowMesh`). Child-local transforms are
    untouched: `tiltMesh.rotation.y = baseTilt + elevation`, the `cueBody`
    hit-animation stroke, `shadowMesh.scale.x`, and the `placerMesh` spin.
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
    material-finding/traversal logic, and the duplicated position/rotation
    writes across `mesh`/`helperMesh`/`shadowMesh` collapse into a single root
    write.
*   **Slightly Higher Startup Memory:** Keeping two simple
    geometries/material sets in memory (which is negligible for a low-poly cue
    model).

## 2. Implementation Blueprint

### Pointer Locations:

1.  **`src/view/cue.ts`**: The main controller for the cue's representation,
    shadow, helper line, and movement calculations. Owns the per-cue `root`
    group and moves the shared aim transforms onto it.
2.  **`src/model/table.ts`**: Currently holds and instantiates the single `cue`
    reference (`this.cue = new Cue()`). Will hold `cueP1`/`cueP2` and mount
    their roots.
3.  **`src/container/container.ts`**: Responsible for driving the active turn
    via `this.inferActivePlayer(controller)` and toggling the roots.

### Steps:

1.  Add a root group to `Cue` (`src/view/cue.ts`) and mount the four existing
    sub-objects under it instead of leaving them as loose scene children:

    ```typescript
    root = new Group()
    // in the constructor, after creating the sub-objects:
    this.root.add(this.mesh, this.helperMesh, this.placerMesh, this.shadowMesh)
    ```

2.  Apply the shared aim transforms to `root` — once, instead of per object.
    In `rotateAim`, `updateCueRotation` and `updateCuePosition`, the three
    per-object writes become:

    ```typescript
    this.root.rotation.z = this.aim.angle
    this.root.position.copy(pos)
    ```

    `mesh`, `helperMesh` and `shadowMesh` keep position/rotation `0`; the root
    carries the aim rotation and translation for the whole subtree. Child-local
    work stays exactly where it is today:

    -   `tiltMesh.rotation.y = CueMesh.baseTilt + this.aim.elevation` (inside
        `mesh`)
    -   the `cueBody` hit-animation stroke (inside `tiltMesh`)
    -   `shadowMesh`: the world-space terms (`pos`, `sideVec`, `unitToBall`)
        move to the root; its local position becomes the offset
        `(projectedX + R*cos(elevation), cueBody.position.y, -R*0.99)`, and
        `scale.x = cos(elevation)` is unchanged. The old `sideVec`/`unitToBall`
        math is exactly the root's rotation basis, so the world result is
        identical.
    -   `placerMesh.rotation.z = this.t` stays local (it spins independently
        of the aim angle)
    -   `placeBallMode()` / `aimMode()` child-level toggles (placer vs
        body/shadow) are unchanged — they still operate inside the active
        player's visible root

3.  Update `src/model/table.ts` to hold both cues, each built with its
    player's cue params (see §3):

    ```typescript
    cueP1!: Cue
    cueP2!: Cue
    ```

4.  Update `Table.addToScene()` in `src/model/table.ts` to mount just the two
    roots:

    ```typescript
    addToScene(scene) {
      // Add balls, etc.
      if (this.cueP1) scene.add(this.cueP1.root)
      if (this.cueP2) scene.add(this.cueP2.root)
    }
    ```

5.  Toggle in `src/container/container.ts` on controller transitions, and keep
    `table.cue` pointing at the active instance so the existing `table.cue`
    call sites keep working unchanged. (Table has no notion of whose turn it
    is — the container does, via `inferActivePlayer`.)

    ```typescript
    private setActiveCue(active: ActivePlayer) {
      const { cueP1, cueP2 } = this.table
      cueP1.root.visible = active === 1
      cueP2.root.visible = active === 2
      this.table.cue = active === 1 ? cueP1 : cueP2
    }
    ```

    In single-player games `cueP2` is simply never shown: its root stays
    `visible = false` from startup.

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
