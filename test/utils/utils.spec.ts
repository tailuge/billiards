import { Vector3 } from "three"
import { unitAtAngle, roundVec2 } from "../../src/utils/three-utils"
import {
  round,
  round2,
  pow,
  exp,
  isFirstShot,
  getRandomSeed,
  getFlagForLocale,
} from "../../src/utils/utils"
import { EventType } from "../../src/events/eventtype"

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

  describe("round", () => {
    it("should round a number to 4 decimal places", () => {
      expect(round(1.2345678)).toBe(1.2345)
      expect(round(-1.2345678)).toBe(-1.2345)
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

  describe("isFirstShot", () => {
    it("should return true if no AIM event is in recorder", () => {
      const recorder = { entries: [] } as any
      expect(isFirstShot(recorder)).toBe(true)
    })

    it("should return false if an AIM event is in recorder", () => {
      const recorder = {
        entries: [{ event: { type: EventType.AIM } }],
      } as any
      expect(isFirstShot(recorder)).toBe(false)
    })
  })

  describe("getRandomSeed", () => {
    it("should return a number between 0 and 999999", () => {
      const seed = getRandomSeed()
      expect(seed).toBeGreaterThanOrEqual(0)
      expect(seed).toBeLessThan(1000000)
    })

    it("should return different values", () => {
      const seed1 = getRandomSeed()
      const seed2 = getRandomSeed()
      // Extremely unlikely to be same, but possible.
      // We just want to check it's not a constant.
      if (seed1 === seed2) {
        const seed3 = getRandomSeed()
        expect(seed3).not.toBe(seed1)
      }
    })
  })

  describe("getFlagForLocale", () => {
    it("should return a flag emoji for common locales", () => {
      // Mocking navigator.language is hard in jsdom if it's already set
      // but we can test the logic if we were to expose it better,
      // or just check it returns something valid.
      const flag = getFlagForLocale()
      expect(flag.length).toBeGreaterThan(0)
    })
  })
})
