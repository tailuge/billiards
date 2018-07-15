import { Vector3 } from "three"

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)
