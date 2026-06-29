import { expect } from "chai"
import { offCenterLimit, maxPower } from "../src/model/physics/constants"
import {
  buildAxisSpecs,
  runSensitivityAnalysis,
  firstContactDistance,
  ShotParams,
  ParamKey,
  BallPos,
} from "../src/sensitivity"

/** Phase 2 gate: grid construction, clamps, disk exclusion, and the BFS +
 * robustness search over a deterministic mock scorer (no worker). */

const SEED: ShotParams = {
  angle: 0,
  power: 2.5,
  offsetX: 0,
  offsetY: 0,
  elevation: 0,
}

const BALLS: BallPos[] = [
  { id: 0, pos: { x: -0.5, y: 0, z: 0 } },
  { id: 1, pos: { x: 0.5, y: 0.05, z: 0 } },
  { id: 2, pos: { x: 0, y: 0.5, z: 0 } },
]

function run(
  selected: ParamKey[],
  scorer: (s: ShotParams) => boolean,
  base = SEED
) {
  return runSensitivityAnalysis({
    balls: BALLS,
    cueBallId: 0,
    baseShot: base,
    ruleType: "threecushion",
    cushionModel: "mathavan",
    selectedParams: selected,
    poolSize: 4,
    scorer: async (s) => scorer(s),
  })
}

describe("buildAxisSpecs", () => {
  it("uses fixed steps and physical clamps for spin/elevation", () => {
    const axes = buildAxisSpecs(SEED, BALLS, 0, [
      "offsetX",
      "offsetY",
      "elevation",
    ])

    const ox = axes.find((a) => a.key === "offsetX")!
    expect(ox.step).to.equal(0.025)
    expect(ox.min).to.equal(-offCenterLimit)
    expect(ox.max).to.equal(offCenterLimit)

    const elev = axes.find((a) => a.key === "elevation")!
    expect(elev.step).to.equal(0.025)
    expect(elev.min).to.equal(0)
    expect(elev.max).to.be.closeTo((2 * Math.PI) / 5, 1e-9)
  })

  it("gives aim angle a 21-point (10-each-side) window-relative step", () => {
    const angle = buildAxisSpecs(SEED, BALLS, 0, ["angle"])[0]
    expect(angle.stepsEachSide).to.equal(10) // 21 simulations
  })

  it("always scans power's FULL physical range, centred at its midpoint, regardless of the seed power", () => {
    const power = buildAxisSpecs(SEED, BALLS, 0, ["power"])[0]
    expect(power.min).to.equal(0)
    expect(power.max).to.equal(maxPower)
    expect(power.center).to.be.closeTo(maxPower / 2, 1e-9)
    expect(power.step).to.be.closeTo(maxPower / 2 / 10, 1e-9)
    expect(power.stepsEachSide).to.equal(10) // 21 simulations over [0, maxPower]

    // A very different seed power doesn't change the window at all.
    const otherPower = buildAxisSpecs({ ...SEED, power: 0.2 }, BALLS, 0, [
      "power",
    ])[0]
    expect(otherPower.center).to.equal(power.center)
    expect(otherPower.step).to.equal(power.step)
  })

  it("derives a wider angle step for a closer first contact", () => {
    // closer object ball → larger atan(2R/d) → larger step
    const near: BallPos[] = [
      { id: 0, pos: { x: 0, y: 0, z: 0 } },
      { id: 1, pos: { x: 0.2, y: 0, z: 0 } },
    ]
    const far: BallPos[] = [
      { id: 0, pos: { x: 0, y: 0, z: 0 } },
      { id: 1, pos: { x: 1.5, y: 0, z: 0 } },
    ]
    const stepNear = buildAxisSpecs(SEED, near, 0, ["angle"])[0].step
    const stepFar = buildAxisSpecs(SEED, far, 0, ["angle"])[0].step
    expect(stepNear).to.be.greaterThan(stepFar)
  })
})

describe("firstContactDistance", () => {
  it("returns distance to a ball directly along the aim ray", () => {
    const balls: BallPos[] = [
      { id: 0, pos: { x: 0, y: 0, z: 0 } },
      { id: 1, pos: { x: 0.4, y: 0, z: 0 } },
    ]
    expect(firstContactDistance(balls, 0, 0)).to.be.closeTo(0.4, 1e-9)
  })

  it("falls back to the cushion when no ball is in the path", () => {
    const balls: BallPos[] = [{ id: 0, pos: { x: 0, y: 0, z: 0 } }]
    const d = firstContactDistance(balls, 0, 0)
    expect(d).to.be.greaterThan(0)
    expect(Number.isFinite(d)).to.equal(true)
  })
})

describe("runSensitivityAnalysis (full grid scan)", () => {
  it("finds a symmetric square scoring region", async () => {
    // Score when within 2 steps of the seed on both spin axes (a 5x5 block).
    const res = await run(["offsetX", "offsetY"], (s) => {
      const ix = Math.round(s.offsetX / 0.025)
      const iy = Math.round(s.offsetY / 0.025)
      return Math.abs(ix) <= 2 && Math.abs(iy) <= 2
    })
    expect(res.scoredCount).to.equal(25) // 5x5
  })

  it("finds scoring cells beyond a failure (disconnected region, 1-D)", async () => {
    // Power's grid is centred at maxPower/2 regardless of SEED.power (it always
    // scans the full [0, maxPower] range — see buildAxisSpecs). scorer scores at
    // indices {-1,0,1} and the disconnected island {4}; gap at {2,3}. A
    // flood-fill would find only 3; the full grid finds 4.
    const step = maxPower / 2 / 10
    const center = maxPower / 2
    const res = await run(["power"], (s) => {
      const i = Math.round((s.power - center) / step)
      return (i >= -1 && i <= 1) || i === 4
    })
    expect(res.scoredCount).to.equal(4)
    const idxs = res.scoringPoints
      .map((p) => Math.round((p.power - center) / step))
      .sort((a, b) => a - b)
    expect(idxs).to.deep.equal([-1, 0, 1, 4])
  })

  it("finer stepScale yields more cells over the same physical window", async () => {
    const phys = (s: ShotParams) => Math.abs(s.power - SEED.power) <= 0.2
    const coarse = await runSensitivityAnalysis({
      balls: BALLS,
      cueBallId: 0,
      baseShot: SEED,
      ruleType: "threecushion",
      cushionModel: "mathavan",
      selectedParams: ["power"],
      poolSize: 4,
      scorer: async (s) => phys(s),
      stepScale: 1,
    })
    const fine = await runSensitivityAnalysis({
      balls: BALLS,
      cueBallId: 0,
      baseShot: SEED,
      ruleType: "threecushion",
      cushionModel: "mathavan",
      selectedParams: ["power"],
      poolSize: 4,
      scorer: async (s) => phys(s),
      stepScale: 0.25,
    })
    expect(fine.scoredCount).to.be.greaterThan(coarse.scoredCount)
  })

  it("excludes spin cells outside the off-centre disk", async () => {
    // Seed near the disk edge; scorer accepts everything. Disk constraint must
    // still keep every scoring point inside the limit.
    const base: ShotParams = { ...SEED, offsetX: 0.4, offsetY: 0.0 }
    const res = await run(["offsetX", "offsetY"], () => true, base)
    expect(res.scoredCount).to.be.greaterThan(0)
    for (const p of res.scoringPoints) {
      expect(Math.hypot(p.offsetX, p.offsetY)).to.be.at.most(
        offCenterLimit + 1e-9
      )
    }
  })

  it("clamps power to [0, maxPower] (cannot go negative)", async () => {
    const base: ShotParams = { ...SEED, power: 0.1 }
    const res = await run(["power"], () => true, base)
    for (const p of res.scoringPoints) {
      expect(p.power).to.be.at.least(0)
      expect(p.power).to.be.at.most(maxPower)
    }
  })

  it("expands a non-spin sweep even when the seed spin sits on the disk edge", async () => {
    // Seed offset right at (slightly over) the 0.45 limit, like a real max-spin
    // shot. A power-only sweep must not be blocked by the fixed seed offset.
    const base: ShotParams = {
      ...SEED,
      offsetX: -0.2100413739681244,
      offsetY: 0.3979731500148773,
    }
    const step = maxPower / 2 / 10
    const center = maxPower / 2
    const res = await run(
      ["power"],
      (s) => Math.abs(Math.round((s.power - center) / step)) <= 2,
      base
    )
    expect(res.scoredCount).to.equal(5) // -2..+2, not just the seed
  })

  it("evaluates the whole window even when nothing scores", async () => {
    const res = await run(["offsetX", "offsetY"], () => false)
    expect(res.scoredCount).to.equal(0)
    expect(res.evaluated).to.be.greaterThan(1) // full grid, not just the seed
  })

  it("respects an abort signal", async () => {
    const signal = { aborted: true }
    let err: Error | null = null
    try {
      await runSensitivityAnalysis({
        balls: BALLS,
        cueBallId: 0,
        baseShot: SEED,
        ruleType: "threecushion",
        cushionModel: "mathavan",
        selectedParams: ["offsetX", "offsetY"],
        poolSize: 4,
        scorer: async () => true,
        signal,
      })
    } catch (e) {
      err = e as Error
    }
    expect(err).to.not.equal(null)
    expect(err!.message).to.contain("abort")
  })
})

describe('"Expand range" incremental spin scan', () => {
  // Collect the set of lattice cells a spin scan evaluates, keyed by their
  // absolute grid index (step 0.025). Seed-centred + fixed step means the keys
  // are comparable across runs with different windows.
  async function spinCells(
    outer: number,
    inner?: number
  ): Promise<Set<string>> {
    const cells = new Set<string>()
    await runSensitivityAnalysis({
      balls: BALLS,
      cueBallId: 0,
      baseShot: SEED,
      ruleType: "threecushion",
      cushionModel: "mathavan",
      selectedParams: ["offsetX", "offsetY"],
      poolSize: 4,
      scorer: async () => true,
      spinHalfWindow: outer,
      spinInnerHalfWindow: inner,
      onEvaluate: (shot) => {
        const ix = Math.round(shot.offsetX / 0.025)
        const iy = Math.round(shot.offsetY / 0.025)
        cells.add(`${ix},${iy}`)
      },
    })
    return cells
  }

  it("scans only the ring outside the inner window", async () => {
    const ring = await spinCells(0.5, 0.3) // grow 0.3 -> 0.5
    expect(ring.size).to.be.greaterThan(0)
    // Inner box (half-window 0.3) reaches index 12; every ring cell must sit
    // strictly beyond it on at least one spin axis.
    for (const key of ring) {
      const [ix, iy] = key.split(",").map(Number)
      expect(Math.max(Math.abs(ix), Math.abs(iy))).to.be.greaterThan(12)
    }
  })

  it("ring + initial scan tile the wider scan exactly (no gaps, no overlap)", async () => {
    const initial = await spinCells(0.3)
    const ring = await spinCells(0.5, 0.3)
    const full = await spinCells(0.5)

    // Disjoint: the ring never re-runs an already-scanned cell.
    for (const key of ring) expect(initial.has(key)).to.equal(false)
    // Complete: their union is exactly the single full scan at 0.5.
    expect(initial.size + ring.size).to.equal(full.size)
    const union = new Set([...initial, ...ring])
    expect(union.size).to.equal(full.size)
    for (const key of full) expect(union.has(key)).to.equal(true)
  })

  it("tiles the same way wherever the starting window is (default-independent)", async () => {
    // Same property starting from 0.2 instead of 0.3 — proves the feature still
    // works if the default spin half-window is later reduced.
    const initial = await spinCells(0.2)
    const ring = await spinCells(0.4, 0.2)
    const full = await spinCells(0.4)

    for (const key of ring) expect(initial.has(key)).to.equal(false)
    expect(initial.size + ring.size).to.equal(full.size)
  })

  it("evaluates nothing once the inner window already covers the disk", async () => {
    // Inner half-window 0.45 boxes the entire off-centre disk, so no ring remains
    // — this is the page's "whole ball covered" signal (result.evaluated === 0).
    let evaluated = 0
    const res = await runSensitivityAnalysis({
      balls: BALLS,
      cueBallId: 0,
      baseShot: SEED,
      ruleType: "threecushion",
      cushionModel: "mathavan",
      selectedParams: ["offsetX", "offsetY"],
      poolSize: 4,
      scorer: async () => true,
      spinHalfWindow: 0.7,
      spinInnerHalfWindow: offCenterLimit,
      onEvaluate: () => {
        evaluated++
      },
    })
    expect(evaluated).to.equal(0)
    expect(res.evaluated).to.equal(0)
  })
})
