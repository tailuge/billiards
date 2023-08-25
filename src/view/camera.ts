import { PerspectiveCamera, Vector3, MathUtils } from "three"
import { up, zero, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { TableGeometry } from "./tablegeometry"

export class Camera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(35, aspectRatio, 0.1, 1000)
  }

  camera: PerspectiveCamera
  private mode = this.topView
  private mainMode = this.aimView
  private height = 4

  elapsed: number

  update(elapsed, aim: AimEvent) {
    this.elapsed = elapsed
    this.mode(aim)
  }

  topView(_: AimEvent) {
    let dist = 1 / (2 * Math.tan((this.camera.fov * Math.PI) / 360))
    if (this.camera.aspect > 1.78) {
      dist = dist * 2.75 * TableGeometry.tableY
    } else {
      dist = (dist * 2.4 * TableGeometry.tableX) / this.camera.aspect
    }
    const top = new Vector3(0, -0.1, dist)
    this.camera.position.lerp(top, 0.9)
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
