import { Vector3 } from "three"

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

export function upCross(v) {
  return up.clone().cross(v)
}

export function norm(v) {
  return v.clone().normalize()
}

export function passesThroughZero(v, dv) {
  return v.clone().add(dv).dot(v) <= 0
}
