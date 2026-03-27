import { EventType } from "../events/eventtype"
import { Recorder } from "../events/recorder"

export function isFirstShot(recorder: Recorder): boolean {
  return !recorder.entries.some((e) => e.event.type === EventType.AIM)
}

export function round(num) {
  const sign = Math.sign(num)
  return (sign * Math.floor((Math.abs(num) + Number.EPSILON) * 10000)) / 10000
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

export function getOriginalIdentity() {
  const params = new URLSearchParams(globalThis.location?.search ?? "")
  return {
    userId: params.get("userId") ?? params.get("clientId"),
    userName: params.get("userName") ?? params.get("name") ?? params.get("playername")
  }
}
