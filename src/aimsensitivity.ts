/**
 * Standalone shot-sensitivity analysis page (aimsensitivity.html).
 *
 * Opened in a new tab from the practice game with the pre-shot state encoded in
 * `?init=...` (see src/seedlink.ts). Decodes the seed, runs the analysis engine
 * (src/sensitivity.ts) off the main thread via worker.js, and renders the result
 * as a spin-plane scatter + per-axis bars. Purely a demonstration — it never
 * writes back to the game.
 */
import { offCenterLimit, R } from "./model/physics/constants"
import {
  ParamKey,
  ParamRange,
  Scorer,
  ShotParams,
  SensitivityResult,
  WorkerPool,
  buildWorkerConfig,
  firstContactDistance,
  isThreeCushionScored,
  runSensitivityAnalysis,
  verifySeed,
} from "./sensitivity"
import { AnalysisSeed, decodeAnalysisSeed } from "./seedlink"

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

/**
 * The fixed default analysis set, run automatically on load. The spin scan is the
 * 2-D scatter; the rest are independent 1-D tolerance sweeps. (The engine is still
 * generic over `selectedParams` — a configurable multidimensional mode lived here
 * once and can be re-added; see shot_analysis_implementation_logbook.md.)
 */
const ANALYSES: { name: string; params: ParamKey[] }[] = [
  { name: "spin", params: ["offsetX", "offsetY"] },
  { name: "angle", params: ["angle"] },
  { name: "power", params: ["power"] },
  { name: "elevation", params: ["elevation"] },
]

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

document.addEventListener("DOMContentLoaded", () => {
  const statusEl = $("status")
  const seed = readSeed(statusEl)
  if (!seed) return

  const canvas = $<HTMLCanvasElement>("plot")
  const summaryEl = $("summary")
  const barsEl = $("bars")
  const stopBtn = $<HTMLButtonElement>("stop")
  const csvBtn = $<HTMLButtonElement>("csv")

  const signal = { aborted: false }
  const spinPoints: EvalPoint[] = []
  const oneDResults: OneDResult[] = []
  let csvRows: string[] = []
  const hasResults = () => spinPoints.length > 0 || oneDResults.length > 0

  describeSeed(statusEl, seed)
  drawPlot(canvas, seed, spinPoints)

  stopBtn.addEventListener("click", () => {
    signal.aborted = true
    stopBtn.disabled = true
  })

  csvBtn.addEventListener("click", () => {
    downloadCsv(`shot-analysis-${Date.now()}.csv`, csvRows.join("\n"))
  })

  /** Run one analysis on the shared pool and render its result in place. */
  async function analyseOne(
    a: (typeof ANALYSES)[number],
    scorer: Scorer,
    cores: number
  ) {
    const isSpin = a.name === "spin"
    const label = isSpin ? "spin (side / top-back)" : PARAM_LABELS[a.params[0]]
    statusEl.textContent = `Analysing ${label}…`

    const cells: { value: number; scored: boolean }[] = []
    const result = await runSensitivityAnalysis({
      balls: seed!.balls,
      cueBallId: seed!.cueBallId,
      baseShot: seed!.shot,
      ruleType: seed!.ruleType,
      cushionModel: seed!.cushionModel,
      selectedParams: a.params,
      poolSize: cores,
      scorer,
      signal,
      onEvaluate: (shot, scored) => {
        csvRows.push(
          `${a.name},cell,${scored ? "success" : "fail"},${shot.angle},${shot.power},${shot.offsetX},${shot.offsetY},${shot.elevation}`
        )
        if (isSpin) spinPoints.push({ shot, scored })
        else cells.push({ value: shot[a.params[0]], scored })
      },
      onProgress: (evaluated) => {
        if (isSpin && evaluated % 10 === 0) {
          drawPlot(canvas, seed!, spinPoints)
        }
      },
    })

    if (isSpin) {
      drawPlot(canvas, seed!, spinPoints)
      renderSummary(summaryEl, result)
    } else {
      oneDResults.push({
        range: result.ranges[0],
        cells,
        ...(a.params[0] === "angle"
          ? {
              contactDistance: firstContactDistance(
                seed!.balls,
                seed!.cueBallId,
                seed!.shot.angle
              ),
            }
          : {}),
      })
      renderBars(barsEl, oneDResults)
    }
  }

  async function runAll() {
    csvRows = [
      "analysis,role,scored,angle,power,offsetX,offsetY,elevation",
      `seed,seed,pending,${seed!.shot.angle},${seed!.shot.power},${seed!.shot.offsetX},${seed!.shot.offsetY},${seed!.shot.elevation}`,
    ]
    stopBtn.disabled = false
    csvBtn.disabled = true

    statusEl.textContent = "Verifying seed reproduces in the worker…"
    const seedScores = await verifySeed(
      seed!.balls,
      seed!.cueBallId,
      seed!.shot,
      seed!.ruleType,
      seed!.cushionModel
    )
    csvRows[1] = csvRows[1].replace("pending", seedScores ? "success" : "fail")
    if (!seedScores) {
      statusEl.innerHTML =
        '<span class="error">Seed does not score in the worker — ' +
        "physics inputs don't match. Analysis aborted.</span>"
      stopBtn.disabled = true
      return
    }

    // One worker pool shared across all four scans (vs a spawn/teardown per scan).
    const cores =
      (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4
    const pool = new WorkerPool(cores, "worker.js")
    const scorer: Scorer = async (shot) => {
      const result = await pool.run(
        buildWorkerConfig(
          seed!.balls,
          seed!.cueBallId,
          shot,
          seed!.ruleType,
          seed!.cushionModel
        )
      )
      return isThreeCushionScored(result.outcomes, seed!.cueBallId)
    }

    try {
      for (const a of ANALYSES) {
        if (signal.aborted) break
        await analyseOne(a, scorer, cores)
      }
      statusEl.textContent = signal.aborted
        ? "Stopped — partial results shown."
        : "Done: spin scatter and speed / aim / elevation tolerances below."
    } catch (err) {
      const aborted = signal.aborted || (err as Error)?.message === "aborted"
      statusEl.textContent = aborted
        ? "Stopped — partial results shown."
        : `Error: ${(err as Error)?.message ?? err}`
      drawPlot(canvas, seed!, spinPoints)
    } finally {
      pool.terminate()
      stopBtn.disabled = true
      csvBtn.disabled = !hasResults()
    }
  }

  runAll()
})

/** Decode the seed from the URL, or show an error and return null. */
function readSeed(statusEl: HTMLElement): AnalysisSeed | null {
  const init = new URLSearchParams(location.search).get("init")
  if (!init) {
    statusEl.innerHTML =
      '<span class="error">No shot data in the URL. Open this page from the ' +
      '"Shot Analysis" button in the practice game.</span>'
    return null
  }
  try {
    return decodeAnalysisSeed(init)
  } catch (e) {
    statusEl.innerHTML = `<span class="error">Could not read shot data: ${
      (e as Error)?.message ?? e
    }</span>`
    return null
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
 * is draw. Each evaluated cell is a dot (green scores / red misses); the original
 * shot is a white ring. Solid circle = ball edge, dashed circle = the off-centre
 * spin extremity the scan stays within.
 */
function drawPlot(
  canvas: HTMLCanvasElement,
  seed: AnalysisSeed,
  points: EvalPoint[]
) {
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

  // Original shot — white ring.
  ctx.strokeStyle = "#fff"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(sx(seed.shot.offsetX), sy(seed.shot.offsetY), 7, 0, 2 * Math.PI)
  ctx.stroke()

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
}

function renderSummary(el: HTMLElement, result: SensitivityResult) {
  if (result.scoredCount === 0) {
    el.innerHTML = "No scoring variations found in the scanned window."
    return
  }
  el.innerHTML =
    `${result.scoredCount} of ${result.evaluated} variations score ` +
    `(${((100 * result.scoredCount) / Math.max(1, result.evaluated)).toFixed(0)}%).`
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
export type BarTick = { pct: number; label: string; align: "start" | "center" | "end" }
export type BarModel = {
  finite: boolean
  lo: number
  hi: number
  markerPct: number
  segments: BarSegment[]
  ruler: BarTick[]
}

/** Tile [lo, hi] with a green/red segment per evaluated cell (each `step` wide)
 * and neutral grey for any un-scanned stretch. */
function buildBarSegments(od: OneDResult, lo: number, hi: number): BarSegment[] {
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
    if (start - cursor > eps) segs.push({ w: start - cursor, color: BAR_UNSCANNED })
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
  const valueAtPct = (pct: number) => lo + ((mirrored ? 100 - pct : pct) / 100) * span

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
  row.innerHTML =
    `<div class="bar-label">${PARAM_LABELS[r.key]}</div>` +
    shiftRowHtml +
    `<div class="bar-track">` +
    cellsHtml +
    `<div class="bar-marker" style="left:${m.markerPct}%"></div>` +
    `</div>` +
    `<div class="bar-ruler">${rulerHtml}</div>`
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
