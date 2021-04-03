import { PerspectiveCamera, Vector3 } from "three"
import { up, zero, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"

export class Camera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(35, aspectRatio, 0.1, 1000)
  }

  camera: PerspectiveCamera
  mode = this.topView

  private topViewPoint = new Vector3(0, -0.1, 49)

  update(aim: AimEvent) {
    this.mode(aim)
  }

  topView(_: AimEvent) {
    this.camera.position.lerp(this.topViewPoint, 0.2)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView(aim: AimEvent, fraction = 0.08) {
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -9),
      fraction
    )
    this.camera.position.z = 2.7
    this.camera.up = up
    this.camera.lookAt(aim.pos)
  }

  afterHitView(aim: AimEvent) {
    this.camera.position.lerp(
      this.camera.position.clone().addScaledVector(up, 1),
      0.001
    )
    this.camera.up = up
    this.camera.lookAt(aim.pos)
  }
}
