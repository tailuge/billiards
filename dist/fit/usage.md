# fit tooling usage

Batch-fit shot parameters from recorded trajectories against the physics
engine. See `fitplan.md` for design background.

## Files

| File | Purpose |
|---|---|
| `trajectories.json` | Recorded shots (input format: `{id, balls, ...}`) |
| `shots.json` | Fitted output — same format plus `shot`, `mover`, `ballMapping`, `fit` metadata |
| `fit-shots.mjs` | Batch optimiser (Node) |
| `all.html` | Grid of all shots, sorted best → worst RMSE; click for detail, 🔍 opens viewer |
| `viewer.html` | Single-shot view + interactive optimiser; reads `shots.json` |
| `vendor/` | Vendored optimiser libraries (`dfoptim.mjs`, `pso.mjs`) |

## Fit a batch

```bash
node fit-shots.mjs [options]
```

Defaults: input `trajectories.json`, output `shots.json`, Nelder-Mead over
`shot.power,shot.offset.x,shot.offset.y`, cue-ball-only RMSE.

### Options

```
--optimise f1,f2   fields to fit: shot.angle, shot.power,
                   shot.offset.x, shot.offset.y
                   (default: shot.power,shot.offset.x,shot.offset.y)
--optimiser nm     Nelder-Mead (default)
--optimiser pso    serial PSO — use when NM stalls on a shot
--ids 3,17,42      only fit these shot ids
--all              RMSE against all balls (default: cue ball only)
--max-evals N      NM eval budget per shot (default 400)
--cutoff S         score only truth samples with t <= S seconds (default 4);
                   0 disables the time cutoff. The simulation itself also
                   stops at S+1 s (worker `maxTime`) so tails aren't simulated
--report           no optimisation: evaluate and report seed RMSE only
--min-rmse CM      only fit shots whose seed RMSE is above CM (cm); shots at
                   or below are copied through to the output unchanged
--input  file.json input path (or first positional arg)
--output file.json output path (or second positional arg)
```

### Chaining

Output entries carry the fitted `shot`, so an output can be fed back as
`--input`: existing fitted values become the seed and are refined further.
Refits are ratcheted — a shot whose refit comes out worse than its seed
keeps the seed parameters, so feeding `shots.json` back into itself can
never degrade a fit.

### Common recipes

Full re-fit of every shot scored against all balls, using PSO seeded from
the current fits (in-place: output defaults to `shots.json`, and the
ratchet protects existing results):

```bash
node fit-shots.mjs --all --optimiser pso --input shots.json
```

Same, but only tune cue angle and tip offset (power stays at its seed):

```bash
node fit-shots.mjs --all --optimiser pso \
  --optimise shot.angle,shot.offset.x,shot.offset.y \
  --input shots.json
```

Spend the eval budget only on bad shots: anything already at or below
20 cm seed RMSE is copied through untouched, so a re-run only touches
the stragglers:

```bash
node fit-shots.mjs --all --optimiser pso --min-rmse 20 --input shots.json
```

Typical refinement of stragglers:

```bash
node fit-shots.mjs --input shots.json --output shots-v2.json \
  --ids 118,63 --optimise shot.angle,shot.power --optimiser pso
```

### Output metadata

Each entry gets a `fit` object:

```json
"fit": {
  "rmseBeforeCm": 68.07,
  "rmseAfterCm": 2.41,
  "evals": 93,
  "elapsedMs": 412,
  "converged": true,
  "fitted": ["shot.power", "shot.offset.x", "shot.offset.y"],
  "optimiser": "nm"
}
```

Filtering candidates for refinement: high `rmseAfterCm`, or
`rmseAfterCm ≈ rmseBeforeCm` (the fit barely helped).

### Caveats

- RMSE values are only comparable between runs scored the same way
  (same weighting, same cue-ball vs `--all` setting, same `--cutoff`).
- Scoring weights each sample `1/(1+t)` (cue ball 1.5x other balls) and
  ignores truth samples past the cutoff (`rmse.js`, default 4 s), so late
  friction mismatches don't dominate the fit.
- A crash mid-batch can leave the output half-written — just re-run from
  the input. The script halts with a non-zero exit on any simulation failure.

## Visual QA

- **`all.html`** — every shot as a trajectory thumbnail, sorted by fitted
  RMSE (best first). Label shows `id · before→after cm`. Click a shot for a
  large view; ▶ replays it in the simulator; 🔍 opens it in `viewer.html`.
- **`viewer.html?shot=<id>`** — single shot with truth vs sim overlay, RMSE,
  parameter table, and an interactive optimiser (tick params, choose
  Nelder-Mead/PSO, click Optimise). Uses the fitted shot from `shots.json`
  when present, otherwise the kinematic estimate.
