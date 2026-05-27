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

export function bisectionSolver(
  func: (x: number) => number,
  low: number,
  high: number,
  maxIter = 100,
  tol = 1e-8
): number {
  let a = low
  let b = high
  if (func(a) * func(b) > 0) return b
  for (let i = 0; i < maxIter; i++) {
    const mid = (a + b) / 2
    const val = func(mid)
    if (Math.abs(val) < tol) return mid
    if (func(a) * val < 0) {
      b = mid
    } else {
      a = mid
    }
  }
  return (a + b) / 2
}
