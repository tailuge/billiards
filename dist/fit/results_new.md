# Parameter re-fit under early-window scoring — results

Date: 2026-08-26
Question: re-derive the physics-constant optimums under the **new RMSE
scoring** — per-sample weight `wi = (cue ball ? 1.5 : 1) / (1 + t)` and a
**4 s time cutoff** (`RMSE_CUTOFF_T` in `rmse.js`), which excludes the
divergent slow-rolling tail from the fit. Prior `results_*.md` numbers were
scored with flat 3:1 weights and no cutoff, so none of them are comparable.

**Working base adopted: `μw = 0.16`** (dev-set pilot, −0.96 cm median,
18/24 improved, p = 0.023). **μs stays at 0.20; ee is directionally lower
(0.86) but not yet significant.** Nothing applied to system defaults until
held-out validation.

---

## Tooling / data state (what changed first)

- `dist/fit/rmse.js`: scoring is now `(1.5:1 ball weight) × 1/(1+t)` decay,
  samples with `t > 4 s` excluded. `--cutoff` flag on `fit-shots.mjs`;
  cutoff input in `viewer.html` (plot and RMSE both honour it).
- `src/worker.ts`: `maxTime` config stops the simulation at `cutoff + 1 s`
  (fit tool only; viewer still simulates full-length for inspection).
- `shots.json` re-fitted under the new scoring: 72/72 shots improved and
  converged, median RMSE 9.4 → 6.0 cm, mean 9.6 → 6.9 cm.
- Split: **seeded random** (`split-shots.mjs`, seed 42), id 25 excluded a
  priori (unmodelled double-kiss, model-capability decision). Dev
  (`sweep-dev.json`) = 24 shots, test (`sweep-test.json`) = 47 shots.
  Random rather than the old RMSE bands: band selection correlates the
  split with the quantity under study (selection-on-outcome).
- `viewer.html` `?shot=<id>` now resolves by shot id (was treated as an
  array index, showing the wrong shot when linked from `all.html`).

Note: the sweep anchors on its own freshly-fitted base (repeated NM passes),
so its base medians (5.62 cm) are lower than the single-pass stored fits
(dev median 6.51 cm) — comparisons are always vs the fresh base.

---

## Study 1 — μw pilot (dev set, 24 shots)

`--param 'muw=0.15|0.16|0.17|0.18|0.19'`, no pin, ~2.5 min.

| μw | med (cm) | Δmed | w/t/l | sign-p | passes |
|---|---|---|---|---|---|
| **0.16** | 4.65 | **−0.96** | 18/0/6 | **0.023** | 6 |
| 0.18 | 4.95 | −0.67 | 18/1/5 | 0.011 | 4 |
| 0.19 | 5.46 | −0.16 | 17/0/7 | 0.064 | 3 |
| 0.17 | 5.72 | +0.10 | 17/0/7 | 0.064 | 2 |
| 0.20 (base) | 5.62 | 0 | | | |
| 0.15* | 4.69† | ≈ 0.16 | — | — | hit 6-pass cap, still descending |

\* dropped from the tool table (`medians: null`); † pass-6 median, not a
converged final.

**Verdict: adopt `μw = 0.16` as the working base.** 0.15 is within noise of
it and should ride along into validation. 0.17 is anomalous (stalled after
2 passes; shot 8 swings −7.4 → +3.6 between 0.16 and 0.17), so the valley
floor reads 0.15–0.16 rather than the old study's 0.15–0.17.

---

## Study 2 — μs × ee matrix (dev set, pinned μw = 0.16)

Biased grid per the working hypothesis that μs moves **down** and ee moves
**up**: `mus ∈ {0.14, 0.17, 0.20}`, `ee ∈ {0.86, 0.90, 0.94}`, ~5 min.

Δmedian (cm) vs base (defaults + μw=0.16, 4.65 cm):

| μs \ ee | 0.86 | 0.90 | 0.94 |
|---|---|---|---|
| 0.14 | +1.00 | +0.53 | +1.49 |
| 0.17 | +0.41 | +0.53 | +1.90 |
| 0.20 | **−0.51** | +0.71 | +2.19 |

**Verdict: the data rejects the hypothesis — the optimum points the other
way.** ee lower is better at every μs level (0.86 < 0.90 < 0.94 in each
row); ee=0.94 is consistently bad (+1.5…+2.2 cm, sign-p as low as 0.007).
μs stays at 0.20 — every lower-μs cell is ≥ +0.41 cm, consistent with the
old flatness result. No diagonal tilt ⇒ no detectable μs↔ee coupling at
this resolution. Best cell **(0.20, 0.86) at −0.51 cm** (15/24, p = 0.307,
not significant).

Coherent reading: μw↓ (0.16) and ee↓ (0.86) both mean *less cushion
energy* than defaults — a single physical direction, even if the ee leg is
still statistically weak.

---

## Caveats

- All numbers are within the new protocol; do **not** compare against any
  `results_*.md` before this date or against `shots.json` stored fits.
- Pilot-level only: dev is 24 shots; nothing is adopted without held-out
  validation on the 47-shot test set.
- Per-shot deltas are dominated by regime-flippers (ids 127, 8, 32, 92),
  which swing tens of cm between cells; they add noise, not bias.
- The ee=0.86 candidate needs either a finer one-axis probe (does the
  valley continue below 0.86?) or straight to validation.
- μs may be tuned for feel/realism within the old flat band
  (~0.15–0.32) without measurable fit cost — the recorded shots barely
  identify it.

---

## Reproducing

```sh
# Re-fit shots.json under the new scoring (in place, ratcheted)
node dist/fit/fit-shots.mjs --all --input dist/fit/shots.json

# Seeded random split (id 25 excluded)
node dist/fit/split-shots.mjs

# μw pilot (dev)
node dist/fit/sweep-params.mjs --param 'muw=0.15|0.16|0.17|0.18|0.19' \
    --input dist/fit/sweep-dev.json --out-dir dist/fit/corners/muw3-pilot

# μs × ee matrix (dev, pinned μw=0.16)
node dist/fit/sweep-params.mjs --param 'mus=0.14|0.17|0.2' \
    --param 'ee=0.86|0.9|0.94' --pin muw=0.16 \
    --input dist/fit/sweep-dev.json --max-passes 8 \
    --out-dir dist/fit/corners/mus-ee-matrix

# Pending: held-out validation of the working base (μw=0.16) and the
# (μs=0.20, ee=0.86) candidate on sweep-test.json
```

Machine-readable outputs: `dist/fit/corners/muw3-pilot/sweep-results.json`,
`dist/fit/corners/mus-ee-matrix/sweep-results.json`.
