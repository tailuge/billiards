import { expect } from "chai"
import { RealPosition } from "../../src/diagram/real/realposition"

const example = [
  {
    shotID: 545599,
    balls: {
      "1": {
        t: [0, 0.35, 0.45],
        x: [0, 1, 2],
        y: [0, 1, 2],
      },
    },
  },
]

const real = new RealPosition(example)

describe("RealPosition", () => {
  it("Use initial position up to move", (done) => {
    const result0 = real.getPositionsAtTime(545599, 0.0)
    const result1 = real.getPositionsAtTime(545599, 0.039)
    expect(result1).to.deep.equal(result0)
    done()
  })

  it("Interpolate between positions", (done) => {
    const result = real.getPositionsAtTime(545599, 0.4)
    console.log(result)
    expect(result).to.not.be.null
    expect(result!["1"].x).to.be.closeTo(1.5, 0.01)
    done()
  })
})
