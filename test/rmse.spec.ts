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
    // wi = 3.0 (cue ball)
    // sse = 3.0 * 1.0 = 3.0
    // count = 3.0
    const resSSE = computeSSE(truth, simTracks)
    expect(resSSE.sse).toBeCloseTo(3.0)
    expect(resSSE.count).toBeCloseTo(3.0)

    const rmse = computeRMSE(truth, simTracks)
    expect(rmse).toBeCloseTo(1.0)
  })

  it("should compute correct weighted SSE and RMSE for a single point at t=1", () => {
    const truth = [{ ball: 0, t: 1.0, x: 1.0, y: 0.0 }]
    const simTracks = {
      0: [{ x: 3.0, y: 0.0, t: 1.0 }],
    }
    // error is dx = 2.0, dy = 0.0 => distance squared is 4.0
    // wi = 3.0 (cue ball)
    // sse = 3.0 * 4.0 = 12.0
    // count = 3.0
    const resSSE = computeSSE(truth, simTracks)
    expect(resSSE.sse).toBeCloseTo(12.0)
    expect(resSSE.count).toBeCloseTo(3.0)

    const rmse = computeRMSE(truth, simTracks)
    // rmse = sqrt(sse / count) = sqrt(12.0 / 3.0) = 2.0
    expect(rmse).toBeCloseTo(2.0)
  })

  it("should weight early and late errors of the same magnitude equally", () => {
    const simTracks = {
      0: [
        { x: 0, y: 0, t: 0.0 },
        { x: 1, y: 0, t: 1.0 },
      ],
    }

    // Case A: error at t=0 is 1.0, error at t=1 is 0.0
    const truthA = [
      { ball: 0, t: 0.0, x: 1.0, y: 0.0 }, // error = 1.0, w = 3.0
      { ball: 0, t: 1.0, x: 1.0, y: 0.0 }, // error = 0.0, w = 3.0
    ]
    const sseA = computeSSE(truthA, simTracks)
    // sse = 3.0 * (1.0^2) + 3.0 * (0.0^2) = 3.0
    // count = 6.0
    expect(sseA.sse).toBeCloseTo(3.0)
    expect(sseA.count).toBeCloseTo(6.0)
    const rmseA = computeRMSE(truthA, simTracks)
    expect(rmseA).toBeCloseTo(Math.sqrt(1.0 / 2.0))

    // Case B: error at t=0 is 0.0, error at t=1 is 1.0
    const truthB = [
      { ball: 0, t: 0.0, x: 0.0, y: 0.0 }, // error = 0.0, w = 3.0
      { ball: 0, t: 1.0, x: 2.0, y: 0.0 }, // error = 1.0, w = 3.0
    ]
    const sseB = computeSSE(truthB, simTracks)
    // sse = 3.0 * (0.0^2) + 3.0 * (1.0^2) = 3.0
    // count = 6.0
    expect(sseB.sse).toBeCloseTo(3.0)
    expect(sseB.count).toBeCloseTo(6.0)
    const rmseB = computeRMSE(truthB, simTracks)
    expect(rmseB).toBeCloseTo(Math.sqrt(1.0 / 2.0))

    // Flat weighting: early and late errors contribute equally
    expect(rmseA).not.toBeNull()
    expect(rmseB).not.toBeNull()
    if (rmseA !== null && rmseB !== null) {
      expect(rmseA).toBeCloseTo(rmseB)
    }
  })

  it("should weight cue ball samples 3x other balls", () => {
    const simTracks = {
      0: [{ x: 1.0, y: 0.0, t: 0 }],
      1: [{ x: 0.0, y: 0.0, t: 0 }],
    }
    const truth = [
      { ball: 0, t: 0, x: 0.0, y: 0.0 },
      { ball: 1, t: 0, x: 1.0, y: 0.0 },
    ]
    const res = computeSSE(truth, simTracks, true)
    expect(res.sse).toBeCloseTo(3 * 1.0 + 1 * 1.0)
    expect(res.count).toBeCloseTo(4.0)

    const rmse = computeRMSE(truth, simTracks, true)
    expect(rmse).toBeCloseTo(1.0)
  })
})
