import { dedensify } from "../dist/fit/processpkl"

describe("dedensify", () => {
  it("should handle empty arrays gracefully", () => {
    const result = dedensify([], [], [])
    expect(result).toEqual({ t: [], x: [], y: [] })
  })

  it("should keep the only point if length is 1", () => {
    const result = dedensify([0.0], [1.5], [0.5])
    expect(result).toEqual({ t: [0.0], x: [1.5], y: [0.5] })
  })

  it("should discard points closer than 2mm (0.002m)", () => {
    // P0: (0, 0)
    // P1: (0.001, 0) -> distance is 0.001m (1mm) < 2mm -> discard!
    // P2: (0.0025, 0) -> distance to P0 is 0.0025m (2.5mm) >= 2mm -> keep!
    // P3: (0.0035, 0) -> distance to P2 is 0.001m (1mm) < 2mm -> discard!
    const t = [0.0, 0.02, 0.04, 0.06]
    const x = [0.0, 0.001, 0.0025, 0.0035]
    const y = [0.0, 0.0, 0.0, 0.0]

    const result = dedensify(t, x, y)
    expect(result).toEqual({
      t: [0.0, 0.04],
      x: [0.0, 0.0025],
      y: [0.0, 0.0],
    })
  })

  it("should keep points exactly 2mm (0.002m) or further apart", () => {
    // P0: (0, 0)
    // P1: (0.002, 0) -> distance is 2mm -> keep!
    // P2: (0.002, 0.002) -> distance is 2mm -> keep!
    const t = [0.0, 0.02, 0.04]
    const x = [0.0, 0.002, 0.002]
    const y = [0.0, 0.0, 0.002]

    const result = dedensify(t, x, y)
    expect(result).toEqual({
      t: [0.0, 0.02, 0.04],
      x: [0.0, 0.002, 0.002],
      y: [0.0, 0.0, 0.002],
    })
  })
})
