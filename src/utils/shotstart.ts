import type { Table } from "../model/table"

/**
 * Snapshot of a shot's initial conditions, captured the instant the cue strikes
 * so that a `Depth exceeded resolving collisions` throw in `Table.advance()` can
 * report a recreation link. `balls` is the flat `[x, y, ...]` per-ball position
 * list (the `init` query param); the aim fields are the `initShot` query param.
 * The optional metadata (rulename, cushionModelName, tableSize, dt) is for
 * headless/worker contexts that have no page URL; in the browser
 * `buildRecreateUrl` falls back to the current page's query params for anything
 * not supplied.
 */
export interface ShotStartConditions {
  balls: number[]
  cueBallId: number
  angle: number
  power: number
  offsetX: number
  offsetY: number
  elevation: number
  rulename?: string
  cushionModelName?: string
  tableSize?: number
  /** Informational-only: the physics step size in effect when the shot ran.
   * Printed in the JSON dump but not part of the recreation link (the main game
   * uses a fixed `Container.step`, and `rack.ts`/`aim.ts` don't parse a `dt`). */
  dt?: number
  /** Explicit base URL for the recreation link. A headless caller (e.g. a
   * worker) passes this because its `globalThis.location` points at `worker.js`,
   * not `index.html`. In the browser this is left undefined so
   * `buildRecreateUrl` uses the page URL. */
  baseUrl?: string
}

/**
 * Utility for capturing a shot's initial conditions from a `Table` and turning
 * them into a recreation link (the same `init`/`initShot` query params the live
 * game parses: `src/utils/rack.ts` applies `init`; `src/controller/aim.ts`
 * applies `initShot`). Lives outside `Table` so the model stays free of URL /
 * console plumbing.
 */
export class ShotStartUtils {
  /**
   * Capture the current table state + cue aim as the shot's initial conditions.
   * `Table.hit()` calls this with no `meta` (reads `cue.aim`); a headless caller
   * supplies `meta` when it has no `Cue`. Aim fields fall back to `cue.aim` when
   * not supplied in `meta`.
   */
  static capture(
    table: Table,
    meta?: Partial<Omit<ShotStartConditions, "balls">>
  ): ShotStartConditions {
    const aim = table.cue?.aim
    return {
      balls: table.shortSerialise(),
      cueBallId: meta?.cueBallId ?? table.balls.indexOf(table.cueball),
      angle: meta?.angle ?? aim?.angle ?? 0,
      power: meta?.power ?? aim?.power ?? 0,
      offsetX: meta?.offsetX ?? aim?.offset.x ?? 0,
      offsetY: meta?.offsetY ?? aim?.offset.y ?? 0,
      elevation: meta?.elevation ?? aim?.elevation ?? 0,
      rulename: meta?.rulename,
      cushionModelName: meta?.cushionModelName,
      tableSize: meta?.tableSize,
      dt: meta?.dt,
      baseUrl: meta?.baseUrl,
    }
  }

  /**
   * Build an `index.html` URL that re-opens this shot from its captured initial
   * conditions. Returns `""` when `conditions` is undefined (no snapshot).
   * Rulename/cushionModel/tableSize fall back to the current page URL when not
   * stored on the snapshot (so the browser needs no extra wiring). A headless
   * caller's `baseUrl` is preferred over `globalThis.location` (which, in a
   * worker, points at `worker.js`).
   */
  static buildRecreateUrl(conditions?: ShotStartConditions): string {
    if (!conditions) return ""
    const c = conditions
    const pageBase = (globalThis.location?.href ?? "index.html").split("?")[0]
    const base = c.baseUrl ?? pageBase ?? "index.html"
    const pageParams = new URLSearchParams(globalThis.location?.search ?? "")
    const rulename = c.rulename ?? pageParams.get("ruletype") ?? "nineball"
    const cushionModelName =
      c.cushionModelName ?? pageParams.get("cushionModel") ?? "mathavan"
    const tableSize = c.tableSize ?? Number(pageParams.get("tableSize") ?? 10)
    const params = new URLSearchParams()
    params.set("ruletype", rulename)
    params.set("practice", "")
    params.set("init", JSON.stringify(c.balls))
    params.set(
      "initShot",
      JSON.stringify({
        cueBallId: c.cueBallId,
        angle: c.angle,
        power: c.power,
        offset: { x: c.offsetX, y: c.offsetY },
        elevation: c.elevation,
      })
    )
    params.set("cushionModel", cushionModelName)
    if (tableSize !== 10) params.set("tableSize", String(tableSize))
    return `${base}?${params.toString()}`
  }

  /**
   * Print the shot's initial conditions, a recreation link, and the table's
   * current (post-failure) state to the console so a developer can cut-and-paste
   * the link to reproduce the exact shot that overflowed the collision resolver.
   */
  static reportDepthExceeded(table: Table, conditions?: ShotStartConditions) {
    const url = ShotStartUtils.buildRecreateUrl(conditions)
    console.error(
      "Depth exceeded resolving collisions.\n" +
        "Initial conditions at shot start (JSON):\n" +
        JSON.stringify(conditions ?? null, null, 2) +
        (url
          ? "\nRecreation link (paste in a browser to reproduce):\n" + url
          : "\n(No shot-start snapshot — call ShotStartUtils.capture() before the shot.)") +
        "\nCurrent state (shortSerialise): " +
        JSON.stringify(table.shortSerialise())
    )
  }
}
