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
