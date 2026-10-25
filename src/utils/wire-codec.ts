import { deflateSync, inflateSync } from "fflate"

/**
 * Compact wire encoding for WATCHAIM ball positions.
 *
 * Only x, y pairs are sent (z is decided by the receiver, see Ball).
 * Set `wireConfig.compactWatchBalls` to false to send the verbose
 * Array<{pos, id}> form instead. The decoder accepts both forms.
 */
export const wireConfig = { compactWatchBalls: true }

const PREFIX = "1|"
const BYTES_PER_DOUBLE = 8
const BYTES_PER_BALL = 16

function toBase64url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function fromBase64url(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  let binary: string
  try {
    binary = atob(base64)
  } catch {
    throw new Error("bad base64 payload")
  }
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function encodeCoords(coords: number[]): string {
  const bytes = new Uint8Array(coords.length * BYTES_PER_DOUBLE)
  const view = new DataView(bytes.buffer)
  coords.forEach((val, i) => view.setFloat64(i * BYTES_PER_DOUBLE, val, true))
  return PREFIX + toBase64url(deflateSync(bytes, { level: 9 }))
}

const VECTOR_ZERO_REGEX =
  /(,\s*"(?:x|y|z)"\s*:\s*-?0(?:\.0+)?(?![0-9\.])|"(?:x|y|z)"\s*:\s*-?0(?:\.0+)?(?![0-9\.])\s*,|"(?:x|y|z)"\s*:\s*-?0(?:\.0+)?(?![0-9\.]))/g

/**
 * Strips x=0, y=0, z=0 entries individually from vector objects in a serialized JSON string.
 */
export function removeZeroVectorEntries(str: string): string {
  let prev: string
  do {
    prev = str
    str = str.replace(VECTOR_ZERO_REGEX, "")
  } while (str !== prev)
  return str.replace(/\{\s+\}/g, "{}")
}

const KNOWN_VECTOR_KEYS = new Set([
  "pos",
  "offset",
  "vel",
  "rvel",
  "spin",
  "rspin",
  "acceleration",
  "startPos",
  "endPos",
  "target",
  "center",
  "point",
  "p1",
  "p2",
])

const KNOWN_VECTOR_ARRAY_KEYS = new Set([
  "points",
  "coords",
  "vectors",
  "positions",
])

/**
 * Reinstates missing x, y, z properties at 0 on vector objects in a parsed JSON object.
 */
export function reinstateZeroVectorEntries(obj: any, parentKey: string = ""): any {
  if (!obj || typeof obj !== "object") return obj
  if (Array.isArray(obj)) {
    const isVectorElem = KNOWN_VECTOR_ARRAY_KEYS.has(parentKey)
    for (let i = 0; i < obj.length; i++) {
      if (isVectorElem && typeof obj[i] === "object" && obj[i] !== null) {
        if (obj[i].x === undefined) obj[i].x = 0
        if (obj[i].y === undefined) obj[i].y = 0
        if (obj[i].z === undefined) obj[i].z = 0
      }
      reinstateZeroVectorEntries(obj[i], parentKey)
    }
    return obj
  }
  const keys = Object.keys(obj)
  const isVector =
    KNOWN_VECTOR_KEYS.has(parentKey) ||
    (keys.length > 0 && keys.every((k) => k === "x" || k === "y" || k === "z"))

  if (isVector) {
    if (obj.x === undefined) obj.x = 0
    if (obj.y === undefined) obj.y = 0
    if (obj.z === undefined) obj.z = 0
  }

  for (const k of keys) {
    if (typeof obj[k] === "object" && obj[k] !== null) {
      reinstateZeroVectorEntries(obj[k], k)
    }
  }
  return obj
}

export function decodeCoords(s: string): number[] {
  if (!s.startsWith(PREFIX)) {
    throw new Error("unsupported wire version")
  }
  const compressed = fromBase64url(s.slice(PREFIX.length))
  if (compressed.length === 0) {
    throw new Error("bad coordinate blob length")
  }
  let bytes: Uint8Array
  try {
    bytes = inflateSync(compressed)
  } catch {
    throw new Error("bad compressed payload")
  }
  if (bytes.length === 0 || bytes.length % BYTES_PER_BALL !== 0) {
    throw new Error("bad coordinate blob length")
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const count = bytes.length / BYTES_PER_DOUBLE
  const out: number[] = new Array(count)
  for (let i = 0; i < count; i++) {
    out[i] = view.getFloat64(i * BYTES_PER_DOUBLE, true)
  }
  return out
}
