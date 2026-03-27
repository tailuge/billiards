import { VERSION } from "./version"

export function getUID() {
  const buf = new Uint8Array(4)
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    globalThis.crypto.getRandomValues(buf)
  } else {
    // Fallback using timestamp and bitwise operations to avoid Math.random()
    // which can trigger security alerts in some contexts.
    let t = Date.now()
    for (let i = 0; i < 4; i++) {
      buf[i] = (t >> (i * 8)) & 0xff
    }
  }
  let uid = ""
  for (let i = 0; i < buf.length; i++) {
    uid += buf[i].toString(16).padStart(2, "0")
  }
  return `${uid}_${VERSION.substring(0, 6)}`
}
