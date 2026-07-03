# Simulation and Rendering Loop Churn Analysis Report (Object Allocation Ranking)

This report ranks the sources of object allocation (churn) within the 3D simulation and rendering loops. High churn increases Garbage Collection (GC) frequency, which can lead to frame-time instability and stuttering.

## Ranking of Churn Sources

| Rank | Source Type | Frequency | Location(s) | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Outcome Allocations** | Per Physics Step | `src/utils/proximity.ts`, `src/model/table.ts` | High (Frequent per-step allocation) |
| **2** | **Vector Cloning/Creation** | Per Frame | `src/view/camera.ts`, `src/view/drawing.ts` | High (Constant per-frame allocation) |
| **3** | **Array Filter/Map/Set** | Per Frame | `src/container/container.ts`, `src/utils/proximity.ts` | Medium (Intermediate object churn) |
| **4** | **String/JSON Churn** | Per Network Event | `src/network/client/nchanmessagerelay.ts` | Low (Dependent on network traffic) |

---

## 1. Outcome Allocations (Highest Impact)

The simulation engine generates `Outcome` objects for every collision, cushion bounce, and proximity check.

*   **Location:** `src/utils/proximity.ts` (`updateProximityOutcome`, `refineProximity`), `src/model/table.ts` (`prepareAdvancePair`, `prepareAdvanceToCushions`).
*   **Churn:** Calls `Outcome.proximity()`, `Outcome.collision()`, etc., which create `new Outcome(...)`.
*   **Issue:** In `checkProximity`, `Outcome` objects are pushed to a growing array and often replaced/refined. This happens inside the physics loop (`advance`), which may run multiple steps per frame.
*   **Optimization:** Use an object pool for `Outcome` instances or represent outcomes using typed arrays if historical tracking is only needed for the current shot.

## 2. Vector Cloning/Creation (High Impact)

Explicit cloning and new vector instantiation in high-frequency update methods.

*   **Location 1:** `src/view/camera.ts` (`spectatorView`, `aimView`, `topView`).
    *   **Churn:** `aim.pos.clone()` and `unitAtAngle(..., this.tempVec)` (which potentially returns a new vector or modifies one).
*   **Location 2:** `src/view/drawing.ts` (`updatePreview`).
    *   **Churn:** `p1.clone().add(new Vector3(0, 0, 0.001))`.
*   **Issue:** These methods run every frame (Camera) or every mouse move (Drawing). `Vector3` allocations are small but very numerous.
*   **Optimization:** Use pre-allocated "scratch" vectors and the `.copy()`, `.add()`, and `.set()` methods to avoid new object creation.

## 3. Array Transformation Churn (Medium Impact)

Use of functional array methods (`filter`, `map`, `some`) creates intermediate array objects.

*   **Location 1:** `src/container/container.ts` (`animate`).
    *   **Churn:** `Object.keys(this.pressed).filter(...)` (via `this.keyboard.getEvents()`).
*   **Location 2:** `src/utils/proximity.ts` (`checkProximity`, `updateCushionCount`).
    *   **Churn:** `balls.filter(b => b.inMotion())`, `outcome.filter(...)`.
*   **Issue:** These filters create new array instances every frame or physics step.
*   **Optimization:** Use traditional `for` loops or `forEach` with a stable result array to avoid creating short-lived intermediate arrays.

## 4. State Snapshotting (Low to Medium Impact)

Capturing the full state of the table for replays or analysis.

*   **Location:** `src/container/container.ts` (`updateLastShot`).
    *   **Churn:** `ExportUtils.captureSnapshot(this.table)` creates a large JSON-serializable object.
*   **Issue:** While not happening every frame, it happens at the end of every shot and periodically in some modes.
*   **Optimization:** Update a persistent state object incrementally rather than serializing the whole table.

## Summary

To minimize GC pressure, the priority should be moving **Outcome tracking** to a non-allocating structure and replacing **Vector cloning** in the camera/drawing logic with scratch vector usage. Reducing intermediate **Array filtering** in the physics and input loops will further stabilize the memory footprint.
