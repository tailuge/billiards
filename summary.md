# TypeScript vs Python Stronge Implementation — Comparison Report

## Overview

The TypeScript `stronge.ts` is a port of the Python `stronge.py` wrapper around
`resolve_collinear_compliant_frictional_inelastic_collision` from pooltool's
`stronge_compliant.py`. The scalar solver logic is faithfully reproduced. The
differences below are the most likely sources of residual error.

---

## 1. Contact velocity formula (sign difference) — HIGH PRIORITY

**Python** (`surface_velocity` in `physics/utils.py`):
```python
# called with d = -normal_direction (i.e. d points INTO the cushion)
return v + cross(w, R * d)
```
So: `V_c = v + ω × (R · (-n̂)) = v - ω × (R · n̂)`

**TypeScript**:
```ts
const R_n̂ = n̂.clone().multiplyScalar(radius)
const ω_cross_R_n̂ = new Vector3().crossVectors(ω, R_n̂)
const V_c = v.clone().sub(ω_cross_R_n̂)  // v - ω × (R·n̂)
```

These are algebraically identical. ✓

---

## 2. Tangent direction decomposition — HIGH PRIORITY

**Python** (`decompose_normal_tangent` with `flip_tangent_direction=True`):
```python
v_n = dot(n, v)
n_cross_v = cross(n, v)
v_t = norm(n_cross_v)
v_t = -v_t                          # flipped
t = cross(n_cross_v, n) / v_t       # note: divided by the already-negated v_t
```

With the flip, `v_t` is negative (since `norm >= 0` then negated), and `t` is
`cross(n_cross_v, n) / v_t` where `v_t < 0`, so `t` points **opposite** to
`cross(n_cross_v, n)`.

**TypeScript**:
```ts
const v_n0 = n̂.dot(V_c)
const V_c_tangential = V_c - (V_c·n̂)n̂
V_c_tangential.z = 0                // ← Z zeroed before normalising
const v_t_mag = V_c_tangential.length()
const t̂ = V_c_tangential.normalize()
const v_t0 = v_t_mag               // always >= 0
```

**Difference**: The Python `v_t_0` passed to the solver is **negative** (it is
`-|v_t|` due to the flip). The TypeScript negates before calling the solver
(`resolve(-v_t0, ...)`) to compensate, which is correct in intent. However the
Python `t` direction is derived from the **full 3D** `V_c` (including Z), while
TypeScript zeros Z on `V_c_tangential` **before** computing `t̂`. This means the
two tangent unit vectors can differ when `ω_y` is non-zero (ω_y contributes a Z
component to `V_c`). The Z-zeroing is a deliberate 2D projection, but it changes
the direction of `t̂` relative to Python's `t`, which will affect where the
velocity delta is applied.

---

## 3. Angular velocity update — HIGH PRIORITY

**Python**:
```python
rvw[2] += (2.5 / ball.params.R) * cross(-normal_direction, Dv_t * tangent_direction)
```
The factor is `2.5 / R = 5/2 / R`.

**TypeScript**:
```ts
const inertiaFactor = (mass * radius) / inertia
// inertia = (2/5) * m * R^2
// => (m * R) / ((2/5) * m * R^2) = (1/R) * (5/2) = 2.5 / R
const ω_new = ω.clone().addScaledVector(torque_dir, inertiaFactor)
```

Numerically identical. ✓

However, `torque_dir = cross(-n̂, Δv_t · t̂)` in TypeScript vs
`cross(-normal_direction, Dv_t * tangent_direction)` in Python. These are the
same operation, but `t̂` in TypeScript has had its Z zeroed (see point 2), so
the torque direction will differ from Python when there is Z spin.

---

## 4. Case 2 (initial stick): `v_t_f` formula uses `v_t0` not `v_t0/v_n0`

**Python** (`slip_time_for_initial_stick`):
```python
def f(t):
    return abs(-v_t_0_by_v_n_0 * sin(omega_t * t)) - (
        mu * eta_squared * omega_t / omega_n * sin(phi_rest(t))
    )
```
The root-finding function uses `v_t_0_by_v_n_0 = v_t_0 / v_n_0`.

**TypeScript** (`findRootInitialStick`):
```ts
const v_ratio = v_t0 / v_n0
const f = (t) => {
    return abs(-v_ratio * sin(omega_t * t)) - mu * eta_squared * (omega_t / omega_n) * sin(phi_rest(t))
}
```
Identical. ✓

**Python** post-slip `v_t_f` (Case 2):
```python
v_t_stick_to_slip = v_t_stick(t_slip, omega_t, v_t_0)
# v_t_stick(t, omega_t, v_t_0) = omega_t * 0 * sin(...) + v_t_0 * cos(omega_t * t)
#                               = v_t_0 * cos(omega_t * t_slip)
v_t_f = v_t_stick_to_slip + mu * v_n_0 * beta_t_by_beta_n * e_n * (1 + cos(...))
```

**TypeScript** (Case 2):
```ts
const v_tf =
    v_t0 * Math.cos(omega_t * t_slip) +
    μ * v_n0 * beta_ratio * e_n * (1 + Math.cos(...))
```
Identical. ✓

---

## 5. Root-finding algorithm: `fzero` vs `scipy.optimize.toms748` — MEDIUM PRIORITY

**Python** uses `scipy.optimize.toms748`, a robust bracketed root-finder with
guaranteed superlinear convergence.

**TypeScript** uses `fzero` (a JS port of MATLAB's `fzero`), with `maxiter: 50`.
The two algorithms can converge to slightly different roots, especially when the
function is nearly flat near the root. This is unlikely to cause large errors but
could contribute small numerical differences.

Additionally, the Python `slip_time_for_initial_stick` asserts
`t_c <= t_slip <= t_f` after finding the root. The TypeScript has no such clamp,
so an out-of-bracket solution from `fzero` would silently propagate.

---

## 6. Case 2 (initial stick): `v_t_f` sign after negation round-trip — MEDIUM PRIORITY

The TypeScript negates `v_t0` before calling `resolve` and negates the result
back:
```ts
const [v_tf_solver, v_nf] = resolve(-v_t0, v_n0, params)
const v_tf = -v_tf_solver
```

Inside `resolve`, Case 2 computes:
```ts
const v_tf = v_t0 * cos(omega_t * t_slip) + μ * v_n0 * beta_ratio * e_n * (1 + cos(...))
```
Here `v_t0` is already the negated value (`-original_v_t0`). The result is then
negated again by the caller. This double-negation is correct **only if** the
formula is linear in `v_t0`. It is — the formula is `A * v_t0 + B` where B does
not depend on `v_t0`, so negating input and output is equivalent to the Python
path. ✓

---

## 7. `eta_squared` passed differently — LOW PRIORITY

**Python** computes `eta_squared` in the wrapper and passes it directly:
```python
eta_squared=(beta_t_by_beta_n / omega_ratio**2)
```

**TypeScript** passes `omega_ratio` and recomputes inside `resolve`:
```ts
const eta_squared = beta_ratio / (omega_ratio * omega_ratio)
```
Identical formula. ✓

---

## 8. `omega_t` range assertion missing in TypeScript — LOW PRIORITY

Python asserts:
```python
assert 1 < omega_t / omega_n and omega_t / omega_n < 2
```

TypeScript has no such guard. With the new constants (`omega_ratio = 1.847`),
`omega_t / omega_n = omega_ratio = 1.847`, which is in range. But if constants
are changed this could silently produce nonsense results.

---

## Summary Table

| # | Area | Severity | Match? |
|---|------|----------|--------|
| 2 | Z-zeroing of `V_c_tangential` before computing `t̂` changes tangent direction vs Python | High | ✗ Differs |
| 3 | Angular update uses Z-zeroed `t̂`, so torque direction differs from Python when ω_y ≠ 0 | High | ✗ Differs |
| 5 | `fzero` vs `toms748` — different root-finding accuracy, no bracket assertion | Medium | ✗ Differs |
| 1 | Contact velocity formula | — | ✓ Same |
| 4 | Case 2 `v_t_f` formula | — | ✓ Same |
| 6 | Negation round-trip for `v_t0` | — | ✓ Same |
| 7 | `eta_squared` computation | — | ✓ Same |
| 8 | Missing `omega_t/omega_n` range guard | Low | ✗ Missing |

---

## Most Likely Source of Residual Error

The Z-zeroing in step 2 is the most structurally significant difference. Python's
`decompose_normal_tangent` computes the tangent direction from the full 3D contact
velocity (including any Z component from `ω_y` spin), while TypeScript zeros Z
before normalising. This means:

- `t̂` points in a slightly different direction in 3D space.
- `Δv_t · t̂` is applied in a different direction to both `v` and `ω`.
- The angular update `cross(-n̂, Δv_t · t̂)` produces a different torque vector.

For shots with significant side-spin (`ω_y ≠ 0`), this will produce a
measurable difference in the post-bounce spin state. For pure top/back-spin
(`ω_y = 0`) the Z component of `V_c` is zero and the two implementations agree
exactly.

The comment in the TypeScript says "The Stronge model is 2D so this projection is
correct" — but Python does **not** project to 2D before decomposing; it uses the
full 3D contact velocity and only zeros `rvw[1][2]` (the ball's linear Z velocity)
**after** the update, with a `FIXME-3D` comment. The TypeScript projection is
therefore more aggressive than what Python does.
