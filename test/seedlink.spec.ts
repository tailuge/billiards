import {
  AnalysisSeed,
  buildAnalysisUrl,
  decodeAnalysisSeed,
  encodeAnalysisSeed,
} from "../src/seedlink"

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

describe("seedlink round-trip", () => {
  it("encode → decode reproduces the seed", () => {
    const decoded = decodeAnalysisSeed(encodeAnalysisSeed(seed))
    expect(decoded).toEqual(seed)
  })

  it("decodes through URLSearchParams the way the page reads it", () => {
    const url = buildAnalysisUrl(seed)
    const init = new URLSearchParams(url.split("?")[1]).get("init")!
    expect(decodeAnalysisSeed(init)).toEqual(seed)
  })

  it("buildAnalysisUrl targets the analysis page", () => {
    expect(buildAnalysisUrl(seed)).toMatch(/^aimsensitivity\.html\?init=/)
  })

  it("decodes plain JSON payloads too", () => {
    expect(decodeAnalysisSeed(JSON.stringify(seed))).toEqual(seed)
  })
})
