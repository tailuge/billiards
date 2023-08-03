import "mocha"
import { expect } from "chai"
import { Vector3 } from "three"
import { isCushionXGrip } from "../../src/model/physics/physics"

describe("Physics", () => {
  it("isCushionGrip", (done) => {
    const v = new Vector3(1, 2, 0)
    const w = new Vector3(3, 4, 0)
    expect(isCushionXGrip(v, w)).true
    done()
  })
})
