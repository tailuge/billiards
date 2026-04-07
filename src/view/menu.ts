import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { Session } from "../network/client/session"
import { ConcedeEvent } from "../events/concedeevent"

export class Menu {
  container: Container
  share: HTMLButtonElement
  camera: HTMLButtonElement
  concede: HTMLButtonElement

  disabled = true

  constructor(container) {
    this.container = container

    this.share = this.getElement("share")
    this.camera = this.getElement("camera")
    this.concede = this.getElement("concede")
    this.setShareVisible(false)
    if (this.camera) {
      this.camera.onclick = (_) => {
        this.adjustCamera()
      }
    }
    if (this.concede) {
      this.concede.onclick = (_) => {
        this.container.notification.show(
          {
            type: "Info",
            title: "Concede Game",
            subtext: "opponent will win",
            extra:
              '<button class="notification-btn" data-notification-action="concede-confirm">Concede</button>' +
              '<button class="notification-btn" data-notification-action="concede-cancel">Play on</button>',
            duration: 0,
          },
          0,
          {
            "concede-confirm": () => {
              this.container.notification.clear()
              if (Session.isBotMode()) {
                this.container.updateController(
                  this.container.rules.handleGameEnd(false)
                )
              } else {
                this.container.updateController(
                  this.container.rules.handleGameEnd(false)
                )
                this.container.sendEvent(new ConcedeEvent())
              }
            },
            "concede-cancel": () => this.container.notification.clear(),
          }
        )
      }
    }
  }

  adjustCamera() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  getElement(id): HTMLButtonElement {
    return getButton(id)!
  }

  setShareVisible(visible: boolean) {
    if (!this.share) {
      return
    }
    this.share.hidden = !visible
    this.share.disabled = !visible
  }

  setConcedeVisible(visible: boolean) {
    if (this.concede) {
      this.concede.hidden = !visible
      this.concede.disabled = !visible
    }
  }
}
