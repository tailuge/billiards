# fitplan.md — Enrich `trajectories.json` with shot estimates

Design for a program that iterates every shot in `dist/fit/trajectories.json` and
writes `dist/fit/shots.json`, where each entry pairs the original trajectory with
an estimated `shot` object (the exact shape the simulator consumes).

Two stages, run in sequence from the same script:

- **Stage 1 — kinematic estimate (no simulation).** Angle + power derived from the
  cue ball's first samples, replicating `viewer.html`'s `convertTrajectoryShot`.
- **Stage 2 — physics fit.** Refine `angle`, `power`, `offset.x`, `offset.y` (4D)
  with a Nelder-Mead fit against the recorded trajectory, using the real physics
  engine (`dist/worker.js`) as the objective. Reuses the same optimizer wiring as
  the viewer's `optimise.js`.

---

## 1. Input data (verified)

`dist/fit/trajectories.json` — 1.3 MB, **182 shots**, each:

```json
{
  "id": 0,
  "balls": {
    "1": { "t": [0, 0.04, ...], "x": [...], "y": [...] },
    "2": { "t": [0, 14.9], "x": [...], "y": [...] },
    "3": { "t": [0, 0.36, ...], "x": [...], "y": [...] }
  }
}
```

Facts that shape the design:

- Exactly 3 balls per shot (`"1"`, `"2"`, `"3"`).
- `t` sampling is **irregular per ball** (first `dt` varies: 0.04 s, 0.36 s, or
  the ball never moves and has 2 samples). Trajectories run up to ~15 s.
- Positions are in table units, centre-relative (same coordinate system the
  simulator's `sim.balls` uses — no scaling needed).
- The recorded cue ball is the ball with the smallest `t[1]` (first to move).

## 2. The viewer logic being replicated (`viewer.html` → `convertTrajectoryShot`)

1. **Mover (cue ball)**: ball with the smallest `t[1]`; fallback to first key.
2. **Ball mapping**: mover → `0`; remaining balls → `1`, `2` (sorted by key).
3. **Truth**: flatten per-ball samples into `{ball, t, x, y}`, sorted by `t` then `ball`.
4. **Kinematic estimate** (Stage 1's whole job):
   - `t0 = 1`, `t1 = min(5, len-1)` (samples 1..5)
   - `angle = atan2(y[t1]-y[t0], x[t1]-x[t0])`
   - `power = hypot(dx, dy) / (t[t1]-t[t0])` (average speed; 0 if `dt <= 0`)
5. **Sim skeleton** (Stage 2's starting point): `ruleType: "threecushion"`,
   `cushionModel: "mathavan"`, `shot: {cueBallId: 0, angle, power, offset:{x:0,y:0}, elevation:0}`,
   `params: <viewer defaults>`, `stepSize: 0.001953125`, `maxIterations: 20000`,
   `balls` from each ball's `t=0` sample.

Viewer default params (from `viewer.html`):

```json
{ "mu": 0.0055, "muS": 0.126, "rho": 0.045, "m": 0.23, "R": 0.03275, "ee": 0.85,
  "μs": 0.2, "μw": 0.2, "stronge_omega_ratio": 1.76, "stronge_e_n": 0.77,
  "stronge_μ": 0.25, "warpClearanceR": 2.05 }
```

---

## 3. Stage 1 — kinematic enrichment (no sim, no deps)

**Script**: `dist/fit/enrich-shots.mjs` (new file; zero changes to existing code;
zero new dependencies; Node ≥ 20).

**CLI**: `node dist/fit/enrich-shots.mjs [input.json] [output.json]`
(defaults: `trajectories.json` → `shots.json`, same directory).

**Algorithm per shot**: exactly §2.1–2.4. No simulation is run.

**Output schema** (strict — decided):

```json
[{
  "id": 0,
  "balls": { "1": { "t": [...], "x": [...], "y": [...] } },
  "shot": { "cueBallId": 0, "angle": 2.987, "power": 4.618,
            "offset": { "x": 0, "y": 0 }, "elevation": 0 }
}]
```

`balls` is the untouched original trajectory; `shot` is byte-for-byte the
simulator's `sim.shot` shape.

**Console summary** on completion: shot count, `angle`/`power` ranges, count of
zero-power shots (degenerate trajectories) — a first-pass sanity check.

**Validation (Stage 1)**:
- 182 entries; keys exactly `id`, `balls`, `shot`; `shot` keys exactly
  `cueBallId`, `angle`, `power`, `offset`, `elevation`.
- Spot-check values against `viewer.html?index=N` (identical estimator).

---

## 4. Stage 2 — physics fit (4D)

### 4.1 Why `optimise.js` is browser-bound, and how we still reuse it

`optimise.js` imports its optimizers from `https://esm.sh/...` CDN URLs and its
PSO path constructs browser `Worker`s. Browsers support both; **Node cannot
resolve `https://` import specifiers** and has no `Worker` global — hence the
viewer runs it in HTML. But both libraries exist on npm:

| Library | npm | Used for |
|---|---|---|
| `@reside-ic/dfoptim` | `1.0.0` | `Simplex` (Nelder-Mead) — `.step()` / `.result()` |
| `pso` | `1.0.0` | `Optimizer` / `Particle` (optional, see 4.6) |

**Reuse strategy** (identical optimizer behaviour, no browser):
- Vendor `@reside-ic/dfoptim`'s esm.sh bundle into `dist/fit/vendor/dfoptim.mjs`
  (one-time `curl https://esm.sh/@reside-ic/dfoptim?bundle` — no `package.json`
  change, repo stays untouched). Alternative if a dependency is preferred:
  `yarn add @reside-ic/dfoptim`.
- Mirror `optimise.js`'s `makeTarget` / `makeInitial` / `decode` / `runOptimiseNM`
  wiring verbatim in a Node module, importing the vendored `Simplex`.
- Swap only the simulation call: `window.simulateSync` → `global.simulateSync`
  (Node setup in §4.2) and the Worker pool (not used by NM).
- Reuse `dist/fit/rmse.js` (`computeSSE` / `computeRMSE`) unchanged as the
  objective — already verified importable from Node.

### 4.2 Running the physics engine in Node (verified)

`dist/worker.js` is a webpack IIFE that detects worker vs main thread via
`self instanceof WorkerGlobalScope`. In Node:

```js
global.self = global
require('dist/worker.js')        // registers global.simulateSync
const result = global.simulateSync(sim)   // { frames:[{t, balls:[{id,pos:[x,y]}]}], ... }
```

- Synchronous, measured **6–58 ms per simulation**.
- ⚠️ **Do not use `dist/ww.js` `SimulationRunner(..., isNode=true)`** — its
  worker_threads shim sets `global.self = global` but never fakes
  `WorkerGlobalScope`, so `worker.js` registers `simulateSync` instead of
  `onmessage` and `spawn()` hangs forever (verified).

### 4.3 Fit specification

| Param | Symbol | Bounds (viewer ranges) | Init |
|---|---|---|---|
| `shot.angle` | θ | `[-2π, 2π]` | Stage-1 kinematic estimate |
| `shot.power` | p | `[0.1, 5.25]` | Stage-1 kinematic estimate |
| `shot.offset.x` | x | `[-0.451, 0.451]` | `0` |
| `shot.offset.y` | y | `[-0.451, 0.451]` | `0` |

- **Objective**: simulate with trial `shot` (sim skeleton from §2.5) → build
  `simTracks` from `result.frames` → `computeRMSE(truth, simTracks, trackAll=false)`
  (cue ball only, the viewer default). Return `Infinity` on any failure.
- **Stopping**: `Simplex.result().converged`, or cap at `--max-evals` (default
  ~400 for 4D).
- **Output per shot**: write the fitted `shot` back into the entry immediately
  (crash-safe, resume-friendly: skip ids already present in `shots.json`).

### 4.4 Stage-2 output schema (metadata added — decided)

```json
[{
  "id": 0,
  "balls": { ... },
  "shot": { "cueBallId": 0, "angle": ..., "power": ...,
            "offset": { "x": ..., "y": ... }, "elevation": 0 },
  "mover": "1",
  "ballMapping": { "1": 0, "2": 1, "3": 2 },
  "fit": { "rmseCm": 37.2, "evals": 401, "elapsedMs": 900, "converged": true }
}]
```

`mover` / `ballMapping` / `fit` are required for QA and for re-loading the shot
into the simulator later.

### 4.5 Runtime (measured/estimated)

- Single sim: 6–58 ms (long-rolling shots like id 0, ~15 s, are the expensive end).
- 2D fit (angle+power, 200 evals): **160–350 ms/shot** → all 182 shots ≈ 1 min.
- 4D fit (≈400 evals): ≈ 2× → **~0.5–1.5 s/shot → ~2–5 min serial** for all shots.
- Optional parallelization: 4–8 `node:worker_threads`, each running the same
  `global.self` + `simulateSync` setup (works inside threads), splits wall time
  by ~core count.

### 4.6 Optional / future

- **PSO** (`pso` npm package): its WorkerPool is browser-only; a Node port would
  need worker_threads or serial step. Only worth it if NM converges poorly on
  some shots (4D NM on a noisy objective can stall — mark `converged:false` and
  report, don't fail the batch).
- **trackAll** mode (fit against all balls, not just the cue ball) via a flag.
- **Global-parameter optimisation**: once `shots.json` is trustworthy, feed
  shot+truth pairs into the multi-shot common-parameters pipeline (`common.md`).

---

## 5. Validation & QA

- **Stage 1**: structural checks (§3) + spot-check a few ids against
  `viewer.html?index=N`.
- **Stage 2**: run the batch; print RMSE distribution (expect the ~1 m kinematic
  errors to drop into the ~0.2–0.6 m range; flag outliers > 1 m); cross-check one
  shot's fitted values against the viewer's own Optimise result; confirm
  `converged` rate.
- Keep `dist/fit/shots.json` git-visible so diffs are reviewable.

## 6. Non-goals

- No changes to `viewer.html`, `optimise.js`, `worker.js`, `sim.js`, `rmse.js`.
- No changes to repo `package.json` / `yarn.lock` (Stage-2 vendoring via
  `dist/fit/vendor/`; `yarn add` only if explicitly preferred).
- No HTML UI for Stage 1/2 (an `enrich.html` page remains a possible later
  addition for visual QA).

## 7. Open decisions

1. **Vendoring method**: `curl` esm.sh bundle into `dist/fit/vendor/` (no repo
   change — recommended) vs `yarn add @reside-ic/dfoptim`.
2. **PSO in Stage 2**: skip (recommended) or port with worker_threads.
3. **`trackAll`**: cue-ball-only (recommended, matches viewer) or all balls.
