# Stronge Compliant Cushion Model: TypeScript Porting Specification

This document is a clean-room specification for porting the Stronge compliant collision
model from pooltool (Python) to TypeScript. All necessary logic is defined below.

**Source paper**:
> W. J. Stronge, *Impact Mechanics*, Cambridge University Press, 2018, pp. 89–115.
> DOI: [10.1017/9781139050227](https://doi.org/10.1017/9781139050227)

---

## 1. Overview

The model resolves a ball-cushion collision analytically in a 2D normal/tangent scalar
space. It handles three slip regimes (gross slip, slip→stick→slip, stick→slip) and
requires a root-finder only for the stick→slip transition time.

The entry point mirrors the existing `mathavanAdapter` pattern: receive `v` and `w` in
world space, return `{ v: Δv, w: Δw }` deltas.

---

## 2. Physics Parameters

| Symbol | Description | Typical value |
|:---|:---|:---|
| `e_n` | Normal coefficient of restitution | 0.5 – 0.9 |
| `μ` | Friction coefficient | 0.1 – 0.2 |
| `omega_ratio` | Frequency ratio ω_t/ω_n, must be in **(1, 2)** | 1.7 |
| `β_n` | Normal mass-matrix coefficient (sphere/half-space) | 1.0 |
| `β_t` | Tangential mass-matrix coefficient (sphere/half-space) | 3.5 |
| `k_n` | Normal spring stiffness (arbitrary; only ratio matters) | 1e3 |
| `m` | Ball mass | ball-dependent |
| `R` | Ball radius | ball-dependent |

`eta_squared` is derived from `omega_ratio`:

```
beta_ratio = β_t / β_n          // = 3.5
eta_squared = beta_ratio / omega_ratio²
```

---

## 3. Coordinate Setup

The solver works in a **2D scalar space** defined by:

- **Normal direction** `n̂`: unit vector pointing *from the cushion into the ball*
  (i.e. in the direction of ball travel toward the cushion). In the Python code this is
  `cushion.get_normal_3d(ball.xyz)`, flipped if `dot(normal, v) <= 0`.
- **Tangent direction** `t̂`: derived from the contact velocity (see §4).

**Contact velocity** at the ball-cushion contact point:

```
V_c = v + (w × (R * (-n̂)))     // surface_velocity with d = -n̂
    = v - (w × (R * n̂))
```

Decompose `V_c` into scalar components:

```
v_n_0 = dot(n̂, V_c)            // must be < 0 (ball approaching cushion)
n_cross_Vc = cross(n̂, V_c)
v_t_0 = -‖n_cross_Vc‖          // negated so v_t_0 ≤ 0 (convention used by solver)
t̂ = cross(n_cross_Vc, n̂) / ‖n_cross_Vc‖   // unit tangent direction
    (t̂ = zero vector if v_t_0 == 0)
```

> **Why `v_t_0 ≤ 0`?** The solver's friction term `−μ · v_n_0 · β_ratio · (1 + e_n)`
> is positive (since `v_n_0 < 0`), so the convention is that positive tangential
> impulse opposes negative `v_t_0`. The Python code enforces `assert v_t_0 <= 0`.

---

## 4. Scalar Solver

### 4.1 Derived quantities

```
omega_n = sqrt(β_n * k_n / m)
omega_t = omega_n * sqrt(beta_ratio / eta_squared)
// assert 1 < omega_t/omega_n < 2

t_c = π / (2 * omega_n)                    // compression duration
t_f = (1 + e_n) * t_c                      // total collision duration

beta_ratio = β_t / β_n
v_ratio    = v_t_0 / v_n_0                 // >= 0 because both <= 0
```

### 4.2 Phase angle (restitution phase only, used for t > t_c)

```
phi_rest(t) = omega_n * t / e_n + (π/2) * (1 - 1/e_n)
```

### 4.3 Regime classification

Three mutually exclusive regimes, tested in order:

**Gross slip** (ball slides throughout):
```
v_ratio > μ * ((1 + e_n) * beta_ratio - eta_squared / e_n)
```

**Initial stick** (ball sticks immediately at t=0):
```
v_ratio < μ * eta_squared
```

**Slip→stick→slip** (intermediate): neither of the above.

### 4.4 Case 1 — Gross slip

```
v_t_f = v_t_0 - μ * v_n_0 * beta_ratio * (1 + e_n)
```

### 4.5 Case 2 — Initial stick (stick→slip)

Find `t_slip` in `[t_c, t_f]` using a bracketed root-finder (Brent's method) on:

```
f(t) = |−v_ratio * sin(omega_t * t)|
       − μ * eta_squared * (omega_t/omega_n) * sin(phi_rest(t))
```

Special cases (no root-finder needed):
- `v_ratio ≈ 0` → `t_slip = t_f`
- `v_ratio ≈ μ * eta_squared` → `t_slip = t_c`

Then:
```
v_t_stick_at_slip = v_t_0 * cos(omega_t * t_slip)   // v_t_stick(t, omega_t, v_t_0)
v_t_f = v_t_stick_at_slip
        + μ * v_n_0 * beta_ratio * e_n
          * (1 + cos(omega_n * t_slip / e_n + t_c_shift))
```
where `t_c_shift = (π/2) * (1 - 1/e_n)`.

### 4.6 Case 3 — Slip→stick→slip

**Step A**: Find `t_stick` analytically.

```
x = (v_ratio/μ - beta_ratio) / (eta_squared - beta_ratio)
```
If `v_ratio ≤ μ * beta_ratio` (stick during compression):
```
t_stick = t_c * (2/π) * acos(x)          // result in [0, t_c]
```
If `v_ratio > μ * beta_ratio` (stick during restitution):
```
x = (v_ratio/μ - beta_ratio) / (eta_squared/e_n - e_n * beta_ratio)
t_stick = t_c * (2/π) * (acos(x) - t_c_shift) * e_n   // result in [t_c, t_f]
```

**Step B**: Evaluate state at `t_stick`.

```
// u_t is the tangential spring deformation (integral of v_t)
// During initial slip phase:
u_t_at_stick =
  if t_stick <= t_c:
    -μ * v_n_0 * eta_squared / omega_n * sin(omega_n * t_stick)
  else:
    -μ * v_n_0 * eta_squared / omega_n * sin(phi_rest(t_stick))

v_t_at_stick =
  if t_stick <= t_c:
    v_t_0 - μ * beta_ratio * v_n_0 * (1 - cos(omega_n * t_stick))
  else:
    v_t_0 - μ * beta_ratio * v_n_0 * (1 - e_n * cos(phi_rest(t_stick)))
```

**Step C**: Find `t_slip` in `[t_c, t_f]` using a bracketed root-finder on:

```
f(t) = |omega_n / (μ * v_n_0)
         * (u_t_at_stick * cos(omega_t*(t - t_stick))
            - v_t_at_stick/omega_t * sin(omega_t*(t - t_stick)))|
       − eta_squared * sin(phi_rest(t))
```

Special cases:
- `v_ratio ≈ μ * eta_squared` → `t_slip = t_c`
- `v_ratio ≈ μ * ((1+e_n)*beta_ratio - eta_squared/e_n)` → `t_slip = t_f`

**Step D**: Final tangential velocity.

```
v_t_stick_to_slip =
    omega_t * u_t_at_stick * sin(omega_t*(t_slip - t_stick))
    + v_t_at_stick * cos(omega_t*(t_slip - t_stick))

v_t_f = v_t_stick_to_slip
        + beta_ratio * μ * v_n_0 * e_n
          * (1 + cos(phi_rest(t_slip)))
```

### 4.7 Normal final velocity (all cases)

```
v_n_f = e_n * v_n_0 * cos(phi_rest(t_f))
```

Since `phi_rest(t_f) = π/2 * (1 + 1/e_n) * e_n / e_n ... ` simplifies to `π/2`:
```
v_n_f = e_n * v_n_0 * cos(π/2) = 0   // always zero at t_f
```
Wait — that's only true for the specific `t_f`. In practice just compute:
```
v_n_f = e_n * v_n_0 * cos(phi_rest(t_f))
```

---

## 5. Reconstructing `v` and `w` from Scalar Results

After the solver returns `(v_t_f, v_n_f)`:

```
Δv_n = (v_n_f - v_n_0) / β_n
Δv_t = (v_t_f - v_t_0) / β_t

v_new = v + Δv_n * n̂ + Δv_t * t̂
w_new = w + (2.5 / R) * cross(-n̂, Δv_t * t̂)
```

The factor `2.5/R = (5/2)/R` comes from the sphere moment of inertia: `I = (2/5)mR²`,
so `Δw = cross(r_contact, F/m) / (I/m) = cross(-R*n̂, Δv_t*t̂) * (1/R²) * (5/2R²... )`
which reduces to `(2.5/R) * cross(-n̂, Δv_t * t̂)`.

---

## 6. Adapter Function

The existing `mathavanAdapter` uses `rotateApplyUnrotate` to handle the Mathavan
convention (ball travels in +y). The Stronge solver works directly in world-space
normal/tangent coordinates, so **no rotation is needed**. The adapter is simpler:

```typescript
export function strongeAdapter(
  v: Vector3,
  w: Vector3,
  n: Vector3,          // unit cushion normal pointing toward ball
  params: { m: number; R: number; e_n: number; mu: number; omega_ratio: number }
): { v: Vector3; w: Vector3 } {
  // 1. Contact velocity at cushion contact point
  const V_c = v.clone().sub(new Vector3().crossVectors(w, n.clone().multiplyScalar(params.R)))

  // 2. Decompose into normal/tangent scalars
  const v_n_0 = n.dot(V_c)                          // < 0
  const nCrossVc = new Vector3().crossVectors(n, V_c)
  const v_t_mag = nCrossVc.length()
  const v_t_0 = -v_t_mag                            // <= 0
  const t_hat = v_t_mag > 0
    ? new Vector3().crossVectors(nCrossVc, n).divideScalar(v_t_mag)
    : new Vector3()

  // 3. Scalar solve
  const [v_t_f, v_n_f] = resolveStronge(v_t_0, v_n_0, params)

  // 4. Reconstruct velocity deltas
  const beta_n = 1.0, beta_t = 3.5
  const dv_n = (v_n_f - v_n_0) / beta_n
  const dv_t = (v_t_f - v_t_0) / beta_t

  const v_new = v.clone()
    .addScaledVector(n, dv_n)
    .addScaledVector(t_hat, dv_t)

  const w_new = w.clone()
    .addScaledVector(
      new Vector3().crossVectors(n.clone().negate(), t_hat.clone().multiplyScalar(dv_t)),
      2.5 / params.R
    )

  return { v: v_new.sub(v), w: w_new.sub(w) }
}
```

> **Note**: The return value is `{ v: Δv, w: Δw }` (deltas), matching the
> `cartesionToBallCentric` convention used by the existing Mathavan adapter.

---

## 7. Root-Finder

The Python code uses `scipy.optimize.toms748` (a bracketed root-finder). In TypeScript,
implement Brent's method or use a library. The function is always called with a valid
bracket `[t_c, t_f]` (or `[t_stick, t_f]` for case 3 step C) where a sign change is
guaranteed by the physics.

A minimal Brent's method implementation needs ~30 lines. Alternatively, `brent` from
`@stdlib/math-base-tools-brent` or a similar package works.

---

## 8. Validation Test Cases

All cases use `β_n=1.0`, `β_t=3.5`, `k_n=1e3`, `omega_ratio=1.7`.

| Case | `v_n_0` | `v_t_0` | `e_n` | `μ` | Expected regime |
|:---|:---|:---|:---|:---|:---|
| Head-on, no spin | -1.0 | 0.0 | 0.7 | 0.2 | Initial stick (v_ratio=0) |
| High side-spin | -1.0 | -3.0 | 0.7 | 0.2 | Gross slip |
| Moderate side-spin | -1.0 | -0.5 | 0.7 | 0.2 | Slip→stick→slip |

For the head-on case: `v_n_f = e_n * v_n_0 * cos(phi_rest(t_f))`, `v_t_f ≈ 0`.

Cross-check by running the Python solver directly:
```python
from pooltool.physics.resolve.stronge_compliant import (
    resolve_collinear_compliant_frictional_inelastic_collision
)
v_t_f, v_n_f = resolve_collinear_compliant_frictional_inelastic_collision(
    v_t_0=-0.5, v_n_0=-1.0, m=0.17, beta_t=3.5, beta_n=1.0,
    mu=0.2, e_n=0.7, k_n=1e3,
    eta_squared=3.5 / 1.7**2
)
```

---

## 9. Implementation Checklist

- [ ] `assert 1 < omega_t/omega_n < 2` before solving
- [ ] `assert v_n_0 < 0` and `assert v_t_0 <= 0` at solver entry
- [ ] Root-finder bracket is `[t_c, t_f]`; verify sign change before calling
- [ ] `v_n_f` computed from `v_n_restitution(t_f, ...)`, not hardcoded to zero
- [ ] `w` update uses `cross(-n̂, dv_t * t̂)` scaled by `2.5/R`
- [ ] No rotation needed (unlike Mathavan adapter)

---

## 10. Outstanding Concerns Before Implementation

### 10.1 Call-site integration — `n̂` is not available in the current adapter signature

`Cushion.bounceIn` calls all cushion models as `cushionModel(v, w)` via `rotateApplyUnrotate`. The four cushion normals are encoded as rotation angles:

| Cushion | `dir` | Implied `n̂` (world space) |
|:---|:---|:---|
| Short (+x) | `0` | `(-1, 0, 0)` |
| Short (−x) | `π` | `(+1, 0, 0)` |
| Long (+y) | `−π/2` | `(0, -1, 0)` |
| Long (−y) | `+π/2` | `(0, +1, 0)` |

`rotateApplyUnrotate` rotates `v` and `w` so the ball always travels in +x before calling the model, then un-rotates the delta. The Stronge adapter works in world-space normal/tangent coordinates and derives `n̂` from the geometry — so it does not fit the `(v, w)` signature and cannot be dropped in as-is.

**Two options:**

**A. Derive `n̂` inside the adapter from `v`** — since after rotation the ball always travels in +x, `n̂ = (-1, 0, 0)` is a constant. This works but defeats the purpose of a world-space solver and still requires the rotation.

**B. Change the call site** — pass `n̂` explicitly to `bounceIn` and bypass `rotateApplyUnrotate` entirely for world-space models. This is the cleaner approach and would allow `strongeAdapter(v, w, n)` to be called directly:

```typescript
private static bounceIn(ball, cushionModel, n?: Vector3) {
  ball.ballmesh.trace.forceTrace(ball.futurePos)
  const delta = n
    ? cushionModel(ball.vel, ball.rvel, n)          // world-space model (Stronge)
    : rotateApplyUnrotate(rotation, ball.vel, ball.rvel, cushionModel)  // legacy
  ball.vel.add(delta.v)
  ball.rvel.add(delta.w)
  return delta.v.length()
}
```

The four `n̂` vectors are fixed constants for a rectangular table and can be computed directly from `futurePosition` without any trigonometry. This is the recommended path — it removes the rotation entirely for the Stronge model and makes the normal explicit.

### 10.2 `v_n_f` is always zero

`phi_rest(t_f)` always evaluates to `π/2`, so `v_n_f = e_n * v_n_0 * cos(π/2) = 0` in every case. The spec should state this explicitly: `Δv_n = -v_n_0 / β_n`. The "just compute it anyway" note is misleading — it will always be zero and computing it obscures that fact.

### 10.3 `Δv_n` / `Δv_t` reconstruction — verify against Python source

The formulas `Δv_n = (v_n_f - v_n_0) / β_n` and `Δv_t = (v_t_f - v_t_0) / β_t` need to be cross-checked against the Python `pooltool` source. It is not obvious why the mass-matrix coefficients divide (rather than multiply) the velocity change. With `β_n = 1.0` the normal term is trivially `Δv_n = -v_n_0`, but the tangential term with `β_t = 3.5` will significantly attenuate the spin transfer if the formula is wrong.

### 10.4 `w` update — use `I` from `constants.ts` rather than hardcoding `2.5/R`

The spec hardcodes `2.5/R` for the angular velocity update. The existing codebase derives this from `I = (2/5)mR²` in `constants.ts`. Use `(m * R) / I` (which equals `2.5/R` for a uniform sphere) so the update respects any future changes to `m` or `R` via the existing setters.

### 10.5 `t_c_shift` defined after first use in §4.5

`t_c_shift = (π/2) * (1 - 1/e_n)` is used in the Case 2 formula but only defined in a trailing note. It should be promoted to §4.1 alongside the other derived quantities.

### 10.6 Case 3 Step A — restitution-phase `t_stick` formula needs verification

```
t_stick = t_c * (2/π) * (acos(x) - t_c_shift) * e_n
```

`t_c_shift` is an angle (radians), so subtracting it from `acos(x)` (also radians) is dimensionally consistent, but the overall expression needs to be verified against the Python source. The compression-phase branch `t_stick = t_c * (2/π) * acos(x)` is straightforward; the restitution-phase branch is not.

### 10.7 Test cases lack expected output values

§8 identifies the expected *regime* for each test case but gives no expected values for `v_t_f` or `v_n_f`. Without these, the tests can only verify that the solver runs without error and selects the correct branch — not that the physics is correct. Run the Python solver to obtain reference values:

```python
from pooltool.physics.resolve.stronge_compliant import (
    resolve_collinear_compliant_frictional_inelastic_collision
)
# head-on
v_t_f, v_n_f = resolve_collinear_compliant_frictional_inelastic_collision(
    v_t_0=0.0, v_n_0=-1.0, m=0.23, beta_t=3.5, beta_n=1.0,
    mu=0.2, e_n=0.7, k_n=1e3, eta_squared=3.5/1.7**2
)
# high side-spin
# moderate side-spin
```

Add the resulting `(v_t_f, v_n_f)` pairs as `approximately` assertions in the Jest tests.

### 10.8 New constants need a home in `constants.ts`

`omega_ratio`, `e_n` (cushion restitution for Stronge, distinct from the existing `ee`), and the Stronge friction coefficient should be added to `constants.ts` alongside `ee`, `μs`, `μw` with corresponding setters, so they can be tuned via the existing diagram/tweak infrastructure.

### 10.9 Root-finder error handling

The spec says the bracket sign change is "guaranteed by the physics" but gives no fallback. The existing Mathavan solver throws `new Error("Solution not found")` after exceeding iteration count. The Brent implementation should do the same, and the bracket sign-change should be asserted before entering the solver (not silently assumed).

### 10.10 Export and wiring

Decide whether `strongeAdapter` lives in `physics.ts` alongside `mathavanAdapter`, or in its own file (e.g. `stronge.ts`). It also needs to be wired into `browsercontainer.ts` where the cushion model is selected by name string, so users can switch to it via URL parameter.
