# Headless Execution Design for Billiards Engine

This document outlines the architecture and feasibility of running the billiards game engine in a headless environment, specifically targeting a **WebWorker** for bot simulations and replay processing without DOM dependencies or rendering overhead.

## Feasibility Analysis

The core physics engine is already largely decoupled from the rendering layer, as evidenced by existing unit tests that run in Node.js (via Jest/JSDOM). To run in a true WebWorker (where `document` and `window` are unavailable), the following changes are required:

1.  **Decouple `Container` from UI**: The `Container` class currently instantiates `View`, `Hud`, `Menu`, `Comment`, `Notification`, and `LobbyIndicator`. These must be made optional or abstracted.
2.  **Mock/Omit `three` Renderer**: While physics uses `three`'s math library (`Vector3`, `Matrix4`), it should not initialize `WebGLRenderer` or `Scene` when running headless.
3.  **Headless Loop**: Replace the `requestAnimationFrame` loop with a synchronous or `setTimeout`-based loop that can run "uncapped" (faster than 60fps).
4.  **Asset Loading**: Physics-only execution does not require textures or complex meshes. The table geometry and ball properties are already defined in code (`src/model/physics/constants.ts`).

## Architectural Design

### 1. Optional UI in `Container`

Modify `Container` to accept a `headless` flag in its config. When `true`:
- `view`, `hud`, `menu`, `sound`, etc., are either not instantiated or replaced with null-object stubs.
- Methods like `notify` and `updateScoreHud` will skip DOM updates.

### 2. Headless Simulation Loop

In a headless environment, we want to reach the "Stationary" state as fast as possible after a hit.

```typescript
// Simplified headless loop logic
runToStationary() {
  const step = 0.001953125; // Constant physics step
  while (!this.table.allStationary()) {
    this.table.advance(step);
    // Optional: process mid-flight events if any
  }
  this.eventQueue.push(new StationaryEvent());
  this.processEvents(); // Transition to next state (e.g., next player's turn)
}
```

### 3. WebWorker Integration

The `HeadlessWorker` will act as a wrapper around the engine:

- **Input**: Listen for `postMessage` containing game events (e.g., `HitEvent`, `BeginEvent`).
- **Processing**: Run the physics simulation uncapped.
- **Output**: `postMessage` results back to the main thread (e.g., final ball positions, scores, or "shot complete" signals).

## Implementation Plan

### Step 1: Core Decoupling
- Refactor `Container` to allow null for `element`.
- Guard all DOM accesses in `src/view/` and `src/utils/dom.ts`.
- Ensure `Assets.localAssets()` can function without GLTF loading.

### Step 2: Headless Entry Point
- Create `src/headless/headless-container.ts` which extends or configures `Container` for minimal overhead.
- Create `src/headless/worker.ts` as the WebWorker script.

### Step 3: Uncapped Simulation
- Implement a controller/loop that calls `table.advance` in a tight loop.
- Ensure `StationaryEvent` triggers correctly to allow the `Rules` engine to update the game state (e.g., potting balls, foul detection).

### Step 4: Network Integration
- The headless instance can still use `MessageRelay` if provided with a non-DOM implementation (e.g., a simple WebSocket or a mock relay for testing).

## Benefits
- **Bot Training**: Bots can simulate thousands of shots per second to find the optimal move.
- **Server-side Validation**: Validate game outcomes on a server (Node.js) using the same physics code.
- **Fast Replay**: Skip the animation and jump straight to the end of a break to calculate final scores.
