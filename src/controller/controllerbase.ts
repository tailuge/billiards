import { AbortEvent } from "../events/abortevent"
import { Controller } from "./controller"
import { End } from "./end"
import { exportGltf } from "../utils/gltf"
import { ChatEvent } from "../events/chatevent"

export abstract class ControllerBase extends Controller {
  readonly scale = 0.001

  override handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }

  override handleChat(chatevent: ChatEvent): Controller {
    this.container.chat.showMessage(chatevent.message)
    return this
  }

  commonKeyHandler(input) {
    const cue = this.container.table.cue
    switch (input.key) {
      case "ArrowLeft":
        cue.rotateAim(-input.t * this.scale)
        return true
      case "ArrowRight":
        cue.rotateAim(input.t * this.scale)
        return true
      case "ArrowDown":
        cue.adjustHeight(-input.t * this.scale)
        return true
      case "ArrowUp":
        cue.adjustHeight(input.t * this.scale)
        return true
      case "ShiftArrowLeft":
        cue.adjustSide(input.t * this.scale)
        return true
      case "ShiftArrowRight":
        cue.adjustSide(-input.t * this.scale)
        return true
      case "KeyPUp":
        exportGltf(this.container.view.scene)
        return true
      case "KeyHUp":
        cue.helperMesh.visible = !cue.helperMesh.visible
        return true
      case "movementXUp":
        cue.rotateAim(input.t * this.scale * 2)
        return true
      case "movementYUp":
      case "NumpadSubtract":
        this.container.view.camera.adjustHeight(-input.t * this.scale * 10)
        return true
      case "NumpadAdd":
        this.container.view.camera.adjustHeight(input.t * this.scale * 10)
        return true
      case "KeyOUp":
        this.container.view.camera.toggleMode()
        return true
      case "KeyDUp":
        console.log(this.container.table.serialise())
        return true
      default:
        return false
    }
  }
}
