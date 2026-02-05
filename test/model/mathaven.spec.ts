import { expect } from "chai"
import { Mathaven } from "../../src/model/physics/mathaven"
import { m, R, ee, μs, μw } from "../../src/model/physics/constants"

describe("Mathaven Physics", () => {
  it("solve should result in reasonable rebound values", () => {
    const mathaven = new Mathaven(m, R, ee, μs, μw + 0.1)
    mathaven.solve(1, 1, 0, 0, 0)

    // Check that velocity changed (bounced)
    expect(mathaven.vy).to.be.lessThan(0)
    expect(mathaven.vx).to.not.equal(1)

    // Check that angular velocity was updated
    expect(mathaven.ωx).to.not.equal(0)
    expect(mathaven.ωy).to.not.equal(0)
    expect(mathaven.ωz).to.not.equal(0)
  })

  it("reusing instance should yield same result as new instance", () => {
    const vx = 1.5, vy = 2.0, wx = 0.5, wy = -0.3, wz = 10.0

    const mathaven1 = new Mathaven(m, R, ee, μs, μw + 0.1)
    mathaven1.solve(vx, vy, wx, wy, wz)
    const result1 = { vx: mathaven1.vx, vy: mathaven1.vy, wx: mathaven1.ωx, wy: mathaven1.ωy, wz: mathaven1.ωz }

    const mathaven2 = new Mathaven(m, R, ee, μs, μw + 0.1)
    // Solve once with different values
    mathaven2.solve(0.1, 0.1, 0, 0, 0)
    // Solve again with original values
    mathaven2.solve(vx, vy, wx, wy, wz)
    const result2 = { vx: mathaven2.vx, vy: mathaven2.vy, wx: mathaven2.ωx, wy: mathaven2.ωy, wz: mathaven2.ωz }

    expect(result1).to.deep.equal(result2)
  })
})
