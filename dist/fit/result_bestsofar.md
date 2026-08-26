# Best-so-far constants — state of play

Date: 2026-08-26
Question: what is the best validated physics-constants configuration, and
what is worth testing next?

**Current champion: `muw = 0.17`, `ee = 0.865`, everything else default**
(med 12.27 cm on held-out-no25 vs 14.10 pure defaults, −1.83 cm,
39W/20L, sign-p 0.018).

---

## Findings to date

### 1. The "URL proposal" is dead (`corners/adopt-heldout`, `adopt-easy8`)

Candidate from a web-app URL (`muS=0.0739, muw=0.1702, ee=0.8856`,
everything else default) lost everywhere it was tested through the fair
fresh-fit pipeline:

| set | base med | candidate med | Δmedian |
|---|---|---|---|
| heldout.json (60) | 14.14 | 15.43 | +1.29 |
| easy8.json (8) | 5.32 | 11.27 | +5.95 |

Damage concentrated in long-roll shots (ids 148 +49, 127 +41, 109/169 +28)
— consistent with `muS=0.0739` breaking the sliding phase. **Keep
`muS = 0.126`.**

### 2. μw = 0.17 stands (`results_μw.md`, untouched)

Today's experiments never varied μw against a fixed reference; where it
appeared it was pinned at 0.1702 on *both* sides (pilot) or left at the
0.20 default on both sides (held-out ee runs). Nothing contradicts the
v2 study.

### 3. There is an ee × muw interaction (`corners/adopt-heldout{2,3,4}`)

Held-out profile of ee at two μw levels:

| config | med (cm) | Δmed vs own base | sign-p |
|---|---|---|---|
| muw=0.20 base | 14.14 | — | |
| muw=0.20 + ee=0.855 | 13.86 | −0.28 | **0.0027**, 42W/18L, no flips |
| muw=0.20 + ee=0.865 | 13.71 | −0.43 | 0.018, 39W/1T/20L |
| muw=0.20 + ee=0.875 | 13.17 | −0.97* | 0.093; rides id-25 flipper blowup (+33) — reject |
| muw=0.17 base | 12.64 | — | prior study |
| **muw=0.17 + ee=0.865** | **12.27** | −0.37 vs muw=0.17 alone | 0.018 vs pure defaults |

Key observations:

- At muw=0.20 the clean winner was ee=0.855; at muw=0.17 only ee=0.865
  helps and ee=0.855 does nothing (13.51, p 0.60). The ee optimum shifts
  with μw — co-calibration, as suspected in `results_ee.md`.
- Head-to-head vs muw=0.17 alone: 33W/26L, median per-shot delta −0.13 cm.
  The ee bonus on top of the adopted μw is real-ish but thin (−0.1…−0.4 cm).
- id 168 (+17) under muw=0.17 is the already-documented μw loser, not an
  ee effect.

## Champion config

```json
{ "mu": 0.0055, "muS": 0.126, "rho": 0.045, "m": 0.23, "R": 0.03275,
  "ee": 0.865, "μs": 0.2, "μw": 0.17, "stronge_omega_ratio": 1.76,
  "stronge_e_n": 0.77, "stronge_μ": 0.25 }
```

Expected gain vs system defaults: ≈ −1.8 cm median (~13 %) on unseen shots.

Machine-readable evidence: `corners/adopt-heldout4/sweep-results.json`
(plus `adopt-heldout{,2,3}`, `adopt-easy8`, `adopt-pilot`).

### 4. muS × ee grid around the champion (`corners/adopt-pilot2`)

4×3 grid — `muS ∈ {0.0739, 0.09, 0.107, 0.126}` × `ee ∈ {0.845, 0.865,
0.885}` — all at `muw = 0.17`, pilot panel, referenced against the
champion cell (fresh-fit med 7.69 cm):

| Δmedian vs champion | ee=0.845 | ee=0.865 | ee=0.885 |
|---|---|---|---|
| **muS=0.126** | +0.14 | **0 (champion)** | +0.29 |
| muS=0.107 | +0.41 | +0.01 | +0.39 |
| muS=0.09 | +0.68 | +0.74 | +1.63 |
| muS=0.0739 | +2.13 | +1.86 | +2.54 |

**Dropping muS is refuted.** The surface rises monotonically as muS falls;
the eyeball appeal of low muS does not survive contact with the fits.
Nothing beats the champion; its immediate neighbours are ties within the
±0.1 cm noise floor, so the champion sits on a small plateau
(muS ≈ 0.11–0.13, ee ≈ 0.85–0.87) rather than a knife edge. No held-out
run warranted (nothing to validate).

## Next lines of attack (in order)

1. **Re-profile `rho` under the champion** (`Mz ∝ mu·rho` makes rho
   meaningless without mu; never tested away from default constants) —
   single-axis profile 0.0375–0.0525, pilot then held-out vs champion.
2. **Re-profile `μs` under the champion** — its flatness conclusion
   (`results_μs.md`) predates angle-inclusive fits *and* predates the
   ee/muw moves; the muS×ee interaction found above shows these stale
   conclusions can hide shifts.
3. **First-ever sweep of the Stronge trio** (`stronge_e_n`,
   `stronge_omega_ratio`, `stronge_μ`) — untouched by every study so far;
   even a coarse 2-value box would say whether they matter at all under
   current constants.
4. **Triage flippers** (id 168 next after 25): they cap how much signal
   the panels can resolve (`flippers.html`). id 32/92/114 all showed
   regime flips again in adopt-pilot2.
