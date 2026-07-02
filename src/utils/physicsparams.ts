import * as C from "../model/physics/constants"

export function applyPhysicsParams(params: URLSearchParams) {
  for (const [key, value] of params) {
    const setter = (C as any)[`set${key}`]
    if (typeof setter === "function") {
      const n = Number(value)
      if (!isNaN(n)) setter(n)
    }
  }
}
