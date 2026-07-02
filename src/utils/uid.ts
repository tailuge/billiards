import { VERSION } from "./version"

function generateRandomHex4(): string {
  return "xxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
}

function getAnonId(): string {
  const stored = globalThis.localStorage?.getItem("anonId")
  if (stored) return stored
  const id = generateRandomHex4()
  globalThis.localStorage?.setItem("anonId", id)
  return id
}

export function getUID() {
  return `${getAnonId()}_${VERSION.substring(0, 6)}`
}
