/**
 * Shot-sensitivity analysis renderer.
 *
 * Builds its own DOM inside a host element and runs the analysis engine
 * (src/sensitivity.ts) off the main thread via worker.js, rendering the result
 * as a spin-plane scatter + per-axis tolerance bars. Used by the in-game
 * split-screen analysis view (src/view/analysispanel.ts). The pure geometry /
 * formatting helpers are exported for unit testing.
 */
import { offCenterLimit, R } from "../model/physics/constants"
import {
  DEFAULT_SPIN_HALF_WINDOW,
  OutcomeSignature,
  ParamKey,
  ParamRange,
  SPIN_GRID_STEP,
  Scorer,
  ShotParams,
  WorkerPool,
  buildAxisSpecs,
  buildWorkerConfig,
  firstContactDistance,
  isThreeCushionScored,
  paramRangeOf,
  runSensitivityAnalysis,
  signaturesMatch,
  simulateShot,
  verifySeed,
} from "../sensitivity"
import { AnalysisSeed } from "../seedlink"

const PARAM_LABELS: Record<ParamKey, string> = {
  offsetX: "side spin",
  offsetY: "top/back spin",
  power: "speed",
  angle: "aim shift (ball widths)",
  elevation: "elevation",
}

type EvalPoint = { shot: ShotParams; scored: boolean }

/** A finished 1-D sweep: its axis range plus every evaluated cell (value +
 * outcome), so the bar can draw the studied window cell-by-cell. */
export type OneDResult = {
  range: ParamRange
  cells: { value: number; scored: boolean }[]
  /** Angle axis only: distance `d` to the first contact, used to convert
   * angle offsets to ghost-ball position shifts (in ball diameters). */
  contactDistance?: number
}

/** Format a parameter value for display: speed to 1 decimal, elevation as a
 * whole-degree integer, the rest (offsets) to 2 decimals. */
export function formatValue(key: ParamKey, v: number): string {
  if (!Number.isFinite(v)) return "∞"
  if (key === "elevation") return `${Math.round((v * 180) / Math.PI)}°`
  if (key === "power") return v.toFixed(1)
  return v.toFixed(2)
}

/** Convert an aim-angle value to the magnitude of the ghost-ball position
 * shift it implies at distance `d`, in ball-diameter (2R) units, e.g. "0.43".
 * Direction (left/right) is conveyed separately by the bar's shift labels,
 * not by sign — a bare "-0.25" isn't an intuitive number for players. */
export function formatAngleShift(v: number, center: number, d: number): string {
  const diameters = (Math.tan(v - center) * d) / (2 * R)
  return Math.abs(diameters).toFixed(2)
}

/** Pick the right formatter for an axis value: aim angle shows the
 * ghost-ball position shift (Ø), other axes use `formatValue`. */
function formatAxisValue(od: OneDResult, v: number): string {
  return od.range.key === "angle"
    ? formatAngleShift(v, od.range.center, od.contactDistance ?? 1.0)
    : formatValue(od.range.key, v)
}

/** The aim-angle bar is mirrored left-right relative to the raw angle axis: a
 * more negative angle steers the cue ball's contact point to the RIGHT, so
 * showing it on the right of the bar matches the on-table direction instead
 * of the raw mathematical axis (where it would land on the left). */
function isMirrored(od: OneDResult): boolean {
  return od.range.key === "angle"
}

/** Markup for the analysis results panel (scatter + bars + hidden toolbar). */
const PANEL_HTML = `
  <div class="analysis-results">
    <div class="analysis-status" data-an="status">Loading…</div>
    <div class="col-spin">
      <h2>Spin (side vs top/back)</h2>
      <div class="legend">
        <span class="ok">scores</span>
        <span class="fail">misses</span>
        <span class="original">original shot</span>
      </div>
      <div class="plot-wrap">
        <canvas data-an="plot" width="420" height="420"></canvas>
        <div data-an="spinMarker" class="spin-marker" hidden></div>
        <button data-an="spinShow" class="spin-show" disabled>Show</button>
      </div>
    </div>
    <div class="col-bars">
      <h2>1-D tolerances</h2>
      <div class="bars" data-an="bars"></div>
    </div>
    <div class="analysis-toolbar">
      <button data-an="csv" class="secondary" disabled>Download CSV</button>
      <button data-an="stop" class="secondary" disabled>Stop</button>
    </div>
  </div>`

/** A click on one of the displays, picking a new value for a shot parameter. */
export type Pick =
  | { kind: "spin"; x: number; y: number }
  | { kind: "angle" | "power" | "elevation"; value: number }

export interface AnalysisHandle {
  /** Abort an in-flight scan. */
  stop(): void
  /** Reposition the single white marker on each display to the current live
   * shot. (`seed` is accepted for the signature but no longer drawn.) */
  setLiveShot(shot: ShotParams, seed: ShotParams): void
}

export interface RunAnalysisOptions {
  /** The shot's actual (main-thread) outcome. When given, the worker's seed
   * simulation must match it or the scan is aborted with a parity warning.
   * When omitted, the scan runs regardless of whether the seed scored. */
  expectedSignature?: OutcomeSignature
  workerUrl?: string
  /** Called when the user clicks a display to pick a new parameter value. */
  onPick?: (pick: Pick) => void
  /** Called when the elevation bar's Show is clicked, so the host can reveal
   * the cue-ball tilt control if it's currently collapsed. */
  onShowElevation?: () => void
}

/** Pixel geometry of the spin scatter, captured from the last drawPlot so the
 * spin marker overlay and click-mapping share the same coordinate transform. */
interface PlotGeom {
  cx: number
  cy: number
  r: number
  lim: number
  W: number
  H: number
}

/**
 * Build the analysis UI inside `rootEl` and run the fixed analysis set for
 * `seed`. Returns a handle whose `stop()` aborts the scan. Works for scoring AND
 * missed seeds (see RunAnalysisOptions.expectedSignature).
 */
export function runAnalysisInto(
  rootEl: HTMLElement,
  seed: AnalysisSeed,
  opts: RunAnalysisOptions = {}
): AnalysisHandle {
  const workerUrl = opts.workerUrl ?? "worker.js"
  rootEl.innerHTML = PANEL_HTML
  const $ = <T extends HTMLElement>(name: string) =>
    rootEl.querySelector(`[data-an="${name}"]`) as T

  const statusEl = $("status")
  const canvas = $<HTMLCanvasElement>("plot")
  const spinMarker = $("spinMarker")
  const barsEl = $("bars")
  const stopBtn = $<HTMLButtonElement>("stop")
  const csvBtn = $<HTMLButtonElement>("csv")
  const spinShowBtn = $<HTMLButtonElement>("spinShow")

  const signal = { aborted: false }
  let spinPoints: EvalPoint[] = []
  const oneDResults: OneDResult[] = []
  let csvRows: string[] = []
  const hasResults = () => spinCache.size > 0 || oneDCache.size > 0

  // --- on-demand / interactive state -------------------------------------
  // The three 1-D sweeps are run on demand (not on load); the spin 2-D scan is.
  const ONE_D_KEYS: ParamKey[] = ["angle", "power", "elevation"]
  // The live shot the displays describe: the base for any scan launched, and
  // what the markers track. Fed in by AnalysisPanel via setLiveShot; starts at
  // the seed (= the initial live shot).
  let liveShot: ShotParams = seed.shot
  // The 1-D bar (if any) currently filled with a sweep; the other two are empty.
  let activeOneD: { key: ParamKey; od: OneDResult } | null = null
  // Mutual exclusivity: only ONE of {spin scatter, aim, speed, elevation} shows
  // real simulation data at a time (user decision — showing two populated
  // displays at once is confusing, even when both are individually accurate).
  // "spin" = the scatter is the active display; a ParamKey = that bar is (and
  // the spin canvas is forced to just the current-shot point, ignoring any
  // cached scatter that may exist for the live aim/speed/elevation).
  let activeView: "spin" | ParamKey = "spin"
  // The spin scatter sweeps offsetX/offsetY holding aim/speed/elevation fixed, so
  // it is valid for the live shot exactly while those three match — changing the
  // spin keeps it valid, changing aim/speed/elevation makes it stale (whether a
  // scatter is shown is derived from spinCache.has(spinBaseSig(liveShot))).
  let busy = false
  // The white spin marker's own simulated result — colors its interior with
  // green/red (user decision: "we should always show the result of the shot
  // by a color in the middle of the circle"). null while a single-point
  // simulation is in flight or hasn't been requested (ring stays hollow).
  let markerResult: { shot: ShotParams; scored: boolean } | null = null
  // Bumped on every new marker-color request so a stale simulation that
  // resolves after the spin has moved again is discarded, not applied.
  let markerGen = 0
  // Per-bar marker coloring (aim/speed/elevation) — ALWAYS on, independent of
  // activeView ("display the shot result on the 1D bars even if the full
  // range is not displayed"). One result/generation/last-requested-signature
  // per axis, mirroring markerResult/markerGen but scoped per key.
  const barMarkerResult: Partial<
    Record<ParamKey, { shot: ShotParams; scored: boolean } | null>
  > = {}
  const barMarkerGen: Partial<Record<ParamKey, number>> = {}
  // Skips a redundant re-simulation when the axis's effective evaluation shot
  // hasn't actually changed grid cell since the last request — without this a
  // continuous slider drag would fire a fresh simulation every frame.
  const barMarkerLastSig: Partial<Record<ParamKey, string>> = {}
  // Single-point results for the bars, separate from oneDCache (which stores
  // whole sweeps): keyed `${key}|${sig5(effectiveShot)}`.
  const oneDMarkerCache = new Map<string, boolean>()
  // Caches so revisiting a shot is instant (scans are expensive). The spin
  // scatter is keyed by its fixed base (aim/speed/elevation only — not spin,
  // which it sweeps); each 1-D sweep is keyed by the full shot. Each entry
  // already covers the WHOLE legal disk (DEFAULT_SPIN_HALF_WINDOW ==
  // offCenterLimit), so there's nothing further to grow.
  const spinCache = new Map<string, { points: EvalPoint[] }>()
  const oneDCache = new Map<string, OneDResult>()
  // Empty (un-scanned) bars: grey track + ruler + markers, centred on the seed
  // ("initial shot parameters"). Built once with no simulation; reused to clear
  // a bar back to empty when another becomes active.
  const emptyBars: Record<string, OneDResult> = {}
  for (const k of ONE_D_KEYS) emptyBars[k] = buildEmptyOneD(k)

  const round = (v: number) => Math.round(v * 1e4) / 1e4
  /** Full-shot key — the 1-D sweep cache's identity. */
  const sig5 = (s: ShotParams) =>
    `${round(s.angle)},${round(s.power)},${round(s.offsetX)},${round(s.offsetY)},${round(s.elevation)}`
  /** Spin scatter's identity = its FIXED dims (aim/speed/elevation). The swept
   * spin (offsetX/offsetY) is deliberately excluded, so a scatter stays valid as
   * you move the spin within it and is reused across spins at the same shot. */
  const spinBaseSig = (s: ShotParams) =>
    `${round(s.angle)},${round(s.power)},${round(s.elevation)}`
  /** A filled 1-D bar's identity = its FIXED dims — every shot field except the
   * one it sweeps (so for "angle" that's power, elevation, AND the spin, since
   * a 1-D sweep always holds spin fixed too). The bar's own swept value moving
   * (e.g. re-picking a point on it) doesn't invalidate it. */
  const oneDFixedSig = (key: ParamKey, s: ShotParams) =>
    (["angle", "power", "offsetX", "offsetY", "elevation"] as ParamKey[])
      .filter((k) => k !== key)
      .map((k) => round(s[k]))
      .join(",")
  /** Axes whose 1-D sweep is frozen entirely at the SEED — center, width, and
   * step all fixed, never following the live shot (user decision: these two
   * are a fixed reference, not a moving one; only the displayed/live MARKER
   * still tracks where you currently are relative to that fixed window). */
  const FROZEN_AT_SEED: ParamKey[] = ["angle", "elevation"]
  /** The base shot used to build a 1-D sweep's swept axis. For angle/elevation
   * (FROZEN_AT_SEED) only THAT field is substituted with the seed's value;
   * power/spin and the other of angle/elevation still come from `live`, so the
   * sweep still reflects the CURRENT shot's tolerance on those axes (the
   * staleness check, oneDFixedSig, is unaffected — it already excludes the
   * swept key). Power needs no substitution: it now always scans its full
   * physical range (sensitivity.ts), independent of any base shot. */
  const oneDScanBase = (key: ParamKey, live: ShotParams): ShotParams =>
    FROZEN_AT_SEED.includes(key) ? { ...live, [key]: seed.shot[key] } : live

  /** Snap a continuous spin pick to the nearest point on the scan's lattice
   * (anchored at the seed's spin, stepped by SPIN_GRID_STEP) — "we should not
   * have infinite resolution on the ball" (user decision). `cue.setSpin`
   * (analysispanel.ts) clamps the result to the off-centre disk afterwards. */
  function snapSpin(x: number, y: number): { x: number; y: number } {
    const snap = (v: number, c: number) =>
      c + Math.round((v - c) / SPIN_GRID_STEP) * SPIN_GRID_STEP
    return { x: snap(x, seed.shot.offsetX), y: snap(y, seed.shot.offsetY) }
  }

  /** The nearest point on a 1-D axis's discrete grid (`range.center` ±
   * k·`range.step`, clamped to the studied window) to `value` — derived from
   * the range definition itself, so it's well-defined even before any
   * simulation has run (the empty/un-Shown placeholder already has a fixed
   * range — see buildEmptyOneD). For a bar that HAS been Shown this is the
   * same lattice `od.cells` covers (Show populates the whole window up
   * front), so picking is always a real, already-simulated point once shown,
   * and a same-grid not-yet-simulated point otherwise — never a continuous
   * value either way. */
  function nearestGridValue(range: ParamRange, value: number): number {
    const clamped = Math.max(range.scannedMin, Math.min(range.scannedMax, value))
    const k = Math.round((clamped - range.center) / range.step)
    return range.center + k * range.step
  }

  /** The cell at this exact (offsetX, offsetY) within `points`, if any. */
  function findAt(
    points: EvalPoint[],
    ox: number,
    oy: number
  ): EvalPoint | undefined {
    const fx = round(ox)
    const fy = round(oy)
    return points.find(
      (p) => round(p.shot.offsetX) === fx && round(p.shot.offsetY) === fy
    )
  }

  /** Color the marker's interior from `markerResult` (or leave it hollow while
   * pending/unknown) — always, regardless of `activeView` (matches the bars'
   * always-on treatment, §40/§41). Safe to color directly here, unlike the
   * bar marker: the spin marker is a RING with a separate white border, so
   * the fill can never camouflage it the way a solid shape could. */
  function updateMarkerFill() {
    spinMarker.classList.remove("scored", "missed")
    if (!markerResult) return
    spinMarker.classList.add(markerResult.scored ? "scored" : "missed")
  }

  /** Leave the marker's last simulated point as a permanent dot on the
   * scatter (and in its cache entry) before moving on — "when the circle
   * moves, the result of the simulation should stay there." No-op if that
   * exact point is already part of the scatter. */
  function commitMarkerAsDot() {
    if (!markerResult) return
    if (findAt(spinPoints, markerResult.shot.offsetX, markerResult.shot.offsetY))
      return
    const point: EvalPoint = { shot: markerResult.shot, scored: markerResult.scored }
    spinPoints.push(point)
    csvRows.push(
      `spin,cell,${point.scored ? "success" : "fail"},${point.shot.angle},${point.shot.power},${point.shot.offsetX},${point.shot.offsetY},${point.shot.elevation}`
    )
    const cached = spinCache.get(spinBaseSig(liveShot))
    if (cached) cached.points.push(point)
    plotGeom = drawPlot(canvas, spinPoints)
  }

  /** Determine whether `forShot`'s exact spin scores: reuse an already-known
   * cell if one exists at that point, otherwise run a single fresh
   * simulation. Colors the marker once resolved; discards the result if the
   * spin has moved on again by the time it resolves (see `markerGen`). */
  async function requestMarkerColor(forShot: ShotParams): Promise<void> {
    const myGen = ++markerGen
    const known = findAt(spinPoints, forShot.offsetX, forShot.offsetY)
    if (known) {
      markerResult = { shot: forShot, scored: known.scored }
      updateMarkerFill()
      return
    }
    markerResult = null
    updateMarkerFill()
    try {
      const config = buildWorkerConfig(
        seed.balls,
        seed.cueBallId,
        forShot,
        seed.ruleType,
        seed.cushionModel
      )
      const result = await simulateShot(config, workerUrl)
      if (myGen !== markerGen) return
      markerResult = {
        shot: forShot,
        scored: isThreeCushionScored(result.outcomes, seed.cueBallId),
      }
      updateMarkerFill()
    } catch {
      if (myGen !== markerGen) return
      markerResult = null
      updateMarkerFill()
    }
  }

  /** Color the small patch sitting under `key`'s marker (`.bar-live-cell`)
   * from `barMarkerResult[key]`, or leave it uncolored while pending/unknown.
   * The marker itself (`.bar-marker`) stays plain white always — a marker
   * filled with the result color used to camouflage against an
   * identically-colored cell once the bar was Shown (user report); putting
   * the color on a patch BEHIND a permanently-white marker fixes that while
   * still showing the result, and doing it even on an un-Shown bar visually
   * conveys the size of one grid step. Unlike the spin marker, this is NEVER
   * gated by `activeView` — the bars show their live result regardless of
   * which display is currently "active" (user decision). */
  function updateBarLiveCellFill(key: ParamKey) {
    const cell = barsEl.querySelector(
      `.bar-row[data-key="${key}"] .bar-live-cell`
    ) as HTMLElement | null
    if (!cell) return
    cell.classList.remove("scored", "missed")
    const result = barMarkerResult[key]
    if (!result) return
    cell.classList.add(result.scored ? "scored" : "missed")
  }

  /** Determine whether `key`'s current value (snapped to its own grid, via
   * nearestGridValue — works even before that bar's Show has ever run)
   * scores, combined with the rest of the live shot: reuse an already-known
   * cell if one exists, otherwise a small ad-hoc cache, otherwise run ONE
   * fresh single-shot simulation. Throttled on the effective shot's
   * signature so a continuous drag only re-simulates when it actually
   * crosses into a new grid cell, not on every frame. */
  async function requestBarMarkerColor(
    key: ParamKey,
    live: ShotParams
  ): Promise<void> {
    const od = oneDResults.find((o) => o.range.key === key)
    if (!od) return
    const effective: ShotParams = {
      ...live,
      [key]: nearestGridValue(od.range, live[key]),
    }
    const sig = sig5(effective)
    if (barMarkerLastSig[key] === sig) return
    barMarkerLastSig[key] = sig
    const myGen = (barMarkerGen[key] ?? 0) + 1
    barMarkerGen[key] = myGen

    const fv = round(effective[key])
    const known = od.cells.find((c) => round(c.value) === fv)
    if (known) {
      barMarkerResult[key] = { shot: effective, scored: known.scored }
      updateBarLiveCellFill(key)
      return
    }
    const cacheKey = `${key}|${sig}`
    const cachedScored = oneDMarkerCache.get(cacheKey)
    if (cachedScored !== undefined) {
      barMarkerResult[key] = { shot: effective, scored: cachedScored }
      updateBarLiveCellFill(key)
      return
    }
    barMarkerResult[key] = null
    updateBarLiveCellFill(key)
    try {
      const config = buildWorkerConfig(
        seed.balls,
        seed.cueBallId,
        effective,
        seed.ruleType,
        seed.cushionModel
      )
      const result = await simulateShot(config, workerUrl)
      if (barMarkerGen[key] !== myGen) return
      const scored = isThreeCushionScored(result.outcomes, seed.cueBallId)
      oneDMarkerCache.set(cacheKey, scored)
      barMarkerResult[key] = { shot: effective, scored }
      updateBarLiveCellFill(key)
    } catch {
      if (barMarkerGen[key] !== myGen) return
      barMarkerResult[key] = null
      updateBarLiveCellFill(key)
    }
  }

  describeSeed(statusEl, seed)
  let plotGeom = drawPlot(canvas, spinPoints)
  refreshBars()

  stopBtn.addEventListener("click", () => {
    signal.aborted = true
    stopBtn.disabled = true
  })

  csvBtn.addEventListener("click", () => {
    downloadCsv(`shot-analysis-${Date.now()}.csv`, csvRows.join("\n"))
  })

  /** A fresh worker pool + a scorer bound to the seed's fixed balls/rules,
   * spawned per scan and torn down by the caller (matching the original
   * spawn-per-scan pattern). */
  function makePool(): { pool: WorkerPool; scorer: Scorer; cores: number } {
    const cores =
      (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4
    const pool = new WorkerPool(cores, workerUrl)
    const scorer: Scorer = async (shot) => {
      const result = await pool.run(
        buildWorkerConfig(
          seed.balls,
          seed.cueBallId,
          shot,
          seed.ruleType,
          seed.cushionModel
        )
      )
      return isThreeCushionScored(result.outcomes, seed.cueBallId)
    }
    return { pool, scorer, cores }
  }

  /** Scan the whole legal spin disk around `base`, appending its points to the
   * scatter. */
  async function scanSpinDisk(base: ShotParams): Promise<void> {
    signal.aborted = false
    const { pool, scorer, cores } = makePool()
    try {
      await runSensitivityAnalysis({
        balls: seed.balls,
        cueBallId: seed.cueBallId,
        baseShot: base,
        ruleType: seed.ruleType,
        cushionModel: seed.cushionModel,
        selectedParams: ["offsetX", "offsetY"],
        poolSize: cores,
        scorer,
        signal,
        spinHalfWindow: DEFAULT_SPIN_HALF_WINDOW,
        onEvaluate: (shot, scored) => {
          csvRows.push(
            `spin,cell,${scored ? "success" : "fail"},${shot.angle},${shot.power},${shot.offsetX},${shot.offsetY},${shot.elevation}`
          )
          spinPoints.push({ shot, scored })
        },
        onProgress: (evaluated) => {
          if (evaluated % 10 === 0) plotGeom = drawPlot(canvas, spinPoints)
        },
      })
    } finally {
      pool.terminate()
    }
  }

  /** (Re)populate the full spin scatter for `base`, reusing the cache when this
   * aim/speed/elevation has already been scanned. */
  async function populateSpin(base: ShotParams): Promise<void> {
    const sig = spinBaseSig(base)
    const cached = spinCache.get(sig)
    if (cached) {
      spinPoints = cached.points.slice()
    } else {
      spinPoints = []
      await scanSpinDisk(base)
      spinCache.set(sig, { points: spinPoints.slice() })
    }
  }

  /** Run (or reuse from cache) the 1-D sweep for `key` around `base`. */
  async function runOneDScan(
    key: ParamKey,
    base: ShotParams
  ): Promise<OneDResult> {
    const cacheKey = `${key}|${sig5(base)}`
    const hit = oneDCache.get(cacheKey)
    if (hit) return hit
    signal.aborted = false
    const { pool, scorer, cores } = makePool()
    const cells: { value: number; scored: boolean }[] = []
    try {
      const result = await runSensitivityAnalysis({
        balls: seed.balls,
        cueBallId: seed.cueBallId,
        baseShot: base,
        ruleType: seed.ruleType,
        cushionModel: seed.cushionModel,
        selectedParams: [key],
        poolSize: cores,
        scorer,
        signal,
        onEvaluate: (shot, scored) => {
          csvRows.push(
            `${key},cell,${scored ? "success" : "fail"},${shot.angle},${shot.power},${shot.offsetX},${shot.offsetY},${shot.elevation}`
          )
          cells.push({ value: shot[key], scored })
        },
      })
      const od: OneDResult = {
        range: result.ranges[0],
        cells,
        ...(key === "angle"
          ? {
              contactDistance: firstContactDistance(
                seed.balls,
                seed.cueBallId,
                base.angle
              ),
            }
          : {}),
      }
      oneDCache.set(cacheKey, od)
      return od
    } finally {
      pool.terminate()
    }
  }

  /** An empty (un-scanned) 1-D bar for `key`, centred on the SEED ("initial shot
   * parameters"): grey track + ruler + markers, built with no simulation. */
  function buildEmptyOneD(key: ParamKey): OneDResult {
    const axes = buildAxisSpecs(seed.shot, seed.balls, seed.cueBallId, [key])
    return {
      range: paramRangeOf(axes[0]),
      cells: [],
      ...(key === "angle"
        ? {
            contactDistance: firstContactDistance(
              seed.balls,
              seed.cueBallId,
              seed.shot.angle
            ),
          }
        : {}),
    }
  }

  /** Re-render the three 1-D bars — the active one scanned, the rest empty —
   * then reposition every marker for the live shot. */
  function refreshBars() {
    oneDResults.length = 0
    for (const k of ONE_D_KEYS)
      oneDResults.push(
        activeOneD && activeOneD.key === k ? activeOneD.od : emptyBars[k]
      )
    renderBars(barsEl, oneDResults)
    if (activeOneD)
      barsEl
        .querySelector(`.bar-row[data-key="${activeOneD.key}"]`)
        ?.classList.add("active")
    // Re-render destroys/rebuilds every .bar-marker, so re-apply each bar's
    // already-known color (no new simulation — barMarkerResult is unchanged).
    for (const key of ONE_D_KEYS) updateBarLiveCellFill(key)
    positionMarkers()
  }

  /** Refresh the active 1-D bar for the live shot: if a sweep was already run
   * for these exact fixed params (+ this swept centre), show it from cache;
   * otherwise the bar reverts to empty (un-scanned) until Show is clicked
   * again — keeping the old sweep on screen would describe a different shot. */
  function updateOneDDisplay() {
    if (!activeOneD) return
    const { key } = activeOneD
    const hit = oneDCache.get(`${key}|${sig5(oneDScanBase(key, liveShot))}`)
    activeOneD = hit ? { key, od: hit } : null
  }

  /** Position the single white marker on every display at the current
   * `liveShot` — the only shot parameters shown. (The initial/seed shot is kept
   * as data for a future "show initial parameters" affordance, not as a marker.) */
  function positionMarkers() {
    const g = plotGeom
    const spinLeft = (ox: number) => ((g.cx - (ox / g.lim) * g.r) / g.W) * 100
    const spinTop = (oy: number) => ((g.cy - (oy / g.lim) * g.r) / g.H) * 100
    spinMarker.hidden = false
    spinMarker.style.left = `${spinLeft(liveShot.offsetX)}%`
    spinMarker.style.top = `${spinTop(liveShot.offsetY)}%`

    for (const od of oneDResults) {
      const key = od.range.key
      const row = barsEl.querySelector(
        `.bar-row[data-key="${key}"]`
      ) as HTMLElement | null
      if (!row) continue
      const marker = row.querySelector(".bar-marker") as HTMLElement | null
      const liveCell = row.querySelector(
        ".bar-live-cell"
      ) as HTMLElement | null
      const m = computeBarModel(od)
      const snapped = nearestGridValue(od.range, liveShot[key])
      const pct = barPctOf(m, snapped)
      if (marker) marker.style.left = `${pct}%`
      if (liveCell) {
        const span = m.hi - m.lo
        const widthPct = span > 0 ? (od.range.step / span) * 100 : 0
        liveCell.style.left = `${pct}%`
        liveCell.style.width = `${widthPct}%`
        liveCell.style.marginLeft = `${-widthPct / 2}%`
      }
    }
    refreshStepButtons()
  }

  /** Disable a bar's step button once its snapped current value sits at the
   * studied window's edge — there's nowhere further to step. Works whether or
   * not the bar has been Shown (only needs `od.range`). */
  function refreshStepButtons() {
    for (const od of oneDResults) {
      const key = od.range.key
      const row = barsEl.querySelector(
        `.bar-row[data-key="${key}"]`
      ) as HTMLElement | null
      if (!row) continue
      const current = nearestGridValue(od.range, liveShot[key])
      const leftBtn = row.querySelector(
        ".bar-step--left"
      ) as HTMLButtonElement | null
      const rightBtn = row.querySelector(
        ".bar-step--right"
      ) as HTMLButtonElement | null
      // Mirrored (aim shift): screen-left is the MAX value, so the edge
      // tests flip too, matching the step buttons' own dir flip above.
      const atMin = current <= od.range.scannedMin
      const atMax = current >= od.range.scannedMax
      const mirrored = isMirrored(od)
      if (leftBtn) leftBtn.disabled = mirrored ? atMax : atMin
      if (rightBtn) rightBtn.disabled = mirrored ? atMin : atMax
    }
  }

  /** Draw the spin plane for the current view: the full scatter ("spin"), or the
   * single base-spin point while a 1-D sweep is active (the other spin points
   * would be misleading — they weren't used for that sweep). */
  /** Draw the spin plane for the current shot. Only called while spin IS the
   * active display (mutual exclusivity — see `activeView`): the cached scatter
   * when this aim/speed/elevation has been scanned, otherwise just the
   * current-shot point (the white ring) — the old scatter's dots describe a
   * different aim/speed/elevation, so showing them would mislead. */
  function updateSpinDisplay() {
    const sig = spinBaseSig(liveShot)
    const cached = spinCache.get(sig)
    if (cached) {
      spinPoints = cached.points.slice()
      plotGeom = drawPlot(canvas, spinPoints)
    } else {
      spinPoints = []
      plotGeom = drawPlot(canvas, spinPoints) // empty → just the ring + marker
    }
    positionMarkers()
    refreshSpinButton()
  }

  /** Force the spin canvas to show just the current-shot point — no scatter,
   * even if a cached one would otherwise be valid for the live shot. Used
   * whenever a 1-D bar is the active display, per the mutual-exclusivity rule:
   * only one of spin/aim/speed/elevation shows real simulation data at a time. */
  function collapseSpinToPoint() {
    spinPoints = []
    plotGeom = drawPlot(canvas, spinPoints)
    positionMarkers()
    updateMarkerFill() // re-applies the already-known result, now shown regardless of activeView
  }

  /** The spin button is just "Show" (it reclaims the spin display from
   * whichever bar is active); its enabled state varies with `busy`, and it
   * gets the same blue "active" accent as a bar's Show button (.bar-row.active
   * .bar-show) whenever the spin scatter is the live display. */
  function refreshSpinButton() {
    spinShowBtn.disabled = busy
    spinShowBtn.classList.toggle("active", activeView === "spin")
  }

  spinShowBtn.addEventListener("click", () => {
    if (busy) return
    void showSpin()
  })

  /** Spin "Show": reclaims the spin display from whichever bar was active
   * (mutual exclusivity), then scans the whole legal spin disk for the live
   * aim/speed/elevation (or reuses the cache), and displays it. */
  async function showSpin() {
    busy = true
    refreshSpinButton()
    statusEl.textContent = "Scanning spin…"
    try {
      activeView = "spin"
      activeOneD = null
      refreshBars() // all three bars go back to empty
      await populateSpin(liveShot)
      plotGeom = drawPlot(canvas, spinPoints)
      positionMarkers()
      void requestMarkerColor(liveShot)
      statusEl.textContent = "Spin scatter shown."
    } catch (err) {
      const aborted = signal.aborted || (err as Error)?.message === "aborted"
      statusEl.textContent = aborted
        ? "Stopped."
        : `Error: ${(err as Error)?.message ?? err}`
    } finally {
      busy = false
      csvBtn.disabled = !hasResults()
      refreshSpinButton()
    }
  }

  /** Bar "Show": run (or reuse) the 1-D sweep for `key` at the live shot, fill
   * its bar, and collapse the spin display to just the current-shot point
   * (mutual exclusivity — see `activeView`; ignores any cached spin scatter
   * that might otherwise be valid for the live shot). */
  async function runOneD(key: ParamKey) {
    if (busy) return
    busy = true
    refreshSpinButton()
    if (key === "elevation") opts.onShowElevation?.()
    statusEl.textContent = `Analysing ${PARAM_LABELS[key]}…`
    try {
      const od = await runOneDScan(key, oneDScanBase(key, liveShot))
      activeView = key
      activeOneD = { key, od }
      refreshBars()
      collapseSpinToPoint()
      statusEl.textContent = `${PARAM_LABELS[key]} tolerance shown.`
    } catch (err) {
      const aborted = signal.aborted || (err as Error)?.message === "aborted"
      statusEl.textContent = aborted
        ? "Stopped."
        : `Error: ${(err as Error)?.message ?? err}`
    } finally {
      busy = false
      csvBtn.disabled = !hasResults()
      refreshSpinButton()
    }
  }

  /** On load: verify the seed reproduces in the worker, then run ONLY the spin
   * 2-D scatter. The three 1-D bars stay empty until their Show button is used. */
  async function runInitial() {
    csvRows = [
      "analysis,role,scored,angle,power,offsetX,offsetY,elevation",
      `seed,seed,pending,${seed.shot.angle},${seed.shot.power},${seed.shot.offsetX},${seed.shot.offsetY},${seed.shot.elevation}`,
    ]
    stopBtn.disabled = false
    csvBtn.disabled = true
    busy = true
    refreshSpinButton()

    statusEl.textContent = "Verifying seed reproduces in the worker…"
    const seedSig = await verifySeed(
      seed.balls,
      seed.cueBallId,
      seed.shot,
      seed.ruleType,
      seed.cushionModel,
      workerUrl
    )
    csvRows[1] = csvRows[1].replace("pending", seedSig.scored ? "success" : "fail")

    // Parity guard: when the caller knows the shot's actual outcome, the worker
    // must reproduce it (scored OR missed). A mismatch means the physics inputs
    // diverge and the scan would be meaningless. With no expected outcome we just
    // proceed — the scan is valid for failed shots too.
    if (
      opts.expectedSignature &&
      !signaturesMatch(seedSig, opts.expectedSignature)
    ) {
      statusEl.innerHTML =
        '<span class="error">The worker reproduces this shot differently from ' +
        "the table — physics inputs don't match. Analysis aborted.</span>"
      stopBtn.disabled = true
      busy = false
      return
    }

    try {
      await populateSpin(seed.shot)
      plotGeom = drawPlot(canvas, spinPoints)
      positionMarkers()
      void requestMarkerColor(liveShot)
      for (const key of ONE_D_KEYS) void requestBarMarkerColor(key, liveShot)
      statusEl.textContent = signal.aborted
        ? "Stopped — partial results shown."
        : "Spin scatter shown — click Show on a bar for its 1-D tolerance."
    } catch (err) {
      const aborted = signal.aborted || (err as Error)?.message === "aborted"
      statusEl.textContent = aborted
        ? "Stopped — partial results shown."
        : `Error: ${(err as Error)?.message ?? err}`
      plotGeom = drawPlot(canvas, spinPoints)
    } finally {
      busy = false
      stopBtn.disabled = true
      csvBtn.disabled = !hasResults()
      refreshSpinButton()
    }
  }

  // --- interaction ---------------------------------------------------------
  // A bar's "Show" button runs that 1-D sweep on demand (independent of picking,
  // so it works even without an onPick handler).
  barsEl.addEventListener("click", (e) => {
    const showBtn = (e.target as HTMLElement).closest(".bar-show")
    if (!showBtn) return
    const key = (showBtn.closest(".bar-row") as HTMLElement | null)?.dataset.key
    if (key === "angle" || key === "power" || key === "elevation") void runOneD(key)
  })

  if (opts.onPick) {
    // Spin scatter: a click is a 2-D pick of (offsetX, offsetY) — invert the
    // drawPlot transform using the latest geometry.
    canvas.addEventListener("click", (e) => {
      const g = plotGeom
      const rect = canvas.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * g.W
      const py = ((e.clientY - rect.top) / rect.height) * g.H
      const snapped = snapSpin(
        ((g.cx - px) / g.r) * g.lim,
        ((g.cy - py) / g.r) * g.lim
      )
      opts.onPick!({ kind: "spin", x: snapped.x, y: snapped.y })
    })

    // Bars: a click on the track, or either step button, picks a point on
    // that axis's discrete grid — works whether or not the bar has been
    // Shown yet (see nearestGridValue), never a continuous value. Delegated,
    // since rows are re-rendered as results arrive.
    barsEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      const row = target.closest(".bar-row") as HTMLElement | null
      const key = row?.dataset.key
      if (
        !row ||
        !key ||
        (key !== "angle" && key !== "power" && key !== "elevation")
      )
        return
      const od = oneDResults.find((o) => o.range.key === key)
      if (!od) return

      if (key === "elevation") opts.onShowElevation?.()

      const stepBtn = target.closest(".bar-step") as HTMLButtonElement | null
      if (stepBtn) {
        if (stepBtn.disabled) return
        const isLeft = stepBtn.classList.contains("bar-step--left")
        // For a mirrored axis (aim shift), screen-left is the HIGHER value
        // (computeBarModel flips the value→% mapping), so the button's effect
        // on the underlying value must flip too, to match the on-screen
        // direction the button points.
        const dir = (isLeft ? -1 : 1) * (isMirrored(od) ? -1 : 1)
        const current = nearestGridValue(od.range, liveShot[key])
        const next = Math.max(
          od.range.scannedMin,
          Math.min(od.range.scannedMax, current + dir * od.range.step)
        )
        opts.onPick!({ kind: key, value: next })
        return
      }

      const track = target.closest(".bar-track") as HTMLElement | null
      if (!track) return
      const rect = track.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      const rawValue = barValueAtPct(computeBarModel(od), pct)
      const value = nearestGridValue(od.range, rawValue)
      opts.onPick!({ kind: key, value })
    })
  }

  /** Public: the live shot changed (drag/click on the table or a bar). Remember
   * it, then refresh whichever display(s) that invalidates:
   * - the active 1-D bar, if ANY of ITS fixed params changed (the other two of
   *   angle/power/elevation, or the spin — a 1-D sweep always holds spin fixed);
   * - every bar's own live-result marker, and the spin marker's own color —
   *   BOTH always-on, independent of `activeView` (mutual exclusivity only
   *   gates the full SCATTER/SWEEP, not a single colored point);
   * - the spin scatter itself, if aim/speed/elevation changed (a different
   *   base) — but ONLY while spin is the active display: while a bar is
   *   active the spin canvas stays collapsed to the current-shot point
   *   regardless of what changed (its marker is still colored, just no dots).
   * A bar's refresh falls back to a cached result for the new params, or to
   * the empty state if none exists — never leaves stale data on screen.
   * While spin is active, the scatter also keeps a trail: if the spin moved
   * within the SAME base, the old point is left behind as a permanent dot
   * first (a base change discards/replaces the whole point cloud via
   * updateSpinDisplay, so there's nothing to keep). The `_seedShot` arg is
   * redundant with the captured seed and kept only for the AnalysisHandle
   * signature. */
  function setLiveShot(shot: ShotParams, _seedShot: ShotParams) {
    const baseChanged = spinBaseSig(shot) !== spinBaseSig(liveShot)
    const spinMoved =
      round(shot.offsetX) !== round(liveShot.offsetX) ||
      round(shot.offsetY) !== round(liveShot.offsetY)
    const oneDStale =
      activeOneD !== null &&
      oneDFixedSig(activeOneD.key, shot) !== oneDFixedSig(activeOneD.key, liveShot)
    if (activeView === "spin" && spinMoved && !baseChanged) {
      commitMarkerAsDot()
    }
    liveShot = shot
    if (oneDStale) {
      updateOneDDisplay()
      refreshBars()
    }
    // Always-on per-bar result coloring (independent of activeView/mutual
    // exclusivity — "display the shot result on the 1D bars even if the full
    // range is not displayed"). Each call's own throttle (barMarkerLastSig)
    // makes this cheap when nothing relevant changed.
    for (const key of ONE_D_KEYS) void requestBarMarkerColor(key, shot)
    // The spin marker's OWN color is likewise always-on now (a bar being
    // active no longer blanks it) — only the full SCATTER stays gated by
    // mutual exclusivity, handled below. Must run before the activeView
    // early return, or the ring would never get (re)colored while a bar is
    // active (the bug this fixes).
    if (spinMoved || baseChanged) {
      const snapped = snapSpin(shot.offsetX, shot.offsetY)
      void requestMarkerColor({ ...shot, offsetX: snapped.x, offsetY: snapped.y })
    }
    if (activeView !== "spin") {
      collapseSpinToPoint()
      refreshSpinButton()
      return
    }
    if (baseChanged) {
      updateSpinDisplay()
    } else {
      positionMarkers()
      refreshSpinButton()
    }
  }

  runInitial()

  return {
    stop() {
      signal.aborted = true
      stopBtn.disabled = true
    },
    setLiveShot,
  }
}

function describeSeed(statusEl: HTMLElement, seed: AnalysisSeed) {
  const s = seed.shot
  statusEl.textContent =
    `Original shot: speed ${s.power.toFixed(2)}, spin (${s.offsetX.toFixed(2)}, ${s.offsetY.toFixed(2)}), ` +
    `elev ${((s.elevation * 180) / Math.PI).toFixed(1)}°, model ${seed.cushionModel}.`
}

// ===========================================================================
// Rendering
// ===========================================================================

/** Cue-ball face radius in offset units (max physical english). The engine's
 * off-centre clamp (offCenterLimit, 0.45) sits just inside it. */
const BALL_FACE = 0.5

/**
 * Spin-plane scatter on the cue-ball face seen from behind the cue. X is REVERSED
 * — +offsetX is LEFT-hand english, so it plots on the left; Y up is follow, down
 * is draw. Each evaluated cell is a dot (green scores / red misses); the current
 * shot is a white ring. Solid circle = ball edge, dashed circle = the off-centre
 * spin extremity the scan stays within.
 */
function drawPlot(canvas: HTMLCanvasElement, points: EvalPoint[]): PlotGeom {
  const ctx = canvas.getContext("2d")!
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // Domain covers the ball face (and any point that somehow lies beyond it).
  const spread = points.reduce(
    (m, p) => Math.max(m, Math.hypot(p.shot.offsetX, p.shot.offsetY)),
    0
  )
  const lim = Math.max(BALL_FACE, spread) * 1.1
  const pad = 30
  const r = (W - 2 * pad) / 2
  const cx = pad + r
  const cy = H - pad - r
  // X reversed (+offsetX → left), Y up = follow.
  const sx = (x: number) => cx - (x / lim) * r
  const sy = (y: number) => cy - (y / lim) * r
  const px = (v: number) => (v / lim) * r // radius in px for a value v

  // Crosshair through centre ball.
  ctx.strokeStyle = "#2a2a30"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sx(-lim), cy)
  ctx.lineTo(sx(lim), cy)
  ctx.moveTo(cx, sy(-lim))
  ctx.lineTo(cx, sy(lim))
  ctx.stroke()

  // Off-centre clamp = the extremity the spin can reach — dashed.
  ctx.strokeStyle = "#666"
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.arc(cx, cy, px(offCenterLimit), 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])
  // Ball edge — continuous line.
  ctx.strokeStyle = "#888"
  ctx.beginPath()
  ctx.arc(cx, cy, px(BALL_FACE), 0, 2 * Math.PI)
  ctx.stroke()

  // Outcomes: green scores / red misses.
  for (const p of points) {
    ctx.fillStyle = p.scored ? "#2ec27e" : "#e0556b"
    ctx.beginPath()
    ctx.arc(sx(p.shot.offsetX), sy(p.shot.offsetY), 3, 0, 2 * Math.PI)
    ctx.fill()
  }

  // The current shot is drawn as a white DOM overlay marker, not on the canvas
  // — see the spin marker in runAnalysisInto / setLiveShot.

  // Axis labels (mirroring the Python orientation).
  ctx.fillStyle = "#9aa0a6"
  ctx.font = "12px system-ui, sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("◀ left english", 2, cy - 5)
  ctx.textAlign = "right"
  ctx.fillText("right english ▶", W - 2, cy - 5)
  ctx.textAlign = "center"
  ctx.fillText("▲ follow", cx, pad - 2)
  ctx.fillText("draw ▼", cx, H - pad + 14)
  ctx.textAlign = "left"

  return { cx, cy, r, lim, W, H }
}

const BAR_OK = "#2ec27e"
const BAR_FAIL = "#e0556b"
const BAR_UNSCANNED = "#34343c"

/**
 * 1-D tolerance bar. The track spans the parameter's FULL physical range when it
 * is finite (power: [0, maxPower]); the studied window is drawn cell-by-cell
 * (green = scores, red = misses) and the un-scanned remainder is neutral grey, so
 * you see how much of the whole range was explored. Aim angle has no finite
 * physical bounds, so its track is just the studied window. Elevation's physical
 * range ([0, 72°]) dwarfs its studied window, so its track instead shows 2x the
 * studied span, centred on the seed (clamped to [0, 72°]). A white tick marks the
 * original (seed) value.
 */
function renderBars(el: HTMLElement, results: OneDResult[]) {
  el.innerHTML = ""
  for (const od of results) el.appendChild(renderOneDBar(od))
}

export type BarSegment = { w: number; color: string }
export type BarTick = {
  pct: number
  label: string
  align: "start" | "center" | "end"
}
export type BarModel = {
  finite: boolean
  lo: number
  hi: number
  /** True when the axis is drawn right-to-left (aim shift). */
  mirrored: boolean
  markerPct: number
  segments: BarSegment[]
  ruler: BarTick[]
}

/** Screen-position percentage (0 = left, 100 = right) for a value on a bar. */
export function barPctOf(m: BarModel, v: number): number {
  const span = m.hi - m.lo
  const raw =
    span > 0 ? Math.max(0, Math.min(100, ((v - m.lo) / span) * 100)) : 50
  return m.mirrored ? 100 - raw : raw
}

/** Inverse of barPctOf: the parameter value at a screen-position percentage. */
export function barValueAtPct(m: BarModel, pct: number): number {
  const clamped = Math.max(0, Math.min(100, pct))
  const span = m.hi - m.lo
  const p = m.mirrored ? 100 - clamped : clamped
  return m.lo + (p / 100) * span
}

/** Tile [lo, hi] with a green/red segment per evaluated cell (each `step` wide)
 * and neutral grey for any un-scanned stretch. */
function buildBarSegments(
  od: OneDResult,
  lo: number,
  hi: number
): BarSegment[] {
  const segs: BarSegment[] = []
  if (hi <= lo) return segs
  const eps = (hi - lo) * 1e-9 // ignore floating-point slivers between cells
  const sorted = od.cells
    .filter((c) => Number.isFinite(c.value))
    .sort((a, b) => a.value - b.value)
  const half = od.range.step / 2
  let cursor = lo
  for (const c of sorted) {
    const segHi = Math.min(hi, c.value + half)
    const start = Math.max(lo, c.value - half, cursor)
    if (segHi <= start) continue
    if (start - cursor > eps)
      segs.push({ w: start - cursor, color: BAR_UNSCANNED })
    segs.push({ w: segHi - start, color: c.scored ? BAR_OK : BAR_FAIL })
    cursor = segHi
  }
  if (hi - cursor > eps) segs.push({ w: hi - cursor, color: BAR_UNSCANNED })
  return segs
}

/**
 * Pure geometry for a 1-D bar. The track spans the FULL physical range when both
 * bounds are finite (power); for elevation (also finite, but whose physical
 * range dwarfs its studied window) it instead spans 2x the studied window,
 * centred on the seed and clamped to the physical bounds; otherwise (aim angle,
 * unbounded) it spans just the studied window. The seed marker sits at `center`,
 * clamped to the track.
 */
export function computeBarModel(od: OneDResult): BarModel {
  const r = od.range
  const finite =
    Number.isFinite(r.physicalMin) && Number.isFinite(r.physicalMax)
  let lo: number
  let hi: number
  if (!finite) {
    lo = r.scannedMin
    hi = r.scannedMax
  } else if (r.key === "elevation") {
    const scanSpan = r.scannedMax - r.scannedMin
    lo = Math.max(r.physicalMin, r.center - scanSpan)
    hi = Math.min(r.physicalMax, r.center + scanSpan)
  } else {
    lo = r.physicalMin
    hi = r.physicalMax
  }
  const span = hi - lo
  const mirrored = isMirrored(od)
  const rawPctOf = (v: number) =>
    span > 0 ? Math.max(0, Math.min(100, ((v - lo) / span) * 100)) : 50
  const pctOf = (v: number) => (mirrored ? 100 - rawPctOf(v) : rawPctOf(v))
  const valueAtPct = (pct: number) =>
    lo + ((mirrored ? 100 - pct : pct) / 100) * span

  const markerPct = pctOf(r.center)

  const ruler: BarTick[] = [0, 25, 50, 75, 100].map((pct) => ({
    pct,
    label: formatAxisValue(od, valueAtPct(pct)),
    align: pct === 0 ? "start" : pct === 100 ? "end" : "center",
  }))

  const segments = buildBarSegments(od, lo, hi)
  if (mirrored) segments.reverse()

  return {
    finite,
    lo,
    hi,
    mirrored,
    markerPct,
    segments,
    ruler,
  }
}

export function renderOneDBar(od: OneDResult): HTMLElement {
  const r = od.range
  const m = computeBarModel(od)

  // Normalise widths to a fraction of the span before using them as flex-grow:
  // raw value-widths whose total is < 1 (e.g. aim angle, ~0.09 rad) would leave
  // the flex items short of filling the track (flexbox only distributes all free
  // space when the grow factors sum to ≥ 1).
  const span = m.hi - m.lo
  const cellsHtml = m.segments
    .map(
      (s) =>
        `<div class="bar-cell" style="flex:${span > 0 ? s.w / span : 1};background:${s.color}"></div>`
    )
    .join("")
  const rulerHtml = m.ruler
    .map(
      (t) =>
        `<div class="bar-tick bar-tick--${t.align}" style="left:${t.pct}%">` +
        `<span class="bar-tick-mark"></span>` +
        `<span class="bar-tick-label">${t.label}</span>` +
        `</div>`
    )
    .join("")

  // Aim shift: a "shifting aim left/right" caption above the track, split at
  // the seed marker so each half points away from it (values are unsigned —
  // direction is conveyed here, not by sign).
  const shiftRowHtml = isMirrored(od)
    ? `<div class="bar-shiftrow">` +
      `<div class="bar-shift-label bar-shift-label--left" style="right:${100 - m.markerPct}%">◀ shifting aim left</div>` +
      `<div class="bar-shift-label bar-shift-label--right" style="left:${m.markerPct}%">shifting aim right ▶</div>` +
      `</div>`
    : ""

  const row = document.createElement("div")
  row.className = "bar-row"
  row.dataset.key = r.key
  row.innerHTML =
    `<div class="bar-head">` +
    `<button class="bar-show" type="button">Show</button>` +
    `<div class="bar-label">${PARAM_LABELS[r.key]}</div>` +
    `</div>` +
    shiftRowHtml +
    // Step buttons flank the track+ruler column (not inside .bar-track,
    // which clips its children via overflow:hidden) so they render as full,
    // uncropped triangles; positionMarkers/refreshStepButtons reposition and
    // enable/disable them.
    `<div class="bar-trackrow">` +
    `<button class="bar-step bar-step--left" type="button" aria-label="Step left"></button>` +
    `<div class="bar-trackcol">` +
    `<div class="bar-track">` +
    cellsHtml +
    // A small colored patch under the marker, showing the live point's
    // result even when the bar hasn't been Shown (positioned/colored by
    // positionMarkers / updateBarLiveCellFill). Sits behind the marker.
    `<div class="bar-live-cell" style="left:${m.markerPct}%"></div>` +
    // The marker (a CSS bowtie) — always plain white; repositioned by
    // positionMarkers. (Coloring it directly used to camouflage it against
    // an identically-colored cell once the bar was Shown.)
    `<div class="bar-marker" style="left:${m.markerPct}%"></div>` +
    `</div>` +
    `<div class="bar-ruler">${rulerHtml}</div>` +
    `</div>` +
    `<button class="bar-step bar-step--right" type="button" aria-label="Step right"></button>` +
    `</div>`
  return row
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
