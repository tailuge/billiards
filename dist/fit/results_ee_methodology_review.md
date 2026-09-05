# ee parameter-study methodology review

Date: 2026-09-05
Scope: review only — no code, physics, or constants changed. Question: why
does every ee probe conclude the hand-picked default (0.85) is optimal,
when that value was never tuned?

**Verdict: there is a systematic skew toward the current constants, and it
is large enough on the ee axis to manufacture the "current value is best"
result even when it is not.** It is not a scoring or physics bug; it is in
how candidate constants are measured against a base whose per-shot fits
were themselves optimised for the default.

---

## The core bias: asymmetric optimisation gap (anchor advantage)

Every sweep point seeds its pass 1 from the *stored per-shot fits in the
input* (`sweep-params.mjs` → `runPoint`: `passIn = inputPath`;
`fit-shots.mjs` → `seedShot` prefers `entry.shot`). Those stored fits were
globally optimised for the **current constants** over a long history of
PSO/NM passes and refinements. Consequences:

- **Base point:** its seed already (approximately) minimises the objective
  being measured. It only needs local polish.
- **Candidate point:** the *same* seed is evaluated at a different constant
  and must be re-optimised in a shifted landscape. Where per-shot NM fails
  to find the new basin, the ratchet (`if (!improved) shot = seed`) silently
  keeps the default-constant parameters, and the shot is scored at its
  **default-optimised parameters under the candidate constant**.

So every candidate measurement is an **upper bound** on its true optimum,
with a one-sided error: `measured(candidate) − measured(base) ≥ true(candidate)
− true(base)`. The base can never suffer this handicap — its stored fit was
made under the constants it is evaluated at. Direction of the bias: always
favours the current value.

### Evidence in the machine-readable outputs

- `corners/ee-fine-dev`: dev shot 8 at ee = 0.86275 is +11.89 cm vs base
  (base fit 4.66 cm → candidate ~16.5 cm; stored seed 15.85 cm). The shot
  was **never re-optimised** — frozen at the default-constant solution. The
  same shot adapts fine at ee = 0.8755 (−0.88). A ±1.5 % constant change
  cannot cost 12 cm of model error on one shot; that is basin-trapping, and
  it lands entirely on the candidate's side of the ledger.
- That point "converged" after 2 passes with a median improvement of
  0.005 cm (5.70 → 5.695) while other points adapted 0.3–0.8 cm over 3–5
  passes — declared done while most shots were still default fits.
- `corners/ee2-pilot`: id 92 (seed 56.69 cm) lands at 9.84 cm at ee = 0.86,
  12.67 at ee = 0.84, 16.76 at ee = 0.89 — a ±10 cm swing between
  neighbouring constant values from basin flips, while point medians differ
  by ±0.3 cm.

## Why the bias is invisible to the current reporting

1. **The ratchet never records that it fired.** Per-shot outputs carry no
   "optimised at this constant" vs "kept default fit" flag; the sweep
   aggregates `rmseAfterCm` either way. The analysis cannot distinguish
   "this constant is worse" from "this fit never adapted" — and it draws
   the first conclusion.
2. **The convergence gate watches only the median.** Passes stop when the
   panel median improves < 0.02 cm. Stuck shots in the tails (where basin
   problems live) never gate anything.
3. **Skewed metrics on 24 shots.** `Δmedian` (median of absolutes) and the
   per-shot win/loss sign test can disagree wildly: ee = 0.86275 is
   13W/11L yet Δmedian +0.92. With multi-cm outliers, which statistic
   "wins" is a coin toss, not physics.

## Why ee specifically never moves, while μw did

μw **did** move (0.20 → 0.17 → 0.16/0.175) because its signal (1.0–1.5 cm
median) is an order of magnitude above the bias. The ee/μs/rho signals
(±0.3–1 cm over ±3–5 %) are the same order as, or smaller than, the
one-sided adaptation gap — so the bias dominates and every probe reports a
bowl centred on the anchor:

- Scale check: in `ee-fine-dev`, per-point *within-run adaptation* during
  passes was 0.33–0.82 cm (base 5.60 → 4.78) while reported *between-point*
  deltas are 0.29–0.92 cm. The "bowl" and the convergence residuals are the
  same size.
- ee is the cushion parameter most absorbable by the per-shot fit vector:
  it scales rebound *speeds*, and `shot.power` sets the whole speed scale.
  μw changes rebound *directions* via friction/spin coupling, which per-shot
  power cannot hide — hence μw is identified and moved, ee is not.

Weak identification + anchor-seeded optimisation is precisely the recipe
for "the hand-picked value is always confirmed."

## What is not wrong (for fairness)

- The base is genuinely re-fitted through the same pass pipeline (no
  stored-RMSE reuse); candidates get the same or more passes.
- Held-out validation exists for winners; sign tests are properly paired.
- Some flat results (μs, rho) are physically plausible — weakly identified
  by construction — and are mostly phrased correctly already.
- But the same weak-identification logic is **not** applied to ee:
  "the data cannot move ee from its anchor" and "ee = 0.85 is optimal" are
  different claims; the current tables support only the first.

## What would settle it (methodology fixes)

1. **Multi-start candidates.** Seed each candidate point's per-shot fits
   from kinematic estimates plus random/PSO starts, not from the
   default-optimised stored fits. If the default still wins from identical
   starting conditions, the bowl is real.
2. **Report adaptation.** Per point, count shots where the fit actually
   improved vs "kept seed"; exclude or flag points with ~zero adaptation
   (like ee = 0.86275 above) instead of averaging them in.
3. **Fit ee jointly with μw** (the already-flagged (ee, μw) co-calibration
   box): μw↓ + ee↓ was the coherent reading in `results_new.md`, and
   single-axis probes at a fixed μw anchor cannot see a correlated valley.
4. **Widen the prior.** Every probe is ±3–5 % around the anchor; nothing
   searches the ee range. Test ±10–20 % with multi-start before claiming
   the anchor is the minimiser.
5. **Treat sub-0.5 cm median deltas on ≤ 24 shots as unmeasured**, not as
   evidence for the status quo (mirroring the μs conclusion).

**Bottom line:** the ee verdict is an artefact-prone measurement, not
proof. The protocol is structurally unable to prefer any non-default value
unless that value's advantage exceeds the default's free head start — and
the ee signal is smaller than that head start.
