# Per-Player Cues: One Shared Aim Root, Two Per-Player Mesh Sets

This document describes the chosen design for showing a unique cue
styling/geometry for each player in a 2-player match, together with the plan to
make the in-game cue geometry a visual duplicate of `dist/cue.html`.

---

## 0. Status

| Part | Status |
|------|--------|
| §3 geometry port (`CueParams` / `DEFAULT_CUE_PARAMS`, splice geometry, materials, wood grain) | ✅ Implemented + tested (`test/model/cuemesh.spec.ts`) |
| §2 step 1 — shared aim `root` group for both players' cues | ✅ Implemented (`Cue.root`; `Table.addToScene()` mounts it; the second mesh set is step 3) |
| §2 step 2 — aim transforms hoisted onto the shared root | ✅ Implemented (root carries `position` + `rotation.z`; shadow is a local offset; world result identical) |
| §3 URL params — `custom.cue.*` → `CueParams` (single player) | ✅ Implemented (`src/utils/cueparams.ts`; `Cue(opts)`; `Table` reads `Session.customParams`) |
| §2 steps 3–5 — second mesh set, shared helper/placer/shadow, `inferActivePlayer`-driven visibility | ☐ Pending |

---

## 1. Chosen Approach: One Shared Aim Root, Two Per-Player Mesh Sets

One `Cue` instance owns a single shared aim `root` group. The aim transforms —
`position = cue-ball pos`, `rotation.z = aim.angle` — are applied to that root
**once every frame, always, regardless of whose turn it is**. Both players'
cue bodies therefore always carry identical transforms ("apply the same
transforms to all cues"); the only per-player difference is visibility.

Inside the shared root:

-   **two per-player mesh sets** (`p1` / `p2`), each containing one player's
    cue body (`mesh` → `tiltMesh` → `cueBody`) built from that player's
    `CueParams` (see §3);
-   **one shared helper line, placer ring and shadow** — these three are
    player-independent (created with no `CueParams`, and both cues share the
    same `Cue.length`), so only a single instance of each is needed.

At runtime the container toggles `p1.visible` / `p2.visible` — one
boolean per player, driven by the **existing** `inferActivePlayer(controller)`
logic on every controller transition. No new state, no pointer juggling.

*   **Aim Transforms Apply Unchanged, Once:** `position = cue-ball pos` and
    `rotation.z = aim.angle` are written to the shared root instead of to
    three different objects (`mesh`, `helperMesh`, `shadowMesh`) or to "the
    active cue". Both players' mesh sets inherit them automatically. The
    per-mesh child-local transforms stay exactly where they are today, written
    to both mesh sets (the values are aim-derived and identical):
    `tiltMesh.rotation.y = baseTilt + elevation` and the `cueBody`
    hit-animation stroke. The shared instances keep their single writes:
    `shadowMesh.scale.x` and the `placerMesh` spin.
*   **Seamless, Atomic Toggling:** One boolean flips an entire player's cue
    body (mesh + tilt + hit-animation stroke); the shared helper/placer/shadow
    keep working for whichever player is shown.
*   **No Pointers Needed:** `table.cue` stays a single object forever, so all
    existing `table.cue.*` call sites keep working unchanged. Visibility is a
    pure display concern layered on top.
*   **Outstanding Runtime Performance:** When `.visible` is `false`, Three.js
    completely bypasses frustum culling, CPU matrix world updates
    (`updateMatrixWorld`), and GPU draw-call submission for that entire
    sub-tree.
*   **No On-the-Fly Creation Overhead:** Both mesh sets are pre-instantiated
    at startup, so there is zero garbage collection pressure or runtime
    instantiation lag when turns switch.
*   **Maximum Flexibility:** Each player can have completely different 3D
    models, textures, shaders, and geometry. Player 1 can use a traditional
    wooden cue, while Player 2 uses a futuristic carbon-fiber model.
*   **Code Simplicity:** The toggle reuses `inferActivePlayer`, which the
    container already computes on every controller transition; the duplicated
    position/rotation writes across `mesh`/`helperMesh`/`shadowMesh` collapse
    into a single root write.
*   **Slightly Higher Startup Memory:** Keeping two simple
    geometries/material sets in memory (which is negligible for a low-poly cue
    model).

## 2. Implementation Blueprint

### Pointer Locations:

1.  **`src/view/cue.ts`**: The main controller for the cue's representation,
    shadow, helper line, and movement calculations. Owns the shared `root`
    group, both per-player mesh sets, and the shared helper/placer/shadow;
    applies the shared aim transforms to `root` (steps 1–2 implemented).
2.  **`src/model/table.ts`**: Currently holds and instantiates the single `cue`
    reference (`this.cue = new Cue()`). Will pass both players' params into
    `Cue` (see §3) and mount the one root.
3.  **`src/container/container.ts`**: Responsible for driving the active turn
    via `this.inferActivePlayer(controller)` and toggling the two mesh sets.

### Steps:

1.  ✅ **Done** — Add a root group to `Cue` (`src/view/cue.ts`) and mount the
    sub-objects under it instead of leaving them as loose scene children:

    ```typescript
    root = new Group()
    // in the constructor, after creating the sub-objects:
    this.root.add(this.mesh, this.helperMesh, this.placerMesh, this.shadowMesh)
    ```

2.  ✅ **Done** — Apply the shared aim transforms to `root` — once, instead of
    per object. In `rotateAim`, `updateCueRotation` and `updateCuePosition`,
    the three per-object writes become:

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
        body/shadow) are unchanged — they still operate inside the shared root

3.  ☐ **Todo** — Build both players' mesh sets inside `Cue`. The constructor
    takes both players' cue params (see §3) and creates two cue bodies, each
    wrapped in its own `Group` for visibility, plus the single shared
    helper/placer/shadow:

    ```typescript
    p1 = new Group()   // player 1's mesh set
    p2 = new Group()   // player 2's mesh set
    const cue1 = CueMesh.createCue(tip, but, length, p1Params)
    const cue2 = CueMesh.createCue(tip, but, length, p2Params)
    p1.add(cue1.mesh)
    p2.add(cue2.mesh)
    root.add(p1, p2, helperMesh, placerMesh, shadowMesh)
    ```

    The per-mesh child-local writes from step 2 now loop over both created
    cues instead of one (the values are aim-derived and identical for both
    players):

    ```typescript
    for (const c of [cue1, cue2]) {
      c.tiltMesh.rotation.y = CueMesh.baseTilt + this.aim.elevation
      c.cueBody.position.set(...) // hit-animation stroke
    }
    ```

    `helperMesh`, `placerMesh` and `shadowMesh` stay single shared instances —
    they are created with no `CueParams` and both cues share `Cue.length`, so
    one instance of each serves both players.

4.  ☐ **Todo** — Update `src/model/table.ts` to pass both players' params to
    `Cue` and mount the one shared root:

    ```typescript
    this.cue = new Cue(p1Params, p2Params)
    // addToScene:
    if (this.cue) scene.add(this.cue.root)
    ```

    (`p1Params` / `p2Params` resolve from `Session.customParams` /
    `opponentParams` by `playerIndex`, see §4.)

5.  ☐ **Todo** — Toggle in `src/container/container.ts` on controller
    transitions, reusing the existing `inferActivePlayer(controller)` — no
    `table.cue` repointing needed, since transforms already flow to the shared
    root every frame. The container already knows whose turn it is; the
    controllers decide:

    | controller                         | cue shown |
    |------------------------------------|-----------|
    | `Aim`, `PlaceBall`, `PlayShot`     | `p1` (mine) |
    | `WatchAim`, `WatchShot`            | `p2` (opponent's) |

    ```typescript
    private setActiveCue(active: ActivePlayer) {
      const { p1, p2 } = this.table.cue
      p1.visible = active === 1
      p2.visible = active === 2
    }
    ```

    In single-player games `p2.visible` is simply never set to `true`: it
    stays `false` from startup, exactly as the single mesh-set behaviour does
    today.

---

## 3. Geometry Changes: `cuemesh.ts` as the Visual Dual of `cue.html`

Make `src/view/cuemesh.ts` render the same cue as `dist/cue.html` by default
(cue.html's defaults now; player preferences later). This is the per-player
parameterization that §2 instantiates once per player.

**Status: ✅ implemented** — `test/model/cuemesh.spec.ts` covers the port
(defaults, full-length span, part count, grain toggle, `createCue` hierarchy).

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

- Threading `Session.opponentParams` (`opponent.custom.cue.*`) into `p2`
  when step 3 lands (see §4); single-player threading of
  `Session.customParams` is implemented in `src/utils/cueparams.ts`
  (`parseTypedValue` + `cueParamsFromCustom`) and wired through
  `Cue(opts?)` / `Table`.
- Validation: `test/model/cuemesh.spec.ts` covers the port (defaults, span,
  part count, grain toggle, `createCue` hierarchy); the existing
  `test/model/cue.spec.ts` still exercises `createCue` / `baseTilt`;
  `test/utils/cueparams.spec.ts` covers the URL-param mapper.
  `yarn lint` / `yarn test` pass (the four pre-existing sonarjs lint errors
  in untouched files remain on master).

---

## 4. URL Params Flow: `custom.cue.*` / `opponent.custom.cue.*`

Player cue preferences travel as query-string params, generated by the lobby
from `localStorage.custom.cue` (the `cue.html` designer page persists it) and
consumed by the game at startup:

| Param | Meaning |
|-------|---------|
| `custom.cue.<param>` | **My** cue params |
| `opponent.custom.cue.<param>` | **Opponent's** cue params |

Example (single player, the exact shape `cue.html` produces):

```
...&custom.cue.shaftColour=%2326282b&custom.cue.buttColour=%230d0d0d
   &custom.cue.jointColour=%23d9a62e&custom.cue.jointLength=0.004
   &custom.cue.ferruleColour=%23d9a62e&custom.cue.ferruleLength=0.004
   &custom.cue.buttRatio=0.4&custom.cue.grain=true
```

### Flow

1.  **Lobby** (`dist/lobby.js`, `jt` / `Ue` / `ze`): flattens the nested
    `localStorage.custom.cue` object into dotted `custom.cue.<param>` params
    (and `opponent.custom.cue.<param>` for the opponent's custom data),
    URL-encoding keys and values (`#` → `%23`). Values are stringified —
    numbers and booleans become strings, which is inherent to query strings.
2.  **Parse** (`Session.applyUrlParams`, called from `BrowserContainer`'s
    constructor — before the `Container` / `Table` / `Cue` are built): strips
    only the outer prefix, keeping the `cue.` segment in the key:
    `custom.cue.shaftColour` → `customParams["cue.shaftColour"]`;
    `opponent.custom.cue.shaftColour` → `opponentParams["cue.shaftColour"]`.
3.  **Map** (`src/utils/cueparams.ts`): `cueParamsFromCustom` walks the
    record, keeps `cue.*` keys, and `parseTypedValue` recovers the types from
    the string form — `true`/`false` → boolean, numeric-looking → number,
    everything else (`#26282b` colours) stays a string. No param is ever
    named in code; missing fields fall back to `DEFAULT_CUE_PARAMS` and
    unknown keys are ignored.
4.  **Build** (`src/model/table.ts` → `Cue(opts?)` →
    `CueMesh.createCue(tip, but, length, opts)`): `Table` constructs the
    single cue from `cueParamsFromCustom(Session.getInstance().customParams)`.
    With no params present this returns `DEFAULT_CUE_PARAMS`, so ordinary
    games look unchanged.

### Two-player assignment (step 3 pending)

When the second mesh set lands, each player's cue body is built from its
player's record, resolved by `Session.playerIndex` (mirroring
`orderedNamesForHud`):

| playerIndex | p1 params      | p2 params      |
|-------------|----------------|----------------|
| 0           | `customParams`   | `opponentParams`   |
| 1           | `opponentParams` | `customParams`     |

Bots and single-player matches have an empty `opponentParams`, so `p2` falls
back to defaults and its group never shows (`p2.visible = false`).

### Caveats

-   **Rematch / share links** (`src/utils/gameover.ts`) deliberately strip
    `custom.*` and `opponent.custom.*` params, so a rematch starts from
    defaults — opponent params stay private.
-   **Replays** (`Table.fromSerialised`) also show defaults, for the same
    reason.
-   **Spectators** receive neither player's `custom.*` (only their own), so a
    spectator sees default-styled cues. Transporting per-player cue params
    over the network is out of scope.
