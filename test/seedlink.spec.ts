import { AnalysisSeed, buildModeUrl } from "../src/seedlink"

const seed: AnalysisSeed = {
  balls: [
    { id: 0, pos: { x: 0.1, y: -0.2, z: 0 } },
    { id: 1, pos: { x: -0.5, y: 0.3, z: 0 } },
    { id: 2, pos: { x: 0.7, y: 0.0, z: 0 } },
  ],
  cueBallId: 0,
  shot: {
    angle: 1.234,
    power: 3.406,
    offsetX: -0.1,
    offsetY: 0.2,
    elevation: 0,
  },
  ruleType: "threecushion",
  cushionModel: "mathavan",
}

const BASE = "https://example.test/index.html"

describe("buildModeUrl", () => {
  it("encodes balls as a flat init array and the shot as initShot", () => {
    const params = new URLSearchParams(
      buildModeUrl(seed, "analysis", BASE).split("?")[1]
    )
    expect(JSON.parse(params.get("init")!)).toEqual([
      0.1, -0.2, -0.5, 0.3, 0.7, 0.0,
    ])
    expect(JSON.parse(params.get("initShot")!)).toEqual({
      cueBallId: 0,
      angle: 1.234,
      power: 3.406,
      offset: { x: -0.1, y: 0.2 },
      elevation: 0,
    })
  })

  it("sets the mode flag (analysis or drill) plus practice + ruletype", () => {
    const analysis = new URLSearchParams(
      buildModeUrl(seed, "analysis", BASE).split("?")[1]
    )
    expect(analysis.has("analysis")).toBe(true)
    expect(analysis.has("drill")).toBe(false)
    expect(analysis.has("practice")).toBe(true)
    expect(analysis.get("ruletype")).toBe("threecushion")

    const drill = new URLSearchParams(
      buildModeUrl(seed, "drill", BASE).split("?")[1]
    )
    expect(drill.has("drill")).toBe(true)
    expect(drill.has("analysis")).toBe(false)
  })

  it("targets the given base url", () => {
    expect(buildModeUrl(seed, "drill", BASE)).toMatch(
      /^https:\/\/example\.test\/index\.html\?/
    )
  })
})
