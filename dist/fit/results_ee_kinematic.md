# ee parameter study — kinematic-seeded (equal-footing) results

Date: 2026-09-05
Question: under the **equal-footing protocol** (see
`results_ee_methodology_review.md`), does the default `ee = 0.85` still win
its ±3 % window? The earlier anchored probes said yes on every point; the
review predicted that verdict was manufactured by the anchor-seeded
optimisation gap (candidates seeded from default-optimised stored fits).

**Verdict: the anchored verdict flips.** With every point — base included —
starting from the same constant-independent kinematic seed, the default is
no longer the clear winner. `ee = 0.83725` is directionally better on both
splits (−0.66 dev, −0.93 held-out median). Not strong enough to adopt, but
the data no longer support "0.85 is optimal".

## Protocol

The v3 window re-run with one change: stored `shot` fields were stripped
from the inputs (`sweep-dev-kin.json`, 24 shots / `sweep-test-kin.json`,
47 shots), so pass 1 of every point (base included) seeds from the
kinematic estimate — constant-independent. Otherwise identical: no pin,
new RMSE scoring, `--all`, repeated NM passes until median gain < 0.02 cm
(`--max-passes 10`). Absolute medians are inflated vs anchored runs
(kinematic-start fits land in worse basins) — **relative comparisons only**.

## Dev (24 shots) — Δmedian RMSE (cm) vs freshly-fitted base (med 7.81)

| ee | anchored v3 (old protocol) | kinematic-seeded | w/t/l |
|---|---|---|---|
| 0.8245 (−3 %) | +0.43 | +1.80 | 5/0/19 |
| 0.83725 (−1.5 %) | +0.29 | **−0.66** | 6/0/18 |
| 0.85 (base) | 0 (4.78) | 0 | |
| 0.86275 (+1.5 %) | +0.92 | +0.18 | 13/0/11 |
| 0.8755 (+3 %) | +0.36 | **−0.58** | 16/0/8 |

Anchored v3 numbers embedded from the deleted run for the record. Under
equal seeding the uniformly-positive wall disappears; two neighbours beat
the base's median — the two the old write-up called pure losses.

## Held-out (47 unseen shots)

| ee | median (cm) | Δmedian | w/t/l | sign-p |
|---|---|---|---|---|
| 0.85 (base) | 8.75 | — | | |
| 0.83725 | 7.82 | **−0.93** | 19/47 | 0.243 |
| 0.8755 | 9.73 | +0.98 | 32/15 | 0.019 |

`ee = 0.83725` replicates a median gain out-of-sample; `ee = 0.8755` fails
OOS (+0.98) and is rejected.

## Reading

- Lower ee (less cushion energy) is directionally better on both splits —
  the same direction `results_ee_methodology_review.md` predicted and the
  same direction the μw-pinned matrix hinted at (0.86 < 0.90 < 0.94).
- Evidence is **weak, not conclusive**: dev sign balance is loss-heavy
  (6/18) with big wins; held-out sign-p 0.243. Per-shot deltas still carry
  ±5–40 cm basin noise (id 101 −41, id 33 +23), so magnitude is
  unreliable even though the direction replicated.
- The window probes only ±3 %; nothing here locates the valley floor.

## Reproducing

```sh
node dist/fit/sweep-params.mjs --param 'ee=0.8245|0.83725|0.86275|0.8755' \
    --input dist/fit/sweep-dev-kin.json --max-passes 10 \
    --out-dir dist/fit/corners/ee-kin-dev     # dev profile

node dist/fit/sweep-params.mjs --param 'ee=0.83725|0.8755' \
    --input dist/fit/sweep-test-kin.json --max-passes 10 \
    --out-dir dist/fit/corners/ee-kin-test    # held-out confirmation
```

Machine-readable outputs:
`dist/fit/corners/{ee-kin-dev,ee-kin-test}/sweep-results.json`.
Methodology rationale: `dist/fit/results_ee_methodology_review.md`.
