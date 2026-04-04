import { EventType } from "../events/eventtype"
import { Recorder } from "../events/recorder"

export function isFirstShot(recorder: Recorder): boolean {
  return !recorder.entries.some((e) => e.event.type === EventType.AIM)
}

export function round(num) {
  return Math.fround(num)
}

export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
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

export function random() {
  const array = new Uint32Array(1)
  globalThis.crypto.getRandomValues(array)
  return array[0] / (0xffffffff + 1)
}

export function asin(num) {
  return Math.fround(Math.asin(num))
}

export function acos(num) {
  return Math.fround(Math.acos(num))
}

export function atan(num) {
  return Math.fround(Math.atan(num))
}
