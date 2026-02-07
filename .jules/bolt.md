## 2025-05-14 - [Three.js Object Reuse]
**Learning:** Creating new `Frustum` and `Matrix4` objects in the rendering loop (even if just once per frame) generates thousands of short-lived objects per minute, leading to GC-induced "jank".
**Action:** Persistent members (readonly class properties) should be used for transient math objects in any function called during `requestAnimationFrame`.
## 2026-02-07 - [Three.js Resource Sharing and Vector Reuse]
**Learning:** Each ball mesh previously created its own geometry and shadow assets. Sharing static geometries and materials significantly reduces memory footprint and GPU upload overhead. Additionally, projection matrix updates must account for both aspect ratio AND FOV changes.
**Action:** Refactored BallMesh to use static shared assets. Updated View.ts to conditionally call updateProjectionMatrix on size OR FOV change. Refactored math utilities to support optional target vectors for zero-allocation reuse.

## 2026-02-07 - [Three.js Optimization Batch 2]
**Learning:** High-frequency rendering loops (like cue movement and intersection checks) are highly sensitive to object churn. Additionally, normalizing zero-length vectors can lead to `NaN` values that propagate through the scene graph.
**Action:** Optimized `Cue.ts` with persistent vectors and cached `Raycaster`. Implemented state-based update skipping in `BallMesh.updateAll` to avoid redundant property settings. Updated `utils.ts` to support explicit target vectors for `norm` and `upCross`. Added guards against zero-length vector normalization.
