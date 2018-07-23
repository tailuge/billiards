import { Vector3 } from "three"
import { norm, upCross, up } from "./utils"

let mu = 0.006
let g = 9.8
let rho = 0.4
let m = 1
let Mz = ((mu * m * g * 2) / 3) * rho
let Mxy = (7 / (5 * Math.sqrt(2))) * mu * m * g

export function surfaceVelocity(v, w) {
  return v
    .clone()
    .add(upCross(w))
    .setZ(0)
}

export function sliding(v, w, dv, dw) {
  let va = surfaceVelocity(v, w)
  dv.copy(norm(va).multiplyScalar(-mu * g))
  dw.copy(norm(upCross(va)).multiplyScalar((5 / 2) * mu * g))
  dw.setZ(-(5 / 2) * Mz * Math.sign(w.z))
}

export function slidingFull(v, w, dv, dw) {
  let va = new Vector3(v.x - w.y, v.y + w.x, 0)
  dv.set(-mu * g * norm(va).x, -mu * g * norm(va).y, 0)
  dw.set(
    (-5 / 2) * mu * g * norm(va).y,
    (5 / 2) * mu * g * norm(va).x,
    -(5 / 2) * Mz * Math.sign(w.z)
  )
}

export function rollingFull(w, dv, dw) {
  let mag = new Vector3(w.x, w.y, 0).length()
  let k = ((5 / 7) * Mxy) / mag
  dv.set(-k * w.y, k * w.x, 0)
  dw.set(-k * w.x, -k * w.y, -k * w.z)
}

export function forceRoll(v, w) {
  v.sub(surfaceVelocity(v, w).multiplyScalar(0.5))
  w.copy(upCross(v))
}

let sin_a = Math.sin(9.25 / 32.5)
let cos_a = Math.cos(9.25 / 32.5)

let sin_a2 = sin_a * sin_a
let cos_a2 = cos_a * cos_a

let e = 0.8
let unitx = new Vector3(1, 0, 0)

export function bounceWithoutSlipInNormal(n, v, w, dv, dw) {
  let theta = n.angleTo(unitx)
  let vr = v.clone().applyAxisAngle(up, theta)
  let wr = w.clone().applyAxisAngle(up, theta)
  bounceWithoutSlipX(vr, wr, dv, dw)
  dv.applyAxisAngle(up, -theta)
  dw.applyAxisAngle(up, -theta)
}

export function bounceWithoutSlipX(v, w, dv, dw) {
  dv.set(
    -v.x * ((2 / 7) * sin_a2 + (1 + e) * cos_a2) - (2 / 7) * w.y * sin_a,
    5 * 7 * v.y + (2 / 7) * (w.x * sin_a - w.z * cos_a) - v.y,
    0
  )
  dw.set(0,0,0)
}
