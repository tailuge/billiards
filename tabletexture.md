# Threecushion Table Cloth Texture — UV Mapping

## Problem

The glTF model's cloth material had **collapsed UV coordinates** — every vertex on the cloth geometry shared the same single UV value. This meant any texture applied as `mat.map` would sample the exact same texel for every fragment on the cloth surface, producing a solid color instead of a pattern.

Additionally, the mesh had **multiple primitives** (separate `cloth` and `clothshade` sub-meshes). Three.js's GLTFLoader represents these as a **material array** on a single mesh. The original code checked `child.material.name`, which is `undefined` for arrays — so the cloth material was never reached.

## Diagnosis

A coloured UV test pattern (4-quadrant red/green/blue/yellow) was applied. The cloth showed only "blue half table and black", confirming the UVs were 1-dimensional.

Logging the geometry's axis ranges revealed the root cause:

```
X=[656, 15731]  Z=[694, 694]
```

**Z was completely flat** — zero variation across all vertices. The planar UV generation code was using X for U and Z for V, but Z was a constant value, so the V coordinate had essentially no range. The entire cloth surface sampled a single horizontal line of the texture.

## Resolution

The `generatePlanarUVs` method in `src/view/assets.ts` was rewritten to inspect **all three axes** (X, Y, Z). It now auto-selects the two axes with the most real variation:

- **X** → U (always, since it has the widest range by far)
- **Y or Z** → V (whichever has more variation)

For the threecushion model, Y had `[648, 8161]` while Z was flat at `[694, 694]`, so Y was automatically selected for V.

A **uniform scale factor** (`Math.max(rangeX, rangeV)`) is used for both UV axes, preventing the texture from being stretched more in one axis than the other. This preserves aspect ratio on the table surface.

### Final UV span

```
U=0..1.0   V=0..0.4984   (V axis=Y)
```

Proper 2D coverage with correct aspect ratio — red/green/yellow/blue quadrants all visible on the cloth surface without distortion.

## Implementation

See `src/view/assets.ts`:
- `fixClothUVs()` — detects collapsed UVs
- `uvsAreCollapsed()` — checks if all UV pairs are identical
- `generatePlanarUVs()` — generates new UVs from XYZ positions, auto-selecting the best axis pair
- `computeXYZBounds()` — finds min/max/range for all three axes
