import { expect } from "chai"
import { Camera } from "../../src/view/camera"
import { AimEvent } from "../../src/events/aimevent"

describe("Camera", () => {
  it("increments t in update", () => {
    const camera = new Camera(1)
    const aim = new AimEvent()
    camera.update(0.1, aim)
    expect((camera as any).t).to.be.closeTo(0.1, 0.001)
    camera.update(0.2, aim)
    expect((camera as any).t).to.be.closeTo(0.3, 0.001)
  })

  it("orbitView sets target correctly", () => {
    const camera = new Camera(1)
    const aim = new AimEvent()

    const t = (20 * Math.PI) / 2
    camera.update(t, aim)

    camera.orbitView(aim)

    const target = (camera as any).target
    expect(target.z).to.be.greaterThan(0)
  })

  it("stepBackToFitAllBalls steps back, raises height and restores on toggleMode", () => {
    const camera = new Camera(1)
    camera.forceMode(camera.aimView)

    const { Vector3 } = require("three")
    const balls = [
      {
        onTable: () => true,
        pos: new Vector3(0, 0, 0),
      },
      {
        onTable: () => true,
        pos: new Vector3(1.0, 1.0, 0),
      },
    ]

    const aim = new AimEvent()
    aim.pos = new Vector3(0, 0, 0)
    aim.angle = 0

    const initialDistance = (camera as any).distance
    const initialHeight = (camera as any).height

    camera.stepBackToFitAllBalls(balls, aim)

    const steppedDistance = (camera as any).distance
    const steppedHeight = (camera as any).height

    expect(steppedDistance).to.be.greaterThan(initialDistance)
    expect(steppedHeight).to.be.greaterThan(initialHeight)
    expect(camera.savedDistance).to.equal(initialDistance)
    expect(camera.savedHeight).to.equal(initialHeight)

    camera.toggleMode()
    expect((camera as any).distance).to.equal(initialDistance)
    expect((camera as any).height).to.equal(initialHeight)
    expect(camera.savedDistance).to.be.undefined
    expect(camera.savedHeight).to.be.undefined
  })
})
