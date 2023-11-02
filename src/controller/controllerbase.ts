import { AbortEvent } from "../events/abortevent"
import { Controller } from "./controller"
import { End } from "./end"
import { exportGltf } from "../utils/gltf"
import { ChatEvent } from "../events/chatevent"
import { Outcome } from "../model/outcome"
import { Vector3 } from "three"

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
        this.container.table.cueball,
        this.container.table.cue.aim.power
      ),
    ]
    this.container.table.hit()
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
    this.container.table.cue.showHelper(false)
  }

  commonKeyHandler(input) {
    const cue = this.container.table.cue
    const delta = input.t * this.scale
    switch (input.key) {
      case "ArrowLeft":
        cue.rotateAim(-delta, this.container.table)
        return true
      case "ArrowRight":
        cue.rotateAim(delta, this.container.table)
        return true
      case "ArrowDown":
        cue.adjustSpin(new Vector3(0, -delta), this.container.table)
        return true
      case "ArrowUp":
        cue.adjustSpin(new Vector3(0, delta), this.container.table)
        return true
      case "ShiftArrowLeft":
        cue.adjustSpin(new Vector3(delta, 0), this.container.table)
        return true
      case "ShiftArrowRight":
        cue.adjustSpin(new Vector3(-delta, 0), this.container.table)
        return true
      case "KeyPUp":
        exportGltf(this.container.view.scene)
        return true
      case "KeyHUp":
        cue.toggleHelper()
        return true
      case "movementXUp":
        cue.rotateAim(delta * 2, this.container.table)
        return true
      case "movementYUp":
      case "NumpadSubtract":
        this.container.view.camera.adjustHeight(delta * 8)
        return true
      case "NumpadAdd":
        this.container.view.camera.adjustHeight(-delta * 8)
        return true
      case "KeyOUp":
        this.container.view.camera.toggleMode()
        return true
      case "KeyDUp":
        this.togglePanel()
        return true
      default:
        return false
    }
  }

  private togglePanel() {
    this.container.sliders.toggleVisibility()
    this.container.table.showSpin(true)
    this.container.table.showTraces(true)
    typeof process !== "object" && console.log(this.container.table.serialise())
  }
}
