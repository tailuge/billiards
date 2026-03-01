import { Vector3 } from "three"

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

const upCrossVec = new Vector3()
export function upCross(v) {
  return upCrossVec.copy(up).cross(v)
}
const normVec = new Vector3()
export function norm(v) {
  return normVec.copy(v).normalize()
}

const vc = new Vector3()
export function passesThroughZero(v, dv) {
  return vc.copy(v).add(dv).dot(v) <= 0
}

export function unitAtAngle(theta, target = new Vector3()) {
  return target.set(1, 0, 0).applyAxisAngle(up, theta)
}

export function roundVec(v) {
  v.x = Math.fround(v.x)
  v.y = Math.fround(v.y)
  v.z = Math.fround(v.z)
  return v
}

export function roundVec2(v) {
  v.x = Math.round((v.x + Number.EPSILON) * 100) / 100
  v.y = Math.round((v.y + Number.EPSILON) * 100) / 100
  v.z = Math.round((v.z + Number.EPSILON) * 100) / 100
  return v
}
