# muS parameter study — kinematic held-out window (2026-09-07)

Date: 2026-09-07
Scope: Han `muS` only. Other constants left at their current code defaults, including
`μw = 0.175`. No pin. Equal-footing protocol: stored `shot` fields not used; every
point including base seeded from the kinematic estimate on the same input.

Goal: check whether the earlier hint that `muS = 0.126` is over-pegged becomes a
clean downward slope when we widen the held-out window around the best dev candidate.

---

## Inputs and protocol

- Dev panel: `dist/fit/sweep-dev-kin.json` — 24 shots.
- Held-out panel: `dist/fit/sweep-test-kin.json` — 47 shots.
- Sweep driver: `dist/fit/sweep-params.mjs`.
- Per-shot fit: `dist/fit/fit-shots.mjs`, default 4D NM, `--all`, repeated passes
  until panel median gain < 0.02 cm, max 20 passes.
- Scoring: `dist/fit/rmse.js`, cue-ball 1.5× weight, `1/(1+t)` decay, truth cutoff
  4 s by default.

Reproducibility check: `muS = 0.12096` on the held-out input was rerun end to end
twice. Both gave identical per-shot deltas and summary stats.

---

## Results

### Dev (24 shots, base median 7.81 cm)

| muS | vs default | Δmedian | source |
|---|---|---|---|
| 0.1185 | −6 % | −0.91 | dev4 |
| 0.12096 | −4 % | −0.91 to −0.96 | dev3/dev4 |
| 0.12222 | −3 % | −0.96 | dev3 |
| 0.126 | base | 0 | — |
| 0.12978 | +3 % | −1.13 | dev3 |
| 0.13044 | +4 % | +1.49 | dev4 |

### Held-out (47 shots, base median 8.75 cm)

| muS | Δmedian | w/t/l | sign-p | source |
|---|---|---|---|---|
| 0.1185 | −0.24 | 27/0/20 | 0.382 | test4 |
| 0.12096 | **−1.69** | 22/0/25 | 0.771 | test3/test5/test6 |
| 0.12222 | +0.38 | 24/2/21 | 0.766 | test3 |
| 0.12342 | −0.17 | 24/1/22 | 0.883 | test4 |
| 0.12588 | −0.15 | 28/2/17 | 0.135 | test4 |
| 0.126 | base | 0 | — | — |
| 0.13044 | −0.13 | 25/0/22 | 0.771 | test3 |

Test5 and test6 are pure reruns of `muS = 0.12096` on the held-out input; they are
identical to test3 for that point and are included to confirm determinism rather than
to add new candidate values.

---

## What the combined window says

1. **The only candidate better on both splits is `muS = 0.12096`.**  
   Dev: about −0.9 cm. Held-out: −1.69 cm. Reproducible across three held-out runs.

2. **The neighbourhood is not a clean slope.**  
   On held-out, the four nearest neighbours are:
   - 0.1185: −0.24
   - 0.12222: +0.38
   - 0.12342: −0.17
   - 0.12588: −0.15

   So the band on either side of 0.12096 is mostly small and slightly negative, with
   one outlier worse point at 0.12222 and one clearly better point at 0.12096.

3. **Dev and held-out disagree on the shape above 0.126.**  
   - Dev: 0.12978 looks good (−1.13); 0.13044 looks clearly worse (+1.49).
   - Held-out: 0.13044 is essentially flat (−0.13).

   That is the clearest sign that the >0.126 region is still basin/shot noisy on these
   panel sizes rather than producing a stable slope.

4. **The current data no longer support “0.126 is optimal”.**  
   They also do **not** yet support “here is the muS valley floor”. They support
   “0.126 is not strongly optimal under equal footing; 0.12096 is the best candidate
   seen so far; the rest of the window is shallow and jagged”.

---

## Why the window looks jagged

This matters because a ±4 % change in one constant should not normally give a
strongly jagged, non-monotonic median response unless something in the measurement
chain is amplifying small changes into different local fits.

Most likely explanations, in order of plausibility here:

1. **Per-shot NM from a single kinematic seed can land in different local minima for
   very similar muS.**  
   Each panel point re-fits every shot independently. If the per-shot RMSE surface is
   multi-basin, then neighbouring constant values can end up with different local shot
   fits, and the panel median can jump around even if the underlying physics response
   is smooth. This is consistent with the large per-shot deltas seen here.

2. **The RMSE metric is cue-weighted and cutoff at 4 s.**  
   The current scoring is `1/(1+t)` decay, cue ball 1.5×, and only truth through 4 s
   is scored. If muS mainly affects later sliding / spin-down, then the objective is
   only weakly sensitive to it, and small constant changes can flip which local fit
   wins on early cue motion without producing a smooth global trend.

3. **47 held-out shots is enough for a directional read, but not enough to fully
   average out a minority of large-flip shots.**  
   In the 0.12096 held-out result, the median gain is carried by a mix of modest
   improvements and a few large swings, e.g.:
   - large worsening: id 109 +16.4, id 4 +9.5, id 176 +10.1
   - large improvement: id 14 −6.2, id 1 −5.3, id 70 −4.4, id 42 −5.1, id 171 −2.6,
     id 75 −1.9

   That is a plausible signature of a small real effect mixed with basin noise, not a
   clean uniform shift.

4. **μw is still at the default 0.175, not the adopted value.**  
   If muS and μw interact in the Han model, then this window is not yet the shape of
   muS under the system state you may ultimately care about. That does not make these
   numbers wrong, but it does mean the next step is not necessarily the final muS
   picture.

What is **not** a strong methodology red flag yet:
- The pipeline is deterministic. Base and candidates use the same fitting protocol, and
  the 0.12096 rerun reproduced exactly.
- The base is freshly refitted under the same pipeline; this is not a stored-RMSE
  comparison.
- There is no obvious sign of corruption or scoring bug in these runs.

---

## Interpretation

- **Solid:** under equal footing and μw = 0.175, 0.12096 is the only tested muS value
  that is better than 0.126 on both dev and held-out.
- **Solid:** the wider held-out window is shallow and non-monotonic; this is not a
  clean parabola with a visible minimum.
- **Solid:** the current RMSE setup is not maximally sensitive to a sliding-friction
  parameter, because it is cue-weighted and cutoff at 4 s.
- **Uncertain:** whether the jaggedness is mostly real shallow physics or largely
  NM basin noise on a weakly sensitive per-shot objective.
- **Uncertain:** whether 0.12096 would remain the best choice under adopted μw or
  under a muS-better metric.

---

## What would settle it

1. **Re-run the neighbourhood under a metric more sensitive to muS.**  
   For example, longer cutoff or less cue-weighted scoring, if the goal is to see
   whether muS moves the later sliding behaviour smoothly.

2. **Make the per-shot fit more robust than single-seed NM.**  
   If the jaggedness is largely basin noise, then multi-start or PSO-grade fits on the
   same candidates should smooth the window out, and 0.12096 should remain the best if
   the effect is real.

3. **Repeat under adopted μw if that is the eventual target.**  
   The current window is muS at μw = 0.175. If the adopted μw differs, the relevant
   comparison should be repeated there.

4. **Do not expand ±% forever on the same input.**  
   If the window stays jagged under a better metric / better optimisation, then the
   right conclusion may be that muS is weakly identified by this data and this objective,
   not that there is a precise optimum waiting to be found by denser sampling.

---

## Bottom line

`muS = 0.12096` is currently the best muS candidate from the fairer kinematic runs and
it reproduces. But the wider held-out window does **not** look like a smooth downward
slope; it looks like a shallow, jagged band with one low point. That pattern is a
methodology warning sign, not proof of a real optimum, and the most likely culprits are
NM basin sensitivity on a weakly muS-sensitive, cue-weighted 4 s RMSE.

The honest status is:
- the old “keep 0.126” conclusion is weakened;
- 0.12096 is the leading candidate;
- nothing here yet justifies adopting a specific muS change;
- the next step should target the measurement chain, not just add more ±% points.

