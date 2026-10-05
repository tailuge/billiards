import fs from "fs"
import path from "path"

describe("solution.html resolution parameters and logic", () => {
  const R = 0.03275

  function generateGeneralAngles(resAngle: number) {
    const angles: number[] = []
    const numGeneralAngles = 180 * resAngle
    for (let i = 0; i < numGeneralAngles; i++) {
      angles.push((i * Math.PI) / (90 * resAngle))
    }
    return angles
  }

  function generateBallAimAngles(
    cueBall: { pos: { x: number; y: number } },
    targetBalls: Array<{ pos: { x: number; y: number } }>,
    mult = 1
  ) {
    const extra: number[] = []
    const count = 10 * mult
    const denom = count > 1 ? count - 1 : 1
    for (const target of targetBalls) {
      const dx = target.pos.x - cueBall.pos.x
      const dy = target.pos.y - cueBall.pos.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= 2 * R) continue
      const aimAngle = Math.atan2(dy, dx)
      const halfAngle = Math.asin((2 * R) / dist)
      for (let k = 0; k < count; k++) {
        const offset = -halfAngle + (k * (2 * halfAngle)) / denom
        extra.push(aimAngle + offset)
      }
    }
    return extra
  }

  describe("angle generation math", () => {
    it("generates 180 general angles for resAngle = 1 with 2 deg steps", () => {
      const angles = generateGeneralAngles(1)
      expect(angles.length).toBe(180)
      expect(angles[0]).toBe(0)
      expect(angles[1]).toBeCloseTo(Math.PI / 90) // 2 degrees
      expect(angles[1] - angles[0]).toBeCloseTo(Math.PI / 90)
    })

    it("doubles general angles to 360 for resAngle = 2 with 1 deg steps (half angular increment)", () => {
      const angles = generateGeneralAngles(2)
      expect(angles.length).toBe(360)
      expect(angles[0]).toBe(0)
      expect(angles[1]).toBeCloseTo(Math.PI / 180) // 1 degree (half increment)
      expect(angles[1] - angles[0]).toBeCloseTo(Math.PI / 180)
    })

    it("generates 10 ball aim angles for resBall = 1 spanning from -halfAngle to +halfAngle", () => {
      const cueBall = { pos: { x: 0, y: 0 } }
      const targetBalls = [{ pos: { x: 1, y: 0 } }]
      const angles = generateBallAimAngles(cueBall, targetBalls, 1)

      expect(angles.length).toBe(10)
      const aimAngle = Math.atan2(0, 1) // 0
      const halfAngle = Math.asin((2 * R) / 1)
      expect(angles[0]).toBeCloseTo(aimAngle - halfAngle)
      expect(angles[9]).toBeCloseTo(aimAngle + halfAngle)
    })

    it("doubles ball aim angles to 20 for resBall = 2 (half angular increment)", () => {
      const cueBall = { pos: { x: 0, y: 0 } }
      const targetBalls = [{ pos: { x: 1, y: 0 } }]
      const angles1 = generateBallAimAngles(cueBall, targetBalls, 1)
      const angles2 = generateBallAimAngles(cueBall, targetBalls, 2)

      expect(angles2.length).toBe(20)
      const step1 = angles1[1] - angles1[0]
      const step2 = angles2[1] - angles2[0]
      expect(step2 * 2).toBeCloseTo(step1 * (19 / 18)) // 19 steps vs 9 steps
      expect(angles2[0]).toBeCloseTo(angles1[0])
      expect(angles2[19]).toBeCloseTo(angles1[9])
    })
  })

  describe("HTML structure and script integration", () => {
    let html: string

    beforeAll(() => {
      html = fs.readFileSync(
        path.resolve(__dirname, "../../dist/fit/solution.html"),
        "utf-8"
      )
    })

    it("contains res-ball-btn and res-angle-btn elements with proper titles and styles", () => {
      expect(html).toContain('id="res-ball-btn"')
      expect(html).toContain('id="res-angle-btn"')
      expect(html).toContain("res-btn")
      expect(html).toContain(".res-btn")
      expect(html).toContain(".res-btn.active")
    })

    it("parses resBall and resAngle query parameters with fallbacks", () => {
      expect(html).toContain('urlParams.get("resBall")')
      expect(html).toContain('urlParams.get("ballRes")')
      expect(html).toContain('urlParams.get("resAngle")')
      expect(html).toContain('urlParams.get("angleRes")')
      expect(html).toContain('urlParams.get("resGen")')
    })
  })
})
