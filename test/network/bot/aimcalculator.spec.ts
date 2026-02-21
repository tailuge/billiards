import { Vector3 } from "three"
import { AimCalculator } from "../../../src/network/bot/aimcalculator"
import { Pocket } from "../../../src/model/physics/pocket"

describe("AimCalculator", () => {
  const ballRadius = 0.5
  const calculator = new AimCalculator(ballRadius)

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
      expect(aimPoint?.x).toBeCloseTo(1)
      expect(aimPoint?.y).toBeCloseTo(0)
      expect(aimPoint?.z).toBeCloseTo(0)
    })

    it("should return null if no pockets are ahead", () => {
      const cuePos = new Vector3(0, 0, 0)
      const targetPos = new Vector3(2, 0, 0)
      const pocketPos = new Vector3(-2, 0, 0) // Behind
      const pockets = [pocketPos]

      const aimPoint = calculator.getAimPoint(cuePos, targetPos, pockets)

      expect(aimPoint).toBeNull()
    })

    it("should choose the closest pocket among those that are ahead", () => {
      const cuePos = new Vector3(0, 0, 0)
      const targetPos = new Vector3(2, 0, 0)
      const pocket1 = new Vector3(10, 0, 0) // Far
      const pocket2 = new Vector3(4, 0, 0) // Close
      const pockets = [pocket1, pocket2]

      const aimPoint = calculator.getAimPoint(cuePos, targetPos, pockets)

      // Should choose pocket2
      // Incident vector from pocket2 (4,0,0) to target (2,0,0) is (-1,0,0)
      // Ghost ball = (2,0,0) + (-1,0,0) * 1 = (1,0,0)
      expect(aimPoint?.x).toBeCloseTo(1)
      expect(aimPoint?.y).toBeCloseTo(0)
    })
  })

  describe("extractPocketPositions", () => {
    it("should extract positions from a list of Pocket objects", () => {
      const p1 = new Pocket(new Vector3(1, 2, 3), 1)
      const p2 = new Pocket(new Vector3(4, 5, 6), 1)
      const pockets = [p1, p2]

      const positions = calculator.extractPocketPositions(pockets)

      expect(positions).toHaveLength(2)
      expect(positions[0]).toEqual(p1.pos)
      expect(positions[1]).toEqual(p2.pos)
    })
  })
})
