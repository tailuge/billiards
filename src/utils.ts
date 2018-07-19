import { Vector3 } from "three"

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

export function crossUp(v) {
  return v.clone().cross(up)
}

export function upCross(v) {
  return up.clone().cross(v)
}

export function norm(v) {
  return v.clone().normalize()
}

let mu = 0.01
let g = 9.8
let rho = 0.2
let m = 1
let Mz = ((mu * m * g * 2) / 3) * rho

export function surfaceVelocity(v, w) {
  return v.clone().add(upCross(w))
}

export function sliding(v, w, dv, dw) {
  let va = surfaceVelocity(v, w)
  dv.copy(norm(va).multiplyScalar(-mu * g))
  dw.copy(norm(upCross(va)).multiplyScalar((5 / 2) * mu * g))
  dw.setZ(-(5 / 2) * Mz * Math.sign(w.z))
}

export function slidingFull(v, w, dv, dw) {
  let va = new Vector3(v.x - w.y, v.y + w.x, 0)
  dv.copy(new Vector3(-mu * g * norm(va).x, -mu * g * norm(va).y, 0))
  dw.copy(
    new Vector3(
      (-5 / 2) * mu * g * norm(va).y,
      (5 / 2) * mu * g * norm(va).x,
      -(5 / 2) * Mz * Math.sign(w.z)
    )
  )
}
