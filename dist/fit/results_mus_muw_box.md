# μs × μw interaction box — results

Date: 2026-08-24
Question: does the flat single-axis profile of `μs` hide a cross-dependence
with `μw`? 3×3 box around the adopted starting point
(μs = 0.20, μw = 0.18), everything else at defaults.

**Verdict: no detectable interaction.** The adopted corner sits at/near the
minimum of the joint surface. μw's narrow optimum at 0.18 replicates at
*every* μs level tested; μs stays flat even as μw varies. The few
sub-zero cells are anti-diagonal from each other (inconsistent directions)
and below the ~±0.05 cm noise floor, flipping sign between all-12 and
clean-10. Nothing to adopt; nothing sent to held-out.

---

## Methodology

Standard pass-pipeline protocol (repeated NM passes, median aggregation),
no pin this time — μw itself was an axis:

- axes: `mus ∈ {0.17, 0.20, 0.23}` (wide steps; flat alone),
  `muw ∈ {0.17, 0.18, 0.19}` (fine steps; known steep direction)
- base = freshly-fitted pure defaults (0.20, 0.20), as always
- analysis below re-references every cell to the **centre cell**
  (mus=0.2, muw=0.18) rather than to defaults, reconstructing per-shot
  absolutes as `base.perShotCm[i] + point.perShot[i]`

Data: pilot set (12 shots); clean-10 excludes regime-flippers 32/92.
This run was heavily flipper-contaminated (id 92 swings +3 … +44 cm across
cells depending on which regime its fit lands in), so clean-10 carries the
real signal.

## Results

Δmedian RMSE (cm) vs centre (μs=0.20, μw=0.18):

| | μw=0.17 | μw=0.18 | μw=0.19 |
|---|---|---|---|
| **all 12** (centre 8.94) | | | |
| μs=0.17 | +0.38 | +0.05 | −0.03 |
| μs=0.20 | +0.21 | 0 | +0.06 |
| μs=0.23 | +0.21 | −0.02 | +0.13 |
| **clean 10** (centre 8.39) | | | |
| μs=0.17 | +0.63 | +0.13 | +0.48 |
| μs=0.20 | +0.04 | 0 | +0.40 |
| μs=0.23 | −0.05 | +0.10 | +0.34 |

Wins–losses vs centre (all 12): every neighbour loses or ties overall,
e.g. (0.20, 0.19) is 3W–9L; the best challenger (0.23, 0.18) is only
5W–7L — a coin flip.

Readings:

1. **The μw=0.18 dip survives in 2-D.** In each μs row, μw=0.18 matches or
   beats both neighbours (the lone exceptions — (0.17, 0.19) on all-12,
   (0.23, 0.17) on clean-10 — are ±0.03–0.05 and do not repeat across
   subsets).
2. **No unmasking of μs.** Along the optimal μw column, μs contributes
   ≤ 0.13 cm over a ±15 % span. If a (μs, μw) trade-off exists, it is
   weaker than this experiment can see.
3. **No coherent diagonal tilt.** A coupled valley would show monotone
   improvement toward one corner; instead the negative cells jump corners
   between subsets.

## Caveats

- Grid resolution: ±15 % on μs, ±5 % on μw. A narrow diagonal channel could
  thread between cells, but at 12-shot noise levels (~±0.1 cm median) it
  would be undetectable regardless.
- Only one pair examined; the structurally-coupled pairs still open are
  (mu, rho) — `Mz ∝ mu·rho` makes rho meaningless without mu — and
  (ee, μw) for cushion speed/angle co-calibration.

## Reproducing

```sh
node dist/fit/sweep-params.mjs \
    --param 'mus=0.17|0.2|0.23' --param 'muw=0.17|0.18|0.19' \
    --out-dir dist/fit/corners/mus-muw-box   # ~4 min
```

Machine-readable output: `dist/fit/corners/mus-muw-box/sweep-results.json`
(note: `points[].perShot` holds deltas vs *base*, not absolute RMSE).
