import { Vector3 } from "three"

type PositionLike = {
  x: number
  y: number
}

type AimLike = {
  pos: Vector3
  power: number
  i: number
}

type ExtraFields = Record<string, unknown>

const TRIPWIRE_THRESHOLD = 1e-9

export function warnAimDriftTripwire(
  label: string,
  aim: AimLike | undefined,
  cueballPos: PositionLike | undefined,
  extra: ExtraFields = {}
) {
  if (!aim || !cueballPos) {
    return
  }

  const dx = cueballPos.x - aim.pos.x
  const dy = cueballPos.y - aim.pos.y
  const d = Math.hypot(dx, dy)

  if (d <= TRIPWIRE_THRESHOLD) {
    return
  }

  console.warn(
    label,
    JSON.stringify(
      {
        dx,
        dy,
        d,
        power: aim.power,
        i: aim.i,
        aim: {
          x: aim.pos.x,
          y: aim.pos.y,
        },
        cueball: {
          x: cueballPos.x,
          y: cueballPos.y,
        },
        ...extra,
      },
      null,
      2
    )
  )
}
