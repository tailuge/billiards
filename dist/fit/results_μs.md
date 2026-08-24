# μs parameter study — results (v2)

Date: 2026-08-24 (v2 revises the morning study of the same date)
Question: how far can `μs` (Mathavan table coefficient, default `0.2`) move
before the fit degrades, under the current protocol — cushion friction
pinned at adopted **μw = 0.17**, `shot.angle` in the per-shot fit vector,
degenerate shots removed?

**Verdict: keep `μs = 0.2`, but note it is only weakly constrained.**
The objective is flat from ≈ 0.15 out to ≈ 0.32 (all cells within noise of
the centre, best +0.10 cm at coin-flip win rates). Sensitivity appears only
at the extremes (0.10 → +0.39 cm; 0.40 → +1.68 cm). Practical consequence:
μs may be tuned freely for feel/realism anywhere in roughly **[0.12, 0.35]**
without measurable fit cost — the recorded shots barely identify it.

---

## Methodology

Standard pass-pipeline protocol (`--pin muw=0.17`, repeated NM passes until
median improves < 0.02 cm, `--max-passes 10`, median aggregation vs
freshly-fitted centre; pilot panel = `sweep-trim.json`, 12 shots).

Grid deliberately widened per expectation of insensitivity — upper side
stretched to double the default:

| μs | vs default |
|---|---|
| 0.10 | −50 % |
| 0.15 | −25 % |
| 0.18 | −10 % |
| 0.20 (base) | 0 |
| 0.25 | +25 % |
| 0.32 | +60 % |
| 0.40 | +100 % |

## Results

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.17, μs=0.2, med 7.89):

| μs | all 12 | w/l |
|---|---|---|
| 0.10 | +0.39 | 3/9 |
| 0.15 | **+0.10** | 7/5 |
| 0.18 | +0.20 | 6/6 |
| 0.20 (base) | 0 | |
| 0.25 | +0.54 | 6/6 |
| 0.32 | **+0.10** | 6/6 |
| 0.40 | +1.68 | 3/9 |

No candidate improves → no held-out run warranted. Per-shot deltas are
dominated by flipper noise (id 166 spans −2.1…+6.3 across cells; ids
32/92 similar), which is itself evidence that μs moves shots between
near-equal local optima rather than along any systematic gradient.

## History

| round | anchor / setup | extent | result |
|---|---|---|---|
| v1 morning | defaults (μw=0.20), 3-param fits | 0.17–0.23 | flat, every point ≥ −0.02 |
| v2 | μw=0.17 pin, angle-fitted, trimmed panel | 0.10–0.40 | flat 0.15–0.32, walls beyond |

## Reproducing

```sh
node dist/fit/sweep-params.mjs --pin muw=0.17 \
    --param 'mus=0.1|0.15|0.18|0.25|0.32|0.4' \
    --input dist/fit/sweep-trim.json --max-passes 10 \
    --out-dir dist/fit/corners/muS-wide   # ~4 min
```

Machine-readable output: `dist/fit/corners/muS-wide/sweep-results.json`.
