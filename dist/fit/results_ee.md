# ee parameter study — results (v2)

## v3 — fine window under the new scoring (2026-09-05)

Question: with the **new RMSE scoring** (`results_new.md`) and **pure
system defaults everywhere else** (no pin; μw = 0.175), is there any gain
in a tight ±3 % window around `ee = 0.85` — the resolution bracket the
earlier adopter candidates (0.855–0.865) sat in under the old scoring?

**Verdict: keep `ee = 0.85`.** Every point in the window is worse than the
freshly-fitted base; the old adopter band does not return under the new
scoring at defaults.

Protocol: `sweep-params.mjs` pass-pipeline, no pin, dev set (24 shots).
Base med 4.78 cm. Δmedian (cm) vs base:

| ee | −3 % | −1.5 % | +1.5 % | +3 % |
|---|---|---|---|---|
| value | 0.8245 | 0.83725 | 0.86275 | 0.8755 |
| Δmedian | +0.43 | **+0.29** | +0.92 | +0.36 |
| w/t/l | 7/0/17 | 7/0/17 | 13/0/11 | 15/0/9 |

No interior dip, no significant challenger (best sign-p 0.064, and it's a
*loss*). Per-shot deltas are dominated by flipper noise again (id 8: +11.9
at ee=0.86275). Nothing to send to held-out.

```sh
node dist/fit/sweep-params.mjs --param 'ee=0.8245|0.83725|0.86275|0.8755' \
    --input dist/fit/sweep-dev.json \
    --out-dir dist/fit/corners/ee-fine-dev   # ~1.5 min
```

Machine-readable output: `dist/fit/corners/ee-fine-dev/sweep-results.json`.

See also `results_rho.md` v2 (same date): its ±1.5 %/±3 % rho probe is also
flat — 0.044325 ties the default at +0.03 cm, p = 1.0.

---

## v2 — pinned-μw study (2026-08-24)

Date: 2026-08-24 (v2 revises the morning study of the same date)
Question: where is the Mathavan cushion-restitution optimum `ee` under the
current protocol — cushion friction pinned at adopted **μw = 0.17**,
`shot.angle` in the per-shot fit vector, degenerate shots removed?

**Verdict: keep `ee = 0.85`.**
The pilot hinted the peak had drifted up (`ee=0.87`, Δmedian −0.13 cm) with
an asymmetric bowl — lower wall steep (+1.53 at 0.81), upper gentle
(+0.38 at 0.89). Held-out testing kills it: `ee=0.87` lands **+0.34 cm**
worse (28/58 improved, sign-p 0.90), `ee=0.88` +1.32. As in the morning
study (symmetric ±5 % walls of +0.3/+1.0 cm), `ee` remains strongly
identified and centred on the default; only its local asymmetry changed,
which is within panel noise.

---

## Methodology

Standard pass-pipeline protocol (`--pin muw=0.17`, repeated NM passes until
median improves < 0.02 cm, `--max-passes 10`, median aggregation vs
freshly-fitted centre). Panels: pilot `sweep-trim.json` (12 shots),
held-out `heldout-trim.json` (58 shots).

Grid: fine steps around default plus sentinels —
`ee` = 0.81, 0.83, 0.84, 0.85(base), 0.86, 0.87, 0.89.

## Results

### Pilot (12 shots) — Δmedian RMSE (cm) vs centre (med 7.89)

| ee | −5 % | −2 % | −1 % | base | +1 % | +2 % | +5 % |
|---|---|---|---|---|---|---|---|
| value | 0.81 | 0.83 | 0.84 | 0.85 | 0.86 | 0.87 | 0.89 |
| Δmedian | **+1.53** | +0.83 | +0.38 | 0 | +0.21 | **−0.13** | +0.38 |

### Held-out (58 shots)

| ee | median (cm) | Δmedian | wins | sign-p |
|---|---|---|---|---|
| base 0.85 (μw=0.17) | 12.50 | — | | |
| 0.87 | 12.85 | +0.34 | 28/58 | 0.896 |
| 0.88 | 13.82 | +1.32 | 24/58 | 0.237 |

## History

| round | anchor / setup | result |
|---|---|---|
| v1 morning | defaults (μw=0.20), 3-param fits, full panel | sharp symmetric bowl at 0.85; ±5 % → +0.33/+0.99 |
| **v2** | μw=0.17 pin, angle-fitted, trimmed panel | same verdict; mild upper-side softening, 0.87 pilot dip failed held-out |

## Reproducing

```sh
# pilot (~4 min)
node dist/fit/sweep-params.mjs --pin muw=0.17 \
    --param 'ee=0.81|0.83|0.84|0.86|0.87|0.89' \
    --input dist/fit/sweep-trim.json --max-passes 10 \
    --out-dir dist/fit/corners/ee2-pilot

# held-out (~10 min)
node dist/fit/sweep-params.mjs --pin muw=0.17 \
    --param 'ee=0.87|0.88' \
    --input dist/fit/heldout-trim.json --max-passes 10 \
    --out-dir dist/fit/corners/ee2-heldout
```

Machine-readable outputs:
`dist/fit/corners/{ee2-pilot,ee2-heldout}/sweep-results.json`.
