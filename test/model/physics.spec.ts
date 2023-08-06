import "mocha"
import { expect } from "chai"
import { Vector3 } from "three"
import { isCushionXGrip } from "../../src/model/physics/physics"

describe("Physics", () => {
  it("isCushionGrip slow direct into cushion should grip", (done) => {
    const v = new Vector3(0.1, 0, 0)
    const w = new Vector3(0, 0, 0.1)
    expect(isCushionXGrip(v, w)).true
    done()
  })

  it("isCushionGrip fast glancing angle into cushion should not grip", (done) => {
    const v = new Vector3(0.1, 20, 0)
    const w = new Vector3(0, 0, 0.1)
    expect(isCushionXGrip(v, w)).false
    done()
  })
})
