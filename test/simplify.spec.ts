import { simplifyTruth } from "../dist/fit/simplify"

describe("simplifyTruth", () => {
  it("should handle empty or undefined input gracefully", () => {
    expect(simplifyTruth([], 250)).toEqual([])
    expect(simplifyTruth(undefined as any, 250)).toEqual([])
  })

  it("should return the original points if the trajectory has 2 or fewer samples", () => {
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    expect(simplifyTruth(samples, 250)).toEqual(samples)
  })

  it("should simplify interior linear points when distance to last kept is less than min distance", () => {
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 0.5, x: 0.1, y: 0.1 }, // very close to first point
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    // minDistance is 250mm = 0.25m.
    // Distance from (0,0) to (0.1, 0.1) is sqrt(0.02) = 0.141m. This is < 0.25m, so it should be skipped.
    const simplified = simplifyTruth(samples, 250)
    expect(simplified).toEqual([
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ])
  })

  it("should NOT remove interior points if distance is at least minDistance", () => {
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 0.5, x: 0.5, y: 0.5 }, // distance from (0,0) is 0.707m > 0.25m
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    const simplified = simplifyTruth(samples, 250)
    expect(simplified).toEqual(samples)
  })

  it("should never remove points within 3r of cushion", () => {
    // Left cushion is at -1.479645.
    // Point at x = -1.45, y = 0.0 is within 3R of left cushion.
    const samples = [
      { ball: 0, t: 0.0, x: -1.47, y: 0.0 },
      { ball: 0, t: 0.5, x: -1.45, y: 0.0 },
      { ball: 0, t: 1.0, x: -1.4, y: 0.0 },
    ]
    const simplified = simplifyTruth(samples, 1000) // even with 1000mm minDistance, it should keep the cushion point
    expect(simplified).toEqual(samples)
  })

  it("should never remove points within 3r of other balls", () => {
    // Ball 0 and Ball 1 are in close proximity at t = 0.5.
    const samples = [
      { ball: 0, t: 0.0, x: -1.0, y: 0.0 },
      { ball: 0, t: 0.5, x: -0.01, y: 0.0 }, // near other ball (0.01, 0)
      { ball: 0, t: 1.0, x: 1.0, y: 0.0 },
      { ball: 1, t: 0.0, x: 0.0, y: 1.0 },
      { ball: 1, t: 0.5, x: 0.01, y: 0.0 }, // near other ball (-0.01, 0)
      { ball: 1, t: 1.0, x: 0.0, y: -1.0 },
    ]
    const simplified = simplifyTruth(samples, 1000)
    expect(simplified).toEqual(samples)
  })
})
