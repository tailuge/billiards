/**
 * @jest-environment jsdom
 */
import {
  computeBarModel,
  renderOneDBar,
  formatValue,
  formatAngleShift,
  barPctOf,
  barValueAtPct,
  OneDResult,
} from "../src/view/analysisrender"
import { AxisSpec, ParamRange, paramRangeOf } from "../src/sensitivity"

/** Build a 1-D sweep with cells at center + k*step for k in [-n, n]. `scoringMin`/
 * `scoringMax` are derived from the min/max scored k, mirroring
 * `runSensitivityAnalysis` (center when nothing scored). */
function sweep(
  partial: Pick<
    ParamRange,
    "key" | "center" | "step" | "physicalMin" | "physicalMax"
  >,
  n: number,
  scoredKs: Set<number>,
  contactDistance?: number
): OneDResult {
  const cells: { value: number; scored: boolean }[] = []
  for (let k = -n; k <= n; k++) {
    cells.push({
      value: partial.center + k * partial.step,
      scored: scoredKs.has(k),
    })
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
  return {
    range,
    cells,
    ...(contactDistance !== undefined ? { contactDistance } : {}),
  }
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
      {
        key: "elevation",
        center: 0.5,
        step: 0.025,
        physicalMin: 0,
        physicalMax: (2 * Math.PI) / 5,
      },
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
      {
        key: "elevation",
        center: 0.1,
        step: 0.025,
        physicalMin: 0,
        physicalMax: (2 * Math.PI) / 5,
      },
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
      {
        key: "power",
        center: 2.57,
        step: 0.15,
        physicalMin: 0,
        physicalMax: 5.24,
      },
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
      {
        key: "power",
        center: 2.57,
        step: 0.15,
        physicalMin: 0,
        physicalMax: 5.24,
      },
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
      formatAngleShift(
        od.range.scannedMax,
        od.range.center,
        od.contactDistance!
      )
    )
    expect(m.ruler[4].label).toBe(
      formatAngleShift(
        od.range.scannedMin,
        od.range.center,
        od.contactDistance!
      )
    )
  })
})

describe("renderOneDBar — DOM additions", () => {
  it("renders 5 ruler ticks with labels below the track", () => {
    const od = sweep(
      {
        key: "power",
        center: 2.57,
        step: 0.15,
        physicalMin: 0,
        physicalMax: 5.24,
      },
      7,
      new Set([0, 1, 2, -1])
    )
    const row = renderOneDBar(od)
    const ticks = row.querySelectorAll(".bar-ruler .bar-tick")
    expect(ticks.length).toBe(5)
    const labels = Array.from(
      row.querySelectorAll(".bar-ruler .bar-tick-label")
    ).map((el) => el.textContent)
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
      {
        key: "power",
        center: 2.57,
        step: 0.15,
        physicalMin: 0,
        physicalMax: 5.24,
      },
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

describe("barPctOf / barValueAtPct (click mapping)", () => {
  it("round-trips value→pct→value on a finite (speed) axis", () => {
    const od = sweep(
      {
        key: "power",
        center: 2.5,
        step: 0.1,
        physicalMin: 0,
        physicalMax: 5.24,
      },
      10,
      new Set([0])
    )
    const m = computeBarModel(od)
    for (const v of [0.5, 2.5, 4.0, 5.0]) {
      expect(barValueAtPct(m, barPctOf(m, v))).toBeCloseTo(v, 6)
    }
  })

  it("round-trips on the mirrored (aim-shift) axis and respects the flip", () => {
    const od = sweep(
      {
        key: "angle",
        center: 0,
        step: 0.01,
        physicalMin: Number.NEGATIVE_INFINITY,
        physicalMax: Number.POSITIVE_INFINITY,
      },
      8,
      new Set([0])
    )
    const m = computeBarModel(od)
    expect(m.mirrored).toBe(true)
    // Mirrored: the maximum value sits at the LEFT edge (pct 0).
    expect(barPctOf(m, m.hi)).toBeCloseTo(0, 6)
    expect(barPctOf(m, m.lo)).toBeCloseTo(100, 6)
    for (const v of [m.lo, m.lo + (m.hi - m.lo) * 0.3, m.hi]) {
      expect(barValueAtPct(m, barPctOf(m, v))).toBeCloseTo(v, 6)
    }
  })

  it("clamps out-of-range percentages to the track ends", () => {
    const od = sweep(
      {
        key: "power",
        center: 2.5,
        step: 0.1,
        physicalMin: 0,
        physicalMax: 5.24,
      },
      10,
      new Set([0])
    )
    const m = computeBarModel(od)
    expect(barValueAtPct(m, -20)).toBeCloseTo(m.lo, 6)
    expect(barValueAtPct(m, 130)).toBeCloseTo(m.hi, 6)
  })
})

describe("paramRangeOf (empty-bar range, no simulation)", () => {
  it("derives the display range from an axis spec", () => {
    const axis: AxisSpec = {
      key: "power",
      center: 2.5,
      step: 0.1,
      min: 0,
      max: 10,
      stepsEachSide: 10,
    }
    const r = paramRangeOf(axis)
    expect(r.key).toBe("power")
    expect(r.center).toBe(2.5)
    expect(r.step).toBe(0.1)
    expect(r.physicalMin).toBe(0)
    expect(r.physicalMax).toBe(10)
    expect(r.scannedMin).toBeCloseTo(1.5) // 2.5 - 10*0.1
    expect(r.scannedMax).toBeCloseTo(3.5) // 2.5 + 10*0.1
    // No scored cells yet → scoring range collapses to the centre.
    expect(r.scoringMin).toBe(2.5)
    expect(r.scoringMax).toBe(2.5)
  })

  it("clamps the scanned window to the physical bounds", () => {
    const axis: AxisSpec = {
      key: "elevation",
      center: 0.1,
      step: 0.025,
      min: 0,
      max: 1.2566,
      stepsEachSide: 10,
    }
    const r = paramRangeOf(axis)
    expect(r.scannedMin).toBe(0) // 0.1 - 0.25 = -0.15, clamped to 0
    expect(r.scannedMax).toBeCloseTo(0.35)
  })
})

describe("computeBarModel — empty (un-scanned) bar", () => {
  it("is one full-width grey segment with a full ruler and centred marker", () => {
    const range = paramRangeOf({
      key: "power",
      center: 2.5,
      step: 0.1,
      min: 0,
      max: 5,
      stepsEachSide: 10,
    })
    const od: OneDResult = { range, cells: [] }
    const m = computeBarModel(od)
    expect(m.segments).toHaveLength(1)
    expect(m.segments[0].color).toBe(UNSCANNED)
    expect(m.segments[0].w).toBeCloseTo(m.hi - m.lo)
    expect(m.ruler).toHaveLength(5)
    // Power's track is the full physical range; the seed sits at its centre.
    expect(m.markerPct).toBeCloseTo(50)
  })
})

describe("renderOneDBar — Show button + marker", () => {
  it("renders a Show button carrying the row's key, plus one white marker", () => {
    const range = paramRangeOf({
      key: "angle",
      center: 0,
      step: 0.01,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
      stepsEachSide: 10,
    })
    const od: OneDResult = { range, cells: [], contactDistance: 1 }
    const row = renderOneDBar(od)
    expect(row.dataset.key).toBe("angle")
    const btn = row.querySelector<HTMLButtonElement>(".bar-show")
    expect(btn).not.toBeNull()
    expect(btn!.textContent).toBe("Show")
    // The Show button lives in the row header, not inside the clickable track.
    expect(row.querySelector(".bar-track .bar-show")).toBeNull()
    // Exactly one (white) marker — the current shot. No seed marker anymore.
    expect(row.querySelectorAll(".bar-marker")).toHaveLength(1)
    expect(row.querySelectorAll(".bar-seed-marker")).toHaveLength(0)
  })

  it("renders left/right step buttons flanking the track+ruler column, not inside the clipped track", () => {
    const range = paramRangeOf({
      key: "power",
      center: 2.5,
      step: 0.1,
      min: 0,
      max: 5.24,
      stepsEachSide: 10,
    })
    const od: OneDResult = { range, cells: [] }
    const row = renderOneDBar(od)
    const left = row.querySelector<HTMLButtonElement>(".bar-step--left")
    const right = row.querySelector<HTMLButtonElement>(".bar-step--right")
    expect(left).not.toBeNull()
    expect(right).not.toBeNull()
    // Not clipped by .bar-track's overflow:hidden.
    expect(row.querySelector(".bar-track .bar-step")).toBeNull()
    // Both flank a shared track+ruler column.
    const trackrow = row.querySelector(".bar-trackrow")
    expect(trackrow?.querySelector(".bar-trackcol .bar-track")).not.toBeNull()
    expect(trackrow?.querySelector(".bar-trackcol .bar-ruler")).not.toBeNull()
  })
})
