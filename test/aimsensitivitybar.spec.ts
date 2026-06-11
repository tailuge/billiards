/**
 * @jest-environment jsdom
 */
import {
  computeBarModel,
  renderOneDBar,
  formatValue,
  formatAngleShift,
  OneDResult,
} from "../src/aimsensitivity"
import { ParamRange } from "../src/sensitivity"

/** Build a 1-D sweep with cells at center + k*step for k in [-n, n]. `scoringMin`/
 * `scoringMax` are derived from the min/max scored k, mirroring
 * `runSensitivityAnalysis` (center when nothing scored). */
function sweep(
  partial: Pick<ParamRange, "key" | "center" | "step" | "physicalMin" | "physicalMax">,
  n: number,
  scoredKs: Set<number>,
  contactDistance?: number
): OneDResult {
  const cells: { value: number; scored: boolean }[] = []
  for (let k = -n; k <= n; k++) {
    cells.push({ value: partial.center + k * partial.step, scored: scoredKs.has(k) })
  }
  const scored = [...scoredKs]
  const scoringMinK = scored.length > 0 ? Math.min(...scored) : 0
  const scoringMaxK = scored.length > 0 ? Math.max(...scored) : 0
  const range: ParamRange = {
    ...partial,
    scannedMin: partial.center - n * partial.step,
    scannedMax: partial.center + n * partial.step,
    scoringMin: partial.center + scoringMinK * partial.step,
    scoringMax: partial.center + scoringMaxK * partial.step,
  }
  return { range, cells, ...(contactDistance !== undefined ? { contactDistance } : {}) }
}

const UNSCANNED = "#34343c"

describe("computeBarModel", () => {
  it("aim angle (unbounded): track = studied window, fully coloured, marker centred", () => {
    const od = sweep(
      {
        key: "angle",
        center: -0.05,
        step: 0.011,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      4,
      new Set([-1, 0, 1])
    )
    const m = computeBarModel(od)
    expect(m.finite).toBe(false)
    expect(m.lo).toBeCloseTo(od.range.scannedMin)
    expect(m.hi).toBeCloseTo(od.range.scannedMax)
    // No un-scanned grey anywhere — the whole track is studied.
    expect(m.segments.some((s) => s.color === UNSCANNED)).toBe(false)
    // Coloured segments tile the entire span.
    const total = m.segments.reduce((sum, s) => sum + s.w, 0)
    expect(total).toBeCloseTo(m.hi - m.lo)
    // Symmetric window → seed marker at the centre.
    expect(m.markerPct).toBeCloseTo(50, 1)
  })

  it("aim angle: bar is mirrored — cells near scannedMax render at the left", () => {
    const SCORED = "#2ec27e"
    const MISSED = "#e0556b"
    const od = sweep(
      {
        key: "angle",
        center: -0.05,
        step: 0.011,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      4,
      new Set([2, 3, 4])
    )
    const m = computeBarModel(od)
    // Unmirrored, the scored cells (near scannedMax) would tile the END of
    // the segment list; mirrored, they tile the START instead.
    expect(m.segments[0].color).toBe(SCORED)
    expect(m.segments[m.segments.length - 1].color).toBe(MISSED)
  })

  it("elevation (bounded, physical range dwarfs studied window): track shows 2x the studied span, centred on the seed", () => {
    const od = sweep(
      { key: "elevation", center: 0.5, step: 0.025, physicalMin: 0, physicalMax: (2 * Math.PI) / 5 },
      7,
      new Set([0, 1, 2, -1])
    )
    const scanSpan = od.range.scannedMax - od.range.scannedMin
    expect(scanSpan).toBeCloseTo(0.35)
    const m = computeBarModel(od)
    expect(m.finite).toBe(true)
    expect(m.lo).toBeCloseTo(0.5 - scanSpan)
    expect(m.hi).toBeCloseTo(0.5 + scanSpan)
    // Studied window sits in the middle half of the track.
    expect(m.markerPct).toBeCloseTo(50, 1)
  })

  it("elevation: shown range clamps to the physical lower bound (0) near the seed", () => {
    const od = sweep(
      { key: "elevation", center: 0.1, step: 0.025, physicalMin: 0, physicalMax: (2 * Math.PI) / 5 },
      7,
      new Set([0, 1, 2, -1])
    )
    const scanSpan = od.range.scannedMax - od.range.scannedMin
    const m = computeBarModel(od)
    expect(m.lo).toBe(0) // 0.1 - scanSpan would be negative, clamped to physicalMin
    expect(m.hi).toBeCloseTo(0.1 + scanSpan)
  })

  it("power (bounded): full physical track with grey outside the studied window", () => {
    const od = sweep(
      { key: "power", center: 2.57, step: 0.15, physicalMin: 0, physicalMax: 5.24 },
      7,
      new Set([0, 1, 2, -1])
    )
    const m = computeBarModel(od)
    expect(m.finite).toBe(true)
    expect(m.lo).toBe(0)
    expect(m.hi).toBe(5.24)
    // Grey before and after the studied window.
    expect(m.segments[0].color).toBe(UNSCANNED)
    expect(m.segments[m.segments.length - 1].color).toBe(UNSCANNED)
    // Marker sits at the seed power within the full range.
    expect(m.markerPct).toBeCloseTo((2.57 / 5.24) * 100, 1)
  })

  // Regression: a small-span axis (aim angle, ~0.09 rad) must still fill the
  // track. Raw value-widths as flex-grow summed < 1 and left the bar mostly
  // empty; widths must be normalised so the grow factors fill 100%.
  it("renders flex-grow factors that fill the track even for a sub-1 span", () => {
    const od = sweep(
      {
        key: "angle",
        center: -0.05,
        step: 0.011,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      4,
      new Set([-1, 0, 1])
    )
    const row = renderOneDBar(od)
    const cells = Array.from(row.querySelectorAll<HTMLElement>(".bar-cell"))
    expect(cells.length).toBeGreaterThan(0)
    const flexSum = cells.reduce((sum, c) => sum + parseFloat(c.style.flex), 0)
    expect(flexSum).toBeCloseTo(1, 5)
  })
})

describe("computeBarModel — ruler", () => {
  it("ruler ticks: 5 evenly-spaced positions with formatted values (power, finite axis)", () => {
    const od = sweep(
      { key: "power", center: 2.57, step: 0.15, physicalMin: 0, physicalMax: 5.24 },
      7,
      new Set([0, 1, 2, -1])
    )
    const m = computeBarModel(od)
    expect(m.ruler.map((t) => t.pct)).toEqual([0, 25, 50, 75, 100])
    expect(m.ruler[0].label).toBe(formatValue("power", 0))
    expect(m.ruler[4].label).toBe(formatValue("power", 5.24))
    expect(m.ruler[2].label).toBe(formatValue("power", 2.62)) // midpoint of [0, 5.24]
    expect(m.ruler[0].align).toBe("start")
    expect(m.ruler[1].align).toBe("center")
    expect(m.ruler[2].align).toBe("center")
    expect(m.ruler[3].align).toBe("center")
    expect(m.ruler[4].align).toBe("end")
  })

  it("ruler ticks: aim angle (unbounded) ruler spans the studied window, in ball-width units, mirrored left-right", () => {
    const od = sweep(
      {
        key: "angle",
        center: -0.05,
        step: 0.011,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      4,
      new Set([-1, 0, 1]),
      1.0
    )
    const m = computeBarModel(od)
    // Mirrored: the left edge of the bar (pct 0) shows scannedMax, and the
    // right edge (pct 100) shows scannedMin.
    expect(m.ruler[0].label).toBe(
      formatAngleShift(od.range.scannedMax, od.range.center, od.contactDistance!)
    )
    expect(m.ruler[4].label).toBe(
      formatAngleShift(od.range.scannedMin, od.range.center, od.contactDistance!)
    )
  })

})

describe("renderOneDBar — DOM additions", () => {
  it("renders 5 ruler ticks with labels below the track", () => {
    const od = sweep(
      { key: "power", center: 2.57, step: 0.15, physicalMin: 0, physicalMax: 5.24 },
      7,
      new Set([0, 1, 2, -1])
    )
    const row = renderOneDBar(od)
    const ticks = row.querySelectorAll(".bar-ruler .bar-tick")
    expect(ticks.length).toBe(5)
    const labels = Array.from(row.querySelectorAll(".bar-ruler .bar-tick-label")).map(
      (el) => el.textContent
    )
    expect(labels[0]).toBe(formatValue("power", 0))
    expect(labels[4]).toBe(formatValue("power", 5.24))
  })

  it("aim shift bar: shows a 'shifting aim left/right' caption split at the seed marker, with unsigned magnitudes", () => {
    const od = sweep(
      {
        key: "angle",
        center: -0.05,
        step: 0.011,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      4,
      new Set([-1, 0, 1]),
      1.0
    )
    const m = computeBarModel(od)
    const row = renderOneDBar(od)

    const shiftRow = row.querySelector(".bar-shiftrow")
    expect(shiftRow).not.toBeNull()

    const left = row.querySelector<HTMLElement>(".bar-shift-label--left")
    const right = row.querySelector<HTMLElement>(".bar-shift-label--right")
    expect(left?.textContent).toBe("◀ shifting aim left")
    expect(right?.textContent).toBe("shifting aim right ▶")
    expect(left?.style.right).toBe(`${100 - m.markerPct}%`)
    expect(right?.style.left).toBe(`${m.markerPct}%`)

    // Ruler labels for the aim-shift axis are unsigned magnitudes.
    for (const tick of m.ruler) {
      expect(tick.label.startsWith("-")).toBe(false)
      expect(tick.label.startsWith("+")).toBe(false)
    }
  })

  it("power bar: no 'shifting aim' caption", () => {
    const od = sweep(
      { key: "power", center: 2.57, step: 0.15, physicalMin: 0, physicalMax: 5.24 },
      7,
      new Set([0, 1, 2, -1])
    )
    const row = renderOneDBar(od)
    expect(row.querySelector(".bar-shiftrow")).toBeNull()
  })

})

describe("formatAngleShift", () => {
  it("returns an unsigned magnitude regardless of the sign of the angle offset", () => {
    const center = -0.05
    const d = 1.0
    const positive = formatAngleShift(center + 0.02, center, d)
    const negative = formatAngleShift(center - 0.02, center, d)
    expect(positive.startsWith("-")).toBe(false)
    expect(positive.startsWith("+")).toBe(false)
    expect(negative.startsWith("-")).toBe(false)
    expect(negative.startsWith("+")).toBe(false)
    // Equal and opposite offsets produce the same magnitude (tan is odd).
    expect(positive).toBe(negative)
  })

  it("returns '0.00' at the seed centre", () => {
    expect(formatAngleShift(-0.05, -0.05, 1.0)).toBe("0.00")
  })
})
