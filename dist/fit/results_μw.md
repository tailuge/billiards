# μw parameter study — results

Date: 2026-08-24
Question: is the system cushion-friction constant `μw` (default `0.2`) optimal
for fitting the recorded trajectory data?

**Verdict: adopt `μw = 0.18`** (not yet applied to system defaults).
Expected gain ≈ 0.5–0.8 cm of median RMSE (~5%). Evidence clears the
pre-registered bar (improvement replicates on held-out shots; pooled
sign-test p ≈ 0.04), but is modest — treat as a small refinement, not a
breakthrough.

---

## Methodology

**Data.** `shots.json` holds 72 shots already fitted under system constants.
Two disjoint sets were used:

| set | n | definition | file |
|---|---|---|---|
| pilot | 12 | entries with fitted RMSE in (9, 10) cm | `sweep.json` |
| held-out | 60 | everything else with a fit | `heldout.json` |

**Protocol** (`sweep-params.mjs`, built on `fit-shots.mjs`):

- Each tested constant value ("point") is fitted by **repeated NM passes**
  (400-eval Nelder-Mead per shot, output of one pass seeds the next, ratchet
  keeps a shot's params only if not worse) until the point's aggregate
  **median RMSE improves < 0.02 cm** between passes (max 6 passes). This
  avoids trusting the Simplex stagnation flag or unequal eval budgets.
- The **centre point (defaults, μw=0.20) is always fitted through the exact
  same pipeline** and anchors all comparisons — stored RMSEs are never used
  as baseline because they carry an accumulated multi-pass advantage
  (measured at ≈ 0.1 cm here).
- Scoring: `--all` (RMSE against every ball, not cue-only), aggregated by
  **median** across shots (robust to pathological shots).
- Statistics: per-shot paired deltas vs the freshly-fitted centre;
  wins/ties/losses; two-sided sign test.
- Known confounder handled by design: individual shot fits can flip between
  trajectory regimes under changed constants (seen repeatedly, e.g. ids
  25/32/92/168), inflating variance — hence median + sign test rather than
  means.

## Results

### 1. Pilot profile over μw (12 shots; clean-10 = without regime-flippers 32, 92)

Δmedian RMSE (cm) vs freshly-fitted centre:

| μw | all 12 | clean 10 |
|---|---|---|
| 0.17 | −0.08 | −0.78 |
| 0.18 | −0.29 | −0.80 |
| 0.19 | −0.23 | −0.40 |
| 0.20 (base) | 0 | 0 |
| 0.21 | +0.78 | +0.82 |
| 0.22 | +1.63 | +1.58 |
| 0.23 | +2.98 | +2.81 |

Sloped surface: flat-to-improving below default, degrading steeply above it.
Best region ≈ 0.17–0.18. Clean-10 best: 8/10 shots improved at 0.18
(sign-p 0.11).

### 2. Held-out validation (60 unseen shots)

| μw | median (cm) | Δmedian | wins | sign-p | passes to converge |
|---|---|---|---|---|---|
| base 0.20 | 13.85 | — | | | 3 |
| **0.18** | **13.29** | **−0.56** | 36/60 | 0.155 | 3 |
| 0.17 | 13.96 | +0.12 | 32/60 | 0.699 | 2 |

The 0.18 improvement **replicates out-of-sample** in direction and magnitude.
0.17 does *not* replicate (+0.12): the optimum is a narrow dip near 0.18,
not a plateau extending downward — do not go lower.

### 3. Pooled evidence

Pilot 8/10 + held-out 36/60 = **44/70 shots improve** at μw=0.18;
two-sided binomial p ≈ **0.04**.

## Caveats

- Effect size is modest; several shots worsen even at 0.18 (largest id 173
  +6.8 cm). Per-shot responses are noisy because fits are local optima of a
  discontinuous simulation objective.
- Six "regime-flipper" shots (25, 32, 92, 168, 11-borderline, 94-erratic)
  dominate the tails. Visual triage of these would sharpen any future sweep.
- Only μw varied; interaction with ee/μs was checked once before at ±5 %
  corners (no signal there) but not re-examined at the new optimum.

## Reproducing

From the repo root (note: quote `--param` args, `|` is a shell pipe):

```sh
# 1. Build the data sets (one-off extraction from shots.json)
node -e 'const fs=require("fs");const s=JSON.parse(fs.readFileSync("dist/fit/shots.json","utf8"));const sel=s.filter(e=>e.fit&&e.fit.rmseAfterCm>9&&e.fit.rmseAfterCm<10);fs.writeFileSync("dist/fit/sweep.json",JSON.stringify(sel));console.log(sel.length+" shots")'
node -e 'const fs=require("fs");const s=JSON.parse(fs.readFileSync("dist/fit/shots.json","utf8"));const pilot=new Set([24,32,56,62,84,92,94,105,114,128,166,172]);const h=s.filter(e=>e.fit&&!pilot.has(e.id));fs.writeFileSync("dist/fit/heldout.json",JSON.stringify(h));console.log(h.length+" shots")'

# 2. Pilot profile, all 12 shots (~2 min)
node dist/fit/sweep-params.mjs --param 'muw=0.17|0.18|0.19|0.21|0.22|0.23' \
    --out-dir dist/fit/corners/muw-all12

# 3. Pilot profile, clean 10 (excluding flippers 32,92) (~2 min)
node dist/fit/sweep-params.mjs --param 'muw=0.17|0.18|0.19|0.21|0.22|0.23' \
    --ids 24,56,62,84,94,105,114,128,166,172 \
    --out-dir dist/fit/corners/muw-clean10

# 4. Held-out validation (~5 min)
node dist/fit/sweep-params.mjs --param 'muw=0.17|0.18' \
    --input dist/fit/heldout.json --out-dir dist/fit/corners/muw-heldout
```

Each run prints pass-by-pass progress, the comparison table (vs the
freshly-fitted centre), the per-shot delta matrix, and writes
`sweep-results.json` into the respective `--out-dir`. Defaults used:
`--workers 4`, `--max-evals 400`, `--tolerance 0.02`, `--max-passes 6`.
Intermediate/per-point fit files live only in OS tmp unless `--save-points`
is given; `dist/fit/corners/` is gitignored.

Machine-readable outputs: `dist/fit/corners/{muw-all12,muw-clean10,muw-heldout}/sweep-results.json`.
