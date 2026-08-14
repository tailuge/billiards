import { PerspectiveCamera, MathUtils, Vector3 } from "three"
import { up, zero, unitAtAngle } from "../utils/three-utils"
import { AimEvent } from "../events/aimevent"
import { CameraTop } from "./cameratop"
import { R } from "../model/physics/constants"

export class Camera {
  static defaultHeight = R * 8
  static defaultDistance = R * 22
  static defaultFovOffset = 0
  static aimzHeight = R * 40
  static aimzDistance = R * 100

  static configureForRule(ruleType: string) {
    if (ruleType === "threecushion" || ruleType === "sagu") {
      Camera.defaultHeight = R * 19
      Camera.defaultDistance = R * 24
      Camera.defaultFovOffset = 6
      CameraTop.zoomFactor = 0.92
    }
  }

  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(45, aspectRatio, R, R * 1000)
  }

  camera: PerspectiveCamera
  mode = this.topView
  private mainMode = this.aimView
  private height = Camera.defaultHeight
  isZoomedOut = false

  private readonly target = new Vector3()
  private readonly lookTarget = new Vector3()
  private readonly tempVec = new Vector3()
  private readonly tempVec2 = new Vector3()

  private distance = Camera.defaultDistance
  private fovOffset = Camera.defaultFovOffset
  private aimzHeight = Camera.aimzHeight
  private aimzDistance = Camera.aimzDistance

  elapsed: number
  t = 0
  aimGraceStartT?: number

  update(elapsed, aim: AimEvent) {
    this.elapsed = elapsed
    this.t += elapsed
    this.mode(aim)
  }

  orbitView(_: AimEvent) {
    this.camera.fov = 45 + this.fovOffset
    const orbitR = R * 70
    const orbitH = R * 33
    this.target.set(
      Math.sin(this.t / 5) * orbitR,
      Math.cos(this.t / 5) * orbitR,
      orbitH + Math.sin(this.t / 19) * orbitH * 0.25
    )
    this.camera.position.lerp(this.target, 0.004)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  spectatorView(aim: AimEvent) {
    const h = 25 * R
    const portrait = this.camera.aspect < 0.8
    this.camera.fov = (portrait ? 60 : 40) + this.fovOffset
    if (h < 10 * R) {
      const factor = 100 * (10 * R - h)
      this.camera.fov -= factor * (portrait ? 3 : 1)
    }
    this.target
      .copy(aim.pos)
      .addScaledVector(
        unitAtAngle(aim.angle, this.tempVec),
        -(this.distance + R * 12)
      )
    this.camera.position.lerp(this.target, 0.1)
    this.camera.position.z = h
    this.camera.up = up
    this.lookTarget.lerp(
      this.tempVec2
        .copy(aim.pos)
        .addScaledVector(unitAtAngle(aim.angle, this.tempVec), R * 10),
      0.03
    )
    this.camera.lookAt(this.lookTarget)
  }

  topView(_: AimEvent) {
    this.camera.fov = CameraTop.fov
    this.camera.position.lerp(
      CameraTop.viewPoint(this.camera.aspect, this.camera.fov, this.tempVec),
      0.99999
    )
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  aimView(aim: AimEvent, fraction = 0.08) {
    this.aimFrom(aim, this.height, this.distance, this.height / 2, fraction)
  }

  aimzView(aim: AimEvent, fraction = 0.08) {
    this.aimFrom(aim, this.aimzHeight, this.aimzDistance, R * 2, fraction)
  }

  private aimFrom(
    aim: AimEvent,
    h: number,
    distance: number,
    lookHeight: number,
    fraction: number
  ) {
    const portrait = this.camera.aspect < 0.8
    this.camera.fov = (portrait ? 60 : 40) + this.fovOffset
    if (h < 10 * R) {
      const factor = 100 * (10 * R - h)
      this.camera.fov -= factor * (portrait ? 3 : 1)
    }
    this.target
      .copy(aim.pos)
      .addScaledVector(unitAtAngle(aim.angle, this.tempVec), -distance)
    this.camera.position.lerp(this.target, fraction)
    this.camera.position.z = h
    this.camera.up = up
    this.lookTarget.copy(aim.pos).addScaledVector(up, lookHeight)
    this.camera.lookAt(this.lookTarget)
  }

  adjustHeight(delta) {
    if (this.mode === this.aimzView) {
      this.aimzHeight = MathUtils.clamp(this.aimzHeight + delta, R * 6, R * 120)
      return
    }
    delta = this.height < 10 * R ? delta / 8 : delta
    this.height = MathUtils.clamp(this.height + delta, R * 6, R * 120)
    if (this.height > R * 110) {
      this.suggestMode(this.topView)
    }
    if (this.height < R * 105) {
      this.suggestMode(this.aimView)
    }
  }

  adjustFov(delta: number) {
    this.fovOffset = MathUtils.clamp(this.fovOffset + delta, -30, 60)
  }

  adjustDistance(delta: number) {
    if (this.mode === this.aimzView) {
      this.aimzDistance = MathUtils.clamp(
        this.aimzDistance + delta,
        R * 2,
        R * 100
      )
      return
    }
    delta = this.distance < 10 * R ? delta / 8 : delta
    this.distance = MathUtils.clamp(this.distance + delta, R * 2, R * 100)
  }

  suggestMode(mode) {
    if (this.mainMode === this.aimView) {
      this.mode = mode
      this.isZoomedOut = false
      this.updateCameraButtonClass(mode === this.topView ? "topview" : "aim")
    }
    if (
      this.mainMode === this.spectatorView &&
      (mode === this.topView || mode === this.spectatorView)
    ) {
      this.mode = mode
      this.isZoomedOut = false
      this.updateCameraButtonClass(mode === this.topView ? "topview" : "aim")
    }
  }

  forceMode(mode) {
    this.mode = mode
    this.mainMode = mode
    this.isZoomedOut = false
    this.updateCameraButtonClass(mode === this.topView ? "topview" : "aim")
  }

  forceMove(aim: AimEvent) {
    if (this.mode === this.aimView) {
      this.aimView(aim, 1)
    }
  }

  cycleModeToAimz() {
    const wasTopView = this.mode === this.topView
    this.enterAimz()
    if (wasTopView) {
      this.aimGraceStartT = this.t
    }
  }

  private enterAimz() {
    this.aimzHeight = Camera.aimzHeight
    this.aimzDistance = Camera.aimzDistance
    this.mode = this.aimzView
    this.mainMode = this.aimView
    this.isZoomedOut = true
    this.updateCameraButtonClass("aimz")
  }

  cycleMode() {
    if (this.mode === this.aimView) {
      this.enterAimz()
    } else if (this.mode === this.aimzView) {
      this.mode = this.topView
      this.mainMode = this.topView
      this.isZoomedOut = false
      this.updateCameraButtonClass("topview")
    } else {
      this.mode = this.aimView
      this.mainMode = this.aimView
      this.isZoomedOut = false
      this.updateCameraButtonClass("aim")
      this.aimGraceStartT = this.t
    }
  }

  private updateCameraButtonClass(state: "aim" | "aimz" | "topview") {
    const btn = document.getElementById("camera")
    if (btn) {
      btn.classList.remove("aim", "aimz", "topview")
      btn.classList.add(state)
      const labels: Record<string, string> = {
        aim: "🎥",
        aimz: "🎥ᶻ",
        topview: "🎥ᵀ",
      }
      btn.textContent = labels[state]
    }
  }

  toggleMode() {
    this.isZoomedOut = false
    if (this.mode === this.topView) {
      this.mode = this.aimView
      this.updateCameraButtonClass("aim")
      this.aimGraceStartT = this.t
    } else {
      this.mode = this.topView
      this.updateCameraButtonClass("topview")
    }
    this.mainMode = this.mode
  }
}
