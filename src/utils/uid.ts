import { VERSION } from "./version"

export function getUID() {
  return `xxxx_${VERSION.substring(0, 6)}`.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
}
