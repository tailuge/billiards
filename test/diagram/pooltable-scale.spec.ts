import { transformPoolTableSvg } from "../../dist/diagrams/pooltable.js"

const TEST_SVG_FRAGMENT = `
<g class="pool-cushion">
  <path class="pool-cushion" d="M1.327,0.000L1.327,0.572L1.330,0.582" />
</g>
<g class="pool-pocket">
  <path class="pool-pocket" d="M1.362,0.614L1.386,0.638" />
</g>
<rect class="pool-cloth" x="-1.380" y="-0.720" width="2.760" height="1.440" />
`

describe("Pool Table SVG Deformation", () => {
  it("should be idempotent when dx = 0 and dy = 0", () => {
    const output = transformPoolTableSvg(TEST_SVG_FRAGMENT, 0, 0)
    expect(output).toContain("M1.327,0L1.327,0.572L1.33,0.582")
    expect(output).toContain("M1.362,0.614L1.386,0.638")
    expect(output).toContain('rect class="pool-cloth" x="-1.38" y="-0.72" width="2.76" height="1.44"')
  })

  it("should translate geometry outside cutX and cutY", () => {
    const dx = 0.1
    const dy = 0.05
    const output = transformPoolTableSvg(TEST_SVG_FRAGMENT, dx, dy)
    expect(output).toContain("M1.462,0.664L1.486,0.688")
  })

  it("should preserve pocket local geometry exactly (only translation)", () => {
    const pocketSvg = `<path d="M1.362,0.740L1.412,0.820" />`
    const dx = 0.25
    const dy = 0.15
    const output = transformPoolTableSvg(pocketSvg, dx, dy)
    expect(output).toContain("M1.612,0.89L1.662,0.97")
  })

  it("should update <rect> x, y, width, height correctly", () => {
    const rectSvg = `<rect x="-1.380" y="-0.720" width="2.760" height="1.440" />`
    const dx = 0.15
    const dy = 0.10
    const output = transformPoolTableSvg(rectSvg, dx, dy)
    expect(output).toContain('rect x="-1.53" y="-0.82" width="3.06" height="1.64"')
  })

  it("should recompute viewBox correctly on full SVG string", () => {
    const fullSvg = `<svg viewBox="-1.562000 -0.899000 3.124000 2.028000"></svg>`
    const dx = 0.15
    const dy = 0.10
    const output = transformPoolTableSvg(fullSvg, dx, dy)
    expect(output).toContain('viewBox="-1.712000 -0.999000 3.424000 2.228000"')
  })
})
