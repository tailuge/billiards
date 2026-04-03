import { VERSION } from "./version"

const DESYNC_THRESHOLD = 1e-6

export function checkDesyncTripwire(
  label: string,
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[],
  extra: Record<string, unknown> = {}
) {
  if (!remoteStateCheck || remoteStateCheck.length !== localStateCheck.length) {
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

  console.warn(
    label,
    JSON.stringify(
      {
        version: VERSION,
        maxDrift: drift,
        driftedBallIndices: driftedIndices,
        ...extra,
      },
      null,
      2
    )
  )
}
