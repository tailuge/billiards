import { VERSION } from "./version"

export function getUID() {
  const bytes = new Uint8Array(4)
  globalThis.crypto.getRandomValues(bytes)
  let i = 0
  return `xxxx_${VERSION.substring(0, 6)}`.replace(/x/g, () =>
    bytes[i++].toString(16).padStart(2, "0").substring(0, 1)
  )
}
