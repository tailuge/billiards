import { VERSION } from "./version"

const DESYNC_THRESHOLD = 1e-9

export function checkDesyncTripwire(
  label: string,
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[],
  extra: Record<string, unknown> | (() => Record<string, unknown>) = {}
) {
  if (remoteStateCheck?.length !== localStateCheck.length) {
    return
  }

  let drift = 0
  for (let i = 0; i < remoteStateCheck.length; i++) {
    const diff = Math.abs(remoteStateCheck[i] - localStateCheck[i])
    if (diff > drift) {
      drift = diff
    }
  }

  if (drift <= DESYNC_THRESHOLD) {
    return
  }

  // Find the exact balls that drifted the most
  const driftedIndices: number[] = []
  for (let i = 0; i < remoteStateCheck.length; i += 2) {
    const dx = Math.abs(remoteStateCheck[i] - localStateCheck[i])
    const dy = Math.abs(remoteStateCheck[i + 1] - localStateCheck[i + 1])
    if (dx > DESYNC_THRESHOLD || dy > DESYNC_THRESHOLD) {
      driftedIndices.push(i / 2)
    }
  }

  const extraObj = typeof extra === "function" ? extra() : extra
  console.warn(
    label,
    JSON.stringify(
      {
        version: VERSION,
        maxDrift: drift,
        driftedBallIndices: driftedIndices,
        ...extraObj,
      },
      null,
      2
    )
  )
}

export function buildRecordingUrl(compressedState: string): string {
  const origin = globalThis.location.origin
  return `${origin}/?state=${encodeURIComponent(compressedState)}`
}
