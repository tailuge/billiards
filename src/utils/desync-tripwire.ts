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
) {
  if (!statesDiffer(remoteStateCheck, localStateCheck)) {
    return
  }

  if (reportedTripwires.has(label)) {
    return
  }
  reportedTripwires.add(label)

  const extraObj = typeof extra === "function" ? extra() : extra
  globalThis.console?.warn?.(
    label,
    JSON.stringify(
      {
        version: VERSION,
        ...extraObj,
      },
      null,
      2
    )
  )
}

function hashString(input: string): string {
  let hash = HASH_SEED
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, HASH_MULTIPLIER)
  }
  return (hash >>> 0).toString(16)
}
