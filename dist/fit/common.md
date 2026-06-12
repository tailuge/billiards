# Multi-Input Optimization Pipeline

This document describes the design for extending the billiards physics optimizer to support multiple input shots in a single optimization pass.

## Objective

The goal is to find a set of global physics parameters (e.g., friction constants, cushion restitution) that minimize the total error across a diverse set of recorded shots. Each shot has its own unique initial conditions (aim, power, ball positions), but they all share the same underlying physics model and parameters.

## Architecture

### Data Flow

1.  **Input:** Multiple JSON files, each containing:
    *   `sim`: Initial shot configuration (balls, shot details, physics params).
    *   `truth`: Ground truth tracking data.
2.  **Global Parameters:** A subset of physics parameters selected in the UI for tuning.
3.  **Optimization Loop:**
    *   The optimizer (Nelder-Mead or PSO) proposes a set of values for the global parameters.
    *   For **each** input shot:
        1.  The shot's `sim` config is cloned.
        2.  The proposed global parameters are injected into the cloned `sim.params`, overriding the values from the file.
        3.  The simulation is run.
        4.  The Sum of Squared Errors (SSE) between the simulation and `truth` is calculated.
    *   The **Total SSE** and **Total Sample Count** are aggregated across all shots.
    *   The **Global RMSE** is calculated as `sqrt(TotalSSE / TotalCount)`.
    *   The optimizer uses this Global RMSE as its objective function.

### Key Components

*   `common.html`: A new entry point for multi-shot optimization. It allows loading multiple files and provides a unified view of the tuning process.
*   `optimise.js`: Refactored to handle arrays of `simConfig` and `truth` objects, aggregating error across all of them.
*   `rmse.js`: Updated to expose `computeSSE` for easier aggregation.

## Parameter Separation

*   **Shot-specific parameters**: These include `shot.angle`, `shot.power`, `shot.offset`, etc. In a "Common" optimization run, these are typically NOT tuned, as they are specific to the recording. They are taken directly from each shot's input file.
*   **Global parameters**: These include `params.friction`, `params.table_restitution`, `params.throw_factor`, etc. These are the primary targets for optimization and are shared across all shots in the evaluation pass.

## Compatibility

*   `viewer.html` remains fully functional for single-shot analysis and tuning.
*   The `optimise.js` API remains backward compatible by handling both single objects and arrays for its configuration inputs.
