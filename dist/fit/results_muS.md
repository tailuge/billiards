# muS parameter study — results

Date: 2026-08-24
Question: is the system Han sliding-friction constant `muS` (default
`0.126`, ball–cloth deceleration during the sliding phase) optimal for
fitting the recorded trajectory data, with cushion friction held at the
adopted `μw = 0.18`?

**Verdict: keep `muS = 0.126`** — no change to system defaults.
A weak dip appeared at −10 % in the pilot (`muS = 0.1134`, Δmedian
−0.07/−0.11 cm) but it **does not replicate out-of-sample**: on 60 held-out
shots it is +0.48 cm worse (26/60 improve, sign-p 0.435). Every other tested
point is worse than the freshly-fitted pinned centre in the pilot already.
The pilot dip was local-optimum noise, not signal.

---

## Methodology

Identical protocol to `results_μw.md` / `results_rho.md`: repeated NM passes
per point until aggregate median improves < 0.02 cm (max 6), median
aggregation, per-shot paired sign tests against a **freshly-fitted centre**.
All points — centre included — run under **`--pin muw=0.18`**, so the whole
experiment shares the adopted cushion friction and no stored RMSEs are used
as baseline.

Data sets are the same disjoint sets as before:

| set | n | definition | file |
|---|---|---|---|
| pilot | 12 | entries with fitted RMSE in (9, 10) cm | `sweep.json` |
| held-out | 60 | everything else with a fit | `heldout.json` |

Grid: `muS` = 0.1071, 0.1134, 0.1197, 0.1323, 0.1386, 0.1449
(−15 %, −10 %, −5 %, +5 %, +10 %, +15 % around default 0.126).

## Results

### 1. Pilot profile over muS

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.18, muS=0.126):

| muS | vs default | all 12 | clean 10 (w/o flippers 32, 92) |
|---|---|---|---|
| 0.1071 | −15 % | +0.23 | +0.17 |
| 0.1134 | −10 % | **−0.07** | **−0.11** |
| 0.1197 | −5 % | −0.06 | +0.49 |
| 0.126 (base) | 0 | 0 | 0 |
| 0.1323 | +5 % | +0.13 | +0.68 |
| 0.1386 | +10 % | +0.13 | +0.24 |
| 0.1449 | +15 % | +0.14 | +0.21 |

Raising `muS` consistently hurts (clean-10 +5 % point loses on 9/10 shots,
sign-p 0.02); lowering is flat-to-mixed with a single narrow dip at −10 %.
Note the non-monotonicity around the default (−5 % worse than −15 % on
clean-10): fits flip between trajectory regimes under small constant
changes, so single-point deltas near a flat optimum are unreliable.

### 2. Held-out validation of the pilot dip (60 unseen shots)

| muS | median (cm) | Δmedian | wins | sign-p |
|---|---|---|---|---|
| base 0.126 (μw=0.18) | 13.29 | — | | |
| 0.1134 | 13.77 | **+0.48** | 26/60 | 0.435 |

The dip does not replicate — direction flips to clearly worse. Tails are
dominated by the known regime-flipper shots reacting catastrophically
(id 25 +27.4, id 11 +14.3, id 36 +10.2, id 171 +8.1, id 5 +5.4 cm).

### 3. Interpretation

Unlike μw (sloped surface, replicating gain) or rho (flat everywhere),
muS shows a *noisy* surface whose only apparent gain dissolves
out-of-sample. There is no evidence that any value within ±15 % beats the
default; combined with the earlier ±5 % corner checks of ee/μs showing no
signal, sliding-phase friction appears well-calibrated already.

## Caveats

- Resolution is ±5 %; a sub-0.05 cm effect would be invisible here.
- Only muS varied under pinned μw = 0.18; joint (muw × muS) interaction not
  mapped.
- Regime-flipper shots dominate tails and medians alike; visual triage of
  ids 25/32/92/168/11/94 would sharpen any future sweep.

## Reproducing

From the repo root (note: quote `--param` args, `|` is a shell pipe):

```sh
# 1. Pilot profile, all 12 shots (~2 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'muS=0.1071|0.1134|0.1197|0.1323|0.1386|0.1449' \
    --out-dir dist/fit/corners/muS-all12

# 2. Pilot profile, clean 10 (excluding flippers 32,92) (~1.5 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'muS=0.1071|0.1134|0.1197|0.1323|0.1386|0.1449' \
    --ids 24,56,62,84,94,105,114,128,166,172 \
    --out-dir dist/fit/corners/muS-clean10

# 3. Held-out validation of pilot best (~3 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 --param 'muS=0.1134' \
    --input dist/fit/heldout.json --out-dir dist/fit/corners/muS-heldout
```

Machine-readable outputs:
`dist/fit/corners/{muS-all12,muS-clean10,muS-heldout}/sweep-results.json`
(each records `"pin": {"muw": 0.18}` in its `protocol` block).
