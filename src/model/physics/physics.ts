import { Vector3 } from "three"
import { norm, upCross, up } from "../../utils/utils"
import { mu, g, m, e, Mz, Mxy, R, I } from "./constants"

export function surfaceVelocity(v, w) {
  return v.clone().add(upCross(w)).setZ(0)
}

export function sliding(v, w, dv, dw) {
  const va = surfaceVelocity(v, w)
  dv.copy(norm(va).multiplyScalar(-mu * g))
  dw.copy(norm(upCross(va)).multiplyScalar((5 / 2) * mu * g))
  dw.setZ(-(5 / 2) * Mz * Math.sign(w.z))
}

export function slidingFull(v, w, dv, dw) {
  const va = new Vector3(v.x - w.y, v.y + w.x, 0)
  dv.set(-mu * g * norm(va).x, -mu * g * norm(va).y, 0)
  dw.set(
    (-5 / 2) * mu * g * norm(va).y,
    (5 / 2) * mu * g * norm(va).x,
    -(5 / 2) * Mz * Math.sign(w.z)
  )
}

export function rollingFull(w, dv, dw) {
  const mag = new Vector3(w.x, w.y, 0).length()
  const k = ((5 / 7) * Mxy) / mag
  dv.set(-k * w.y, k * w.x, 0)
  dw.set(-k * w.x, -k * w.y, -k * w.z)
}

export function forceRoll(v, w) {
  v.sub(surfaceVelocity(v, w).multiplyScalar(0.5))
  w.copy(upCross(v))
}

const sin_a = Math.sin(9.25 / 32.5)
const cos_a = Math.cos(9.25 / 32.5)

const sin_a2 = sin_a * sin_a
const cos_a2 = cos_a * cos_a

export function rotateApplyUnrotate(theta, v, w, dv, dw, f) {
  const vr = v.clone().applyAxisAngle(up, theta)
  const wr = w.clone().applyAxisAngle(up, theta)
  f(vr, wr, dv, dw)
  dv.applyAxisAngle(up, -theta)
  dw.applyAxisAngle(up, -theta)
}

function s0(v, w) {
  return new Vector3(
    v.x * sin_a - v.z * cos_a + w.y,
    -v.y - w.z * cos_a + w.x * sin_a
  )
}

function c0(v) {
  return v.x * cos_a - v.z * cos_a
}

const A = 7 / (2 * m)
const B = 1 / m

function Pzs(s0) {
  return s0.length() / A
}

function Pze(c0) {
  return ((1 + e) * c0) / B
}

export function isCushionXGrip(v, w) {
  return Pze(c0(v)) <= Pzs(s0(v, w))
}

export function bounceWithoutSlipX(v, w, dv, dw) {
  var newVx =
    v.x +
    -v.x * ((2 / 7) * sin_a2 + (1 + e) * cos_a2) -
    (2 / 7) * R * w.y * sin_a
  var newVy = (5 / 7) * v.y + (2 / 7) * R * (w.x * sin_a - w.z * cos_a)

  var Py = m * (newVy - v.y)
  var Px = m * (newVx - v.x)
  var Pz = 0
  var newWx = w.x - (R / I) * Py * sin_a
  var newWy = w.y + (R / I) * (Px * sin_a - Pz * cos_a)
  var newWz = w.z + (R / I) * Py * cos_a

  dv.set(newVx - v.x, newVy - v.y, 0)
  dw.set(newWx - w.x, newWy - w.y, newWz - w.z)
}
