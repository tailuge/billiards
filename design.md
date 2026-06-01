# Design: Standalone Physics Utility for Web Workers

## Overview
This design outlines a utility to expose the existing billiards physics engine as a standalone, worker-ready library. The goal is to allow external HTML files to run high-performance, parallel simulations (e.g., for Three-Cushion shot optimization) by providing a standard interface for input and output.

**Important**: Existing game code and simulation logic must remain undisturbed. The utility leverages the fact that the core `Table` and `Ball` classes are already compatible with headless execution.

## Implementation Phases

### Phase 1: Core Worker Logic
Implement the simulation loop in a dedicated Web Worker that utilizes the existing `Table` and `Ball` classes. The worker will use `RuleFactory` to correctly set up table geometry and pocket existence based on the requested `ruleType`.

### Phase 2: Bundling
Update the build configuration to produce a standalone worker bundle (`physics_worker.js`).

### Phase 3: Verification
Create a lightweight HTML test page (`ww.html`) to verify the end-to-end flow.

## Interface & Protocol

### 1. Input: `SimulationConfig`
The configuration represents the initial state of the table and shot parameters. Note that `color` is not required for input as it is purely visual.

```json
{
  "ruleType": "threecushion",
  "balls": [
    { "id": 0, "pos": { "x": -0.7, "y": 0, "z": 0 } },
    { "id": 1, "pos": { "x": 0.7, "y": 0, "z": 0 } },
    { "id": 2, "pos": { "x": 0.5, "y": 0.2, "z": 0 } }
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
The worker returns an array of frames. Ball state is simplified to identity, position, and angular velocity.

```json
[
  {
    "t": 0.00195,
    "balls": [
      {
        "id": 0,
        "pos": [x, y, z],
        "rvel": [wx, wy, wz]
      },
      ...
    ],
    "outcomes": [
      { "type": "Cushion", "ballA": 0, "speed": 1.5, "t": 0.12 }
    ]
  },
  ...
]
```

## Proposed Code Changes

### `src/worker/physics-worker.ts` (New)
- Entry point for the worker.
- Receives `SimulationConfig`.
- Uses `RuleFactory` to initialize table geometry according to `ruleType`.
- Initializes `Table` and applies the shot (including `elevation`).
- Loops `advance()` until `allStationary()`.
- Captures and sends results with simplified ball state (`id`, `pos`, `rvel`).

### `webpack.config.js`
- Add `physics_worker: "./src/worker/physics-worker.ts"`.

### `dist/ww.html` (New)
- Minimal test page in `dist/`.
- Imports `physics_worker.js` and triggers a sample simulation.
- Prints JSON results to the screen.
