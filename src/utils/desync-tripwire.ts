import { VERSION } from "./version"

const DESYNC_THRESHOLD = 1e-9
const HASH_SEED = 2166136261
const HASH_MULTIPLIER = 16777619

export interface BallPositionDiff {
  ballIndex: number
  remoteX: number
  remoteY: number
  localX: number
  localY: number
  dx: number
  dy: number
  dist: number
}

export interface StateDiffSummary {
  maxDrift: number
  driftedBallIndices: number[]
  ballDiffs: BallPositionDiff[]
}

export function hashStateCheck(stateCheck: number[] | undefined): string {
  if (!stateCheck) {
    return "missing"
  }

  return hashString(stateCheck.join(","))
}

export function hashJson(value: unknown): string {
  return hashString(JSON.stringify(value))
}

export function summariseStateDiff(
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[],
  threshold: number = DESYNC_THRESHOLD
): StateDiffSummary | undefined {
  if (remoteStateCheck?.length !== localStateCheck.length) {
    return undefined
  }

  const remoteState = remoteStateCheck!

  let maxDrift = 0
  const driftedBallIndices: number[] = []
  const ballDiffs: BallPositionDiff[] = []

  for (let i = 0; i < remoteState.length; i += 2) {
    const remoteX = remoteState[i]
    const remoteY = remoteState[i + 1]
    const localX = localStateCheck[i]
    const localY = localStateCheck[i + 1]
    const dx = remoteX - localX
    const dy = remoteY - localY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    const dist = Math.hypot(dx, dy)
    const localMaxDrift = Math.max(absDx, absDy)

    if (localMaxDrift > maxDrift) {
      maxDrift = localMaxDrift
    }

    if (absDx > threshold || absDy > threshold) {
      const ballIndex = i / 2
      driftedBallIndices.push(ballIndex)
      ballDiffs.push({
        ballIndex,
        remoteX,
        remoteY,
        localX,
        localY,
        dx,
        dy,
        dist,
      })
    }
  }

  return {
    maxDrift,
    driftedBallIndices,
    ballDiffs,
  }
}

export function checkDesyncTripwire(
  label: string,
  remoteStateCheck: number[] | undefined,
  localStateCheck: number[],
  extra: Record<string, unknown> | (() => Record<string, unknown>) = {}
) {
  const diffSummary = summariseStateDiff(remoteStateCheck, localStateCheck)
  if (!diffSummary) {
    return
  }

  if (diffSummary.maxDrift <= DESYNC_THRESHOLD) {
    return
  }

  const extraObj = typeof extra === "function" ? extra() : extra
  globalThis.console?.warn?.(
    label,
    JSON.stringify(
      {
        version: VERSION,
        maxDrift: diffSummary.maxDrift,
        driftedBallIndices: diffSummary.driftedBallIndices,
        remoteStateHash: hashStateCheck(remoteStateCheck),
        localStateHash: hashStateCheck(localStateCheck),
        ballDiffs: diffSummary.ballDiffs,
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
