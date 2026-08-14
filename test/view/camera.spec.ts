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

  it("cycleMode cycles through aim, aimz and topview", () => {
    const camera = new Camera(1)
    camera.forceMode(camera.aimView)

    const initialDistance = (camera as any).distance
    const initialHeight = (camera as any).height

    camera.cycleMode()
    expect(camera.mode).to.equal(camera.aimzView)
    expect(camera.isZoomedOut).to.equal(true)
    expect((camera as any).distance).to.equal(initialDistance)
    expect((camera as any).height).to.equal(initialHeight)

    camera.cycleMode()
    expect(camera.mode).to.equal(camera.topView)
    expect(camera.isZoomedOut).to.equal(false)

    camera.cycleMode()
    expect(camera.mode).to.equal(camera.aimView)
    expect(camera.isZoomedOut).to.equal(false)
    expect((camera as any).distance).to.equal(initialDistance)
    expect((camera as any).height).to.equal(initialHeight)
  })

  describe("Camera transition grace period", () => {
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

      camera.cycleMode()
      expect(camera.mode).to.equal(camera.aimView)
      expect(camera.aimGraceStartT).to.be.closeTo(4.2, 0.001)
    })

    it("sets aimGraceStartT to current t in cycleModeToAimz", () => {
      const camera = new Camera(1)
      camera.forceMode(camera.topView)
      camera.update(1.8, new AimEvent()) // set t to 1.8
      expect(camera.aimGraceStartT).to.be.undefined

      camera.cycleModeToAimz()
      expect(camera.mode).to.equal(camera.aimzView)
      expect(camera.aimGraceStartT).to.be.closeTo(1.8, 0.001)
    })
  })
})
