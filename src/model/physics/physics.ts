import { Vector3 } from "three"
import { sin, cos } from "../../utils/utils"
import { norm, upCross, up } from "../../utils/three-utils"
import { muS, muC, g, m, Mz, Mxy, R, I, e, ee, μs, μw } from "./constants"
import { Mathaven } from "./mathaven"

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
  delta.w.setZ(-(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z))
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

const vr = new Vector3()
const wr = new Vector3()
const rotateDeltaResult = { v: new Vector3(), w: new Vector3() }
export function rotateApplyUnrotate(theta, v, w, model) {
  vr.copy(v).applyAxisAngle(up, theta)
  wr.copy(w).applyAxisAngle(up, theta)

  const delta = model(vr, wr)

  rotateDeltaResult.v.copy(delta.v).applyAxisAngle(up, -theta)
  rotateDeltaResult.w.copy(delta.w).applyAxisAngle(up, -theta)
  return { v: rotateDeltaResult.v.clone(), w: rotateDeltaResult.w.clone() }
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre

const epsilon = R * 0.1
const theta_a = Math.asin(epsilon / R)

const sin_a = sin(theta_a)
const cos_a = cos(theta_a)

const s0Vec = new Vector3()
export function s0(v, w) {
  return s0Vec.set(
    v.x * sin_a - v.z * cos_a + R * w.y,
    -v.y - R * w.z * cos_a + R * w.x * sin_a,
    0
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
  const coeff = restitutionCushion(new Vector3(c / cos_a, 0, 0))
  return (muC * ((1 + coeff) * c)) / B
}

export function isGripCushion(v, w) {
  const Pze_val = Pze(c0(v))
  const Pzs_val = Pzs(s0(v, w))
  return Pzs_val <= Pze_val
}

function basisHan(v, w) {
  return {
    c: c0(v),
    s: s0(v, w),
    A: 7 / 2 / m,
    B: 1 / m,
  }
}

function gripHan(v, w) {
  const { c, s, A, B } = basisHan(v, w)
  const ecB = (1 + e) * (c / B)
  const PX = (-s.x / A) * sin_a - ecB * cos_a
  const PY = s.y / A
  const PZ = (s.x / A) * cos_a - ecB * sin_a
  return impulseToDelta(PX, PY, PZ, deltaGrip)
}

function slipHan(v, w) {
  const { c, B } = basisHan(v, w)
  const ecB = (1 + e) * (c / B)
  const mu = muCushion(v)
  const phi = Math.atan2(v.y, v.x)
  const cos_phi = Math.cos(phi)
  const sin_phi = Math.sin(phi)
  const PX = -mu * ecB * cos_phi * cos_a - ecB * cos_a
  const PY = mu * ecB * sin_phi
  const PZ = mu * ecB * cos_phi * cos_a - ecB * sin_a
  return impulseToDelta(PX, PY, PZ, deltaSlip)
}

/**
 * Based directly on Han2005 paper.
 * Expects ball to be bouncing in +X plane.
 *
 * @param v ball velocity
 * @param w ball spin
 * @returns delta to apply to velocity and spin
 */
export function bounceHan(v: Vector3, w: Vector3) {
  if (isGripCushion(v, w)) {
    const delta = gripHan(v, w)
    return { v: delta.v.clone(), w: delta.w.clone() }
  } else {
    const delta = slipHan(v, w)
    return { v: delta.v.clone(), w: delta.w.clone() }
  }
}

const deltaGrip = { v: new Vector3(), w: new Vector3() }
const deltaSlip = { v: new Vector3(), w: new Vector3() }
const deltaBlend = { v: new Vector3(), w: new Vector3() }

/**
 * Modification Han 2005 paper by Taylor to blend two bounce regimes.
 * Motive is to remove cliff edge discontinuity in original model.
 * Gives more realistic check side (reverse side played at steep angle)
 *
 * @param v ball velocity
 * @param w ball spin
 * @returns delta to apply to velocity and spin
 */
export function bounceHanBlend(v: Vector3, w: Vector3) {
  const g = gripHan(v, w)
  const s = slipHan(v, w)

  const isCheckSide = Math.sign(v.y) === Math.sign(w.z)
  const factor = isCheckSide ? Math.cos(Math.atan2(v.y, v.x)) : 1

  deltaBlend.v.copy(s.v).lerp(g.v, factor)
  deltaBlend.w.copy(s.w).lerp(g.w, factor)

  return { v: deltaBlend.v.clone(), w: deltaBlend.w.clone() }
}

function impulseToDelta(PX, PY, PZ, target = { v: new Vector3(), w: new Vector3() }) {
  target.v.set(PX / m, PY / m, 0)
  target.w.set(
    (-R / I) * PY * sin_a,
    (R / I) * (PX * sin_a - PZ * cos_a),
    (R / I) * PY * cos_a
  )
  return target
}

export function muCushion(v: Vector3) {
  const theta = Math.atan2(Math.abs(v.y), v.x)
  return 0.471 - theta * 0.241
}

export function restitutionCushion(v: Vector3) {
  const e = 0.39 + 0.257 * v.x - 0.044 * v.x * v.x
  return e
}

const mathavenSolver = new Mathaven(m, R, ee, μs, μw)
const mathavenDelta = { v: new Vector3(), w: new Vector3() }

function cartesionToBallCentric(v, w) {
  mathavenSolver.solve(v.x, v.y, w.x, w.y, w.z)

  mathavenDelta.v.set(mathavenSolver.vx, mathavenSolver.vy, 0).sub(v)
  mathavenDelta.w
    .set(mathavenSolver.ωx, mathavenSolver.ωy, mathavenSolver.ωz)
    .sub(w)

  return mathavenDelta
}

/**
 * Bounce is called with ball travelling in +x direction to cushion,
 * mathaven expects it in +y direction and also requires angle
 * and spin to be relative to direction of ball travel.
 */
export function mathavenAdapter(v: Vector3, w: Vector3) {
  return rotateApplyUnrotate(Math.PI / 2, v, w, cartesionToBallCentric)
}

const cueToSpinDir = new Vector3()
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
  const dir = cueToSpinDir.copy(v).normalize()
  const rvel = upCross(dir)
    .applyAxisAngle(dir, spinAxis)
    .multiplyScalar(spinRate)
  return rvel
}
