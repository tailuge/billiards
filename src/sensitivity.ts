/**
 * Shot Sensitivity Analysis — engine core.
 *
 * Phase 1: physics-parity scoring + single-shot worker round-trip.
 * The grid / BFS search (Phase 2) builds on the types and runner defined here.
 *
 * Everything here is id-based (ball ids, not Ball objects) so it runs headless
 * and matches the worker payload shape emitted by src/worker.ts.
 */
import { OutcomeType } from "./model/outcome"
import { R, offCenterLimit, maxPower } from "./model/physics/constants"

/** A ball's id and position, as accepted by the worker. */
export interface BallPos {
  id: number
  pos: { x: number; y: number; z: number }
}

/** The five shot parameters explored by the analysis. */
export interface ShotParams {
  angle: number
  power: number
  offsetX: number
  offsetY: number
  elevation: number
}

/** Cushion models the worker can simulate (mirrors browsercontainer.cushion()). */
export type CushionModelName =
  | "mathavan"
  | "stronge"
  | "bounceHan"
  | "bounceHanBlend"

/** One outcome as returned by the worker (ballA/ballB are ids, frames discarded). */
export interface SimOutcome {
  type: string
  ballA?: number | undefined
  ballB?: number | undefined
  speed?: number | undefined
  t?: number | undefined
}

/** A request posted to the worker. */
export interface WorkerConfig {
  id?: number | string | undefined
  ruleType: string
  balls: BallPos[]
  cushionModel: string
  shot: {
    cueBallId: number
    angle: number
    power: number
    offset: { x: number; y: number }
    elevation: number
  }
  stepSize?: number
  maxIterations?: number
}

/** Result of a single simulation (frames intentionally dropped). */
export interface SimResult {
  id?: number | string
  outcomes: SimOutcome[]
  computeTime?: string
}

/**
 * Build a worker config from id-based ball positions and a ShotParams.
 * stepSize / maxIterations are left to the worker defaults (0.001953125 / 200000)
 * so the simulation always runs to rest and never truncates outcomes.
 */
export function buildWorkerConfig(
  balls: BallPos[],
  cueBallId: number,
  shot: ShotParams,
  ruleType: string,
  cushionModel: string,
  id?: number | string
): WorkerConfig {
  return {
    id,
    ruleType,
    balls,
    cushionModel,
    shot: {
      cueBallId,
      angle: shot.angle,
      power: shot.power,
      offset: { x: shot.offsetX, y: shot.offsetY },
      elevation: shot.elevation,
    },
  }
}

/**
 * Normalise collisions so the cue ball is always ballA — the id-based mirror of
 * Outcome.cueBallFirst (src/model/outcome.ts). Returns a new array; inputs are
 * not mutated.
 */
function cueBallFirst(cueBallId: number, outcomes: SimOutcome[]): SimOutcome[] {
  return outcomes.map((o): SimOutcome => {
    if (o.type === OutcomeType.Collision && o.ballB === cueBallId) {
      return { ...o, ballA: cueBallId, ballB: o.ballA }
    }
    return o
  })
}

/**
 * Three-cushion scoring check — an id-based port of Outcome.isThreeCushionPoint
 * (src/model/outcome.ts:111). Includes the Proximity second pass so it matches
 * the live game exactly. `outcomes` is the worker's outcomes[] array.
 */
export function isThreeCushionScored(
  outcomes: SimOutcome[],
  cueBallId: number
): boolean {
  const cueFirst = cueBallFirst(cueBallId, outcomes).filter(
    (o) => o.ballA === cueBallId
  )

  const cannons = new Set<number | undefined>()
  let cushions = 0
  for (const o of cueFirst) {
    if (o.type === OutcomeType.Cushion) {
      cushions++
    }
    if (o.type === OutcomeType.Collision) {
      cannons.add(o.ballB)
      if (cannons.size === 2) {
        return cushions >= 3
      }
    }
  }

  // Pass 2: proximity point (cue settled next to the second object ball).
  const proximity = cueFirst.find(
    (o) => o.type === OutcomeType.Proximity && o.ballA === cueBallId
  )
  if (proximity) {
    const collisionCount = new Set(
      cueFirst
        .filter(
          (o) => o.type === OutcomeType.Collision && o.ballA === cueBallId
        )
        .map((o) => o.ballB)
    ).size
    if (collisionCount === 1 && cushions >= 3) {
      return true
    }
  }

  return false
}

/**
 * Run a single shot in a fresh Web Worker, resolve with its outcomes, and
 * terminate the worker. Frames are discarded on receipt.
 */
export function simulateShot(
  config: WorkerConfig,
  workerUrl = "worker.js"
): Promise<SimResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl)
    worker.onmessage = (e: MessageEvent) => {
      const d = e.data
      if (d.type === "COMPLETE") {
        worker.terminate()
        resolve({
          id: d.id,
          outcomes: d.outcomes ?? [],
          computeTime: d.computeTime,
        })
      } else if (d.type === "ERROR") {
        worker.terminate()
        reject(new Error(d.error ?? "worker error"))
      }
      // CHECKPOINT messages are ignored.
    }
    worker.onerror = (err) => {
      worker.terminate()
      reject(err)
    }
    worker.postMessage(config)
  })
}

/**
 * A pool of persistent workers, each processing one simulation at a time.
 *
 * Earlier work abandoned worker reuse because a *single* worker fed concurrent
 * postMessages returned corrupted results (responses misrouted, CHECKPOINT
 * messages clobbering handlers). The worker itself resets cleanly per message
 * (new Table + balls + geometry each time — see src/worker.ts), so the fix is
 * not "fresh worker per shot" but strict serialisation: every worker runs at
 * most one job, and a response is matched to the job that slot is running (not by
 * reassigning onmessage). This recovers the throughput the standalone analysis
 * page needs (~tens of sims/sec) without per-shot worker spawn cost.
 */
export class WorkerPool {
  private readonly slots: { worker: WorkerLike; job: PoolJob | null }[] = []
  private readonly queue: PoolJob[] = []
  private terminated = false

  constructor(
    size: number,
    workerUrl = "worker.js",
    createWorker: (url: string) => WorkerLike = (url) => new Worker(url)
  ) {
    for (let i = 0; i < Math.max(1, size); i++) {
      const worker = createWorker(workerUrl)
      const slot = { worker, job: null as PoolJob | null }
      worker.onmessage = (e: MessageEvent) => this.onMessage(slot, e)
      worker.onerror = (err) => this.onError(slot, err)
      this.slots.push(slot)
    }
  }

  /** Queue a simulation; resolves when the assigned worker reports COMPLETE. */
  run(config: WorkerConfig): Promise<SimResult> {
    return new Promise<SimResult>((resolve, reject) => {
      this.queue.push({ config, resolve, reject })
      this.pump()
    })
  }

  /** Terminate all workers and reject anything still in flight or queued. */
  terminate() {
    this.terminated = true
    for (const slot of this.slots) {
      slot.worker.terminate()
      slot.job?.reject(new Error("pool terminated"))
      slot.job = null
    }
    for (const job of this.queue.splice(0)) {
      job.reject(new Error("pool terminated"))
    }
  }

  private pump() {
    if (this.terminated) return
    for (const slot of this.slots) {
      if (slot.job) continue
      const job = this.queue.shift()
      if (!job) return
      slot.job = job
      slot.worker.postMessage(job.config)
    }
  }

  private onMessage(
    slot: { worker: WorkerLike; job: PoolJob | null },
    e: MessageEvent
  ) {
    const d = e.data
    if (d?.type !== "COMPLETE" && d?.type !== "ERROR") return // ignore CHECKPOINTs
    const job = slot.job
    slot.job = null
    if (job) {
      if (d.type === "COMPLETE") {
        job.resolve({
          id: d.id,
          outcomes: d.outcomes ?? [],
          computeTime: d.computeTime,
        })
      } else {
        job.reject(new Error(d.error ?? "worker error"))
      }
    }
    this.pump()
  }

  private onError(
    slot: { worker: WorkerLike; job: PoolJob | null },
    err: unknown
  ) {
    const job = slot.job
    slot.job = null
    job?.reject(err instanceof Error ? err : new Error(String(err)))
    this.pump()
  }
}

interface PoolJob {
  config: WorkerConfig
  resolve: (r: SimResult) => void
  reject: (e: unknown) => void
}

/** Minimal Worker surface the pool needs — lets tests inject a fake worker. */
export interface WorkerLike {
  onmessage: ((e: MessageEvent) => void) | null
  onerror: ((e: ErrorEvent) => void) | null
  postMessage(data: unknown): void
  terminate(): void
}

/**
 * Verify the seed shot scores when re-simulated in the worker. Used to guard
 * the analysis: if a genuinely-played scoring shot fails to reproduce, the
 * physics inputs (model, positions) don't match and the analysis is meaningless.
 */
export async function verifySeed(
  balls: BallPos[],
  cueBallId: number,
  seed: ShotParams,
  ruleType: string,
  cushionModel: string,
  workerUrl = "worker.js"
): Promise<boolean> {
  const config = buildWorkerConfig(
    balls,
    cueBallId,
    seed,
    ruleType,
    cushionModel,
    "seed"
  )
  const result = await simulateShot(config, workerUrl)
  return isThreeCushionScored(result.outcomes, cueBallId)
}

// ===========================================================================
// Phase 2: grid + BFS flood-fill search + robustness
// ===========================================================================

/** The five searchable shot parameters. */
export type ParamKey = "angle" | "power" | "offsetX" | "offsetY" | "elevation"

export const ALL_PARAMS: ParamKey[] = [
  "angle",
  "power",
  "offsetX",
  "offsetY",
  "elevation",
]

/** Default selection when the analysis panel opens: side + top spin only. */
export const DEFAULT_PARAMS: ParamKey[] = ["offsetX", "offsetY"]

/** Minimum half-window for the aim angle, so very long shots still get a usable
 * step instead of an unmeasurably tiny one. */
const MIN_ANGLE_HALF_WINDOW = (0.5 * Math.PI) / 180 // 0.5°

/** Steps on each side of the seed for the aim-angle and speed 1-D sweeps, so
 * each yields 2 * ONE_D_STEPS_EACH_SIDE + 1 = 21 simulations over its physical
 * half-window. */
const ONE_D_STEPS_EACH_SIDE = 10

/** Hard safety ceiling on evaluated cells — guards against a runaway flood-fill
 * (e.g. an unbounded scoring region in an unclamped dimension). Not a cost cap. */
const MAX_CELLS = 200_000

/** Per-parameter grid axis: a step, physical clamp bounds, and how many steps to
 * scan on each side of the seed (the seed value is the grid origin, index 0). */
export interface AxisSpec {
  key: ParamKey
  center: number
  step: number
  min: number
  max: number
  stepsEachSide: number
}

/** Per-parameter ranges reported back for display (values, not indices). */
export interface ParamRange {
  key: ParamKey
  center: number
  step: number
  physicalMin: number
  physicalMax: number
  scannedMin: number
  scannedMax: number
  scoringMin: number
  scoringMax: number
}

export interface SensitivityResult {
  selected: ParamKey[]
  axes: AxisSpec[]
  ranges: ParamRange[]
  scoringPoints: ShotParams[]
  evaluated: number
  scoredCount: number
  elapsedMs: number
}

/** Threecushion playing area (cushion-nose half-extents), mirroring the geometry
 * the worker sets up in src/worker.ts. */
function threeCushionPlayArea(): { tableX: number; tableY: number } {
  const UMB_TABLE_X = 92.36
  const UMB_TABLE_Y = 46.18
  return {
    tableX: R * (UMB_TABLE_X / 2 - 1),
    tableY: R * (UMB_TABLE_Y / 2 - 1),
  }
}

/**
 * Distance from the cue ball to the first thing the aim ray meets: the nearest
 * object-ball centre within 2R of the ray, else the cushion. Drives the angle
 * step (a closer target → wider angular tolerance).
 */
export function firstContactDistance(
  balls: BallPos[],
  cueBallId: number,
  angle: number
): number {
  const cue = balls.find((b) => b.id === cueBallId)
  if (!cue) return 1.0
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  let best = Infinity
  for (const b of balls) {
    if (b.id === cueBallId) continue
    const rx = b.pos.x - cue.pos.x
    const ry = b.pos.y - cue.pos.y
    const t = rx * dx + ry * dy // projection along the ray
    if (t <= 0) continue // behind the cue
    const perp = Math.abs(rx * dy - ry * dx)
    if (perp <= 2 * R) best = Math.min(best, t)
  }
  if (best !== Infinity) return best

  // No ball in the path → distance to the cushion box.
  const { tableX, tableY } = threeCushionPlayArea()
  let tHit = Infinity
  if (dx > 0) tHit = Math.min(tHit, (tableX - cue.pos.x) / dx)
  else if (dx < 0) tHit = Math.min(tHit, (-tableX - cue.pos.x) / dx)
  if (dy > 0) tHit = Math.min(tHit, (tableY - cue.pos.y) / dy)
  else if (dy < 0) tHit = Math.min(tHit, (-tableY - cue.pos.y) / dy)
  return Number.isFinite(tHit) && tHit > 0 ? tHit : 1.0
}

/**
 * Build the grid axis spec for each selected parameter: the seed-centred step
 * size and the physical clamps. The flood-fill is bounded only by these clamps
 * (and genuine failures), so there is no artificial scan-window edge.
 */
export function buildAxisSpecs(
  baseShot: ShotParams,
  balls: BallPos[],
  cueBallId: number,
  selected: ParamKey[],
  stepScale = 1
): AxisSpec[] {
  // Build a spec from a step + a physical half-window. stepScale shrinks the
  // step (finer grid) without changing the window, so finer steps mean more
  // cells covering the *same* physical range.
  const spec = (
    key: ParamKey,
    center: number,
    baseStep: number,
    min: number,
    max: number,
    halfWindow: number
  ): AxisSpec => {
    const step = baseStep * stepScale
    return {
      key,
      center,
      step,
      min,
      max,
      // ceil so the full physical half-window is always covered (no partial
      // step dropped at the ends).
      stepsEachSide: Math.max(1, Math.ceil(halfWindow / step)),
    }
  }

  return selected.map((key): AxisSpec => {
    switch (key) {
      case "angle": {
        const d = firstContactDistance(balls, cueBallId, baseShot.angle)
        const cone = Math.max(Math.atan2(R, d), MIN_ANGLE_HALF_WINDOW)
        return spec(
          key,
          baseShot.angle,
          cone / ONE_D_STEPS_EACH_SIDE,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          cone
        )
      }
      case "power": {
        const halfWindow = Math.max(0.4 * Math.abs(baseShot.power), 0.45)
        return spec(
          key,
          baseShot.power,
          halfWindow / ONE_D_STEPS_EACH_SIDE,
          0,
          maxPower,
          halfWindow
        )
      }
      case "offsetX":
        return spec(
          key,
          baseShot.offsetX,
          0.025,
          -offCenterLimit,
          offCenterLimit,
          0.2
        )
      case "offsetY":
        return spec(
          key,
          baseShot.offsetY,
          0.025,
          -offCenterLimit,
          offCenterLimit,
          0.2
        )
      case "elevation":
        return spec(
          key,
          baseShot.elevation,
          0.025,
          0,
          (2 * Math.PI) / 5,
          0.1745
        )
    }
  })
}

/** Value of a parameter at a given grid index along its axis. */
function valueAt(axis: AxisSpec, index: number): number {
  return axis.center + index * axis.step
}

/** Build a full ShotParams for a cell (selected params from indices, the rest
 * pinned to the seed). */
function cellToShot(
  baseShot: ShotParams,
  axes: AxisSpec[],
  indices: number[]
): ShotParams {
  const shot: ShotParams = { ...baseShot }
  axes.forEach((axis, i) => {
    shot[axis.key] = valueAt(axis, indices[i])
  })
  return shot
}

/** A cell is valid if every selected param is within its clamp and the spin
 * stays inside the off-centre disk. Out-of-range cells are skipped (never
 * simulated, never counted as failures). */
function isCellValid(
  baseShot: ShotParams,
  axes: AxisSpec[],
  indices: number[]
): boolean {
  for (let i = 0; i < axes.length; i++) {
    const v = valueAt(axes[i], indices[i])
    if (v < axes[i].min || v > axes[i].max) return false
  }
  // The off-centre disk only constrains cells when spin is actually varied. If
  // neither spin axis is selected the offset is fixed at the (playable) seed, so
  // it must not reject neighbours — even when the seed sits exactly on the limit.
  const spinSelected = axes.some(
    (a) => a.key === "offsetX" || a.key === "offsetY"
  )
  if (spinSelected) {
    const shot = cellToShot(baseShot, axes, indices)
    if (Math.hypot(shot.offsetX, shot.offsetY) > offCenterLimit + 1e-9) {
      return false
    }
  }
  return true
}

const keyOf = (indices: number[]) => indices.join(",")

/** Pluggable per-shot scorer (real worker by default; a stub in tests). */
export type Scorer = (shot: ShotParams) => Promise<boolean>

export interface SensitivityOptions {
  balls: BallPos[]
  cueBallId: number
  baseShot: ShotParams
  ruleType: string
  cushionModel: string
  selectedParams?: ParamKey[]
  /** Multiplier on every grid step (<1 = finer/denser grid, more sims). */
  stepScale?: number
  poolSize?: number
  workerUrl?: string
  /** Injectable scorer (tests). When omitted, a fresh worker is used per shot. */
  scorer?: Scorer
  onProgress?: (evaluated: number, scored: number) => void
  /** Called for every evaluated cell — used to build a CSV export. */
  onEvaluate?: (shot: ShotParams, scored: boolean) => void
  signal?: { aborted: boolean }
}

/**
 * Evaluate the full bounded grid (every cell within ±stepsEachSide per axis) and
 * return all scoring cells. We deliberately do NOT flood-fill: three-cushion
 * shots can be chaotic in a parameter (e.g. power on long shots), so the scoring
 * set is not contiguous — there can be scoring cells beyond a failing one. Cells
 * are evaluated concurrently across the worker pool.
 */
export async function runSensitivityAnalysis(
  opts: SensitivityOptions
): Promise<SensitivityResult> {
  const selected = opts.selectedParams ?? DEFAULT_PARAMS
  const axes = buildAxisSpecs(
    opts.baseShot,
    opts.balls,
    opts.cueBallId,
    selected,
    opts.stepScale ?? 1
  )
  const start = Date.now()

  const detectedCores =
    (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4
  const poolSize = opts.poolSize ?? detectedCores
  // A persistent pool of `poolSize` workers, each running one sim at a time, is
  // reused for the whole scan — no per-shot worker spawn cost. See WorkerPool
  // for why this is safe where naive reuse was not. Tests inject `scorer` and
  // never touch a worker.
  const workerUrl = opts.workerUrl ?? "worker.js"
  const pool = opts.scorer ? null : new WorkerPool(poolSize, workerUrl)
  const score: Scorer = opts.scorer
    ? opts.scorer
    : async (shot) => {
        const result = await pool!.run(
          buildWorkerConfig(
            opts.balls,
            opts.cueBallId,
            shot,
            opts.ruleType,
            opts.cushionModel
          )
        )
        return isThreeCushionScored(result.outcomes, opts.cueBallId)
      }

  const scoring = new Map<string, number[]>() // key -> indices
  let evaluated = 0
  const concurrency = Math.max(
    1,
    opts.scorer ? Math.max(1, poolSize) : poolSize
  )

  try {
    // Guard against an unmanageably large full grid (e.g. fine steps in 5-D).
    const totalCells = axes.reduce((n, a) => n * (2 * a.stepsEachSide + 1), 1)
    if (totalCells > MAX_CELLS) {
      throw new Error(
        `Grid too large: ${totalCells} cells (limit ${MAX_CELLS}). ` +
          `Use fewer parameters, a coarser stepScale, or accept a smaller window.`
      )
    }

    // Enumerate every cell in the bounded box, then keep the valid ones.
    let cells: number[][] = [[]]
    for (const a of axes) {
      const next: number[][] = []
      for (const c of cells) {
        for (let k = -a.stepsEachSide; k <= a.stepsEachSide; k++) {
          next.push([...c, k])
        }
      }
      cells = next
    }
    const validCells = cells.filter((c) => isCellValid(opts.baseShot, axes, c))

    // Evaluate the valid cells concurrently across the pool. Each lane pulls the
    // next cell until the grid is exhausted, the user aborts, or one lane errors
    // (`stop`). allSettled (not all) so every lane's rejection is observed — no
    // unhandled rejections when one lane fails or we abort.
    let cursor = 0
    let stop = false
    const lane = async (): Promise<void> => {
      for (;;) {
        if (stop || opts.signal?.aborted) return
        const i = cursor++
        if (i >= validCells.length) return
        const cell = validCells[i]
        const shot = cellToShot(opts.baseShot, axes, cell)
        let scored: boolean
        try {
          scored = await score(shot)
        } catch (e) {
          if (opts.signal?.aborted || stop) return
          stop = true
          throw e
        }
        evaluated++
        if (scored) scoring.set(keyOf(cell), cell)
        opts.onEvaluate?.(shot, scored)
        opts.onProgress?.(evaluated, scoring.size)
      }
    }
    const settled = await Promise.allSettled(
      Array.from({ length: concurrency }, () => lane())
    )
    if (opts.signal?.aborted) throw new Error("aborted")
    const failed = settled.find((s) => s.status === "rejected")
    if (failed) throw (failed as PromiseRejectedResult).reason
  } finally {
    pool?.terminate()
  }

  const scoringPoints = [...scoring.values()].map((indices) =>
    cellToShot(opts.baseShot, axes, indices)
  )

  // --- per-parameter ranges for display.
  const ranges: ParamRange[] = axes.map((axis, i) => {
    // Scanned range = the bounded window (clamped to physical limits).
    const scannedMin = Math.max(valueAt(axis, -axis.stepsEachSide), axis.min)
    const scannedMax = Math.min(valueAt(axis, axis.stepsEachSide), axis.max)
    let scoringMinIdx = 0
    let scoringMaxIdx = 0
    let hasScoring = false
    for (const indices of scoring.values()) {
      scoringMinIdx = hasScoring
        ? Math.min(scoringMinIdx, indices[i])
        : indices[i]
      scoringMaxIdx = hasScoring
        ? Math.max(scoringMaxIdx, indices[i])
        : indices[i]
      hasScoring = true
    }
    return {
      key: axis.key,
      center: axis.center,
      step: axis.step,
      physicalMin: axis.min,
      physicalMax: axis.max,
      scannedMin,
      scannedMax,
      scoringMin: valueAt(axis, scoringMinIdx),
      scoringMax: valueAt(axis, scoringMaxIdx),
    }
  })

  return {
    selected,
    axes,
    ranges,
    scoringPoints,
    evaluated,
    scoredCount: scoring.size,
    elapsedMs: Date.now() - start,
  }
}
