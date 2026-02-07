## 2025-05-14 - [Stationary Ball Physics Optimization]
**Learning:** In a billiards simulation, the vast majority of balls are stationary most of the time. Functions like `prepareAdvanceToCushions` and `fround` are called in high-frequency sub-steps (10+ times per frame). Checking `!inMotion()` before performing boundary math or rounding provides a significant CPU win without affecting physics accuracy.
**Action:** Always check for object activity state (like `inMotion()`) before executing complex geometry or state-update logic in physics sub-steps.

## 2025-05-14 - [Three.js Object Reuse]
**Learning:** Creating new `Frustum` and `Matrix4` objects in the rendering loop (even if just once per frame) generates thousands of short-lived objects per minute, leading to GC-induced "jank".
**Action:** Persistent members (readonly class properties) should be used for transient math objects in any function called during `requestAnimationFrame`.
