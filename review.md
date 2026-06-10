# Optimization Review & Recommendations - /dist/fit/

This document summarizes the mathematical and algorithmic review of the optimization tooling used for fitting physical parameters to telemetry data.

## 1. Systematic Bias in RMSE Calculation

A critical systematic error was identified in the simulation-to-truth temporal alignment.

*   **Observation:** In `src/worker.ts`, the simulation loop executes `table.advance(stepSize)` *before* recording the first frame. This means `frames[0].t` is equal to the `stepSize` (typically $0.00195$s), effectively omitting the $t=0$ initial state.
*   **Mathematical Impact:** In `rmse.js`, the `interpolateTrack` function calculates the index as `fi = t / simStep`. For truth data at $t=0$, it results in `fi = 0`, mapping to `frames[0]`. Since `frames[0]` is physically at $t = \text{simStep}$, the RMSE calculation compares the truth position at $t=0$ with the simulation state at $t \approx 2\text{ms}$.
*   **Consequence:** At typical ball speeds ($2\text{m/s}$), this introduces a constant error "floor" of $\approx 4\text{mm}$. This prevents local optimizers (like Nelder-Mead) from reaching a true zero-error state and forces them to settle on biased parameters to compensate for the lag.
*   **Recommendation:** Prepend the initial ball states (at $t=0$) to the `frames` array in `worker.ts` before entering the simulation loop.

## 2. Particle Swarm Optimization (PSO) Hyperparameters

The current PSO configuration in `optimise.js` uses conservative coefficients that limit exploration and convergence speed.

```javascript
opt.setOptions({ inertiaWeight: 0.8, social: 0.4, personal: 0.4, pressure: 0.5 })
```

*   **Social & Personal Coefficients ($c_1, c_2$):** The value of `0.4` is extremely low for high-dimensional physical fitting. Standard literature (e.g., Clerc-Kennedy) suggests values closer to **$1.49$**. Low values result in "lazy" particles that are not sufficiently pulled toward best-known positions, leading to slow convergence.
*   **Inertia Weight ($w$):** While `0.8` is stable, a decaying weight (e.g., $0.9 \rightarrow 0.4$) is preferred to transition from global exploration to local exploitation.
*   **Recommendation:** Increase `social` and `personal` coefficients to **$1.4$**.

## 3. Nelder-Mead (NM) Stability

The NM implementation in `optimise.js` relies on default library settings from `@reside-ic/dfoptim`.

*   **Convergence Tolerances:** The lack of explicit `xTol` (parameter tolerance) and `fTol` (function value tolerance) makes the convergence behavior unpredictable on noisy RMSE landscapes.
*   **Initial Simplex Size:** NM is highly sensitive to the initial simplex size. For parameters with high sensitivity (like `shot.angle`), a fixed step in normalized $[0, 1]$ space may be too aggressive.
*   **Recommendation:** Pass an options object to `new Simplex(...)` with explicit tolerances (e.g., `xTol: 1e-6`, `fTol: 1e-8`).

## 4. Algorithmic Strategy: Hybrid Approach

The RMSE surface for billiards is non-convex and non-smooth due to discrete collision events.

*   **NM Limitation:** Being a local searcher, NM frequently traps in local minima if the initial guess is not already near the global optimum.
*   **PSO Limitation:** Excellent at global exploration but inefficient at high-precision refinement.
*   **Recommendation:** Implement a **Hybrid Workflow**. Use PSO for a fixed budget (e.g., 50–100 iterations) to find the primary "valley," then automatically initialize Nelder-Mead at that position for high-precision refinement.

## 5. Numerical Stability & Normalization

*   **Parameter Scaling:** The current $[0, 1]$ normalization is good practice. However, parameters with logarithmic sensitivity (like friction or spindown) should ideally be optimized in log-space to ensure a consistent gradient across orders of magnitude.
*   **UI Constraints:** Ensure parameter ranges in `viewer.html` are wide enough to allow the optimizer to explore "incorrect" physics, which is necessary to follow the gradient toward the optimum.
