import { VERSION } from "./version"

const BASE36_LENGTH = 3
const BASE36_RANGE = 36 ** BASE36_LENGTH

function generateRandomBase36(): string {
  const value = Math.floor(Math.random() * BASE36_RANGE)
  return value.toString(36).padStart(BASE36_LENGTH, "0")
}

function getAnonId(): string {
  const stored = globalThis.localStorage?.getItem("anonId")
  if (stored) return stored
  const id = generateRandomBase36()
  globalThis.localStorage?.setItem("anonId", id)
  return id
}

export function getUID() {
  return `${getAnonId()}${VERSION.substring(2, 6)}`
}
