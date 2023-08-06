import { Vector3 } from "three"
import { norm, upCross, up } from "../../utils/utils"
import { mu, muSlide, g, m, e, Mz, Mxy, R, I } from "./constants"

export function surfaceVelocity(v, w) {
  return surfaceVelocityFull(v, w).setZ(0)
}

export function surfaceVelocityFull(v, w) {
  return v.clone().addScaledVector(upCross(w), R)
}

export function sliding(v, w, dv, dw) {
  const va = surfaceVelocity(v, w)
  dv.copy(norm(va).multiplyScalar(-muSlide * g))
  dw.copy(norm(upCross(va)).multiplyScalar(((5 / 2) * muSlide * g) / R))
  dw.setZ(-(5 / 2) * (Mz / (R * R)) * Math.sign(w.z))
}

export function rollingFull(w, dv, dw) {
  const mag = new Vector3(w.x, w.y, 0).length()
  const k = ((5 / 7) * Mxy) / (m * R) / mag
  const kw = ((5 / 7) * Mxy) / (m * R * R) / mag
  dv.set(-k * w.y, k * w.x, 0)
  dw.set(-kw * w.x, -kw * w.y, -(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z))
}

export function forceRoll(v, w) {
  v.sub(surfaceVelocity(v, w).multiplyScalar(1))
  w.copy(upCross(v).multiplyScalar(1 / R))
}

export function rotateApplyUnrotate(theta, v, w, dv, dw) {
  const vr = v.clone().applyAxisAngle(up, theta)
  const wr = w.clone().applyAxisAngle(up, theta)

  bounceWithSideX(vr, wr, dv, dw)
  //  if (isCushionXGrip(vr, wr)) {
  //    bounceWithoutSlipX(vr, wr, dv, dw)
  //  } else {
  //    bounceWithSlipX(vr, wr, dv, dw)
  //  }

  dv.applyAxisAngle(up, -theta)
  dw.applyAxisAngle(up, -theta)
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre

const epsilon = R * 0.2
const theta_a = Math.asin(epsilon / R)

const sin_a = Math.sin(theta_a)
const cos_a = Math.cos(theta_a)
const sin_a2 = sin_a * sin_a
const cos_a2 = cos_a * cos_a

export function s0(v, w) {
  return new Vector3(
    v.x * sin_a - v.z * cos_a + R * w.y,
    -v.y - R * w.z * cos_a + R * w.x * sin_a
  )
}

export function c0(v) {
  return v.x * cos_a
}

const A = 7 / 2 / m
const B = 1 / m

export function Pzs(s) {
  return s.length() / A
}

export function Pze(c) {
  return ((1 + e) * c) / B
}

export function isGripCushion(v, w) {
  const Pze_val = Pze(c0(v))
  const Pzs_val = Pzs(s0(v, w))
  return Pzs_val <= Pze_val
}

export function bounceWithoutSlipX(v, w, dv, dw) {
  const newVx =
    v.x -
    v.x * ((2 / 7) * sin_a2 + (1 + e) * cos_a2) -
    (2 / 7) * R * w.y * sin_a
  const newVy = (5 / 7) * v.y + (2 / 7) * R * (w.x * sin_a - w.z * cos_a)

  const Py = m * (newVy - v.y)
  const Px = m * (newVx - v.x)
  const Pz = -m
  const newWx = w.x - (R / I) * Py * sin_a
  const newWy = w.y + (R / I) * (Px * sin_a - Pz * cos_a)
  const newWz = w.z + (R / I) * Py * cos_a

  dv.set(newVx - v.x, newVy - v.y, 0)
  dw.set(newWx - w.x, newWy - w.y, newWz - w.z)
}

export function bounceWithSlipX(v, w, dv, dw) {
  const newVx = v.x - v.x * (1 + e) * cos_a * (mu * cos_a * sin_a + cos_a)
  const newVy = v.y + mu * (1 + e) * cos_a * sin_a * v.x

  const Py = m * (newVy - v.y)
  const Px = m * (newVx - v.x)
  const Pz = -m
  const newWx = w.x - (R / I) * Py * sin_a
  const newWy = w.y + (R / I) * (Px * sin_a - Pz * cos_a)
  const newWz = w.z + (R / I) * Py * cos_a

  dv.set(newVx - v.x, newVy - v.y, 0)
  dw.set(newWx - w.x, newWy - w.y, newWz - w.z)
}

/**
 * Own version
 */
export function bounceWithSideX(v, w, dv, dw) {
  const newVx = -v.x * e
  const newVy = v.y + R * ((-w.z * cos_a * Math.abs(v.x)) / 30)

  const newWx = w.x * 0.9
  const newWy = 0
  const newWz = w.z / 2

  dv.set(newVx - v.x, newVy - v.y, 0)
  dw.set(newWx - w.x, newWy - w.y, newWz - w.z)
}
