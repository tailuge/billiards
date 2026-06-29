import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { Session } from "../network/client/session"
import { ConcedeEvent } from "../events/concedeevent"
import { Replay } from "../controller/replay"

export class Menu {
  container: Container
  share: HTMLButtonElement
  diagram: HTMLButtonElement
  camera: HTMLButtonElement
  concede: HTMLButtonElement
  menu: HTMLButtonElement
  analysis: HTMLButtonElement

  disabled = true

  constructor(container) {
    this.container = container

    this.share = this.getElement("share")
    this.diagram = this.getElement("diagram")
    this.camera = this.getElement("camera")
    this.concede = this.getElement("concede")
    this.menu = this.getElement("menu")
    this.analysis = this.getElement("analysis")

    if (this.analysis) {
      this.analysis.onclick = () => {
        const replay = this.container.controller as Replay
        if (replay.currentInit && replay.currentShot) {
          const base = "https://velikodimov.github.io/billiards/dist/index.html"
          const params = new URLSearchParams()
          params.set("ruletype", this.container.rules.rulename)
          params.set("practice", "")
          // Open the full-page shot analysis view directly (was drill mode).
          params.set("analysis", "")
          params.set("init", replay.currentInit)
          params.set("initShot", replay.currentShot)
          window.open(`${base}?${params.toString()}`, "_blank")
        }
      }
    }

    if (this.diagram) {
      this.diagram.onclick = () => {
        const replay = this.container.controller as Replay
        if (replay.currentInit && replay.currentShot) {
          const base = "diagrams/export.html"
          const params = new URLSearchParams()
          params.set("ruletype", this.container.rules.rulename)
          params.set("init", replay.currentInit)
          params.set("initShot", replay.currentShot)
          window.open(`${base}?${params.toString()}`, "_blank")
        }
      }
    }

    this.setShareVisible(false)
    this.setDiagramVisible(false)
    if (this.camera) {
      this.camera.onclick = (_) => {
        this.adjustCamera()
      }
    }
    if (this.menu) {
      this.menu.onclick = (_) => {
        this.toggleHelpOverlay()
      }
    }
    const closeBtn = document.getElementById("helpClose")
    if (closeBtn) {
      closeBtn.onclick = () => {
        const overlay = document.getElementById("helpOverlay")
        overlay?.setAttribute("hidden", "true")
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

  setDiagramVisible(visible: boolean) {
    if (!this.diagram) {
      return
    }
    this.diagram.hidden = !visible
    this.diagram.disabled = !visible
  }

  setConcedeVisible(visible: boolean) {
    if (this.concede) {
      this.concede.hidden = !visible
      this.concede.disabled = !visible
    }
  }

  setAnalysisVisible(visible: boolean) {
    if (this.analysis) {
      this.analysis.hidden = !visible
      this.analysis.disabled = !visible
    }
  }

  toggleHelpOverlay() {
    const overlay = document.getElementById("helpOverlay")
    if (overlay) {
      const isHidden = overlay.hasAttribute("hidden")
      if (isHidden) {
        this.showOverlay("help.html")
      } else {
        overlay.setAttribute("hidden", "true")
      }
    }
  }

  showOverlay(url: string) {
    const overlay = document.getElementById("helpOverlay")
    if (overlay) {
      const iframe = overlay.querySelector("iframe")
      if (iframe) {
        iframe.setAttribute("src", url)
      }
      overlay.removeAttribute("hidden")
    }
  }
}
