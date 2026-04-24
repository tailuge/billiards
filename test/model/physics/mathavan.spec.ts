import { expect } from "chai"
import { Mathavan } from "../../../src/model/physics/mathavan"
import { ee, μs, μw, m, R } from "../../../src/model/physics/constants"

describe("Mathavan", () => {
  it("solves cushion bounce", (done) => {
    const mathavan = new Mathavan(m, R, ee, μs, μw)
    mathavan.solve(1, 1, 0, 0, 0)
    expect(mathavan.vx).to.be.lessThan(1)
    expect(mathavan.vy).to.be.below(0)
    done()
  })
})
