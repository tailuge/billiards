import { AbortEvent } from "../events/abortevent"
import { Container } from "./container"
import { Controller } from "./controller"
import { End } from "./end"
import { exportGltf } from "../utils/gltf"

export abstract class ControllerBase extends Controller {
  readonly scale = 0.001

  constructor(container: Container) {
    super(container)
  }

  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }

  commonKeyHandler(input) {
    switch (input.key) {
      case "ArrowLeft":
        this.container.table.cue.rotateAim(-input.t * this.scale)
        return true
      case "ArrowRight":
        this.container.table.cue.rotateAim(input.t * this.scale)
        return true
      case "ArrowDown":
        this.container.table.cue.adjustHeight(-input.t * this.scale)
        return true
      case "ArrowUp":
        this.container.table.cue.adjustHeight(input.t * this.scale)
        return true
      case "ShiftArrowLeft":
        this.container.table.cue.adjustSide(input.t * this.scale)
        return true
      case "ShiftArrowRight":
        this.container.table.cue.adjustSide(-input.t * this.scale)
        return true
      case "KeyPUp":
        exportGltf(this.container.view.scene)
        return true
      case "KeyHUp":
        this.container.table.cue.helperMesh.visible =
          !this.container.table.cue.helperMesh.visible
        return true
      case "movementXUp":
        this.container.table.cue.rotateAim(input.t * this.scale * 2)
        return true
      case "movementYUp":
        this.container.view.camera.adjustHeight(-input.t * this.scale * 10)
        return true
      case "NumpadAdd":
        this.container.view.camera.adjustHeight(input.t * this.scale * 10)
        return true
      case "NumpadSubtract":
        this.container.view.camera.adjustHeight(-input.t * this.scale * 10)
        return true
      case "KeyOUp":
        this.container.view.camera.toggleMode()
        return true
      default:
        return false
    }
    return false
  }
}
