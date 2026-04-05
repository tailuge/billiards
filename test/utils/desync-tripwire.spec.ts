import { hashStateCheck, statesDiffer } from "../../src/utils/desync-tripwire"

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

  describe("statesDiffer", () => {
    it("returns false for identical state", () => {
      expect(statesDiffer([0, 0, 1, 1], [0, 0, 1, 1])).toBe(false)
    })

    it("returns true for mismatched state", () => {
      expect(statesDiffer([0, 0, 1, 1], [0, 0, 1.25, 1])).toBe(true)
    })

    it("returns true when state lengths differ", () => {
      expect(statesDiffer([0, 1], [0, 1, 2, 3])).toBe(true)
    })
  })
})
