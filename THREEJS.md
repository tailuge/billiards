# Three.js Code Review and Optimizations

This document outlines the findings from a review of the Three.js implementation in this codebase and the subsequent optimizations applied.

## Findings

### 1. Object Churn in Rendering Loop
**Issue:** Several `Vector3` objects were being instantiated every frame during the rendering loop, particularly in `Camera.ts` (`aimView` method) and `utils.ts` (`unitAtAngle` function).
**Impact:** Increased garbage collection (GC) pressure, which can lead to frame stutters, especially on lower-end devices or mobile browsers.
**Recommendation:** Use persistent, reusable `Vector3` objects for mathematical operations within the hot path.

### 2. Redundant Projection Matrix Updates
**Issue:** `camera.updateProjectionMatrix()` was called every frame in `View.ts`, regardless of whether the aspect ratio had changed.
**Impact:** Small but unnecessary CPU overhead every frame.
**Recommendation:** Move the call inside the conditional block that handles window size changes.

### 3. Geometry and Material Duplication
**Issue:** Each `BallMesh` instance created its own `IcosahedronGeometry` and shadow-related meshes/materials.
**Impact:** Increased memory usage and slower initialization, especially in games with many balls (e.g., Snooker with 22 balls).
**Recommendation:** Use static shared geometries and materials for all ball instances.

### 4. Typographical Error
**Issue:** The method `viewFrustrum` in `View.ts` contained a typo (should be `viewFrustum`).
**Impact:** Code readability and maintainability.

---

## Applied Optimizations

- [x] **Vector Reuse:** Refactored utility functions (`unitAtAngle`, `viewPoint`) to accept an optional target vector, and updated `Camera` to provide persistent vectors for these calls.
- [x] **Conditional Updates:** Optimized `View.renderCamera` to only update the projection matrix when size or FOV changes.
- [x] **Shared Assets:** Refactored `BallMesh` to use shared static geometry for the ball and shared geometry/material for shadows.
- [x] **Code Cleanup:** Fixed the `viewFrustrum` typo.

## Further Optimizations (Batch 2)

### 5. Persistent Vectors in High-Frequency Updates
**Issue:** `Cue.ts` was creating multiple `Vector3` objects every frame in its `moveTo` method via `.clone()` and `unitAtAngle()` calls without a target.
**Solution:** Introduced persistent private `Vector3` members to `Cue` and updated mathematical operations to use these vectors.

### 6. Raycaster and Array Allocation
**Issue:** `Cue.intersectsAnything` created a new `Raycaster` and a new array of meshes (via `map`) every time it was called (e.g., during aim rotation).
**Solution:** Cached the `Raycaster` and the list of ball meshes to avoid redundant object creation.

### 7. Dotted Geometry Sharing
**Issue:** Every ball without a label (like the 15 red balls in Snooker) created its own `IcosahedronGeometry`.
**Solution:** Implemented a static cache for dotted geometries in `BallMesh`, allowing balls with the same base color to share the same geometry and vertex-colored dots.

### 8. Conditional Ball Mesh Updates
**Issue:** `BallMesh.updateAll` was updating Three.js properties (position, rotation, arrows) every frame even when balls were stationary.
**Solution:** Refactored the update loop to skip redundant updates if the ball is stationary, its state hasn't changed, and its position is constant.

### 9. Normalized Vector Reuse
**Issue:** `BallMesh.updateAll` called `norm(ball.rvel)` multiple times per frame.
**Solution:** Pre-calculated the normalized rotational velocity once per update and passed it to dependent methods.

### 10. Robust Vector Normalization
**Issue:** Normalizing zero-length vectors (e.g., when a ball stops) could lead to `NaN` values, causing rendering artifacts or console warnings.
**Solution:** Added guards in `BallMesh` and `Cue` to ensure `norm()` is only called on non-zero vectors, and updated `utils.ts` to support explicit target vectors for all vector math utilities.

- [x] **Vector Reuse in Cue:** Optimized `Cue` class for zero-allocation movement.
- [x] **Static Asset Caching:** Added geometry sharing for dotted balls in `BallMesh`.
- [x] **Smart Rendering:** Implemented state-based update skipping in `BallMesh`.
