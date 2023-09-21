import "mocha"
import { expect } from "chai"
import { Trace } from "../../src/view/trace"
import { Vector3 } from "three"

describe("Trace", () => {
  const trace = new Trace(1, 0x001122)

  beforeEach(function (done) {
    trace.reset()
    done()
  })

  it("addsInitialPoint", (done) => {
    const point = new Vector3(0, 0, 0)
    const vel = new Vector3(1, 0, 0)
    trace.addTrace(point, vel)
    expect(trace.lastPos).to.deep.equal(point)
    expect(trace.geometry.drawRange.count).to.equal(1)
    done()
  })

  it("does not add nearby second point", (done) => {
    const point = new Vector3(0, 0, 0)
    const vel = new Vector3(1, 0, 0)
    trace.addTrace(point, vel)
    trace.addTrace(point.setX(0.00001), vel)
    expect(trace.geometry.drawRange.count).to.equal(1)
    done()
  })
})
