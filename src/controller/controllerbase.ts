import { Controller } from "./controller"
import { exportGltf } from "../utils/gltf"
import { ChatEvent } from "../events/chatevent"
import { NotificationEvent } from "../events/notificationevent"
import { ScoreEvent } from "../events/scoreevent"
import { Session } from "../network/client/session"
import { Outcome } from "../model/outcome"
import { Vector3 } from "three"

export abstract class ControllerBase extends Controller {
  readonly scale = 0.001

  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  override handleNotification(event: NotificationEvent): Controller {
    this.container.notification.show(event.data, event.duration)
    return this
  }

  override handleScore(event: ScoreEvent): Controller {
    this.container.scores = [event.p1, event.p2]
    this.container.currentBreak = event.b

    let p1Name: string | undefined = undefined
    let p2Name: string | undefined = undefined

    if (Session.hasInstance()) {
      const session = Session.getInstance()
      const isP1 = Session.playerIndex() === 0
      p1Name = (isP1 ? session.playername : session.opponentName) || undefined
      p2Name = (isP1 ? session.opponentName : session.playername) || undefined
    }

    this.container.hud.updateScores(
      event.p1,
      event.p2,
      event.b,
      p1Name,
      p2Name
    )
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
      case "KeyFUp":
        this.toggleFullscreen()
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

  private toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
