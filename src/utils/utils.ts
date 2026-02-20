import { Vector3 } from "three"
import { EventType } from "../events/eventtype"
import { Recorder } from "../events/recorder"

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)

export function isFirstShot(recorder: Recorder): boolean {
  return !recorder.entries.some((e) => e.event.type === EventType.AIM)
}

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

export function upCross(v, target = new Vector3()) {
  return target.copy(up).cross(v)
}
export function norm(v, target = new Vector3()) {
  if (v.lengthSq() === 0) return target.copy(zero)
  return target.copy(v).normalize()
}

const vc = new Vector3()
export function passesThroughZero(v, dv) {
  return vc.copy(v).add(dv).dot(v) <= 0
}

export function unitAtAngle(theta, target = new Vector3()) {
  return target.set(1, 0, 0).applyAxisAngle(up, theta)
}

export function round(num) {
  const sign = Math.sign(num)
  return (sign * Math.floor((Math.abs(num) + Number.EPSILON) * 10000)) / 10000
}

export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function roundVec(v) {
  v.x = round(v.x)
  v.y = round(v.y)
  v.z = round(v.z)
  return v
}

export function roundVec2(v) {
  v.x = round2(v.x)
  v.y = round2(v.y)
  v.z = round2(v.z)
  return v
}

export function atan2(y, x) {
  return Math.fround(Math.atan2(y, x))
}

export function pow(x, y) {
  return Math.fround(Math.pow(x, y))
}

export function sin(theta) {
  return Math.fround(Math.sin(theta))
}

export function cos(theta) {
  return Math.fround(Math.cos(theta))
}

export function sqrt(theta) {
  return Math.fround(Math.sqrt(theta))
}

export function exp(theta) {
  return Math.fround(Math.exp(theta))
}
