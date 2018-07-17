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
