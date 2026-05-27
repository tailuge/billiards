# Stronge TypeScript vs Python comparison

## Scope

Compared files:

- `src/model/physics/stronge.ts`
- `conductor/stronge.py`
- `conductor/stronge_compliant.py`

I also checked `src/model/physics/cushion.ts`, `src/model/physics/physics.ts`,
and `test/model/physics/stronge.spec.ts` because the cushion feel depends on the
adapter path, not only the scalar Stronge solver.

## Can the Python source be executed for test data?

Not as-is in this workspace. The local Python environment is missing both
dependencies needed by the conductor files:

- `scipy` is required by `conductor/stronge_compliant.py`.
- `pooltool` is required by `conductor/stronge.py`.

The existing TypeScript tests already contain scalar and vector fixtures that
appear to have been generated from the Python formulas. Those tests are useful,
but I could not generate fresh Python fixtures in this environment.

## Parameter status

You confirmed that the TypeScript and Python parameters match in the visual
comparison, so I am not treating parameter mismatch as the explanation.

One useful consequence remains: the scalar normal component in both
implementations reduces to:

```text
v_n_f = -e_n * v_n_0
```

This follows from both implementations using `t_f = (1 + e_n) * t_c` and the
same restitution phase formula. Therefore, for a head-on cushion impact, the
normal rebound should be identical if the same `e_n` and incoming normal
velocity reach the solver. That points the remaining investigation toward subtle
tangential/regime differences or the state passed into the adapter.

## Scalar solver comparison

The core branching logic in `resolve()` matches
`resolve_collinear_compliant_frictional_inelastic_collision()` closely:

- Gross slip condition matches.
- Initial stick condition matches.
- Slip-stick-slip stick time formula matches.
- `eta_squared = (beta_t / beta_n) / omega_ratio**2` matches.
- `omega_n`, `omega_t`, `t_c`, `t_f`, and `t_c_shift` match.
- Normal final velocity matches, and simplifies to `-e_n * v_n_0`.
- Tangential final velocity formulas match in all three regimes.

I did not find a sign error in the scalar TypeScript port.

## Vector wrapper comparison

The TypeScript contact velocity formula:

```ts
V_c = v - omega x (R * n)
```

matches the Python call:

```python
surface_velocity(rvw, -normal_direction, R)
```

assuming pooltool's `surface_velocity` convention of `v + cross(w, R * d)`.
With `d = -normal_direction`, this is the same expression.

The tangent sign convention is different internally but equivalent:

- Python uses `decompose_normal_tangent(..., True)`, giving `v_t_0 <= 0` and a
  tangent direction opposite the raw tangential contact velocity.
- TypeScript computes a positive tangential magnitude, calls `resolve(-v_t0,
  v_n0, ...)`, then negates the returned tangential scalar.

The reconstructed impulse is algebraically equivalent:

```text
TS:     ((-v_tf_solver) - |v_t0|) * (+t_hat)
Python: (v_tf_solver - (-|v_t0|)) * (-t_hat)
```

These are the same vector.

## 3D tangent and z projection

A previous concern would be projecting tangential contact velocity into the XY
plane before normalizing. The comment in `stronge.ts` says that happens, but the
current code does not do it. The code includes the full 3D tangential contact
velocity in `v_t_mag` and `t_hat`, then only sets `v_new.z = 0` after applying
the delta.

That matches the Python wrapper's behavior: Python applies the full tangent
direction, then sets `rvw[1][2] = 0.0` afterwards with a `FIXME-3D` comment.

So I do not think the current TypeScript has a 3D tangent projection mismatch.
The misleading comment in `stronge.ts` should be corrected, but it is not itself
the lively-cushion bug.

## Most relevant remaining differences

These are real differences after excluding parameter mismatch.

### `np.isclose` vs fixed epsilon

Python uses `np.isclose()` at the initial-stick and gross-slip thresholds.
TypeScript uses `eps = 1e-9`.

Python's default tolerance is much looser than `1e-9`, so near regime boundaries
Python may snap to `t_c` or `t_f` while TypeScript still root-finds. This can
cause small discontinuities or near-threshold differences.

This is a plausible source of a subtle visual difference because the branch
boundary controls whether the solver treats the impact as initial stick,
slip-stick-slip, or gross slip. It is more likely to affect angled impacts with
spin than head-on impacts.

### Root finder

Python uses `scipy.optimize.toms748()`, a bracketed root finder. TypeScript uses
`fzero()`.

The formulas passed to the root finders match, but the algorithms and failure
behavior differ. TypeScript also clamps returned roots into range, while Python
asserts the expected range. Clamping can hide a bad numerical result.

If the "too lively" feel is not present on head-on impacts but appears on
spin/angle shots, this is one of the first places I would instrument.

### Clamping inverse cosine inputs

Python asserts the `acos()` inputs are in `[-1, 1]`. TypeScript clamps them.
This prevents crashes from tiny floating-point drift, but it can also mask a
logic or parameter mismatch near a regime boundary.

### Contact timing/state passed to the adapter

The Python wrapper is called at a collision state determined by pooltool. The
TypeScript adapter is called through `Cushion.bounceIn()` after rotating the
current `ball.vel` and `ball.rvel` into a canonical cushion frame.

If the TypeScript game resolves the impact slightly after the ball has crossed
the cushion boundary, or with a different pre-impact spin/velocity state, the
solver can be correct but receive livelier inputs. I did not find a direct bug in
`rotateApplyUnrotate()`, but this is worth checking with logging of `v`, `w`,
`V_c`, `v_n0`, and `v_t0` immediately before the solver in both implementations.

### Misleading 2D projection comment

`stronge.ts` says it projects `t_hat` onto the XY plane before use, but the
current code does not do that. The behavior is closer to Python than the comment
claims. This is not a runtime bug, but it can lead future debugging in the wrong
direction.

## Recommended next checks

1. Add a head-on regression test using the visually matched runtime constants,
   because
   that makes the normal rebound obvious: final speed should be exactly
   `e_n * incoming_normal_speed`.
2. Add near-threshold scalar fixtures around the two regime boundaries and
   compare Python `np.isclose()` behavior against TypeScript's `1e-9` checks.
3. Log the pre-solver state in both simulations for a shot that looks too lively:
   `v`, `w`, `V_c`, `v_n0`, `v_t0`, chosen regime, `t_stick`, `t_slip`,
   `v_nf`, and `v_tf`.
4. If Python dependencies are available elsewhere, generate a table of scalar
   reference cases from `conductor/stronge_compliant.py` over `v_t0/v_n0`
   values near the initial-stick and gross-slip thresholds.

## Bottom line

The ported scalar and vector math is largely consistent with the Python source.
With parameters confirmed aligned, the most suspicious remaining differences are
near-threshold regime selection (`np.isclose` vs `1e-9`), root-finder behavior,
and whether the two simulations pass identical pre-impact velocity/spin states
into the solver.
