# Three-Cushion Practice Support Plan

This document outlines the changes required to enable ball positioning for Three-Cushion billiards using the existing practice mode infrastructure.

## 1. Analysis of Current Mechanism

*   **Frontend (`dist/practice.html`):** The "Play" button serializes ball coordinates into a JSON array and redirects to `index.html?practice=true&init=[...]`. It negates the X-coordinate (`-b.x`) to align with the engine's 3D coordinate system.
*   **Engine (`src/utils/rack.ts`):** The `Rack.fromInitParam(balls: Ball[])` method parses the `init` query parameter and updates the positions of the balls passed to it.
*   **Rule Integration:** Current pool rules (e.g., `NineBall`) call `Rack.fromInitParam(Rack.diamond())` in their `rack()` method.

## 2. Changes Needed in Main Game (`src/controller/rules/threecushion.ts`)

The `ThreeCushion` rule class must be updated to support the initialization parameter.

*   **Modify `rack()` method:**
    Update the implementation to wrap the default three-ball rack with the initialization helper.
    ```typescript
    rack(): Ball[] {
      return Rack.fromInitParam(Rack.three());
    }
    ```

## 3. Changes Needed in Practice Tool (`dist/practice.html`)

The 2D practice tool needs adjustments to support the specific requirements of carom billiards.

*   **Dynamic Configuration:**
    Introduce a way to detect the game mode (e.g., via a `ruletype=threecushion` query parameter).
*   **Ball Count and Colors:**
    In Three-Cushion mode:
    - Only initialize 3 balls (IDs 0, 1, and 2).
    - Ensure the third ball (ID 2) uses the Red color (`#ef4444`).
*   **Table Dimensions:**
    The UMB table used in Three-Cushion is larger than a standard pool table. Update `HW` (Half-Width) and `HH` (Half-Height) to match the engine's `TableGeometry`:
    - `HW = R * 46.18`
    - `HH = R * 23.09`
*   **Play Button Redirect:**
    Ensure the `ruletype=threecushion` parameter is appended to the `index.html` URL so the `RuleFactory` loads the correct ruleset.

## 4. Implementation Steps

1.  Update `src/controller/rules/threecushion.ts` to include `Rack.fromInitParam`.
2.  Add logic to `dist/practice.html` to switch between 'pool' and 'threecushion' modes.
3.  Update table constants in `dist/practice.html` for the UMB scale.
4.  Verify that clicking "Play" in the tool correctly initializes a Three-Cushion game in the main app with the custom positions.
