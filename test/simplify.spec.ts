import { simplifyTruth } from "../dist/fit/simplify"

describe("simplifyTruth", () => {
  it("should handle empty or undefined input gracefully", () => {
    expect(simplifyTruth([], 0.25)).toEqual([])
    expect(simplifyTruth(undefined as any, 0.25)).toEqual([])
  })

  it("should return the original points if the trajectory has 2 or fewer samples", () => {
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    expect(simplifyTruth(samples, 0.25)).toEqual(samples)
  })

  it("should simplify interior linear points perfectly with low tolerance", () => {
    // 3 points perfectly aligned: we should be able to remove the middle one
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 0.5, x: 0.5, y: 0.5 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    // Reconstruct with 1st and 3rd. Interpolating at t=0.5 gives x=0.5, y=0.5.
    // Euclidean distance error is 0. This is less than tolerance 0.25mm.
    // So the middle point should be removed!
    const simplified = simplifyTruth(samples, 0.25)
    expect(simplified).toEqual([
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ])
  })

  it("should NOT remove interior points if the error exceeds tolerance", () => {
    // 3 points where the middle point is offset (not aligned)
    const samples = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 0.5, x: 1.0, y: 0.0 }, // completely off line
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
    ]
    // Reconstruct with 1st and 3rd. Interpolating at t=0.5 gives x=0.5, y=0.5.
    // Euclidean distance error is sqrt((0.5)^2 + (0.5)^2) = 0.707 meters = 707 mm.
    // This is far greater than tolerance 0.25mm.
    // So the middle point must be retained!
    const simplified = simplifyTruth(samples, 0.25)
    expect(simplified).toEqual(samples)
  })

  it("should simplify multiple balls independently", () => {
    const samples = [
      // Ball 0 linear
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 0.5, x: 0.5, y: 0.5 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
      // Ball 1 with non-linear middle point (not simplified)
      { ball: 1, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 1, t: 0.5, x: 1.0, y: 0.0 },
      { ball: 1, t: 1.0, x: 1.0, y: 1.0 },
    ]

    const simplified = simplifyTruth(samples, 0.25)
    expect(simplified).toEqual([
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 0, t: 1.0, x: 1.0, y: 1.0 },
      { ball: 1, t: 0.0, x: 0.0, y: 0.0 },
      { ball: 1, t: 0.5, x: 1.0, y: 0.0 },
      { ball: 1, t: 1.0, x: 1.0, y: 1.0 },
    ])
  })
})
