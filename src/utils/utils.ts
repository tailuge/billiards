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

export function getRandomSeed() {
  const crypto = globalThis.crypto || (globalThis as any).msCrypto
  if (crypto?.getRandomValues !== undefined) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % 999999
  }
  return Math.floor(Math.random() * 999999)
}

export function getFlagForLocale(): string {
  const locale = globalThis.navigator?.language ?? "en-GB"
  const parts = locale.split("-")
  let countryCode = "🌐"

  if (parts.length > 1) {
    // Standard locales: en-GB, zh-Hans-CN, etc.
    // Try to find a 2-letter country code (usually the last part)
    const lastPart = parts[parts.length - 1].toUpperCase()
    if (lastPart.length === 2) {
      countryCode = lastPart
    } else {
      // Fallback for cases like zh-Hant
      const secondPart = parts[1].toUpperCase()
      if (secondPart.length === 2) {
        countryCode = secondPart
      }
    }
  }

  if (countryCode === "🌐") {
    return countryCode
  }

  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("")
}
