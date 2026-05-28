import { Vector3 } from "three"
import { bisectionSolver } from "../../utils/utils"
import {
  m,
  R,
  I,
  stronge_e_n,
  stronge_μ,
  stronge_omega_ratio,
} from "./constants"

export const β_n = 1.0
export const β_t = 3.5
export const k_n = 1e3

export type StrongeParams = {
  m: number
  R: number
  I: number
  e_n: number
  μ: number
  omega_ratio: number
}

/**
 * Resolve a ball-cushion collision and return velocity deltas, not final state.
 *
 * `n̂` is the unit cushion normal pointing out of the cushion and toward the
 * ball. A ball moving into the cushion has `v_n0 < 0`.
 */
export function stronge(
  v: Vector3,
  ω: Vector3,
  n̂: Vector3, // Unit cushion normal pointing toward ball
  params: StrongeParams
): { v: Vector3; w: Vector3 } {
  const { R: radius, m: mass, I: inertia } = params

  // 1. Contact velocity at cushion contact point: V_c = v - (ω × R n̂)
  const R_n̂ = n̂.clone().multiplyScalar(radius)
  const ω_cross_R_n̂ = new Vector3().crossVectors(ω, R_n̂)
  const V_c = v.clone().sub(ω_cross_R_n̂)

  // 2. Decompose into normal/tangent scalars.
  // TypeScript chooses t̂ in the direction of the tangential contact velocity,
  // making v_t0 non-negative. Python/C++ use the opposite tangent basis and pass
  // a non-positive v_t0 to the scalar solver. The sign conversion happens around
  // the resolve() call below.
  const v_n0 = n̂.dot(V_c) // < 0 (ball approaching cushion)
  const V_c_tangential = V_c.clone().addScaledVector(n̂, -v_n0) // V_c - (V_c·n̂)n̂
  const v_t_mag = V_c_tangential.length()
  const t̂ = v_t_mag > 0 ? V_c_tangential.normalize() : new Vector3()
  const v_t0 = v_t_mag // >= 0; solver expects v_t0/v_n0 ratio with v_n0 < 0

  // 3. Scalar solver expects v_t0 <= 0 (same sign convention as v_n0 < 0).
  // We negate for the solver, then negate the result back so Δv_t is in the
  // direction of t̂ (the actual tangential contact velocity direction).
  const [v_tf_solver, v_nf] = resolve(-v_t0, v_n0, params)
  const v_tf = -v_tf_solver

  // 4. Reconstruct velocity deltas
  const Δv_n = (v_nf - v_n0) / β_n
  const Δv_t = (v_tf - v_t0) / β_t

  // 5. Apply linear changes
  const v_new = v.clone().addScaledVector(n̂, Δv_n).addScaledVector(t̂, Δv_t)
  v_new.z = 0 // project back onto table plane (rvw[1][2] = 0.0 in Python)

  // 6. Apply angular change: Δω = (m * R / I) * (-n̂ × Δv_t t̂)
  const negative_n̂ = n̂.clone().negate()
  const Δv_t_t̂ = t̂.clone().multiplyScalar(Δv_t)
  const torque_dir = new Vector3().crossVectors(negative_n̂, Δv_t_t̂)

  const inertiaFactor = (mass * radius) / inertia
  const ω_new = ω.clone().addScaledVector(torque_dir, inertiaFactor)

  return {
    v: v_new.sub(v),
    w: ω_new.sub(ω),
  }
}

export function strongeAdapter(
  v: Vector3,
  w: Vector3
): { v: Vector3; w: Vector3 } {
  const n̂ = new Vector3(-1, 0, 0)
  return stronge(v, w, n̂, {
    m,
    R,
    I,
    e_n: stronge_e_n,
    μ: stronge_μ,
    omega_ratio: stronge_omega_ratio,
  })
}

/**
 * Scalar Stronge compliant collision solver.
 *
 * Inputs use the Python/C++ convention: `v_n0 < 0` and `v_t0 <= 0`.
 * The returned tuple is `[v_tf, v_nf]` in the same tangent/normal basis.
 */
export function resolve(
  v_t0: number,
  v_n0: number,
  params: StrongeParams
): [number, number] {
  const { m: mass, e_n, μ, omega_ratio } = params

  if (omega_ratio <= 1 || omega_ratio >= 2) {
    throw new Error(`omega_ratio must be in (1, 2), got ${omega_ratio}`)
  }

  const beta_ratio = β_t / β_n
  const eta_squared = beta_ratio / (omega_ratio * omega_ratio)

  const omega_n = Math.sqrt((β_n * k_n) / mass)
  const omega_t = omega_n * Math.sqrt(beta_ratio / eta_squared)
  const t_c = Math.PI / (2 * omega_n)
  const t_f = (1 + e_n) * t_c
  const t_c_shift = (Math.PI / 2) * (1 - 1 / e_n)

  const v_ratio = v_t0 / v_n0

  const gross_slip_thresh = μ * ((1 + e_n) * beta_ratio - eta_squared / e_n)
  const initial_stick_thresh = μ * eta_squared

  // Case 1: Gross slip (slides throughout)
  if (v_ratio > gross_slip_thresh) {
    const v_tf = v_t0 - μ * v_n0 * beta_ratio * (1 + e_n)
    const v_nf = e_n * v_n0 * Math.cos((omega_n * t_f) / e_n + t_c_shift)
    return [v_tf, v_nf]
  }

  const eps = 1e-9

  // Case 2: initial stick, then possible slip during restitution.
  if (v_ratio < initial_stick_thresh) {
    const t_slip = getInitialStickSlipTime(
      v_ratio,
      eps,
      initial_stick_thresh,
      t_f,
      t_c,
      v_t0,
      v_n0,
      omega_t,
      omega_n,
      e_n,
      μ,
      eta_squared,
      t_c_shift
    )
    const v_tf =
      v_t0 * Math.cos(omega_t * t_slip) +
      μ *
        v_n0 *
        beta_ratio *
        e_n *
        (1 + Math.cos((omega_n * t_slip) / e_n + t_c_shift))
    const v_nf = e_n * v_n0 * Math.cos((omega_n * t_f) / e_n + t_c_shift)
    return [v_tf, v_nf]
  }

  // Case 3: initial slip, then stick, then slip again.
  const t_stick = findStickTime(
    v_ratio,
    μ,
    beta_ratio,
    eta_squared,
    t_c,
    t_c_shift,
    e_n
  )
  const v_t_at_stick =
    t_stick <= t_c
      ? v_t0 - μ * beta_ratio * v_n0 * (1 - Math.cos(omega_n * t_stick))
      : v_t0 -
        μ *
          beta_ratio *
          v_n0 *
          (1 - e_n * Math.cos((omega_n * t_stick) / e_n + t_c_shift))

  const u_t_at_stick =
    t_stick <= t_c
      ? ((-μ * v_n0 * eta_squared) / omega_n) * Math.sin(omega_n * t_stick)
      : ((-μ * v_n0 * eta_squared) / omega_n) *
        Math.sin((omega_n * t_stick) / e_n + t_c_shift)

  const t_slip = getSlipStickSlipTime(
    v_ratio,
    eps,
    initial_stick_thresh,
    gross_slip_thresh,
    t_f,
    t_c,
    v_n0,
    μ,
    eta_squared,
    omega_t,
    omega_n,
    u_t_at_stick,
    v_t_at_stick,
    t_stick,
    t_c_shift,
    e_n
  )

  const v_t_stick_to_slip =
    omega_t * u_t_at_stick * Math.sin(omega_t * (t_slip - t_stick)) +
    v_t_at_stick * Math.cos(omega_t * (t_slip - t_stick))

  const v_tf =
    v_t_stick_to_slip +
    β_t * μ * v_n0 * e_n * (1 + Math.cos((omega_n * t_slip) / e_n + t_c_shift))

  const v_nf = e_n * v_n0 * Math.cos((omega_n * t_f) / e_n + t_c_shift)
  return [v_tf, v_nf]
}

function getInitialStickSlipTime(
  v_ratio: number,
  eps: number,
  initial_stick_thresh: number,
  t_f: number,
  t_c: number,
  v_t0: number,
  v_n0: number,
  omega_t: number,
  omega_n: number,
  e_n: number,
  μ: number,
  eta_squared: number,
  t_c_shift: number
): number {
  if (Math.abs(v_ratio) < eps) return t_f
  if (Math.abs(v_ratio - initial_stick_thresh) < eps) return t_c
  return findRootInitialStick(
    v_t0,
    v_n0,
    omega_t,
    omega_n,
    e_n,
    μ,
    eta_squared,
    t_c,
    t_f,
    t_c_shift
  )
}

// Python uses scipy.optimize.toms748 for these roots. Bisection is sufficient
// here because the root is bracketed and this is not performance-sensitive.
export function findRootInitialStick(
  v_t0: number,
  v_n0: number,
  omega_t: number,
  omega_n: number,
  e_n: number,
  μ: number,
  eta_squared: number,
  t_c: number,
  t_f: number,
  t_c_shift: number
): number {
  const v_ratio = v_t0 / v_n0
  const phi_rest = (t: number) => (omega_n * t) / e_n + t_c_shift

  const f = (t: number) => {
    return (
      Math.abs(-v_ratio * Math.sin(omega_t * t)) -
      μ * eta_squared * (omega_t / omega_n) * Math.sin(phi_rest(t))
    )
  }

  const solution = bisectionSolver(f, t_c, t_f, 50)
  return Math.max(t_c, Math.min(t_f, solution))
}

export function findStickTime(
  v_ratio: number,
  μ: number,
  beta_ratio: number,
  eta_squared: number,
  t_c: number,
  t_c_shift: number,
  e_n: number
): number {
  if (v_ratio <= μ * beta_ratio) {
    const x = (v_ratio / μ - beta_ratio) / (eta_squared - beta_ratio)
    const clampedX = Math.max(-1.0, Math.min(1.0, x))
    return t_c * (2 / Math.PI) * Math.acos(clampedX)
  } else {
    const x_rest =
      (v_ratio / μ - beta_ratio) / (eta_squared / e_n - e_n * beta_ratio)
    const clampedXRest = Math.max(-1.0, Math.min(1.0, x_rest))
    return t_c * (2 / Math.PI) * (Math.acos(clampedXRest) - t_c_shift) * e_n
  }
}

function getSlipStickSlipTime(
  v_ratio: number,
  eps: number,
  initial_stick_thresh: number,
  gross_slip_thresh: number,
  t_f: number,
  t_c: number,
  v_n0: number,
  μ: number,
  eta_squared: number,
  omega_t: number,
  omega_n: number,
  u_t_at_stick: number,
  v_t_at_stick: number,
  t_stick: number,
  t_c_shift: number,
  e_n: number
): number {
  if (Math.abs(v_ratio - initial_stick_thresh) < eps) return t_c
  if (Math.abs(v_ratio - gross_slip_thresh) < eps) return t_f
  return findRootSlipStickSlip(
    v_n0,
    μ,
    eta_squared,
    omega_t,
    omega_n,
    u_t_at_stick,
    v_t_at_stick,
    t_stick,
    t_c,
    t_f,
    t_c_shift,
    e_n
  )
}

// Python uses scipy.optimize.toms748 for these roots. Bisection is sufficient
// here because the root is bracketed and this is not performance-sensitive.
export function findRootSlipStickSlip(
  v_n0: number,
  μ: number,
  eta_squared: number,
  omega_t: number,
  omega_n: number,
  u_t_at_stick: number,
  v_t_at_stick: number,
  t_stick: number,
  t_c: number,
  t_f: number,
  t_c_shift: number,
  e_n: number
): number {
  const phi_rest = (t: number) => (omega_n * t) / e_n + t_c_shift

  const f = (t: number) => {
    return (
      Math.abs(
        (omega_n / (μ * v_n0)) *
          (u_t_at_stick * Math.cos(omega_t * (t - t_stick)) -
            (v_t_at_stick / omega_t) * Math.sin(omega_t * (t - t_stick)))
      ) -
      eta_squared * Math.sin(phi_rest(t))
    )
  }

  const solution = bisectionSolver(f, t_c, t_f, 50)
  return Math.max(t_stick, Math.min(t_f, solution))
}
