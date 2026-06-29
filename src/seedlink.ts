/**
 * Seed handoff for the shot analysis view.
 *
 * Both drill and analysis are query-flag modes of index.html. Switching between
 * them (or opening either from the replay magnifying glass) re-opens the same
 * shot via the `init` / `initShot` params the live game already parses
 * (src/utils/rack.ts applies `init`; src/controller/aim.ts applies `initShot`).
 */
import { BallPos, ShotParams } from "./sensitivity"

/** Everything needed to reproduce and explore a shot. */
export interface AnalysisSeed {
  balls: BallPos[]
  cueBallId: number
  shot: ShotParams
  ruleType: string
  cushionModel: string
}

export type GameMode = "analysis" | "drill"

/** The current index.html URL without its query string — switching modes stays
 * on the same origin/deployment the game is already running on. */
function currentPageUrl(): string {
  return (globalThis.location?.href ?? "index.html").split("?")[0]
}

/**
 * Build an index.html URL that re-opens this shot in `analysis` or `drill` mode,
 * encoded with the same `init`/`initShot` params the live game parses.
 * `cueBallId` is the cue ball's INDEX in the balls array — aim.ts reads it as
 * `table.balls[cueBallId]`.
 */
export function buildModeUrl(
  seed: AnalysisSeed,
  mode: GameMode,
  base = currentPageUrl()
): string {
  const init = JSON.stringify(seed.balls.flatMap((b) => [b.pos.x, b.pos.y]))
  const initShot = JSON.stringify({
    cueBallId: seed.cueBallId,
    angle: seed.shot.angle,
    power: seed.shot.power,
    offset: { x: seed.shot.offsetX, y: seed.shot.offsetY },
    elevation: seed.shot.elevation,
  })
  const params = new URLSearchParams()
  params.set("ruletype", "threecushion")
  params.set("practice", "")
  params.set(mode, "")
  params.set("init", init)
  params.set("initShot", initShot)
  return `${base}?${params.toString()}`
}
