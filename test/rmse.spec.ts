import { computeSSE, computeRMSE } from "../dist/fit/rmse"

describe("rmse and sse weighting", () => {
  it("should return zero sse and count when relevant samples are empty", () => {
    expect(computeSSE([], {})).toEqual({ sse: 0, count: 0 })
    expect(computeRMSE([], {})).toBeNull()
  })

  it("should compute correct weighted SSE and RMSE for a single point at t=0", () => {
    const truth = [{ ball: 0, t: 0, x: 1.0, y: 0.0 }]
    const simTracks = {
      0: [{ x: 2.0, y: 0.0, t: 0 }],
    }
    // error is dx = 1.0, dy = 0.0 => distance squared is 1.0
    // wi = 1.5 (cue ball) / (1 + 0) = 1.5
    // sse = 1.5 * 1.0 = 1.5
    // count = 1.5
    const resSSE = computeSSE(truth, simTracks)
    expect(resSSE.sse).toBeCloseTo(1.5)
    expect(resSSE.count).toBeCloseTo(1.5)

    const rmse = computeRMSE(truth, simTracks)
    expect(rmse).toBeCloseTo(1.0)
  })

  it("should compute correct weighted SSE and RMSE for a single point at t=1", () => {
    const truth = [{ ball: 0, t: 1.0, x: 1.0, y: 0.0 }]
    const simTracks = {
      0: [{ x: 3.0, y: 0.0, t: 1.0 }],
    }
    // error is dx = 2.0, dy = 0.0 => distance squared is 4.0
    // wi = 1.5 (cue ball) / (1 + 1) = 0.75
    // sse = 0.75 * 4.0 = 3.0
    // count = 0.75
    const resSSE = computeSSE(truth, simTracks)
    expect(resSSE.sse).toBeCloseTo(3.0)
    expect(resSSE.count).toBeCloseTo(0.75)

    const rmse = computeRMSE(truth, simTracks)
    // rmse = sqrt(sse / count) = sqrt(3.0 / 0.75) = 2.0
    expect(rmse).toBeCloseTo(2.0)
  })

  it("should weight an early error more heavily than the same error later", () => {
    const simTracks = {
      0: [
        { x: 0, y: 0, t: 0.0 },
        { x: 1, y: 0, t: 1.0 },
      ],
    }

    // Case A: error 1.0 at t=0, 0.0 at t=1
    const truthA = [
      { ball: 0, t: 0.0, x: 1.0, y: 0.0 }, // error = 1.0, wi = 1.5
      { ball: 0, t: 1.0, x: 1.0, y: 0.0 }, // error = 0.0, wi = 0.75
    ]
    const rmseA = computeRMSE(truthA, simTracks)

    // Case B: error 0.0 at t=0, 1.0 at t=1
    const truthB = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 }, // error = 0.0, wi = 1.5
      { ball: 0, t: 1.0, x: 2.0, y: 0.0 }, // error = 1.0, wi = 0.75
    ]
    const rmseB = computeRMSE(truthB, simTracks)

    expect(rmseA).not.toBeNull()
    expect(rmseB).not.toBeNull()
    if (rmseA !== null && rmseB !== null) {
      expect(rmseA).toBeGreaterThan(rmseB)
    }
  })

  it("should weight cue ball samples 1.5x other balls", () => {
    const simTracks = {
      0: [{ x: 1.0, y: 0.0, t: 0 }],
      1: [{ x: 0.0, y: 0.0, t: 0 }],
    }
    const truth = [
      { ball: 0, t: 0, x: 0.0, y: 0.0 },
      { ball: 1, t: 0, x: 1.0, y: 0.0 },
    ]
    const res = computeSSE(truth, simTracks, true)
    expect(res.sse).toBeCloseTo(1.5 * 1.0 + 1 * 1.0)
    expect(res.count).toBeCloseTo(2.5)

    const rmse = computeRMSE(truth, simTracks, true)
    expect(rmse).toBeCloseTo(1.0)
  })

  it("should exclude truth samples beyond the cutoff", () => {
    const simTracks = {
      0: [
        { x: 1.0, y: 0.0, t: 0 },
        { x: 1.0, y: 0.0, t: 5 },
      ],
    }
    const truth = [
      { ball: 0, t: 0, x: 0.0, y: 0.0 }, // error 1.0, wi = 1.5
      { ball: 0, t: 5, x: 0.0, y: 0.0 }, // error 1.0, wi = 1.5 / 6 = 0.25
    ]

    // Default cutoff of 4 s excludes the t=5 sample.
    const res = computeSSE(truth, simTracks)
    expect(res.sse).toBeCloseTo(1.5)
    expect(res.count).toBeCloseTo(1.5)

    // A null cutoff disables truncation and includes both samples.
    const resFull = computeSSE(truth, simTracks, false, null)
    expect(resFull.sse).toBeCloseTo(1.5 + 0.25)
    expect(resFull.count).toBeCloseTo(1.75)
  })
})
