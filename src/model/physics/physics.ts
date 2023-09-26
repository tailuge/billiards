import { Vector3 } from "three"
import { norm, upCross, up } from "../../utils/utils"
import { muS, muC, g, m, e, Mz, Mxy, R, I } from "./constants"

export function surfaceVelocity(v, w) {
  return surfaceVelocityFull(v, w).setZ(0)
}

const sv = new Vector3()
export function surfaceVelocityFull(v, w) {
  return sv.copy(v).addScaledVector(upCross(w), R)
}

const delta = { v: new Vector3(), w: new Vector3() }
Object.freeze(delta)

export function sliding(v, w) {
  const va = surfaceVelocity(v, w)
  delta.v.copy(norm(va).multiplyScalar(-muS * g))
  delta.w.copy(norm(upCross(va)).multiplyScalar(((5 / 2) * muS * g) / R))
  delta.w.setZ(-(5 / 2) * (Mz / (R * R)) * Math.sign(w.z))
  return delta
}

export function rollingFull(w) {
  const mag = new Vector3(w.x, w.y, 0).length()
  const k = ((5 / 7) * Mxy) / (m * R) / mag
  const kw = ((5 / 7) * Mxy) / (m * R * R) / mag
  delta.v.set(-k * w.y, k * w.x, 0)
  delta.w.set(
    -kw * w.x,
    -kw * w.y,
    -(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z)
  )
  return delta
}

export function forceRoll(v, w) {
  const wz = w.z
  w.copy(upCross(v).multiplyScalar(1 / R))
  w.setZ(wz)
}

export function rotateApplyUnrotate(theta, v, w) {
  const vr = v.clone().applyAxisAngle(up, theta)
  const wr = w.clone().applyAxisAngle(up, theta)

  const delta = bounceHan(vr, wr)

  delta.v.applyAxisAngle(up, -theta)
  delta.w.applyAxisAngle(up, -theta)
  return delta
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre

const epsilon = R * 0.2
const theta_a = Math.asin(epsilon / R)

const sin_a = Math.sin(theta_a)
const cos_a = Math.cos(theta_a)

export function s0(v, w) {
  return new Vector3(
    v.x * sin_a - v.z * cos_a + R * w.y,
    -v.y - R * w.z * cos_a + R * w.x * sin_a
  )
}

export function c0(v) {
  return v.x * cos_a
}

export function Pzs(s) {
  const A = 7 / 2 / m
  return s.length() / A
}

export function Pze(c) {
  const B = 1 / m
  return (muC * ((1 + e) * c)) / B
}

export function isGripCushion(v, w) {
  const Pze_val = Pze(c0(v))
  const Pzs_val = Pzs(s0(v, w))
  return Pzs_val <= Pze_val
}

/**
 * Based on Han2005 paper.
 * Expects ball to be bouncing in +X plane.
 *
 * @param v ball velocity
 * @param w ball spin
 * @returns delta to apply to velocity and spin
 */
export function bounceHan(v: Vector3, w: Vector3) {
  const c = c0(v)
  const s = s0(v, w)
  const Pze_val = Pze(c)
  const Pzs_val = Pzs(s)
  const A = 7 / 2 / m
  const B = 1 / m
  const ecB = (1 + e) * (c / B)
  let PX,
    PY,
    PZ = 0
  if (Pzs_val <= Pze_val) {
    PX = (-s.x / A) * sin_a - ecB * cos_a
    PY = s.y / A
    PZ = (s.x / A) * cos_a - ecB * sin_a
  } else {
    const mu = muCushion(v)
    const phi = Math.atan2(v.y, v.x)
    const cos_phi = Math.cos(phi)
    const sin_phi = Math.sin(phi)
    PX = -mu * ecB * cos_phi * cos_a - ecB * cos_a
    PY = mu * ecB * sin_phi
    PZ = mu * ecB * cos_phi * cos_a - ecB * sin_a
  }
  const delta = {
    v: new Vector3(PX / m, PY / m),
    w: new Vector3(
      (-R / I) * PY * sin_a,
      (R / I) * (PX * sin_a - PZ * cos_a),
      (R / I) * PY * cos_a
    ),
  }
  return delta
}

export function muCushion(v: Vector3) {
  const theta = Math.atan2(Math.abs(v.y), v.x)
  return 0.471 - theta * 0.241
}

/**
 * Spin on ball after strike with cue
 * https://billiards.colostate.edu/technical_proofs/new/TP_A-12.pdf
 *
 * @param offset (x,y,0) from center strike where x,y range from -0.5 to 0.5 the fraction of R from center.
 * @param v velocity of ball after strike
 * @returns angular velocity
 */
export function cueToSpin(offset: Vector3, v: Vector3) {
  const spinAxis = Math.atan2(-offset.x, offset.y)
  const spinRate = ((5 / 2) * v.length() * (offset.length() * R)) / (R * R)
  const dir = v.clone().normalize()
  const rvel = upCross(dir)
    .applyAxisAngle(dir, spinAxis)
    .multiplyScalar(spinRate)
  return rvel
}
