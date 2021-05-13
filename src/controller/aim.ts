import { Controller, HitEvent, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { PlayShot } from "./playshot"
import { exportGltf } from "../utils/gltf"

/**
 * Aim using input events.
 *
 */
export class Aim extends ControllerBase {
  readonly scale = 0.001

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
  }

  handleInput(input: Input): Controller {
    switch (input.key) {
      case "ArrowLeft":
        this.container.table.cue.rotateAim(-input.t * this.scale)
        break
      case "ArrowRight":
        this.container.table.cue.rotateAim(input.t * this.scale)
        break
      case "ArrowDown":
        this.container.table.cue.adjustHeight(-input.t * this.scale)
        break
      case "ArrowUp":
        this.container.table.cue.adjustHeight(input.t * this.scale)
        break
      case "ShiftArrowLeft":
        this.container.table.cue.adjustSide(input.t * this.scale)
        break
      case "ShiftArrowRight":
        this.container.table.cue.adjustSide(-input.t * this.scale)
        break
      case "Space":
        this.container.table.cue.adjustPower(input.t * this.scale * 0.7)
        break
      case "KeyPUp":
        exportGltf(this.container.view.scene)
        break
      case "KeyHUp":
        this.container.table.cue.helperMesh.visible =
          !this.container.table.cue.helperMesh.visible
        break
      case "movementXUp":
        this.container.table.cue.rotateAim(input.t * this.scale * 2)
        break
      case "movementYUp":
        this.container.view.camera.adjustHeight(-input.t * this.scale * 10)
        break
      case "NumpadAdd":
        this.container.view.camera.adjustHeight(input.t * this.scale * 10)
        break
      case "NumpadSubtract":
        this.container.view.camera.adjustHeight(-input.t * this.scale * 10)
        break
      case "KeySUp":
        return this.hitSpinOnly()
      case "KeyOUp":
        this.container.view.camera.toggleMode()
        break
      case "SpaceUp":
        return this.hit()
      default:
        return this
    }
    this.container.sendEvent(this.container.table.cue.aim)
    return this
  }

  hit() {
    this.container.table.cue.aim.round()
    this.container.sendEvent(new HitEvent(this.container.table.cue.aim))
    return new PlayShot(this.container)
  }

  hitSpinOnly() {
    this.container.table.cue.setPower(1)
    this.container.table.cue.aim.round()
    this.container.table.cue.aim.spinOnly = true
    this.container.sendEvent(new HitEvent(this.container.table.cue.aim))
    return new PlayShot(this.container)
  }
}
