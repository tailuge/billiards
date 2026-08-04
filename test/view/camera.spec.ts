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

  describe("Camera transition grace period", () => {
    const { Vector3 } = require("three")
    const balls = [
      {
        onTable: () => true,
        pos: new Vector3(0, 0, 0),
      },
    ]

    it("sets aimGraceStartT to current t in toggleMode", () => {
      const camera = new Camera(1)
      camera.forceMode(camera.topView)
      camera.update(3.5, new AimEvent()) // set t to 3.5
      expect(camera.aimGraceStartT).to.be.undefined

      camera.toggleMode()
      expect(camera.mode).to.equal(camera.aimView)
      expect(camera.aimGraceStartT).to.be.closeTo(3.5, 0.001)
    })

    it("sets aimGraceStartT to current t in cycleMode", () => {
      const camera = new Camera(1)
      camera.forceMode(camera.topView)
      camera.update(4.2, new AimEvent()) // set t to 4.2
      expect(camera.aimGraceStartT).to.be.undefined

      camera.cycleMode(balls, new AimEvent())
      expect(camera.mode).to.equal(camera.aimView)
      expect(camera.aimGraceStartT).to.be.closeTo(4.2, 0.001)
    })

    it("sets aimGraceStartT to current t in cycleModeToAimz", () => {
      const camera = new Camera(1)
      camera.forceMode(camera.topView)
      camera.update(1.8, new AimEvent()) // set t to 1.8
      expect(camera.aimGraceStartT).to.be.undefined

      camera.cycleModeToAimz(balls, new AimEvent())
      expect(camera.mode).to.equal(camera.aimView)
      expect(camera.aimGraceStartT).to.be.closeTo(1.8, 0.001)
    })
  })
})
