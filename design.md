# Design: Standalone Physics Utility for Web Workers

## Overview
This design outlines a utility to expose the existing billiards physics engine as a standalone, worker-ready library. The goal is to allow external HTML files to run high-performance, parallel simulations (e.g., for Three-Cushion shot optimization) by providing a standard interface for input and output.

## Interface & Protocol

The utility will use a JSON-based protocol for communication between the main thread and the Web Worker.

### 1. Input: `SimulationConfig`
The configuration represents the initial state of the table and physics parameters.

```json
{
  "balls": [
    { "id": 0, "pos": { "x": -0.7, "y": 0, "z": 0 }, "color": 0xffffff },
    { "id": 1, "pos": { "x": 0.7, "y": 0, "z": 0 }, "color": 0xffff00 },
    { "id": 2, "pos": { "x": 0.5, "y": 0.2, "z": 0 }, "color": 0xff0000 }
  ],
  "cushionModel": "mathavan",
  "constants": {
    "mu": 0.007,
    "muS": 0.136,
    "muC": 0.85,
    "e": 0.86
  },
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
The worker returns an array (or stream) of frames, each containing the state of all balls at a specific timestep.

```json
[
  {
    "t": 0.00195,
    "balls": [
      {
        "id": 0,
        "p": [x, y, z],
        "q": [x, y, z, w],
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

## Implementation Strategy

### Web Worker (`physics-worker.ts`)
A new dedicated worker script will:
1. Initialize the `Table` using the provided ball positions.
2. Apply the physics constants to the `src/model/physics/constants.ts` module.
3. Configure the `cushionModel` on the `Table` instance.
4. Execute the `hit()` and then loop `advance(stepSize)` until `allStationary()`.
5. Capture ball positions and angular orientations (calculated from `rvel` or maintained as a quaternion) at each step.
6. Post the results back to the main thread.

### Library Bundle
A new Webpack entry point will be created to produce a standalone library (`billiards-physics.js`) that can be imported via a `<script>` tag. This bundle will include:
- The `Table` and `Ball` logic.
- Physics models (Mathavan, Han, etc.).
- A helper class to manage the Web Worker lifecycle.

## External Usage Example

```html
<script src="dist/billiards-physics.lib.js"></script>
<script>
  // Instantiate the worker using the bundled worker script
  const worker = new Worker('dist/physics-worker.js');

  worker.onmessage = (event) => {
    const { frames, finalState } = event.data;
    console.log(`Simulation complete. Generated ${frames.length} frames.`);
    // analyze results (e.g., check if 3-cushion point was scored)
  };

  const config = {
    balls: [...], // standard Three-Cushion setup
    cushionModel: "mathavan",
    shot: { angle: 3.14, power: 10, offset: { x: 0, y: 0 } }
  };

  worker.postMessage(config);
</script>
```

## Pros and Cons

### Pros
- **No Refactoring Needed**: Leveraging the fact that the existing model already runs headlessly (as proven by unit tests).
- **Parallelism**: Allows running hundreds of simulations in parallel to optimize shot parameters or train AI.
- **Isolation**: Heavy calculations are offloaded from the UI thread, ensuring the game remains responsive.
- **Portability**: Provides a clean API for third-party tools to use the physics engine without needing the full Three.js game environment.

### Cons
- **Serialization Overhead**: Transferring thousands of frames via `postMessage` can be slow.
  - *Mitigation*: Use TypedArrays (Float32Array) for ball data and `Transferable` objects.
- **Dependency Management**: The worker bundle must include all necessary physics logic, which may increase the total build size if not carefully treeshaken.

## Three-Cushion Optimization
This utility is particularly suited for Three-Cushion billiards. By running simulations in a worker, a "Search" algorithm can iterate through thousands of combinations of `angle`, `power`, and `offset` to find the highest probability of scoring a point, providing real-time "best shot" suggestions or assisting in physics parameter tuning.
