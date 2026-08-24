# μs parameter study — results

Date: 2026-08-24
Question: is the system Mathavan table-coefficient constant `μs` (default
`0.2`) optimal for fitting the recorded trajectory data, with cushion
friction held at the adopted `μw = 0.18`?

**Verdict: keep `μs = 0.2`** — no change to system defaults.
The surface is flat-to-worse across −15 %…+15 %: in the clean-10 pilot
*every* tested point is worse than the freshly-fitted pinned centre
(Δmedian +0.04 … +0.15 cm); on all 12 the best point is noise-level
(+15 %, Δ −0.02, sign-p 0.77). Since no candidate improved anywhere,
per protocol there was nothing to validate out-of-sample. This matches the
earlier ±5 % corner checks (no signal).

---

## Methodology

Identical protocol to `results_μw.md` / `results_rho.md` / `results_muS.md`:
repeated NM passes per point until aggregate median improves < 0.02 cm
(max 6), median aggregation, sign tests vs a **freshly-fitted centre**, all
points under **`--pin muw=0.18`**.

Data sets as before: pilot = 12 shots (`sweep.json`, RMSE ∈ (9,10) cm),
clean-10 excludes regime-flippers 32/92.

Grid: `μs` = 0.17, 0.18, 0.19, 0.21, 0.22, 0.23
(same absolute grid as the μw study; shared default 0.2).

## Results

### Pilot profile over μs

Δmedian RMSE (cm) vs freshly-fitted centre (μw=0.18, μs=0.2):

| μs | vs default | all 12 | clean 10 |
|---|---|---|---|
| 0.17 | −15 % | +0.05 | +0.13 |
| 0.18 | −10 % | +0.10 | +0.13 |
| 0.19 | −5 % | +0.02 | +0.15 |
| 0.20 (base) | 0 | 0 | 0 |
| 0.21 | +5 % | +0.03 | +0.09 |
| 0.22 | +10 % | +0.06 | +0.04 |
| 0.23 | +15 % | **−0.02** | +0.10 |

The only sub-zero entry (0.23 on all-12) comes entirely from flipper id 92
(−3.1 cm) and reverses to +0.10 without it; it also loses 7/12 shots overall
— pure noise. On clean-10 the ordering is essentially random around a common
level ~+0.1 above base: the classic signature of an unidentified parameter
(compare rho's profile).

### Held-out

Not run: the pre-registered rule validates only candidates that improve in
the pilot, and none did in either subset.

## Interpretation

μs enters the Mathavan cushion model alongside μw (cushion coefficient);
with μw fixed at 0.18 the data carry almost no information about μs within
±15 %. Three of four cushion-model constants now checked (rho, μs, ee below)
show the default at or arbitrarily near the minimum; only μw yielded a real,
replicating gain.

## Caveats

- Resolution ±5 %; sub-0.05 cm effects invisible.
- Only μs varied under pinned μw=0.18; joint (μw × μs) interaction not mapped.
- Flipper ids dominate tails as usual.

## Reproducing

From the repo root (note: quote `--param` args, `|` is a shell pipe):

```sh
# 1. Pilot profile, all 12 shots (~2 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'mus=0.17|0.18|0.19|0.21|0.22|0.23' \
    --out-dir dist/fit/corners/mus-all12

# 2. Pilot profile, clean 10 (~1.5 min)
node dist/fit/sweep-params.mjs --pin muw=0.18 \
    --param 'mus=0.17|0.18|0.19|0.21|0.22|0.23' \
    --ids 24,56,62,84,94,105,114,128,166,172 \
    --out-dir dist/fit/corners/mus-clean10
```

Machine-readable outputs:
`dist/fit/corners/{mus-all12,mus-clean10}/sweep-results.json`.
