import { PerspectiveCamera, Vector3 } from "three"
import { up, zero } from "../utils/utils"
import { AimEvent } from "../events/aimevent"

export class Camera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(35, aspectRatio, 0.1, 1000)
  }

  camera: PerspectiveCamera
  mode = this.topView

  private topViewPoint = new Vector3(0, -0.1, 29)

  update(_, aim) {
    this.mode(aim)
  }

  topView(_: AimEvent) {
    this.camera.position.lerp(this.topViewPoint, 0.2)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView(aim: AimEvent) {
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(aim.dir, -9),
      0.07
    )
    this.camera.position.z = 2.7
    this.camera.up = up
    this.camera.lookAt(aim.pos)
  }

  afterHitView(aim: AimEvent) {
    this.camera.position.lerp(
      this.camera.position.clone().addScaledVector(up, 1),
      0.005
    )
    this.camera.up = up
    this.camera.lookAt(aim.pos)
  }
}
