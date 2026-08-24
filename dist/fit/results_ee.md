# ee parameter study — results

Date: 2026-08-24
Question: is the system Mathavan cushion-restitution constant `ee` (default
`0.85`) optimal for fitting the recorded trajectory data, with cushion
friction held at the adopted `μw = 0.18`?

**Verdict: keep `ee = 0.85`** — no change to system defaults.
Unlike rho/μs/muS, `ee` is **strongly identified**: the objective rises
steeply away from the default in both directions (+0.33 cm already at −5 %,
+0.99 at +5 %, up to +5.8 cm at ±15 %). A fine grid (±1–4 %) shows a smooth
bowl centred on 0.85 with no interior dip. No candidate improved anywhere,
so per protocol nothing was sent to held-out.

---

## Methodology

Identical protocol to the previous studies (`results_μw.md`,
`results_rho.md`, `results_muS.md`, `results_μs.md`): repeated NM passes per
point until aggregate median improves < 0.02 cm (max 6), median aggregation,
sign tests vs a **freshly-fitted centre**, all points under
**`--pin muw=0.18`**.

Data sets as before: pilot = 12 shots (`sweep.json`, RMSE ∈ (9,10) cm),
clean-10 excludes regime-flippers 32/92.

Two grids:

| grid | values |
|---|---|
| coarse | 0.7225, 0.765, 0.8075, 0.8925, 0.935, 0.9775 (−15…+15 %) |
| fine | 0.82, 0.83, 0.84, 0.86, 0.87, 0.88 (−3.5…+3.5 %) |

## Results

### 1. Coarse pilot profile over ee

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.18, ee=0.85):

| ee | vs default | all 12 | clean 10 |
|---|---|---|---|
| 0.7225 | −15 % | +5.82 | +5.38 |
| 0.765 | −10 % | +2.46 | +2.77 |
| 0.8075 | −5 % | +0.33 | +0.86 |
| 0.85 (base) | 0 | 0 | 0 |
| 0.8925 | +5 % | +0.99 | +0.79 |
| 0.935 | +10 % | +4.46 | +4.28 |
| 0.9775 | +15 % | +5.53 | +5.58 |

Steep, roughly symmetric degradation; on clean-10 *every* shot but one is
worse at ±10 % and beyond (largest id 114 +44/+48 cm). The mild asymmetry at
±5 % (lower cheaper than higher on all-12, reversed on clean-10) is within
flipper noise — no evidence of skew.

### 2. Fine pilot profile over ee (all 12)

| ee | Δmedian |
|---|---|
| 0.82 | +0.36 |
| 0.83 | +0.15 |
| 0.84 | **+0.10** |
| 0.85 (base) | 0 |
| 0.86 | +0.14 |
| 0.87 | +0.21 |
| 0.88 | +0.52 |

Monotone rise away from 0.85 on both sides at ~1–2 cm per 0.05 of ee; the
minimum of the tested set is the default itself. The μw-style narrow-dip
scenario is excluded.

### Held-out

Not run: no candidate improved in any pilot subset.

## Interpretation

Cushion restitution dominates post-bounce ball speeds, so nearly every
multi-cushion shot pins it down hard — in contrast to rho/μs (flat) and muS
(noisy). Together with the earlier ±5 % corner checks, the cushion model's
constants are now confirmed well-calibrated except for μw, whose adopted
0.18 remains the single real improvement found.

## Caveats

- Resolution ±1 %; a dip narrower/shallower than that is irrelevant at
  current noise levels (~0.05 cm).
- Only ee varied under pinned μw=0.18; joint (ee × μw) interaction not mapped.
- Flipper ids dominate tails as usual.

## Reproducing

From the repo root (note: quote `--param` args, `|` is a shell pipe):

```sh
# 1. Coarse pilot, all 12 shots (~2 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'ee=0.7225|0.765|0.8075|0.8925|0.935|0.9775' \
    --out-dir dist/fit/corners/ee-all12

# 2. Coarse pilot, clean 10 (~1.5 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'ee=0.7225|0.765|0.8075|0.8925|0.935|0.9775' \
    --ids 24,56,62,84,94,105,114,128,166,172 \
    --out-dir dist/fit/corners/ee-clean10

# 3. Fine pilot around default (~1 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'ee=0.82|0.83|0.84|0.86|0.87|0.88' \
    --out-dir dist/fit/corners/ee-fine
```

Machine-readable outputs:
`dist/fit/corners/{ee-all12,ee-clean10,ee-fine}/sweep-results.json`.
