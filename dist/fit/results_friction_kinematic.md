# muS / mu / μs small sweeps — kinematic-seeded (equal-footing) gradient probe

Date: 2026-09-05
Question: under the equal-footing protocol (see
`results_ee_methodology_review.md`), which direction — if any — does each
friction/dissipation constant want to move? Small two-sided ±10 % dev
probes, then out-of-sample checks on the directional candidates. Goal:
establish the **gradient**, not a converged optimum.

**Verdict: `mu` and `μs` both want to go DOWN; `muS` shows no gradient at
±10 %.** `mu 0.00495` is the strongest result so far in the fair-seeded
series: dev −0.95 and held-out −0.62 cm median, pooled 45/71 shots
(p ≈ 0.02). `μs 0.18` replicates directionally (dev −0.68, held-out
−1.48) but with coin-flip shot balance. This continues the pattern from
`results_ee_kinematic.md` and `results_rho_kinematic.md`: every identified
dissipation constant wants to be **lower** than its hand-picked default.

## Protocol

Same as the ee/rho kinematic runs: stored `shot` fields stripped
(`sweep-dev-kin.json` 24 shots / `sweep-test-kin.json` 47 shots), every
point incl. base seeds from the constant-independent kinematic estimate,
no pin, new RMSE scoring, `--all`, repeated NM passes until median gain
< 0.02 cm (`--max-passes 20`). Absolute medians inflated vs anchored runs —
**relative comparisons only**.

## Dev profiles (24 shots, base med 7.81)

| param | value | vs default | Δmedian | w/t/l |
|---|---|---|---|---|
| muS | 0.1134 | −10 % | −1.25 * | 11/0/13 |
| muS | 0.1386 | +10 % | −0.06 | 12/0/12 |
| **mu** | **0.00495** | **−10 %** | **−0.95** | **14/1/9** |
| mu | 0.00605 | +10 % | +0.59 | 10/1/13 |
| **μs** | **0.18** | **−10 %** | **−0.68** | **12/0/12** |
| μs | 0.22 | +10 % | +1.17 | 11/0/13 |

\* not a trustworthy signal: 11/13 shot balance (loss-heavy) with the gain
carried by a few basin-flips (id 151 −10.4, id 29 −9.2) against one +20.9
loss (id 52) — the same flip pattern that sank `rho 0.04275` on dev.

`mu` and `μs` are coherent: the −10 % step improves the median and the
+10 % step worsens it, with mostly small per-shot deltas (the few big ones
are basin flips: id 84 +10 at mu +10 %, id 134 +7.5 at μs +10 %).

## Held-out (47 unseen shots)

| param | value | median (cm) | Δmedian | w/t/l | sign-p |
|---|---|---|---|---|---|
| base | defaults | 8.75 | — | | |
| **mu** | **0.00495** | 8.13 | **−0.62** | 31/1/16 | **0.040** |
| **μs** | **0.18** | 7.27 | **−1.48** | 25/1/21 | 0.659 |

`mu 0.00495` replicates with a significant sign test (pooled dev+test
45/71 ≈ 63 %, two-sided p ≈ 0.02). `μs 0.18` improves the median more
out-of-sample than on dev (−1.48) but the shot balance stays a coin flip —
directional evidence only, consistent with μs being weakly identified
(old studies: flat ≈ 0.15–0.32).

## Reading

- **The gradient on `mu` and `μs` is downward** — same direction as the
  rho (−17 %), ee (−1.5 %) and μw (0.20 → 0.16/0.17) findings. The
  hand-picked defaults systematically over-dissipate energy.
- **Caveat — `mu` and `rho` are coupled**: `Mz = (2/3)·mu·m·g·rho`, so the
  mu↓ probe partially re-expresses the rho↓ result through the spin-down
  torque. `mu` also drives rolling resistance (`Mxy ∝ mu`), its own
  pathway. Treat mu↓ and rho↓ as one corroborating direction, not two
  independent discoveries, until a joint (mu × rho) probe is run.
- **`muS` is unresolved at this step size**: −10 % is basin-noisy, +10 %
  is flat. Nothing here says the old "keep 0.126" verdict is right or
  wrong — a wider probe (±20–30 %) or PSO-grade fits would be needed.
- No value is adopted from this probe — gradient evidence only. The usual
  caveats apply: kinematic-start fits are basin-limited and per-shot
  deltas carry ±5–20 cm flips.

## Reproducing

```sh
# Dev gradient probes (~2 min each)
node dist/fit/sweep-params.mjs --param 'muS=0.1134|0.1386' \
    --input dist/fit/sweep-dev-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/muS-kin-dev
node dist/fit/sweep-params.mjs --param 'mu=0.00495|0.00605' \
    --input dist/fit/sweep-dev-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/mu-kin-dev
node dist/fit/sweep-params.mjs --param 'mus=0.18|0.22' \
    --input dist/fit/sweep-dev-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/mus-kin-dev

# Held-out confirmation of the downward candidates (~2.5 min each)
node dist/fit/sweep-params.mjs --param 'mu=0.00495' \
    --input dist/fit/sweep-test-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/mu-kin-test
node dist/fit/sweep-params.mjs --param 'mus=0.18' \
    --input dist/fit/sweep-test-kin.json --max-passes 20 \
    --out-dir dist/fit/corners/mus-kin-test
```

Machine-readable outputs:
`dist/fit/corners/{muS-kin-dev,mu-kin-dev,mu-kin-test,mus-kin-dev,mus-kin-test}/sweep-results.json`.
