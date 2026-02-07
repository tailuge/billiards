## 2025-05-14 - [Three.js Object Reuse]
**Learning:** Creating new `Frustum` and `Matrix4` objects in the rendering loop (even if just once per frame) generates thousands of short-lived objects per minute, leading to GC-induced "jank".
**Action:** Persistent members (readonly class properties) should be used for transient math objects in any function called during `requestAnimationFrame`.
