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
viewer runs it in HTML.

**Reuse strategy (decided: vendored bundles, no `package.json` change).**
Both libraries are vendored as self-contained ESM bundles in
`dist/fit/vendor/` — byte-for-byte the same modules esm.sh serves the browser,
so optimizer behaviour is identical. No runtime or dev dependencies are added
to the repo's `package.json`; no reimplementation.

| File | Source (esm.sh) | Verified in Node |
|---|---|---|
| `dist/fit/vendor/dfoptim.mjs` | `@reside-ic/dfoptim@1.0.0` es2022 bundle | 8 KB, zero imports; named exports `Simplex`, `Brent`, `fitSimplex`, `fitBrent`; `Simplex.step()/.result()` work |
| `dist/fit/vendor/pso.mjs` | `pso@1.0.0` es2022 bundle | 4 KB, zero imports; **single default export** `{ Interval, Particle, Optimizer }` (note: `import pso from "./vendor/pso.mjs"`, matching `optimise.js`'s default import); async objective + `Particle.createRandom` verified |

Re-vendoring (if ever needed): fetch the `es2022/*.bundle.mjs` URL each esm.sh
stub redirects to (the plain `?bundle` URL returns a redirect stub, not the
code), prepend a provenance header, and re-verify with a smoke import.

**Wiring** — mirror `optimise.js`'s `makeTarget` / `makeInitial` / `decode` /
`runOptimiseNM` verbatim in a Node module, importing the vendored `Simplex`:
- Swap the simulation call: `window.simulateSync` → `global.simulateSync`
  (Node setup in §4.2).
- Reuse `dist/fit/rmse.js` (`computeSSE` / `computeRMSE`) unchanged as the
  objective — already verified importable from Node.

### 4.1.1 PSO in Node — serial (decided)

The `pso` library vendors cleanly, but `optimise.js`'s `WorkerPool`
(optimise.js:5) is browser-only (`new Worker(url)`), so it is **not** ported.
Instead the PSO objective evaluates particles **serially** with
`global.simulateSync`: the `pso.Optimizer` accepts an async callback objective,
so the pool drops out without changing the algorithm — same update rules,
same results, single-threaded.

Cost: PSO needs ~1500+ evals/run (15 particles × 100 iters) vs NM's
~300–400, so serial PSO is roughly 4–5× slower per run. Consequences:

- **NM is the batch default.** PSO is a per-shot option for shots where NM
  stalls (reported `converged: false`).
- If batch wall time ever demands it, a `node:worker_threads` port of the
  pool is the later upgrade path (§4.5) — the serial objective is the same
  code with the pool swapped back in.

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

**Which fields are fitted is user-selectable per run.** Whatever is not
selected stays frozen at its seed value (kinematic estimate for angle/power,
`0,0` for offsets).

#### CLI

```
node dist/fit/fit-shots.mjs [options]

--optimise shot.power,shot.offset.x,shot.offset.y
        Comma-separated subset of: shot.angle, shot.power,
        shot.offset.x, shot.offset.y.
        Default: shot.power,shot.offset.x,shot.offset.y.
        Unknown names → error listing valid options.

--optimiser nm|pso
        Nelder-Mead (default) or serial PSO (§4.1.1).
        PSO mainly useful for 4D+ fits where NM stalls.

--ids 3,17,42   Only fit these shot ids (subset selection).
--all           RMSE against all balls (default: cue ball only, matches viewer).
--max-evals N   Eval budget per shot (default ~400 for 3D).
--input/--output  Paths (defaults: trajectories.json / shots.json in dist/fit).
```

**Input/output model (decided):**
- Pure **input → output transform**; not tied to specific filenames. Output
  schema (§4.4) is a superset of the input schema (`trajectories.json`
  format), so **an output can be fed back in as `--input`**: if an entry
  already has a `shot` field it is used as the seed (prior fit refined
  further); otherwise the Stage-1 kinematic estimate seeds it.
- **Incremental writes, no completeness/resume checking.** Each finished
  entry is appended to the output file as JSON lines are accumulated; a
  crash may leave the file half-written/garbled — that's fine, just re-run
  the batch from the input.
- **Halt on failure**: if simulation fails or RMSE is non-finite for a shot,
  the script stops immediately with a non-zero exit. No special provision
  for degenerate shots — the pipeline tries them like any other and the
  RMSE metadata shows the result.
- Fitted angles are **normalised to [-π, π]** in the output.
- Eval budgets: NM capped by `--max-evals` (default ~400 for 3D); PSO runs a
  fixed 100 iterations (viewer parity).

- **Objective**: simulate with trial `shot` (sim skeleton from §2.5) → build
  `simTracks` from `result.frames` → `computeRMSE(truth, simTracks, trackAll=false)`
  (cue ball only unless `--all`). Return `Infinity` on any failure.
- **Stopping**: `Simplex.result().converged`, or cap at `--max-evals`.
- **Progress output**, one line per shot as it completes:
  ```
  Shot #1   rmse 54.3cm -> 23.0cm   (412 evals, converged)
  Shot #2   rmse 12.1cm -> 12.0cm   (stalled)
  ```
  followed by a final summary (mean/median before→after, worst outliers,
  converged count).

### 4.4 Stage-2 output schema (metadata added — decided)

```json
[{
  "id": 0,
  "balls": { ... },
  "shot": { "cueBallId": 0, "angle": ..., "power": ...,
            "offset": { "x": ..., "y": ... }, "elevation": 0 },
  "mover": "1",
  "ballMapping": { "1": 0, "2": 1, "3": 2 },
  "fit": {
    "rmseBeforeCm": 54.3,
    "rmseAfterCm": 23.0,
    "evals": 412,
    "elapsedMs": 900,
    "converged": true,
    "fitted": ["shot.power", "shot.offset.x", "shot.offset.y"],
    "optimiser": "nm"
  }
}]
```

`mover` / `ballMapping` are required for QA and for re-loading the shot into
the simulator later. The extra `fit` keys are ignored by existing tooling
(`convertTrajectoryShot` reads only `id`/`balls`; sim consumers read
`shot`/`balls`) but support filtering:

- quality: `fit.rmseAfterCm < 40`
- improvement ratio: `rmseAfterCm / rmseBeforeCm` (near 1.0 = fit barely helped;
  candidates for a PSO pass or `--optimise shot.angle,...`)
- provenance: `fitted` + `optimiser` record exactly how each entry was produced.

### 4.5 Runtime (measured/estimated)

- Single sim: 6–58 ms (long-rolling shots like id 0, ~15 s, are the expensive end).
- 2D fit (angle+power, 200 evals): **160–350 ms/shot** → all 182 shots ≈ 1 min.
- 4D fit (≈400 evals): ≈ 2× → **~0.5–1.5 s/shot → ~2–5 min serial** for all shots.
- Optional parallelization: 4–8 `node:worker_threads`, each running the same
  `global.self` + `simulateSync` setup (works inside threads), splits wall time
  by ~core count.

### 4.6 Optional / future

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

## 7. Decisions (resolved)

1. **Dependency strategy**: vendored self-contained ESM bundles in
   `dist/fit/vendor/` (`dfoptim.mjs`, `pso.mjs`) — no `package.json` change,
   no devDependencies, no reimplementation (§4.1).
2. **PSO**: vendored + **serial** evaluation (no WorkerPool port). NM is the
   batch default; PSO selectable via `--optimiser pso` for stalled shots (§4.1.1).
3. **`trackAll`**: cue-ball-only by default (matches viewer); `--all` flag.
4. **Field selection**: `--optimise` CLI flag over
   `shot.angle|shot.power|shot.offset.x|shot.offset.y`; default
   `shot.power,shot.offset.x,shot.offset.y`; unfitted params stay at seed (§4.3).
5. **RMSE metadata**: per-entry `fit` object with before/after RMSE, evals,
   convergence, fitted fields and optimiser — ignored by existing tooling,
   filterable later (§4.4).
