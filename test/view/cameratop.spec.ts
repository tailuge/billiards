import { expect } from "chai"
import { CameraTop } from "../../src/view/cameratop"

describe("View", () => {
  const fov = 35
  it("wide screen render table horizontally", (done) => {
    const distance = CameraTop.viewPoint(2, fov)
    expect(distance.x).to.equal(0)
    done()
  })
  it("wide screen scale to height", (done) => {
    const distance = CameraTop.viewPoint(1, fov)
    expect(distance.z).to.be.approximately(5, 0.5)
    done()
  })
  it("mobile device render table vertically", (done) => {
    const distance = CameraTop.viewPoint(0.7, fov)
    expect(distance.x).to.be.lessThan(0)
    done()
  })
  it("mobile device scale to width", (done) => {
    const distance = CameraTop.viewPoint(0.4, fov)
    expect(distance.z).to.be.approximately(7.0, 1)
    done()
  })
})
