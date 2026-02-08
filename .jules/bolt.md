## 2025-05-14 - [Three.js Object Reuse]
**Learning:** Creating new `Frustum` and `Matrix4` objects in the rendering loop (even if just once per frame) generates thousands of short-lived objects per minute, leading to GC-induced "jank".
**Action:** Persistent members (readonly class properties) should be used for transient math objects in any function called during `requestAnimationFrame`.
## 2026-02-07 - [Three.js Resource Sharing and Vector Reuse]
**Learning:** Each ball mesh previously created its own geometry and shadow assets. Sharing static geometries and materials significantly reduces memory footprint and GPU upload overhead. Additionally, projection matrix updates must account for both aspect ratio AND FOV changes.
**Action:** Refactored BallMesh to use static shared assets. Updated View.ts to conditionally call updateProjectionMatrix on size OR FOV change. Refactored math utilities to support optional target vectors for zero-allocation reuse.

## 2026-02-07 - [Advanced Three.js Geometry Caching and Cue Optimization]
**Learning:** Redundant geometry creation for table components (knuckles, pockets, cushions) and unlabeled balls (snooker reds) adds unnecessary memory overhead. Object churn in cue movement and raycasting also contributes to GC pressure.
**Action:** Implemented static geometry caching in TableMesh and BallMesh. Added persistent scratch vectors and Raycaster to the Cue class. Optimized camera calculations by caching trigonometric results.

## 2026-02-07 - [DOM and Controller Organization]
**Learning:** Scattered `document.getElementById` calls with manual type casting and duplicate controller name mapping logic lead to code maintenance challenges and potential runtime errors.
**Action:** Centralized DOM access in `src/utils/dom.ts` with typed helpers. Refactored the `Controller` base class to include a `name` getter using `this.constructor.name`, eliminating the need for a manual name-mapping utility and reducing duplication.

## 2026-02-08 - [Snooker Score-Based Winner Determination]
**Learning:** In Snooker, the person who pots the last ball isn't necessarily the winner; the player with the highest score wins the frame. Relying on an `isWinner` boolean passed from the game flow controller can lead to incorrect UI states and match reporting in multiplayer.
**Action:** Refactored `Snooker.handleGameEnd` to ignore the `isWinner` parameter for UI/Winner logic. It now explicitly compares `this.container.scores` to determine the actual winner (where a tie is treated as a win), updates the notification subtext with names and scores, and ensures only the correct winner submits the match result.
