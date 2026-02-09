import { Vector3 } from "three"
import { unitAtAngle, round2, roundVec2, pow, exp } from "../../src/utils/utils"

describe("utils", () => {
  describe("unitAtAngle", () => {
    it("should return a unit vector at a given angle", () => {
      const v = unitAtAngle(0)
      expect(v.x).toBeCloseTo(1)
      expect(v.y).toBeCloseTo(0)
      expect(v.z).toBeCloseTo(0)
    })

    it("should use the provided target vector", () => {
      const target = new Vector3()
      const v = unitAtAngle(Math.PI / 2, target)
      expect(v).toBe(target)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(1)
      expect(v.z).toBeCloseTo(0)
    })
  })

  describe("round2", () => {
    it("should round a number to 2 decimal places", () => {
      expect(round2(1.2345)).toBe(1.23)
      expect(round2(1.235)).toBe(1.24)
    })
  })

  describe("roundVec2", () => {
    it("should round all components of a Vector3 to 2 decimal places", () => {
      const v = new Vector3(1.234, 5.678, 9.012)
      roundVec2(v)
      expect(v.x).toBe(1.23)
      expect(v.y).toBe(5.68)
      expect(v.z).toBe(9.01)
    })
  })

  describe("pow", () => {
    it("should return x raised to the power of y", () => {
      expect(pow(2, 3)).toBe(8)
      expect(pow(9, 0.5)).toBe(3)
    })
  })

  describe("exp", () => {
    it("should return e raised to the power of x", () => {
      expect(exp(0)).toBe(1)
      expect(exp(1)).toBeCloseTo(Math.E)
    })
  })
})
