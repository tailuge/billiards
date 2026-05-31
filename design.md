# Design: Standalone Physics Utility for Web Workers

## Overview
This design outlines a utility to expose the existing billiards physics engine as a standalone, worker-ready library. The goal is to allow external HTML files to run high-performance, parallel simulations (e.g., for Three-Cushion shot optimization) by providing a standard interface for input and output.

**Important**: Existing game code and simulation logic must remain undisturbed. All changes are additive or use existing interfaces.

## Implementation Phases

### Phase 1: Core Worker Logic
Implement the simulation loop in a dedicated Web Worker that utilizes the existing `Table` and `Ball` classes.

### Phase 2: Bundling
Update the build configuration to produce a standalone worker bundle and a library for the main thread.

### Phase 3: Verification
Create a lightweight HTML test page to verify the end-to-end flow.

## Interface & Protocol

### 1. Input: `SimulationConfig`
The configuration represents the initial state of the table and shot parameters.

```json
{
  "balls": [
    { "id": 0, "pos": { "x": -0.7, "y": 0, "z": 0 }, "color": 0xffffff },
    { "id": 1, "pos": { "x": 0.7, "y": 0, "z": 0 }, "color": 0xffff00 },
    { "id": 2, "pos": { "x": 0.5, "y": 0.2, "z": 0 }, "color": 0xff0000 }
  ],
  "cushionModel": "mathavan",
  "shot": {
    "cueBallId": 0,
    "angle": 0.1,
    "power": 12.5,
    "offset": { "x": 0.1, "y": -0.05 },
    "elevation": 0.05
  },
  "stepSize": 0.001953125,
  "maxIterations": 200000
}
```

### 2. Output: `SimulationFrame[]`
The worker returns an array of frames. Ball state is simplified to position and velocity vectors.

```json
[
  {
    "t": 0.00195,
    "balls": [
      {
        "id": 0,
        "p": [x, y, z],
        "v": [vx, vy, vz],
        "w": [wx, wy, wz]
      },
      ...
    ],
    "outcomes": [
      { "type": "Cushion", "ball": 0, "speed": 1.5, "time": 0.12 }
    ]
  },
  ...
]
```

## Proposed Code Changes

### `src/worker/physics-worker.ts` (New)
- Entry point for the worker.
- Receives `SimulationConfig`.
- Initializes `Table` and applies the shot.
- Loops `advance()` until `allStationary()`.
- Captures and sends results.

### `webpack.config.js`
- Add `physics_worker: "./src/worker/physics-worker.ts"`.
- Configure library output for main-thread utilities if needed.

### `dist/ww.html` (New)
- Minimal test page.
- Imports `physics_worker` and triggers a sample simulation.
- Prints JSON results to the screen.
