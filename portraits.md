# Emoji Wall Portraits: `wall.html` → In-Game `Portrait`

Port `dist/wall.html`'s emoji portrait (border + instanced emoji triangles +
fake shadows + optional name plaque) into the game so each player's chosen
emoji appears on the interior walls of `dist/models/background.gltf`. One
portrait on the **+X wall** and one on the **-X wall**, hard-coded coordinates.

This document mirrors the approach already used for cues
(`twocue.md` ↔ `src/view/cuemesh.ts` ↔ `dist/cue.html`): the game ships a
faithful TypeScript port of a single, well-isolated wall-rendering function.

---

## 0. Status

| Part | Status |
|------|--------|
| wall.html refactor (§2) | ✅ Done |
| `Portrait` class (`src/view/portrait.ts`) | ✅ Done |
| Placement constants (`src/view/portraitplacements.ts`) | ✅ Done |
| Wiring into the scene / assets-ready path (§4) | Planned (deferred) |
| Tests | Deferred — "app still builds" check only (`tsc` + `eslint` + `webpack`) |

---

## 1. Coordinate & Scale Reference

The game is **Z-up** (`up = (0,0,1)`, `src/utils/three-utils.ts`); the table
lies in the XY plane and +Z is vertical. `dist/wall.html` is also Z-up, but it
authors its overlay in a **local YZ wall plane** with **+X = facing normal**
and **+Z = up**, then re-orients it via an `orientation` map. That local-frame
convention is exactly what the game port keeps.

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
`normal` + `up`).

### Hard-coded placement (`src/view/portraitplacements.ts` — implemented)

| Wall | position (x, y, z) | orientation normal | orientation up | scale |
|------|--------------------|--------------------|----------------|-------|
| −X | (−5.24 + offset, 0, 1.05) | +X `(1,0,0)` | +Z `(0,0,1)` | 3 |
| +X | (+5.24 − offset, 0, 1.05) | −X `(−1,0,0)` | +Z `(0,0,1)` | 3 |

- `PORTRAIT_OFFSET = 0.02` floats the overlay inward from the wall face to
  avoid z-fighting.
- `PORTRAIT_SCALE = 3` → portrait ≈ 3.77 × 3.36, inside the 5.24 × 3.93 wall.

These are starting points; the exact offset/scale get tuned when wiring lands.
They are confined to the placement module so `Portrait` stays unit-agnostic.

---

## 2. Changes to `dist/wall.html` — ✅ DONE

Goal was to isolate the portrait renderer and make it parameterized and static,
while keeping wall.html a **single HTML file** (no `emojiwall.js` extraction).

1. **`scale` option added.** `createEmojiWall(scene, { scale })` now applies
   `wallGroup.scale.setScalar(scale)` (default 1). Combined with the existing
   `orientation` + `position`, the same function can place any number of
   portraits on different walls at any size.
2. **Animation removed.** The per-frame `tick()` and its call in the render
   loop are gone; instance matrices/colours are written once by `bake()`,
   called on creation and inside `setState()`. Return is now
   `{ setState, drawPlate }`.
3. **Single-sided polygons.** All four `side: THREE.DoubleSide` removed; every
   mesh faces +X in local space, so the wall's `normal` must point toward the
   viewer.
4. **JSDoc documents the port surface** (`emoji`, `name`, `position`,
   `orientation`, `scale`) and the single-sided constraint.

wall.html still owns the picker, `localStorage` persistence, scene/backdrop/
lights/camera/OrbitControls, and the `postMessage("done")` handshake — none of
which the game needs (the game receives the emoji via URL params, §5).

---

## 3. Classes Added to the Game — ✅ DONE

### 3.1 `src/view/portrait.ts` — `Portrait`

Faithful TS port of wall.html's `createEmojiWall` (border + border shadow +
576 instanced emoji triangles + instance shadow + optional name plaque).

```typescript
export interface PortraitOrientation { normal: Vector3; up: Vector3 }

export interface PortraitOptions {
  emoji: string
  name?: string        // plaque hidden when empty/absent
  position?: Vector3
  orientation: PortraitOrientation
  scale?: number       // default 1
}

export class Portrait {
  readonly group: Group               // added to the scene by the constructor
  constructor(scene: Scene, options: PortraitOptions)
  setState(patch: { emoji?: string; name?: string }): void  // re-sample + re-bake
  dispose(): void
}
```

- Single-sided materials; parallel-normal guard (throws).
- Baked once in the constructor and re-baked on `setState`; no per-frame work.
- `getContext("2d")` null is handled (like `balltexturefactory.ts`).

### 3.2 `src/view/portraitplacements.ts` — hard-coded walls

`WALL_X = 5.24`, `PORTRAIT_SCALE = 3`, `PORTRAIT_OFFSET = 0.02`,
`PORTRAIT_Z = 1.05`, plus `MINUS_X_WALL` and `PLUS_X_WALL` placement objects
(`PortraitPlacement = { position, orientation }`).

---

## 4. Wiring Plan — Flexible, Mode-Aware Policy

Design principle: **separate "what to show" (policy) from "how to render"
(`Portrait`)**. A pure function turns the current mode + `Session` state into
a list of specs; a tiny helper turns specs into `Portrait` instances. Future
modes only edit the policy function — `Portrait` and the placements never
change.

### 4.1 Specs and policy

```typescript
// planned: src/view/portraits.ts
const DEFAULT_EMOJI = "📺"   // wall.html's DEFAULT_STATE.emoji

interface PortraitSpec {
  emoji: string          // fall back to DEFAULT_EMOJI when absent
  name?: string          // plaque hidden when empty/absent
  placement: PortraitPlacement
  scale?: number         // default PORTRAIT_SCALE
}

interface PortraitMode {
  roomVisible: boolean   // false when there is no background.gltf room
  singlePlayer: boolean  // true → only the local player's portrait
}

function portraitSpecs(mode: PortraitMode, s: Session): PortraitSpec[] {
  if (!mode.roomVisible) return []

  const mine: PortraitSpec = {
    emoji: s.customParams["emoji"] || DEFAULT_EMOJI,
    name: s.playername || undefined,
    placement: MINUS_X_WALL,
  }
  if (mode.singlePlayer) return [mine]

  return [
    mine,
    {
      emoji: s.opponentParams["emoji"] || DEFAULT_EMOJI,
      name: s.opponentName || undefined,
      placement: PLUS_X_WALL,
    },
  ]
}

function createPortraits(scene: Scene, specs: PortraitSpec[]): Portrait[] {
  return specs.map(
    (spec) => new Portrait(scene, { ...spec, scale: spec.scale ?? PORTRAIT_SCALE })
  )
}
```

### 4.2 Mode → behaviour table

| Mode | `roomVisible` | `singlePlayer` | Portraits | Emoji | Name |
|------|---------------|----------------|-----------|-------|------|
| diagrams / analysis / drill | `false` | — | 0 | — | — |
| single-player (practice, exam, speedrun, local mesh) | `true` | `true` | 1 (mine) | `customParams.emoji` → default | `playername` |
| bot | `true` | `false` | 2 | mine = `customParams.emoji`; bot = default | mine = `playername`; bot = `opponentName` |
| two-player multiplayer | `true` | `false` | 2 | mine + `opponentParams.emoji` | `playername` + `opponentName` |
| replay | `true` | `false` (or `true`) | 1–2 | absent → default | already inferred into `Session` (below) |
| spectator | `true` | `false` | 2 | absent → default | `spectatedP1Name/P2Name` if set |

Notes:

- **Replay** already infers names: `BrowserContainer.startReplay` sets
  `session.playername = breakState.players.player1` and
  `session.opponentName = breakState.players.player2`. The replay state has no
  emoji, so the policy falls back to `DEFAULT_EMOJI`. A one-player replay shows
  one portrait because the opponent name/emoji are absent.
- **Spectator** receives neither player's `custom.*` over the network (same
  caveat as cues in `twocue.md`), so emoji defaults; names are filled in when
  `spectatedP1Name/P2Name` arrive.
- **Diagrams/analysis/drill** have no `background.gltf` room (diagrams use
  `Assets.localAssets`, so `assets.background` is undefined), hence no
  portraits. `roomVisible` is the explicit opt-out rather than relying on that
  fact alone.

### 4.3 Where mode intent lives

Carry the mode intent through `ContainerConfig` so each container states its
intent once, and the wiring just consumes it:

```typescript
// planned: src/container/containerconfig.ts
portraitMode?: PortraitMode
// BrowserContainer (game)   → { roomVisible: true,  singlePlayer: this.isSinglePlayer && !this.replay }
// DiagramContainer (diagram) → { roomVisible: false, singlePlayer: true }
```

Then `View` (which already owns `scene` and `assets.background`) creates the
portraits once assets are ready:

```typescript
// planned: src/view/view.ts (initialiseScene or after background is added)
this.portraits = createPortraits(
  this.scene,
  portraitSpecs(mode, Session.getInstance())
)
```

"Create at asset-load, add to scene, done" — no per-frame work, and any future
mode is a one-line change to the policy/table, not to `Portrait`.

---

## 5. Emoji Flow (for reference)

1. **Lobby** (`dist/lobby.js`) shows `wall.html` in an iframe; wall.html
   persists the pick to `localStorage.custom.emoji`.
2. **Lobby → game URL**: the lobby flattens `custom` into `custom.emoji=…`
   (and the opponent's into `opponent.custom.emoji=…`) when building the game
   link (`Ue`/`ze`).
3. **Parse** (`Session.applyUrlParams`): `custom.emoji` →
   `customParams["emoji"]`; `opponent.custom.emoji` → `opponentParams["emoji"]`.
4. **Policy** (§4): reads those keys, defaults to `"📺"`, infers names from
   `Session` (already populated for replay), and yields the specs to render.

---

## 6. Caveats & Risks

- **+X wall is mirror-imaged.** For `normal = −X`, the orientation basis maps
  local +Y (width) to world −Y, so glyphs/plaque text on the +X wall are
  horizontally mirrored relative to the −X wall. For symmetric emoji this is
  invisible; for text-like emoji (flags, ™, ©, arrows) it shows. Mitigation
  (if desired later): horizontally flip the sampled pixel data for the
  mirrored wall. Not blocking.
- **Camera may rarely frame the walls.** Gameplay cameras (`aimView`,
  `topView`) look steeply down at the table; the portraits live far off to the
  sides (X = ±5.24). Verify framing during wiring before tuning scale/position.
- **Canvas sampling needs a DOM 2D context.** `getEmojiPixelData` requires
  `document.createElement("canvas").getContext("2d")`. Fine in the browser
  (precedent: `balltexturefactory.ts`, `particle-utils.ts`); handled with a
  null guard.
- **Background cube back-faces.** `background.gltf` ships no material, so
  GLTFLoader assigns a default front-side material; the room's interior faces
  may be culled depending on the cube's normals. Portraits are unaffected
  (their own materials are single-sided but the wall normal points inward, and
  `offset` keeps them clear of the wall plane).
- **Disposal.** The game never disposes its scene today; `dispose()` is
  provided for hygiene/future use but is optional at wiring time.

---

## 7. Verification

No dedicated tests yet (deferred). After each change:

- `npx tsc --noEmit` — typecheck the port.
- `npx eslint src/view/portrait.ts src/view/portraitplacements.ts` — lint the
  new files.
- `node node_modules/prettier/bin/prettier.cjs --check --trailing-comma es5 --no-semi <files>` — formatting.
- `yarn dev` (webpack) — the app still builds/runs.

---

## 8. Acceptance Criteria

1. ✅ `dist/wall.html` renders identically but exposes a static, single-sided,
   `scale`-aware `createEmojiWall` (baked once, no per-frame tick).
2. ✅ `src/view/portrait.ts` exports `Portrait`, a 1:1 port of
   `createEmojiWall`.
3. ✅ `src/view/portraitplacements.ts` holds the two hard-coded placements and
   scale/offset constants.
4. ⬜ Wiring lands behind the mode-aware `portraitSpecs` policy (§4), driven by
   `ContainerConfig.portraitMode`; diagrams show nothing, single-player shows
   one, multiplayer/replay/spectator show two (emoji defaulting when absent).
5. ⬜ `yarn lint` / `yarn dev` remain green.
