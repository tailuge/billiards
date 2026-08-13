# Emoji Wall Portraits: `wall.html` → In-Game `Portrait`

Port `dist/wall.html`'s emoji "portrait" (border + instanced emoji triangles +
fake shadow, optional name plaque) into the game so each player's chosen emoji
appears on the interior walls of `dist/models/background.gltf`. One portrait on
the **+X wall** and one on the **-X wall**, hard-coded coordinates.

This document mirrors the approach already used for cues
(`twocue.md` ↔ `src/view/cuemesh.ts` ↔ `dist/cue.html`): the game ships a
faithful TypeScript port of a single, well-isolated wall-rendering function,
pinned by a test, with wall.html refactored just enough to make the port a
1:1 copy.

---

## 0. Status

| Part | Status |
|------|--------|
| wall.html refactor (§1) | Planned |
| `Portrait` class (`src/view/portrait.ts`) | Planned |
| Placement constants (`src/view/portraitplacements.ts`) | Planned |
| Wiring into the scene / assets-ready path | Planned (deferred — see §5) |
| Tests (`test/view/portrait.spec.ts`) | Planned |

No code has been changed yet; this document is the plan only.

---

## 1. Coordinate & Scale Reference

The game is **Z-up** (`up = (0,0,1)`, `src/utils/three-utils.ts`); the table
lies in the XY plane and +Z is vertical. `dist/wall.html` is also Z-up, but it
authors its overlay in a **local YZ wall plane** with **+X = facing normal**
and **+Z = up**, then re-orients it via an `orientation` map. That local-frame
convention is exactly what the game port must keep.

### Background room (`dist/models/background.gltf`)

`importGltf` (`src/utils/gltf.ts`) scales every glTF scene by
`R/0.5 = 0.03275/0.5 = 0.0655`. The cube node is `scale (80, 40, 30)` at
`translation (0, 0, 16)`, so after loading:

| Axis | Extent |
|------|--------|
| X | −5.24 … +5.24 |
| Y | −2.62 … +2.62 |
| Z | −0.917 … +3.013 |

So the interior wall planes (and the vertical center of the room, Z ≈ 1.05):

| Wall | Interior face | Inward normal |
|------|---------------|---------------|
| **−X wall** | X = −5.24 | +X `(1,0,0)` |
| **+X wall** | X = +5.24 | −X `(−1,0,0)` |
| floor / ceiling | Z = −0.917 / +3.013 | — |

### Portrait natural size (wall.html units)

Border outer footprint **1.255 × 1.12** (width along the wall's local +Y,
height along local +Z). The emoji grid is 24×24 with `SPACING_Y = 0.0475`,
`SPACING_Z = 0.042` (≈ 1.14 × 1.008).

On a wall, local **+Y → world Y** (width) and local **+Z → world Z** (height),
for both the −X and +X walls (the orientation basis is derived from
`normal` + `up` in `createEmojiWall`).

### Hard-coded placement (tunable, validated visually after wiring)

| Wall | position (x, y, z) | orientation normal | orientation up | scale |
|------|--------------------|--------------------|----------------|-------|
| −X | (−5.24 + offset, 0, 1.05) | +X `(1,0,0)` | +Z `(0,0,1)` | ~3 |
| +X | (+5.24 − offset, 0, 1.05) | −X `(−1,0,0)` | +Z `(0,0,1)` | ~3 |

- `offset ≈ 0.02` floats the overlay a small distance inward from the wall
  face (wall.html floats its border 0.005 off its wall) to avoid z-fighting.
- `scale = 3` → portrait ≈ 3.77 × 3.36, comfortably inside the 5.24 × 3.93 wall.

> These numbers are starting points. The exact offset/scale get tuned the
> moment the wiring lands; they are deliberately confined to the placement
> module (§4) so the `Portrait` class itself stays unit-agnostic.

---

## 2. Changes to `dist/wall.html` (make it simple to port)

Goal: isolate the wall renderer into one self-contained, parameterized module
that the game can port verbatim, without dragging along the picker UI,
persistence, or the standalone scene/camera/lighting.

1. **Extract the renderer.** Move `createEmojiWall` together with its helpers
   and constants into a new plain-ESM file, e.g. `dist/wall/emojiwall.js`,
   exporting:

   - constants `GRID_SIZE`, `TOTAL_INSTANCES`, `SPACING_Y`, `SPACING_Z`;
   - `createBorderGeometry(width, height, thickness)`;
   - `createWallQuadGeometry(width, height)`;
   - `getEmojiPixelData(emoji)` (canvas sampling);
   - `createEmojiWall(scene, options)` → `{ setState, tick }`.

   `emojiwall.js` only needs `import * as THREE from "three"`, which resolves
   through wall.html's existing importmap. wall.html then imports it and
   deletes the inlined copies.

2. **Add a `scale` option.** `createEmojiWall` currently builds at fixed
   1:1 size. Add `options.scale` (default `1`) and apply it to the overlay
   group, e.g. `wallGroup.scale.setScalar(scale)`. This is the single most
   important change for the game, whose room is ~3× the size of wall.html's
   demo wall.

3. **Parameterize dimensions with current values as defaults.** Add optional
   `gridSize` (default 24), `spacing` (default `{y: 0.0475, z: 0.042}`) and
   `border` (default `{inner: {w: 1.225, h: 1.09}, thickness: 0.015}`) so the
   game can match — or simply keep these as shared constants that the port
   copies exactly (preferred: constants in one place, see §3).

4. **Make the instance bake idempotent.** The triangles are static (no
   per-frame animation); `tick()` re-writes identical matrices every frame.
   Keep `tick()` for wall.html's render loop but document that a consumer may
   call it once (or fold the bake into `updateWall()`/`setState`). The game's
   `Portrait` bakes once and never ticks.

5. **Leave behind in wall.html:** `EmojiPicker`, `generateUnicodeEmojiList`,
   `readCustom`/`saveState` (`localStorage.custom.emoji`), scene/backdrop/
   lights/camera/OrbitControls, and the `postMessage({type:"done"})` handshake.
   None of these are needed by the game — the game receives the emoji via URL
   params (§6).

Net effect: the "wall" is now exactly one importable function whose options
surface (`emoji`, `name`, `position`, `orientation {normal, up}`, `scale`) is
the spec that `Portrait` mirrors.

---

## 3. Classes to Add to the Game

### 3.1 `src/view/portrait.ts` — `Portrait`

A faithful TypeScript port of `dist/wall/emojiwall.js`'s `createEmojiWall`.
Self-contained: constructing it adds a group to the scene; that's it.

```typescript
export interface PortraitOrientation {
  normal: Vector3 // wall inward normal
  up: Vector3     // world up (0,0,1)
}

export interface PortraitOptions {
  emoji: string                       // e.g. "📺"
  name?: string                       // optional name plaque (hidden when empty)
  position?: Vector3                  // group position
  orientation: PortraitOrientation
  scale?: number                      // default 1
}
```

Class shape:

```typescript
export class Portrait {
  readonly group: Group               // added to scene by constructor
  constructor(scene: Scene, options: PortraitOptions) // builds + bakes + adds
  setState(patch: { emoji?: string; name?: string }): void // re-sample + re-bake
  dispose(): void                     // dispose geometry/materials/textures
}
```

Implementation notes (mirror `createEmojiWall` exactly):

- **Constants**: `GRID_SIZE = 24`, `TOTAL_INSTANCES = 576`, `SPACING_Y = 0.0475`,
  `SPACING_Z = 0.042`; border `createBorderGeometry(1.225, 1.09, 0.015)`; the
  triangle `CircleGeometry(0.029, 3)` rotated to the same wall-plane
  orientation (`rotateZ(π/6)`, `rotateY(π/2)`).
- **Orientation math**: reproduce the `normal`/`up` → `right` → `makeBasis`
  block (right = up × normal; throw if parallel) so `Portrait` accepts the
  same `orientation` object as wall.html.
- **Emoji sampling**: port `getEmojiPixelData` (offscreen 24×24 canvas,
  `willReadFrequently`, `19px sans-serif`, centered) and `updateWall()` —
  per-instance `scale`/`lift`/`r,g,b` from the sampled alpha + luminance, with
  empty cells hidden.
- **Materials**: border `MeshStandardMaterial` (0x1f1f1f), border shadow
  `MeshBasicMaterial` (black, 0.35 opacity), emoji `MeshStandardMaterial`
  (flatShading, `DoubleSide`), instance shadow `MeshBasicMaterial` (0x1a1a1a).
  Keep `DoubleSide` so portraits render regardless of how the background cube's
  back-faces are culled.
- **Instance bake**: fold `tick()`'s matrix/color writes into a private
  `bake()` called from the constructor and from `setState` (no per-frame tick;
  nothing animates).
- **Plaque**: keep optional; `name` empty ⇒ hidden, same 512×96 canvas texture
  and aspect (0.4 × 0.075) as wall.html.

### 3.2 `src/view/portraitplacements.ts` — hard-coded walls

A tiny module so the magic numbers live in one place and are easy to tune:

```typescript
export const PORTRAIT_SCALE = 3
export const PORTRAIT_OFFSET = 0.02
export const PORTRAIT_Z = 1.05
export const WALL_X = 5.24        // |X| of the interior wall faces

export const MINUS_X_WALL = { position: new Vector3(-WALL_X + PORTRAIT_OFFSET, 0, PORTRAIT_Z), orientation: { normal: new Vector3(1,0,0), up: new Vector3(0,0,1) } }
export const PLUS_X_WALL  = { position: new Vector3( WALL_X - PORTRAIT_OFFSET, 0, PORTRAIT_Z), orientation: { normal: new Vector3(-1,0,0), up: new Vector3(0,0,1) } }
```

(Exact shape/names to be finalized at wiring time.)

---

## 4. Wiring (deferred — described, not implemented now)

When it lands, it goes where assets are known to be ready, reading each
player's emoji from `Session`:

- **Mine**: `Session.getInstance().customParams["emoji"]` (from the
  `custom.emoji` URL param the lobby emits).
- **Opponent's**: `Session.getInstance().opponentParams["emoji"]`
  (from `opponent.custom.emoji`).
- **Default** when absent: `"📺"` (wall.html's `DEFAULT_STATE.emoji`).

Natural insertion point: `View.initialiseScene()` (already owns `this.scene`
and adds `assets.background`), or `BrowserContainer.onAssetsReady()` after the
container exists. Sketch:

```typescript
const s = Session.getInstance()
this.portraits = [
  new Portrait(this.scene, { emoji: s.customParams["emoji"] ?? "📺", ...MINUS_X_WALL, scale: PORTRAIT_SCALE }),
  new Portrait(this.scene, { emoji: s.opponentParams["emoji"] ?? "📺", ...PLUS_X_WALL, scale: PORTRAIT_SCALE }),
]
```

"Create at asset-load, add to scene, done" — no per-frame work.

---

## 5. Emoji Flow (for reference)

1. **Lobby** (`dist/lobby.js`) shows `wall.html` in an iframe; wall.html
   persists the pick to `localStorage.custom.emoji`.
2. **Lobby → game URL**: the lobby flattens `custom` into `custom.emoji=…`
   (and the opponent's into `opponent.custom.emoji=…`) when building the game
   link (`Ue`/`ze`).
3. **Parse** (`Session.applyUrlParams`): `custom.emoji` →
   `customParams["emoji"]`; `opponent.custom.emoji` → `opponentParams["emoji"]`.
4. **Build** (§4): `Portrait` reads those keys and defaults to `"📺"`.

---

## 6. Caveats & Risks

- **+X wall is mirror-imaged.** For `normal = −X`, the orientation basis maps
  local +Y (width) to world −Y, so glyphs/plaque text on the +X wall are
  horizontally mirrored relative to the −X wall. For symmetric emoji this is
  invisible; for text-like emoji (flags, ™, ©, arrows) it shows. Mitigation
  (if desired later): horizontally flip the sampled pixel data for the
  mirrored wall. Not blocking for the initial port.
- **Camera may rarely frame the walls.** Gameplay cameras (`aimView`,
  `topView`) look steeply down at the table; the portraits live far off to the
  sides (X = ±5.24). They'll be visible in angled aim views / the orbit view,
  but verify framing during wiring before tuning scale/position.
- **Canvas sampling needs a DOM 2D context.** `getEmojiPixelData` requires
  `document.createElement("canvas").getContext("2d")`. Fine in the browser
  (precedent: `balltexturefactory.ts`, `particle-utils.ts`); tests use the
  `canvas` devDependency under jest.
- **Background cube back-faces.** `background.gltf` ships no material, so
  GLTFLoader assigns a default front-side material; the room's interior faces
  may be culled depending on the cube's normals. Portraits are unaffected
  (their own materials are `DoubleSide`), but this is why `offset` must keep
  them clear of the wall plane.
- **Disposal.** The game never disposes its scene today; `dispose()` is
  provided for hygiene/tests but is optional at wiring time.

---

## 7. Testing

Add `test/view/portrait.spec.ts` pinning the port (same idea as
`test/model/cuemesh.spec.ts` for the cue):

- constructing `Portrait` adds a `Group` to the scene and creates
  `TOTAL_INSTANCES = 576` instance slots across the two `InstancedMesh`es;
- border geometry has the 1.225 × 1.09 / 0.015 footprint;
- `setState` re-samples and produces non-empty instance data for a known
  emoji (e.g. "📺") and hides all instances for a blank/transparent input;
- orientation basis: `normal = −X, up = +Z` maps local +Y → world −Y
  (documents the mirror caveat), and parallel normal/up throws.

Run `yarn lint` and `yarn test` after the classes land.

---

## 8. Acceptance Criteria

1. `dist/wall/emojiwall.js` is imported by `dist/wall.html`; the wall page
   looks and behaves identically to today, but the renderer is a standalone
   function with a `scale` option.
2. `src/view/portrait.ts` exports a `Portrait` class whose geometry, materials,
   sampling, and orientation math are a 1:1 port of `emojiwall.js`.
3. `src/view/portraitplacements.ts` holds the two hard-coded wall placements
   (§1) and scale/offset constants.
4. `test/view/portrait.spec.ts` passes; `yarn lint` and `yarn test` are green.
5. Wiring (§4) is a follow-up, explicitly out of scope for this first pass.
