import { PerspectiveCamera, Vector3, MathUtils } from "three"
import { up, zero, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"

export class Camera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(35, aspectRatio, 0.1, 1000)
  }

  camera: PerspectiveCamera
  private mode = this.topView
  private mainMode = this.aimView

  private topViewPoint = new Vector3(0, -0.1, 49)
  private height = 4

  elapsed

  update(elapsed, aim: AimEvent) {
    this.elapsed = elapsed
    this.mode(aim)
  }

  topView(_: AimEvent) {
    this.camera.position.lerp(this.topViewPoint, 0.9)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView(aim: AimEvent, fraction = 0.08) {
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -9),
      fraction
    )
    this.camera.position.z = this.height
    this.camera.up = up
    this.camera.lookAt(aim.pos.clone().addScaledVector(up, 1))
    this.standback = 9
  }

  standback = 9

  afterHitView(aim: AimEvent) {
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -this.standback),
      0.5
    )
    this.camera.position.z = this.height + (this.standback - 9)
    this.camera.up = up
    this.camera.lookAt(aim.pos.clone().addScaledVector(up, 1))
  }

  adjustHeight(delta) {
    this.height = MathUtils.clamp(this.height + delta, 1, 6)
  }

  suggestMode(mode) {
    if (this.mainMode === this.aimView) {
      this.mode = mode
    }
  }

  forceMode(mode) {
    this.mode = mode
    this.mainMode = mode
  }

  forceMove(aim: AimEvent) {
    if (this.mode === this.aimView) {
      this.aimView(aim, 1)
    }
  }

  toggleMode() {
    if (this.mode === this.topView) {
      this.mode = this.aimView
    } else {
      this.mode = this.topView
    }
    this.mainMode = this.mode
  }
}
