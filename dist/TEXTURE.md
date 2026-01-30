# Ball Texture Implementation Plan

This document outlines the plan to integrate the projected texture technique from `dist/mockup.html` into the billiards engine, specifically for Nineball, while retaining the current "dotted" style for Snooker.

## 1. Analysis

### Current State
- **Material**: `BallMesh` uses `MeshPhongMaterial` with `vertexColors: true`.
- **Technique**: Face colors are manually assigned to an `IcosahedronGeometry` in `BallMesh.addDots`.
- **Identification**: Balls are currently identified primarily by `color` and a sequential `id`.

### Target Technique (`mockup.html`)
- **Material**: `MeshStandardMaterial` (provides better PBR support for future improvements).
- **Technique**: A 2D `CanvasTexture` containing numbers and stripes is projected onto the sphere using a custom shader (`onBeforeCompile`).
- **Projection**: The texture is projected on the Y-axis, mirrored for the bottom half to ensure the number appears on both poles.

## 2. Proposed Strategy (Surgical & Low Complexity)

To minimize impact on existing physics and Snooker logic, we will introduce a factory-based approach for ball materials.

### Step 1: Update Data Model (`src/model/ball.ts`)
- Add an optional `label?: number` property to the `Ball` class.
- Update the constructor to accept this `label`.
- **Reason**: Allows the view layer to know *which* texture to generate (e.g., 1-9 for Nineball) without inferring from hex colors.

### Step 2: Create Material Factory (`src/view/ballmaterialfactory.ts`)
Create a new utility class to encapsulate material creation:
- **`createDottedMaterial(color: Color)`**: Returns the existing `MeshPhongMaterial` configuration (for Snooker).
- **`createProjectedMaterial(number: number, color: Color)`**: 
    - Generates a `CanvasTexture` dynamically (drawing stripes for numbers >= 9).
    - Returns a `MeshStandardMaterial` with the `onBeforeCompile` shader injection from the mockup.
- **`createCueBallMaterial()`**: Handles the specific case for the cue ball (plain white).

### Step 3: Refactor `BallMesh` (`src/view/ballmesh.ts`)
- Modify `initialiseMesh` to use `BallMaterialFactory`.
- Logic:
    ```typescript
    if (ball.label !== undefined) {
      this.mesh.material = BallMaterialFactory.createProjectedMaterial(ball.label, this.color);
    } else {
      this.mesh.material = BallMaterialFactory.createDottedMaterial(this.color);
      this.addDots(geometry, color); // Retain existing snooker dots
    }
    ```
- This keeps the Snooker path 100% identical to current behavior.

### Step 4: Update Game Initialization (`src/utils/rack.ts`)
- Update `Rack.diamond()` to pass labels (1-9) when creating Nineball balls.
- Update `Rack.cueBall()` to pass label 0.
- Snooker initialization in `Rack.snooker()` remains unchanged (label stays `undefined`).

## 3. Benefits

- **Surgical**: Does not change physics or game logic.
- **Low Complexity**: No external assets required (all textures are generated via Canvas).
- **Backward Compatible**: Snooker remains untouched, preserving its unique visual style.
- **Maintainable**: All shader and texture logic is isolated in one factory class.

## 4. Verification Plan

1. **Visual Test**: Run Nineball and verify balls 1-8 have numbers and 9 has a stripe.
2. **Regression Test**: Run Snooker and verify balls still have the characteristic "dotted" faces.
3. **Performance**: Ensure `CanvasTexture` generation only happens once per ball type during initialization.
