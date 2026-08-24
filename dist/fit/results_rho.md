# rho parameter study — results

Date: 2026-08-24
Question: is the system spindown-rate constant `rho` (default `0.045`, Han
sliding-spin torque `Mz = ((mu·m·g·2)/3)·rho`) optimal for fitting the
recorded trajectory data, now that cushion friction is held at the adopted
`μw = 0.18`?

**Verdict: keep `rho = 0.045`** — no change to system defaults.
The objective surface is flat in rho across ±20 %: every tested point is
equal-to-worse than the freshly-fitted pinned centre (pilot Δmedian +0.03 …
+0.36 cm), and the nearest neighbour (`rho = 0.04275`) does not improve
out-of-sample either (+0.15 cm, 23/60 shots, sign-p 0.12). There is no
evidence of a better value at this resolution.

---

## Methodology

Identical protocol to `results_μw.md` (repeated NM passes per point,
convergence-gated, median aggregation, sign tests vs a **freshly-fitted
centre**) with one addition:

- **`--pin muw=0.18`** (new option in `sweep-params.mjs`): applies a constant
  param override to *every* point including the centre. The whole experiment
  therefore runs under μw = 0.18 and all comparisons are anchored at a
  freshly-fitted base of (defaults, μw=0.18, rho=0.045) — never stored RMSEs.
  Pinning an axis that also varies is rejected; the pin is recorded in
  `sweep-results.json` under `protocol.pin`.

Data sets are the same disjoint sets as the μw study:

| set | n | definition | file |
|---|---|---|---|
| pilot | 12 | entries with fitted RMSE in (9, 10) cm | `sweep.json` |
| held-out | 60 | everything else with a fit | `heldout.json` |

Grid: `rho` = 0.036, 0.0405, 0.04275, 0.04725, 0.0495, 0.054
(−20 %, −10 %, −5 %, +5 %, +10 %, +20 % around default 0.045).

## Results

### 1. Pilot profile over rho (12 shots)

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.18, rho=0.045):

| rho | vs default | all 12 | clean 10 (w/o flippers 32, 92) |
|---|---|---|---|
| 0.036 | −20 % | +0.23 | +0.16 |
| 0.0405 | −10 % | +0.10 | +0.07 |
| 0.04275 | −5 % | +0.04 | +0.03 |
| 0.045 (base) | 0 | 0 | 0 |
| 0.04725 | +5 % | +0.03 | +0.11 |
| 0.0495 | +10 % | +0.07 | +0.30 |
| 0.054 | +20 % | +0.17 | +0.36 |

No point improves on the centre, in either the full or the clean subset.
The surface is flat with a shallow drift upward toward larger rho;
the minimum sits at the default. Best candidate overall was rho0.04725 at
+0.03 cm with only 3/12 shots improved — noise-level.

### 2. Held-out confirmation (60 unseen shots)

Although nothing cleared an improvement bar, the nearest pilot neighbour was
validated out-of-sample (mirroring how the μw study treated its runner-up):

| rho | median (cm) | Δmedian | wins | sign-p |
|---|---|---|---|---|
| base 0.045 (μw=0.18) | 13.29 | — | | |
| 0.04275 | 13.45 | +0.15 | 23/60 | 0.117 |

Does not replicate as an improvement — direction flips to worse. The pinned
base's held-out median (13.29) exactly reproduces the μw study's μw=0.18 row,
a consistency check on the pin plumbing.

### 3. Interpretation

rho only enters through the sliding-spin torque Mz, so it is weakly
identifiable: most shots' trajectories barely depend on it, which matches the
flat profile. Per-shot responses are dominated by regime flippers again
(held-out ids 25 +16.9, 36 +9.8, 5 +6.0, 11 +5.5, 169 −3.8 cm) rather than by
any systematic rho trend.

## Caveats

- Resolution is ±5 % at best; a benefit smaller than ~0.05 cm would be
  invisible here and would not justify changing defaults anyway.
- Only rho varied under the pinned μw = 0.18; no joint (muw × rho)
  interaction surface was mapped.
- Same flipper caveat as the μw study: ids 25/32/92/168/11/94 dominate tails.

## Reproducing

From the repo root (note: quote `--param` args, `|` is a shell pipe):

```sh
# 1. Pilot profile, all 12 shots (~2 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'rho=0.036|0.0405|0.04275|0.04725|0.0495|0.054' \
    --out-dir dist/fit/corners/rho-all12

# 2. Pilot profile, clean 10 (excluding flippers 32,92) (~1.5 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'rho=0.036|0.0405|0.04275|0.04725|0.0495|0.054' \
    --ids 24,56,62,84,94,105,114,128,166,172 \
    --out-dir dist/fit/corners/rho-clean10

# 3. Held-out confirmation of nearest candidate (~3 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 --param 'rho=0.04275' \
    --input dist/fit/heldout.json --out-dir dist/fit/corners/rho-heldout
```

Machine-readable outputs:
`dist/fit/corners/{rho-all12,rho-clean10,rho-heldout}/sweep-results.json`
(each records `"pin": {"muw": 0.18}` in its `protocol` block).
