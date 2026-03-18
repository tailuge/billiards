import { PerspectiveCamera, MathUtils, Vector3 } from "three"
import { up, zero, unitAtAngle } from "../utils/three-utils"
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

  private readonly target = new Vector3()
  private readonly lookTarget = new Vector3()
  private readonly tempVec = new Vector3()

  elapsed: number
  private t = 0

  update(elapsed, aim: AimEvent) {
    this.elapsed = elapsed
    this.t += elapsed
    this.mode(aim)
  }

  orbitView(_: AimEvent) {
    this.camera.fov = 45
    const orbitR = R * 60
    const orbitH = R * 20
    this.target.set(
      Math.sin(this.t / 20) * orbitR,
      Math.cos(this.t / 20) * orbitR,
      orbitH + Math.sin(this.t / 31) * orbitH * 0.2
    )
    this.camera.position.lerp(this.target, 0.01)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  topView(_: AimEvent) {
    this.camera.fov = CameraTop.fov
    this.camera.position.lerp(
      CameraTop.viewPoint(this.camera.aspect, this.camera.fov, this.tempVec),
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
    this.target
      .copy(aim.pos)
      .addScaledVector(unitAtAngle(aim.angle, this.tempVec), -R * 18)
    this.camera.position.lerp(this.target, fraction)
    this.camera.position.z = h
    this.camera.up = up
    this.lookTarget.copy(aim.pos).addScaledVector(up, h / 2)
    this.camera.lookAt(this.lookTarget)
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
