# Mathematical Correctness & Optimization Review

## 1. Systematic Temporal Bias
There is a systematic 1-step temporal offset in the current RMSE calculation and residual plotting.
- In `src/worker.ts`, the simulation loop calls `table.advance(stepSize)` and then pushes a frame. This means the first recorded frame (`frames[0]`) is at $t = \text{stepSize}$.
- In `dist/fit/rmse.js`, the code uses `Math.round(t / simStep)` to index into the simulation track.
- For a truth sample at $t=0$, the index calculated is `0`, which refers to `frames[0]` at $t = \text{stepSize}$.
- **Result**: The truth data is compared against simulation data that is exactly one `simStep` ahead in time.
- **Recommendation**: Include the $t=0$ state (after strike, before first advance) in the simulation output, or adjust the indexing/interpolation logic to account for this offset.

## 2. Temporal Discretization Error (Rounding)
`computeRMSE` and `plot.js` use `Math.round(t / simStep)` to find the closest simulation frame.
- With a `simStep` of ~$1.95$ms, this introduces a temporal error of up to ~$1$ms.
- At typical ball speeds (e.g., $3$m/s), this causes a positional error of up to $3$mm.
- Since optimization targets and tracking accuracy are often in the mm range, this "quantization noise" in the objective function can hinder the convergence of the Nelder-Mead algorithm, causing it to stall or find sub-optimal local minima.
- **Recommendation**: Use linear interpolation between simulation frames to find the position at exactly time $t$.

## 3. Physics Parameter Setter Inconsistency
The optimization loop in `dist/fit/optimise.js` dynamically calls setters in `src/model/physics/constants.ts` based on parameter names.
- It uses `const setterName = "set" + key`.
- In `dist/fit/inspect.js` and the resulting JSON, parameters like `stronge_omega_ratio` are used. This results in a call to `setstronge_omega_ratio`.
- However, the actual setter in `constants.ts` is `setStrongeOmegaRatio` (CamelCase).
- **Result**: Parameters for the Stronge cushion model (and others with underscores or non-lowercase names) are not actually updated during optimization. The simulator continues using default values.
- **Recommendation**: Implement a mapping function to convert snake_case parameter names to the expected CamelCase setter names (e.g., `stronge_omega_ratio` -> `setStrongeOmegaRatio`).

## 4. Hardcoded Mover Index
`computeRMSE` is currently hardcoded to only look at `ball: 0`.
- While `inspect.js` attempts to assign the moving ball to index 0, this is not guaranteed for all datasets or future multi-ball simulations.
- **Recommendation**: Use `simConfig.shot.cueBallId` to identify the correct ball to track.

## 5. Objective Function Scope
The current RMSE only considers the cue ball.
- Collisions are high-information events. The resulting trajectories of object balls are highly sensitive to the coefficient of restitution (`ee`/`e`) and sliding friction (`muS`).
- **Recommendation**: Include all balls that move significantly in the truth data in the RMSE calculation to provide a more constrained and accurate fit.

## 6. Optimization Search Space
- The current normalization to $[0, 1]$ is excellent for Nelder-Mead.
- **Improvement**: For parameters that can vary over orders of magnitude (like friction), searching in log-space might be more effective.
- **Improvement**: Add `timeOffset` as a tunable parameter. This accounts for any delay between the tracking start and the actual physical strike.

## 7. Scaling and Units
- `extract.js` uses `BALL_RADIUS = 0.03275` for Three-Cushion. Standard carom balls are typically $61.5$mm diameter ($R = 0.03075$m). While self-consistent if the same $R$ is used for scaling the tracking data, it may lead to friction coefficients that don't match literature values if the physical scale is off.
