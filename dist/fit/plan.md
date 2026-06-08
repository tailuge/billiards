# Fit Tooling Plan

## Goal
Compare real ball-tracking recordings (SS files) to billiards simulation output,
and tune physics parameters to minimise positional error (RMSE).

---

## Current state (working)

- `extract.js` — parses SS JSON, returns `[{ball, t, x, y}]` in game units
- `inspect.js` — node CLI: prints ball summary, writes prepared `{source, report, sim, truth}` JSON
- `viewer.html` — loads prepared JSON, plots truth dots + sim overlay + residual lines, shows RMSE
- `ww.js` / `worker.js` — existing sim infrastructure, used as-is

---

## Phase 1 — Module split ✅ DONE

Modules extracted from viewer.html:

| File | Responsibility |
|---|---|
| `plot.js` | `redraw(canvas, truth, simTracks, simStep)` — all canvas drawing. Exports `HALF_W`, `HALF_H`. |
| `rmse.js` | `computeRMSE(truth, simTracks, simStep)` — error metric for ball 0 (mover) |
| `sim.js` | `runSim(simConfig, truth)` → `{simTracks, simStep, frames, rmse}` — wraps SimulationRunner |

`viewer.html` script is now thin: load data → wire UI events → call modules.

---

## Phase 2 — Optimiser UI

**Goal:** add param tuning controls to viewer.html.

### UI additions (below existing shot textarea)

```
Params to tune:
  ☑ mu    min [0.001] max [0.03 ]   current: 0.007
  ☐ muS   min [0.05 ] max [0.3  ]   current: 0.136
  ☐ e     min [0.7  ] max [0.95 ]   current: 0.86
  ☑ μw    min [0.05 ] max [0.4  ]   current: 0.2
  ...

  [Optimise]  [Stop]   iter: 0   RMSE: —
```

Each param row: checkbox (include), min/max text inputs, current value display.
Rows are generated from `sim.params` keys — no hardcoding.

### Implementation

New file `optimise.js`:
- `encode(params, specs)` → normalised `[0,1]^n` vector
- `decode(norm, specs)` → param object, clamped to bounds
- `runOptimise(simConfig, specs, onStep, signal)` — async generator:
  - uses `dfoptim.Simplex` stateful API
  - each step: decode → patch `simConfig.params` → call `sim.js runSim()` → feed RMSE back
  - yields `{iter, rmse, params}` per step
  - stops when `signal.aborted`

`viewer.html` calls `runOptimise`, updates current-value display and status per yield.

**Dependency:** `@reside-ic/dfoptim` — add to `package.json`, import in `optimise.js`.

**Confirm before Phase 3:** can run ~20 iterations, RMSE decreasing, stop button works,
current param values update live.

---

## Phase 3 — Save optimised params + multi-recording

**Goal:** persist results and generalise across recordings.

- "Save JSON" already writes `sim.params` back — optimised params flow through automatically.
- Add `tune` array to the JSON format alongside `sim.params`:
  ```json
  "tune": [
    { "name": "mu",  "min": 0.001, "max": 0.03 },
    { "name": "μw",  "min": 0.05,  "max": 0.4  }
  ]
  ```
  Saved file remembers which params were tuned and their bounds.
  On reload, checkboxes and min/max fields are restored from `tune`.

- Multi-recording: objective function sums RMSE across multiple loaded JSON files.
  UI: a list of loaded files, each with a checkbox to include in objective.
  Architecture: `runOptimise` accepts array of `simConfig`, averages RMSE.

**Confirm before Phase 4:** optimised params saved correctly, reload restores tune config.

---

## Phase 4 — Parallel multi-start (future)

Multiple independent simplex instances from different random starts, each calling
`SimulationRunner.spawn()` — workers run in parallel naturally. Take best result.
Low priority; existing architecture supports it without structural change.

---

## Notes

- `worker.js` / `ww.js` used as-is throughout — no changes needed
- All modules are plain ES modules, no build step, importable directly in browser
- `inspect.js` (node CLI) remains separate — not part of browser tooling
