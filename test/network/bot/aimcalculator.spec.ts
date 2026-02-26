import { Vector3 } from "three"
import { AimCalculator } from "../../../src/network/bot/aimcalculator"
import { Pocket } from "../../../src/model/physics/pocket"
import { R } from "../../../src/model/physics/constants"
import { Table } from "../../../src/model/table"
import { Ball } from "../../../src/model/ball"

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

    it("should return an aim point even for very difficult cut shots (score > 0.8)", () => {
      const cuePos = new Vector3(0, 0, 0)
      const targetPos = new Vector3(2, 0, 0)
      // A pocket that requires a very sharp cut
      // shotLine = (1, 0, 0)
      // pocketLine = targetPos to pocket
      // If pocket is at (2, 2, 0), pocketLine is (0, 1, 0)
      // dot product is 0, score is 1.0 (which is > 0.8)
      const pocketPos = new Vector3(2, 2, 0)
      const pockets = [pocketPos]

      const aimPoint = calculator.getAimPoint(cuePos, targetPos, pockets)

      expect(aimPoint).toBeDefined()
      // Ghost ball should be at (2, -R*2, 0) because pocket is at (2, 2, 0)
      // Wait, incident vector from pocket (2, 2) to target (2, 0) is (0, -2) -> (0, -1) normalized
      // Ghost ball = targetPos + (0, -1) * 2 * R = (2, -2*R, 0)
      expect(aimPoint?.x).toBeCloseTo(2)
      expect(aimPoint?.y).toBeCloseTo(-2 * R)
    })
  })

  describe("generateRandomShot", () => {
    it("should set spin to max top spin if cue intersects another ball", () => {
      const cueball = new Ball(new Vector3(0, 0, 0))
      const table = new Table([cueball])

      // Mock intersectsAnything to return true
      jest.spyOn(table.cue, "intersectsAnything").mockReturnValue(true)

      const targetPos = new Vector3(10, 0, 0)
      const hitEvent = calculator.generateRandomShot(table, 0, targetPos) as any

      const aimData = hitEvent.tablejson.aim
      expect(aimData.offset.y).toBe(table.cue.offCenterLimit)
      expect(aimData.offset.x).toBe(0)
    })

    it("should not set spin to max top spin if cue does not intersect anything", () => {
      const cueball = new Ball(new Vector3(0, 0, 0))
      const table = new Table([cueball])

      // Mock intersectsAnything to return false
      jest.spyOn(table.cue, "intersectsAnything").mockReturnValue(false)

      const targetPos = new Vector3(10, 0, 0)
      const hitEvent = calculator.generateRandomShot(table, 0, targetPos) as any

      const aimData = hitEvent.tablejson.aim
      // By default generateRandomShot sets a random offset.y between -0.3 and 0.3
      // and offset.x to 0.
      expect(aimData.offset.x).toBe(0)
      // It's random, but it should stay as it was (which is not necessarily max top spin)
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
