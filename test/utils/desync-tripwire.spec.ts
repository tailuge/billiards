import {
  hashStateCheck,
  summariseStateDiff,
} from "../../src/utils/desync-tripwire"

describe("desync-tripwire", () => {
  describe("hashStateCheck", () => {
    it("returns a stable fingerprint for identical state", () => {
      const stateCheck = [1, 2, 3, 4]

      expect(hashStateCheck(stateCheck)).toBe(hashStateCheck(stateCheck))
    })

    it("returns missing when state is undefined", () => {
      expect(hashStateCheck(undefined)).toBe("missing")
    })
  })

  describe("summariseStateDiff", () => {
    it("summarises only mismatched balls", () => {
      const summary = summariseStateDiff(
        [0, 0, 1, 1, 2, 2],
        [0, 0, 1.25, 1, 2, 1.5]
      )

      expect(summary).toBeDefined()
      expect(summary?.driftedBallIndices).toEqual([1, 2])
      expect(summary?.ballDiffs).toHaveLength(2)
      expect(summary?.ballDiffs[0].ballIndex).toBe(1)
      expect(summary?.ballDiffs[1].ballIndex).toBe(2)
      expect(summary?.maxDrift).toBeCloseTo(0.5)
    })

    it("returns undefined when state lengths differ", () => {
      expect(summariseStateDiff([0, 1], [0, 1, 2, 3])).toBeUndefined()
    })
  })
})
