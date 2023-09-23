import { PerspectiveCamera, MathUtils } from "three"
import { up, zero, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { CameraTop } from "./cameratop"
import { R } from "../model/physics/constants"

export class Camera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(45, aspectRatio, R, R * 1000)
  }

  camera: PerspectiveCamera
  private mode = this.topView
  private mainMode = this.aimView
  private height = R * 8

  elapsed: number

  update(elapsed, aim: AimEvent) {
    this.elapsed = elapsed
    this.mode(aim)
  }

  topView(_: AimEvent) {
    this.camera.fov = CameraTop.fov
    this.camera.position.lerp(
      CameraTop.viewPoint(this.camera.aspect, this.camera.fov),
      0.9
    )
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView(aim: AimEvent, fraction = 0.08) {
    this.camera.fov = 45
    this.camera.fov = this.camera.aspect < 0.8 ? 65 : 45
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -R * 20),
      fraction
    )
    this.camera.position.z = this.height
    this.camera.up = up
    this.camera.lookAt(aim.pos.clone().addScaledVector(up, 2 * R))
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
