import { expect } from "chai"
import { Mathaven } from "../../../src/model/physics/mathaven"
import { ee, μs, μw, m, R } from "../../../src/model/physics/constants"

describe("Mathaven", () => {
  it("solves cushion bounce", (done) => {
    const mathaven = new Mathaven(m, R, ee, μs, μw)
    mathaven.solve(1, 1, 0, 0, 0)
    expect(mathaven.vx).to.be.lessThan(1)
    expect(mathaven.vy).to.be.below(0)
    done()
  })
})
