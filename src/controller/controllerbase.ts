import { AbortEvent } from "../events/abortevent"
import { Controller } from "./controller"
import { End } from "./end"
import { exportGltf } from "../utils/gltf"
import { ChatEvent } from "../events/chatevent"
import { Outcome } from "../model/outcome"

export abstract class ControllerBase extends Controller {
  readonly scale = 0.001

  override handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }

  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  hit() {
    this.container.table.outcome = [
      Outcome.hit(
        this.container.table.balls[0],
        this.container.table.cue.aim.power
      ),
    ]
    this.container.table.hit()
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
    this.container.table.cue.showHelper(false)
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
        cue.toggleHelper()
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
        this.container.sliders.toggleVisibility()
        console.log(this.container.table.serialise())
        return true
      default:
        return false
    }
  }
}
