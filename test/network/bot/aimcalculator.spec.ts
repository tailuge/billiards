import { Vector3 } from "three"
import { AimCalculator } from "../../../src/network/bot/aimcalculator"
import { Pocket } from "../../../src/model/physics/pocket"
import { R } from "../../../src/model/physics/constants"

describe("AimCalculator", () => {
  const calculator = new AimCalculator()

  describe("getAimPoint", () => {
    it("should return the ghost ball position for a simple straight shot", () => {
      const cuePos = new Vector3(0, 0, 0)
      const targetPos = new Vector3(2, 0, 0)
      const pocketPos = new Vector3(4, 0, 0)
      const pockets = [pocketPos]

      const aimPoint = calculator.getAimPoint(cuePos, targetPos, pockets)

      // Incident vector from pocket to target is (-1, 0, 0)
      // Ghost ball is at targetPos + incidentVector * 2 * ballRadius
      // Ghost ball = (2, 0, 0) + (-1, 0, 0) * 1 = (1, 0, 0)
      expect(aimPoint?.x).toBeCloseTo(2 - 2 * R)
      expect(aimPoint?.y).toBeCloseTo(0)
      expect(aimPoint?.z).toBeCloseTo(0)
    })
  })

  describe("extractPocketPositions", () => {
    it("should extract positions from a list of Pocket objects", () => {
      const p1 = new Pocket(new Vector3(1, 2, 3), 1)
      const p2 = new Pocket(new Vector3(4, 5, 6), 1)
      const pockets = [p1, p2]

      const positions = calculator.extractPocketPositions(pockets)

      expect(positions).toHaveLength(2)
      expect(positions[0].distanceToSquared(p1.pos)).toBeLessThan(1)
      expect(positions[1].distanceToSquared(p2.pos)).toBeLessThan(1)
    })
  })
})
