# Scaling Plan for 3-Cushion Billiard Table Size

This document outlines the design and implementation steps for scaling the 3D three-cushion table asset (`threecushion.min.gltf`), the corresponding physics engine boundaries, and the exported SVG diagrams (`export.html`, `svg.js`) to support smaller table sizes (9ft or 8ft) based on a URL query parameter `tableSize`.

The standard tournament billiard table size (10ft) is used as the base reference. Scaling will be applied only to the horizontal layout plane ($X$ and $Y$ axes), preserving the vertical height ($Z$ axis) to ensure physically accurate ball-cushion contact points, ball drop depths, and floor alignment. Scaling is specifically gated and applied only to **three-cushion** rules/tables.

---

## 1. Scale Factors Formulation

Since standard tables preserve a strict 2:1 playing area aspect ratio:
- **10ft Table (Default):** Base Scale Factor $S = 10 / 10 = 1.0$ (no visual/physical modifications).
- **9ft Table:** Scale Factor $S = 9 / 10 = 0.9$ (90% width and length).
- **8ft Table:** Scale Factor $S = 8 / 10 = 0.8$ (80% width and length).

The dynamic scale factor calculation is:
$$S = \frac{\text{tableSize}}{10}$$

---

## 2. Reading the Query Parameter

To support dynamic configuration, the `tableSize` query parameter should be parsed from the URL search parameters, defaulting to `10`:

```typescript
const urlParams = new URLSearchParams(globalThis.location?.search ?? "");
const tableSize = parseFloat(urlParams.get("tableSize") || "10");
const sizeScale = tableSize / 10;
```

---

## 3. Visual Scaling: `src/utils/gltf.ts`

In `importGltf(path, ready)`, the loaded glTF scene is currently scaled uniformly:
```typescript
gltf.scene.scale.set(R / 0.5, R / 0.5, R / 0.5)
```

To scale only in $X$ and $Y$ for the three-cushion table model, update the scaling logic inside the loader callback:

```typescript
export function importGltf(path, ready) {
  const loader = new GLTFLoader()
  loader.load(
    path,
    (gltf) => {
      // 1. Parse the table size and scale factor
      const urlParams = new URLSearchParams(globalThis.location?.search ?? "");
      const tableSize = parseFloat(urlParams.get("tableSize") || "10");
      const sizeScale = tableSize / 10;

      // 2. Conditionally scale the three-cushion table model
      if (path.includes("threecushion")) {
        gltf.scene.scale.set(
          (R / 0.5) * sizeScale, // Scale in X
          (R / 0.5) * sizeScale, // Scale in Y
          R / 0.5                // Keep Z (height) unchanged to maintain cushion/table heights
        );
      } else {
        gltf.scene.scale.set(R / 0.5, R / 0.5, R / 0.5);
      }

      gltf.scene.matrixAutoUpdate = false
      gltf.scene.updateMatrix()
      gltf.scene.updateMatrixWorld()
      gltf.scene.name = path
      ready(gltf)
    },
    (xhr) => console.log(path + " " + xhr.loaded + " bytes loaded"),
    onError
  )
}
```

---

## 4. Physics Scaling: `src/view/tablegeometry.ts`

To ensure the physical collision boundaries exactly match the scaled visual table mesh, `TableGeometry` must be scaled accordingly.

Update `TableGeometry.configureForRule(ruleType, tableSize)` to accept a `tableSize` parameter, applying scaling **exclusively** to `threecushion` tables:

```typescript
export class TableGeometry {
  static tableX: number
  static tableY: number
  static X: number
  static Y: number
  static hasPockets: boolean = true

  // ...

  static configureForRule(ruleType: string, tableSize: number = 10): void {
    const sizeScale = tableSize / 10;

    if (ruleType === "threecushion") {
      const UMB_TABLE_X = 92.36
      const UMB_TABLE_Y = 46.18
      TableGeometry.tableX = R * (UMB_TABLE_X / 2 - 1) * sizeScale
      TableGeometry.tableY = R * (UMB_TABLE_Y / 2 - 1) * sizeScale
      TableGeometry.hasPockets = false
    } else {
      // Standard / pocket tables remain unmodified (no scaling applied)
      TableGeometry.tableX = R * 43
      TableGeometry.tableY = R * 21
      TableGeometry.hasPockets = true
      setmu(mu * 1.2)
    }
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
  }
}
```

---

## 5. Propagation to Web Workers: `src/worker.ts`

The simulation runs headless in Web Workers (`worker.ts`). Since the worker thread doesn't have direct access to the main window's DOM/location object, the parsed `tableSize` must be explicitly passed through the simulation config payload (`params`).

Update `configureSimulation` inside `src/worker.ts` to forward `tableSize` from `params` to `TableGeometry`:

```typescript
function configureSimulation(
  params: Record<string, unknown>,
  ruleType: string,
  table: Table,
  cushionModel: string
): number {
  for (const [key, value] of Object.entries(params)) {
    const setterName = `set${key}`
    if (typeof (Constants as any)[setterName] === "function") {
      ;(Constants as any)[setterName](Number(value))
    }
  }

  const R = Constants.R

  // Extract tableSize from the params payload, default to 10
  const tableSize = Number(params.tableSize ?? 10);

  TableGeometry.configureForRule(ruleType, tableSize)

  if (cushionModel === "mathavan") {
    table.cushionModel = mathavanAdapter
  } else {
    table.cushionModel = strongeAdapter
  }

  return R
}
```

---

## 6. SVG Diagram Scaling: `dist/diagrams/export.html` and `svg.js`

To scale the 2D exported SVG diagrams for three-cushion rules without modifying non-three-cushion rules:

### A. Modifying module-level constants in `dist/diagrams/svg.js`
In `svg.js`, the table bounds and dimensions are parsed on load based on search parameters:

```javascript
const urlParams = new URLSearchParams(window.location.search);
const tableSize = parseFloat(urlParams.get("tableSize") || "10");
// Only apply scaling if the rule type is three-cushion (or defaults to it)
const sizeScale = (urlParams.get("ruletype") === "threecushion" || !urlParams.get("ruletype"))
  ? tableSize / 10
  : 1.0;

export const R = 0.03275;
const UMB_TABLE_X = 92.36;
const UMB_TABLE_Y = 46.18;
const tableX = R * (UMB_TABLE_X / 2 - 1) * sizeScale;
const tableY = R * (UMB_TABLE_Y / 2 - 1) * sizeScale;
export const X = tableX + R;
export const Y = tableY + R;
```

### B. Forwarding the Table Size inside `dist/diagrams/export.html`
When `export.html` constructs the simulation configuration payload, it should pass `tableSize` inside `config.params` so that the worker physics thread simulates the trajectories using matching boundaries:

```javascript
        const tableSizeParam = parseFloat(params.get("tableSize") || "10");

        config = {
          balls,
          cushionModel,
          ruleType: ruletype,
          shot: {
            cueBallId: initShot.cueBallId ?? 0,
            angle: initShot.angle,
            power: initShot.power,
            offset: initShot.offset,
            elevation: initShot.elevation ?? 0,
          },
          params: {
            tableSize: tableSizeParam // Forward size to physics simulation worker!
          }
        }
```

---

## 7. Implementation Summary

1. **Horizontal Scaling Only:** Visual scaling is performed in 3D scene space by applying the scale factor exclusively to `scale.x` and `scale.y` of the loaded `gltf.scene`.
2. **Seamless Physics Integration:** Dynamic boundary scaling is handled inside the static `TableGeometry` configuration, making it automatically compatible with all existing collision and advance integration logic.
3. **SVG Export Harmonization:** The 2D SVG dimensions and diamonds scale dynamically and matching simulation trajectories are requested from the web worker by forwarding the `tableSize` parameter inside `config.params`.
4. **No Code Changes:** No existing source code is modified in this stage, maintaining full compatibility and a clean workspace state.
