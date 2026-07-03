# Simulation and Rendering Loop Performance Analysis Report (Churn & Bottlenecks)

This report identifies areas of high churn (frequent object allocation and garbage collection pressure) and redundant calculations within the critical simulation and rendering loops, specifically focusing on 3D rendering and non-physics logic.

## 1. Object Churn (Memory Management)

Frequent allocation of short-lived objects in the main loop leads to increased GC pressure and potential frame stutters.

### 1.1 Vector Cloning in Hot Paths
*   **File:** `src/view/camera.ts`
*   **Method:** `spectatorView`, `aimView`, `topView`
*   **Issue:** `aim.pos.clone()` is used frequently during camera updates.
*   **Impact:** Allocates a new `Vector3` every frame for camera positioning.
*   **File:** `src/view/drawing.ts`
*   **Method:** `updatePreview`
*   **Issue:** `p1.clone().add(new Vector3(0, 0, 0.001))` and `new Vector3(0, 0, 0.001)` are called during mouse/pointer move.
*   **Impact:** High-frequency allocations during user interaction.
*   **Recommendation:** Use pre-allocated scratch vectors and `.copy()` or `.set()`.

### 1.2 Trace Logic Allocations
*   **File:** `src/view/trace.ts`
*   **Method:** `freeze`
*   **Issue:** Creates `new Float32Array` and `new BufferGeometry` when freezing a trace. While not called every frame, it can be triggered during active gameplay transitions.
*   **Method:** `addPoint`
*   **Issue:** Triggers `needsUpdate = true` on buffer attributes, which is necessary but expensive when done for every small movement.

### 1.3 Event and Data Conversion
*   **File:** `src/container/container.ts`
*   **Method:** `processEvents`
*   **Issue:** Shifting from `inputQueue` and `eventQueue` happens every frame.
*   **Impact:** Minor, but creates array-shifting churn if queues are deep.

## 2. Redundant Calculations

Expensive mathematical operations performed multiple times per frame when a single cached value would suffice.

### 2.1 Multiple Length and Normalization Calls
*   **File:** `src/view/ballmesh.ts`
*   **Method:** `updateAll` and `updateArrows`
*   **Issue:** `ball.rvel.lengthSq()` is checked, then `updateRotation` calls `rvel.length()`, and `updateArrows` calls `rvel.length()` again. `norm(rvel)` is also called, which internally calculates length yet again.
*   **Impact:** Square root operations are relatively expensive.
*   **Recommendation:** Calculate length once at the start of `updateAll` and pass it down or store it in a local variable.

### 2.2 Camera Trigonometry
*   **File:** `src/view/camera.ts`
*   **Method:** `orbitView`
*   **Issue:** `Math.sin(this.t / 5)` and `Math.cos(this.t / 5)` are calculated independently.
*   **Impact:** Redundant trig for same input.
*   **Recommendation:** Use a single value or cached result if `t` hasn't changed significantly.

### 2.3 Particle System Matrix Updates
*   **File:** `src/view/particle-system.ts`
*   **Method:** `update`
*   **Issue:** Iterates over thousands of particles, performing `dummy.updateMatrix()` and `instancedMesh.setMatrixAt()` for every active particle every frame.
*   **Impact:** Massive CPU overhead for high particle counts.
*   **Recommendation:** Only update matrices for particles that are still in motion (`pState !== 2`).

## 3. Layout Thrashing (DOM Access)

Accessing DOM properties that force the browser to recalculate styles or layout during the animation frame.

### 3.1 Redundant Size Checks
*   **File:** `src/view/view.ts`
*   **Method:** `updateSize`, `sizeChanged`, `renderCamera`
*   **Issue:** `this.element.offsetWidth` and `this.element.offsetHeight` are accessed multiple times per frame across different methods.
*   **Impact:** Touching `offsetWidth/Height` forces layout recalculation (Reflow).
*   **Recommendation:** Cache these values once at the beginning of the `animate` loop or use a `ResizeObserver` to update them only when necessary.

## 4. Logical Flow & Timing

### 4.1 Frame Advance Logic
*   **File:** `src/container/container.ts`
*   **Method:** `animate` and `advance`
*   **Issue:** `performance.now()` is called multiple times. `Math.floor((elapsed * this.timeScale) / this.step)` is calculated every frame.
*   **Impact:** Minor, but adds up in high-refresh-rate environments.
*   **Recommendation:** Pass the timestamp from `requestAnimationFrame` more consistently and consolidate the step calculation.

### 4.2 Visibility Checks
*   **File:** `src/view/view.ts`
*   **Method:** `isInMotionNotVisible`
*   **Issue:** Uses `this.projScreenMatrix.multiplyMatrices` every time it's called.
*   **Impact:** Matrix multiplication is a relatively heavy operation for a simple visibility check that only checks one ball per frame anyway.
*   **Recommendation:** Cache the projection matrix if the camera hasn't moved.

## Summary

The primary bottlenecks are **redundant vector normalization/length calculations** in `BallMesh` and **layout thrashing** in `View`. Secondary concern is **Object Churn** in `Camera` and `Drawing` (e.g., `p1.clone().add(...)`). Addressing these would significantly improve frame time consistency and reduce garbage collection pauses.
