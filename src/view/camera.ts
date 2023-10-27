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
  mode = this.topView
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
    const h = this.height
    const portrait = this.camera.aspect < 0.8
    this.camera.fov = portrait ? 60 : 40
    if (h < 10 * R) {
      const factor = 100 * (10 * R - h)
      this.camera.fov -= factor * (portrait ? 3 : 1)
    }
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -R * 18),
      fraction
    )
    this.camera.position.z = h
    this.camera.up = up
    this.camera.lookAt(aim.pos.clone().addScaledVector(up, h / 2))
  }

  adjustHeight(delta) {
    delta = this.height < 10 * R ? delta / 8 : delta
    this.height = MathUtils.clamp(this.height + delta, R * 6, R * 120)
    if (this.height > R * 110) {
      this.suggestMode(this.topView)
    }
    if (this.height < R * 105) {
      this.suggestMode(this.aimView)
    }
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
