import { expect } from "chai"
import { Trace } from "../../src/view/trace"
import { Vector3 } from "three"
import { R } from "../../src/model/physics/constants"

describe("Trace", () => {
  const trace = new Trace(3, 0x001122)

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

  it("if is straight line then reuse last point", (done) => {
    const point = new Vector3(0, 0, 0)
    const vel = new Vector3(1, 0, 0)
    trace.addTrace(point, vel)
    trace.addTrace(point.setX(2 * R), vel)
    trace.addTrace(point.setX(4 * R), vel)
    trace.addTrace(point.setX(6 * R), vel)
    expect(trace.geometry.drawRange.count).to.equal(2)
    vel.add(new Vector3(0.5, 0.5))
    trace.addTrace(point.setX(8 * R), vel)
    expect(trace.geometry.drawRange.count).to.equal(3)
    vel.add(new Vector3(0.5, 0.5))
    trace.addTrace(point.setX(10 * R), vel)
    expect(trace.geometry.drawRange.count).to.equal(4)
    vel.add(new Vector3(0.5, 0.5))
    trace.addTrace(point.setX(12 * R), vel)
    expect(trace.geometry.drawRange.count).to.equal(4)
    done()
  })
})
