import fzero from "fzero"
import { Vector3 } from "three"
import {
  m,
  R,
  I,
  stronge_e_n,
  stronge_μ,
  stronge_omega_ratio,
} from "./constants"

export function stronge(
  v: Vector3,
  ω: Vector3,
  n̂: Vector3, // Unit cushion normal pointing toward ball
  params: {
    m: number
    R: number
    I: number
    e_n: number
    μ: number
    omega_ratio: number
  }
): { v: Vector3; w: Vector3 } {
  const { R: radius, m: mass, I: inertia } = params

  // 1. Contact velocity at cushion contact point: V_c = v - (ω × R n̂)
  const R_n̂ = n̂.clone().multiplyScalar(radius)
  const ω_cross_R_n̂ = new Vector3().crossVectors(ω, R_n̂)
  const V_c = v.clone().sub(ω_cross_R_n̂)

  // 2. Decompose into normal/tangent scalars.
  // t̂ points in the direction of the tangential contact velocity (matching the
  // Python decompose_normal_tangent convention). v_t0 is the signed projection
  // onto t̂, so it is always >= 0 by construction.
  // We project t̂ onto the XY plane before use: V_c can have a Z component from
  // ωy spin, which would otherwise leak Z into the velocity/spin deltas and lift
  // the ball off the table. The Stronge model is 2D so this projection is correct.
  const v_n0 = n̂.dot(V_c) // < 0 (ball approaching cushion)
  const V_c_tangential = V_c.clone().addScaledVector(n̂, -v_n0) // V_c - (V_c·n̂)n̂
  V_c_tangential.z = 0 // project onto table plane
  const v_t_mag = V_c_tangential.length()
  const t̂ = v_t_mag > 0 ? V_c_tangential.normalize() : new Vector3()
  const v_t0 = v_t_mag // >= 0; solver expects v_t0/v_n0 ratio with v_n0 < 0

  // 3. Scalar solver expects v_t0 <= 0 (same sign convention as v_n0 < 0).
  // We negate for the solver, then negate the result back so Δv_t is in the
  // direction of t̂ (the actual tangential contact velocity direction).
  const [v_tf_solver, v_nf] = resolve(-v_t0, v_n0, params)
  const v_tf = -v_tf_solver

  // 4. Reconstruct velocity deltas
  const β_n = 1.0
  const β_t = 3.5
  const Δv_n = (v_nf - v_n0) / β_n
  const Δv_t = (v_tf - v_t0) / β_t

  // 5. Apply linear changes
  const v_new = v.clone().addScaledVector(n̂, Δv_n).addScaledVector(t̂, Δv_t)

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

const β_n = 1.0
const β_t = 3.5
const k_n = 1e3

function resolve(
  v_t0: number,
  v_n0: number,
  params: {
    m: number
    R: number
    I: number
    e_n: number
    μ: number
    omega_ratio: number
  }
): [number, number] {
  const { m: mass, e_n, μ, omega_ratio } = params

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

  // Case 2: Initial stick (sticks immediately at t=0)
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

  // Case 3: Slip→stick→slip
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

function findRootInitialStick(
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

  const f = (t: string | number) => {
    const tNum = Number(t)
    const val =
      Math.abs(-v_ratio * Math.sin(omega_t * tNum)) -
      μ * eta_squared * (omega_t / omega_n) * Math.sin(phi_rest(tNum))
    return val.toString()
  }

  const result = fzero(f, [t_c, t_f], { maxiter: 50 })
  if (result.code !== 1) {
    throw new Error(
      `fzero failed to find root for initial stick: code ${result.code}, solution: ${result.solution}, fval: ${result.fval}`
    )
  }
  return Number(result.solution)
}

function findStickTime(
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

function findRootSlipStickSlip(
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

  const f = (t: string | number) => {
    const tNum = Number(t)
    const val =
      Math.abs(
        (omega_n / (μ * v_n0)) *
          (u_t_at_stick * Math.cos(omega_t * (tNum - t_stick)) -
            (v_t_at_stick / omega_t) * Math.sin(omega_t * (tNum - t_stick)))
      ) -
      eta_squared * Math.sin(phi_rest(tNum))
    return val.toString()
  }

  const result = fzero(f, [t_c, t_f], { maxiter: 50 })
  if (result.code !== 1) {
    throw new Error(
      `fzero failed to find root for slip-stick-slip: code ${result.code}, solution: ${result.solution}, fval: ${result.fval}`
    )
  }
  return Number(result.solution)
}

export { resolve }
