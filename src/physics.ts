import { Vector3 } from "three"
import { norm, upCross } from "./utils"

let mu = 0.005
let g = 9.8
let rho = 0.2
let m = 1
let Mz = ((mu * m * g * 2) / 3) * rho
let Mxy = (7 / (5 * Math.sqrt(2))) * mu * m * g

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

export function rollingFull(w, dv, dw) {
  let mag = new Vector3(w.x, w.y, 0).length()
  let k = ((5 / 7) * Mxy) / mag
  dv.copy(new Vector3(-k * w.y, k * w.x, 0))
  dw.copy(new Vector3(-k * w.x, -k * w.y, -k * w.z))
}
