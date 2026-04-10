import { VERSION } from "./version"

const HASH_SEED = 2166136261
const HASH_MULTIPLIER = 16777619
const reportedTripwires = new Set<string>()

export function hashStateCheck(stateCheck: number[] | undefined): string {
  if (!stateCheck) {
    return "missing"
  }

  return hashString(stateCheck.join(","))
}

export function hashJson(value: unknown): string {
  return hashString(JSON.stringify(value))
}

export function statesDiffer(
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[]
): boolean {
  if (remoteStateCheck?.length !== localStateCheck.length) {
    return true
  }

  for (let i = 0; i < remoteStateCheck.length; i++) {
    if (remoteStateCheck[i] !== localStateCheck[i]) {
      return true
    }
  }

  return false
}

export function checkDesyncTripwire(
  label: string,
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[],
  extra: Record<string, unknown> | (() => Record<string, unknown>) = {}
): string | undefined {
  if (remoteStateCheck && !statesDiffer(remoteStateCheck, localStateCheck)) {
    return undefined
  }

  const extraObj = typeof extra === "function" ? extra() : extra
  const payload = JSON.stringify(
    {
      version: VERSION,
      ...extraObj,
    },
    null,
    2
  )

  if (!reportedTripwires.has(label)) {
    reportedTripwires.add(label)
    globalThis.console?.warn?.(label, payload)
  }

  return payload
}

function hashString(input: string): string {
  let hash = HASH_SEED
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, HASH_MULTIPLIER)
  }
  return (hash >>> 0).toString(16)
}
