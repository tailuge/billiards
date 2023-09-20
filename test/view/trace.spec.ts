import "mocha"
import { expect } from "chai"
import { Trace } from "../../src/view/trace"
import { Vector3 } from "three"

describe("Trace", () => {
  const trace = new Trace(1, 0x001122)

  it("addsInitialPoint", (done) => {
    trace.reset()
    const point = new Vector3(0, 0, 0)
    const vel = new Vector3(1, 0, 0)
    trace.addTrace(point, vel)
    expect(trace.lastPos).to.deep.equal(point)
    expect(trace.geometry.drawRange.count).to.equal(1)
    done()
  })
})
