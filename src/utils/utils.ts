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

export function unitAtAngle(theta) {
  return new Vector3(1, 0, 0).applyAxisAngle(up, theta)
}

export function round(num) {
  return Math.round((num + Number.EPSILON) * 1000) / 1000
}

export function roundVec(v) {
  v.x = round(v.x)
  v.y = round(v.y)
  v.z = round(v.z)
  return v
}

const vr = new Vector3()
const wr = new Vector3()
export function rotateApplyUnrotate(f, theta, v, w) {
  vr.copy(v).applyAxisAngle(up, theta)
  wr.copy(w).clone().applyAxisAngle(up, theta)

  const delta = f(vr, wr)

  delta.v.applyAxisAngle(up, -theta)
  delta.w.applyAxisAngle(up, -theta)
  return delta
}
