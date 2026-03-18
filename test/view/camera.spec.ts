import { expect } from "chai"
import { Camera } from "../../src/view/camera"
import { AimEvent } from "../../src/events/aimevent"
import { R } from "../../src/model/physics/constants"
import { Vector3 } from "three"

describe("Camera", () => {
  it("increments t in update", () => {
    const camera = new Camera(1)
    const aim = new AimEvent(0, new Vector3(), 0, 0, 0)
    camera.update(0.1, aim)
    expect((camera as any).t).to.be.closeTo(0.1, 0.001)
    camera.update(0.2, aim)
    expect((camera as any).t).to.be.closeTo(0.3, 0.001)
  })

  it("orbitView sets target correctly", () => {
    const camera = new Camera(1)
    const aim = new AimEvent(0, new Vector3(), 0, 0, 0)

    // Set t to a known value
    const t = 20 * Math.PI / 2 // sin(t/20) = 1, cos(t/20) = 0
    camera.update(t, aim)

    camera.orbitView(aim)

    // target is internal but we can check camera position after lerp
    // If we want to check target directly we might need to cast to any
    const target = (camera as any).target
    expect(target.x).to.be.closeTo(22 * R, 0.001)
    expect(target.y).to.be.closeTo(0, 0.001)
    expect(target.z).to.be.closeTo(2 * R, 0.001)
  })
})
