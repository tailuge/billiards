# rho parameter study — kinematic-seeded (equal-footing) results

Date: 2026-09-05
Question: under the equal-footing protocol (see
`results_ee_methodology_review.md`), is `rho = 0.045` still the optimum?
The anchored v2 profile read as flat-with-minimum-at-default and reported
the −17 % point (0.0375) as **+0.52 cm worse**.

**Verdict: the anchored verdict flips.** `rho = 0.0375` is ~2 cm better
than the default on **both** splits (dev −2.29, held-out −1.96 median,
pooled 44/71 shots, two-sided p ≈ 0.05). The +17 % point's dev win
(+0.03 on held-out) does **not** replicate — a control showing
single-split dev winners from this protocol are not trustworthy. rho is
directionally **lower**, not at 0.045.

## Protocol

Same as the ee study: stored `shot` fields stripped from the inputs
(`sweep-dev-kin.json` / `sweep-test-kin.json`), every point incl. base
seeds from the constant-independent kinematic estimate, no pin, new RMSE
scoring, `--all`, repeated NM passes until median gain < 0.02 cm.
`--max-passes 20` on dev2/test so slow-converging points could finish
(0.0375 needed 11 dev passes; the first capped run at 10 passes dropped it
unconverged). Absolute medians are inflated vs anchored runs — **relative
comparisons only**.

## Dev (24 shots) — Δmedian RMSE (cm) vs freshly-fitted base (med 7.81)

| rho | vs default | Δmedian | w/t/l | passes | note |
|---|---|---|---|---|---|
| 0.0375 | −17 % | **−2.29** | 16/0/8 | 11 | converged |
| 0.04275 | −5 % | +3.08 | 8/0/16 | 3 | **stalled at a bad basin** — not interpretable |
| 0.045 (base) | 0 | 0 | | 4 | |
| 0.04725 | +5 % | −0.07 | 9/3/12 | 11 | tie |
| 0.0525 | +17 % | **−2.00** | 15/1/8 | 6 | converged (dev only) |

The ±5 % neighbours bracket the default (flat, as the old study saw), but
the ±17 % sentinels beat it by ~2 cm — the surface is not flat-with-minimum
at the default. 0.04275 is excluded: it "converged" after 3 passes in a
poor per-shot configuration (its +21 cm single-shot outlier on id 52 is a
basin artefact).

## Held-out (47 unseen shots)

| rho | median (cm) | Δmedian | w/t/l | sign-p |
|---|---|---|---|---|
| 0.045 (base) | 8.75 | — | | |
| 0.0375 | 6.79 | **−1.96** | 28/47 | 0.243 |
| 0.0525 | 8.78 | +0.03 | 21/25 | 0.659 |

`rho = 0.0375` replicates out-of-sample (dev −2.29 / test −1.96; pooled
44/71 ≈ 62 %, p ≈ 0.05, marginal). `rho = 0.0525` collapses to +0.03 —
its dev result was basin luck, and is rejected.

## Reading

- The default rho sits inside the probe band but is **not** the minimum
  under equal seeding; the anchored claim "minimum sits at the default"
  came from the same anchor-seeded handicap that skewed the ee studies.
- Lower rho (less sliding-spin torque Mz) improving the fit is consistent
  with the broader pattern the fair-seeded probes keep showing: the
  hand-picked defaults over-dissipate energy.
- Same caveats as the ee study: per-shot basin noise is large (±5–40 cm on
  single shots), statistical strength is marginal (sign-p 0.24, pooled
  p ≈ 0.05), and kinematic-start fits are basin-limited — magnitude ~2 cm
  is "what NM from equal starts can reach", not a clean physics estimate.
- The low side of the band was not probed below 0.0375; the valley floor
  is unknown (could be lower still).

## Reproducing

```sh
node dist/fit/sweep-params.mjs --param 'rho=0.0375|0.04275|0.04725|0.0525' \
    --input dist/fit/sweep-dev-kin.json --max-passes 20 --workers 8 \
    --out-dir dist/fit/corners/rho-kin-dev2   # dev profile (converged)

node dist/fit/sweep-params.mjs --param 'rho=0.0375|0.0525' \
    --input dist/fit/sweep-test-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/rho-kin-test   # held-out confirmation
```

Machine-readable outputs:
`dist/fit/corners/{rho-kin-dev2,rho-kin-test}/sweep-results.json`.

Next step if pursued: low-side probe `rho ∈ 0.030–0.0425` under the same
protocol to locate the valley, then PSO-grade per-shot fits before any
adoption.
