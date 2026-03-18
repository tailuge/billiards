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

export function getRandomSeed(): number {
  const crypto =
    globalThis.crypto || (globalThis as Record<string, unknown>).msCrypto
  if (
    crypto !== undefined &&
    typeof (crypto as Crypto).getRandomValues === "function"
  ) {
    const array = new Uint32Array(1)
    ;(crypto as Crypto).getRandomValues(array)
    return array[0] % 999999
  }
  // Fallback to time-based seed if crypto is unavailable (not for security sensitive tasks)
  return Date.now() % 999999
}

export function getFlagForLocale(): string {
  const locale = globalThis.navigator?.language ?? "en-GB"
  const parts = locale.split("-")
  let countryCode = ""

  // Standard locales: en-GB, zh-Hans-CN, etc.
  // Search for a 2-letter country code in the locale string
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i].toUpperCase()
    if (part.length === 2 && /^[A-Z]{2}$/.test(part)) {
      countryCode = part
      break
    }
  }

  if (countryCode === "") {
    return "🌐"
  }

  const OFFSET = 127397
  return countryCode
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + OFFSET))
    .join("")
}
