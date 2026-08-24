# muS parameter study — results (v2)

Date: 2026-08-24 (v2 revises the morning study of the same date)
Question: is Han sliding friction `muS` (default `0.126`) optimal under the
current protocol — cushion friction pinned at the newly adopted
**μw = 0.17**, `shot.angle` included in the per-shot fit vector, and
degenerate shots (double-kiss ids 25, 36) removed?

**Verdict: keep `muS = 0.126`.**
Under the sharper v2 setup every tested point (−15 % … +15 %) is *worse*
than the freshly-fitted pinned centre (Δmedian +0.12 … +0.39 cm); best
challenger is again −10 % (`0.1134`) but at only 5/12 improved, sign-p 0.77.
Nothing clears the bar → no held-out run warranted. The morning study's
"noisy dip that failed held-out" conclusion now rests on cleaner ground:
with angle free and μw correct, the surface is uniformly flat-to-worse.

---

## Methodology

Standard pass-pipeline protocol (`--pin muw=0.17`, repeated NM passes until
median improves < 0.02 cm, `--max-passes 10`, median aggregation, sign tests
vs freshly-fitted centre). Panel: pilot 12 shots (`sweep-trim.json`; the
removed shots were never in it).

Grid unchanged from v1: `muS` = 0.1071, 0.1134, 0.1197, 0.1323, 0.1386,
0.1449 (−15 %…+15 % around 0.126).

## Results

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.17, muS=0.126, med 7.89):

| muS | vs default | Δmedian | w/l |
|---|---|---|---|
| 0.1071 | −15 % | +0.17 | 6/6 |
| 0.1134 | −10 % | **+0.12** | 5/7 |
| 0.1197 | −5 % | +0.14 | 5/7 |
| 0.126 (base) | 0 | 0 | |
| 0.1323 | +5 % | +0.39 | 4/8 |
| 0.1386 | +10 % | +0.20 | 7/5 |
| 0.1449 | +15 % | +0.17 | 7/5 |

Mild upward drift on both sides of default; no interior dip (the v1 −10 %
dip does not return — it was local-optima noise). Note id 92 still flips
(+8.9 at +10 %) and id 32 swings ±6 — flipper triage would sharpen further,
but no subset recomputation changes the direction of any cell materially.

## Comparison across protocols

| round | anchor | fit vector | result |
|---|---|---|---|
| v1 morning | μw=0.18 pin, defaults elsewhere | power+offsets | noisy; dip at −10 % failed held-out (+0.48) |
| **v2** | **μw=0.17 pin** | **+angle** | all points worse; keep 0.126 |

## Reproducing

```sh
node dist/fit/sweep-params.mjs --pin muw=0.17 \
    --param 'muS=0.1071|0.1134|0.1197|0.1323|0.1386|0.1449' \
    --input dist/fit/sweep-trim.json --max-passes 10 \
    --out-dir dist/fit/corners/muS2-pilot   # ~4 min
```

Machine-readable output: `dist/fit/corners/muS2-pilot/sweep-results.json`.
See also `results_μw.md` (v2) for how the anchor moved.
