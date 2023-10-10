import { Container } from "../container/container"
import { ChatEvent } from "../events/chatevent"
import { Input } from "../events/input"
import { StationaryEvent } from "../events/stationaryevent"
import { share, shorten } from "../utils/shorten"

export class Menu {
  container: Container
  togglemenu: HTMLButtonElement
  redo: HTMLButtonElement
  share: HTMLButtonElement
  replay: HTMLButtonElement
  camera: HTMLButtonElement
  menu

  constructor(container) {
    this.container = container
    this.menu = (document.getElementById("menu") as HTMLElement)?.style

    this.togglemenu = this.getElement("togglemenu")
    this.replay = this.getElement("replay")
    this.redo = this.getElement("redo")
    this.share = this.getElement("share")
    this.camera = this.getElement("camera")
    if (this.togglemenu) {
      this.togglemenu.onclick = (_) => {
        this.toggleMenu()
      }
      this.camera.onclick = (_) => {
        this.adjustCamera()
      }
    }
  }

  toggleMenu() {
    this.menu.display = this.menu.display === "flex" ? "none" : "flex"
  }

  adjustCamera() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  replayMode(url, breakEvent) {
    this.menu.display = "flex"
    const queue = this.container.eventQueue
    this.share.onclick = (_) => {
      shorten(url, (url) => {
        const response = share(url)
        queue.push(new ChatEvent(null, response))
      })
    }
    this.redo.onclick = (_) => {
      this.container.inputQueue.push(new Input(1, "KeyRUp"))
    }
    this.replay.onclick = (_) => {
      if (queue.length == 0) {
        this.container.table.halt()
        this.container.eventQueue.length = 0
        this.container.eventQueue.push(new StationaryEvent())
        queue.push(breakEvent)
      }
    }
  }

  getElement(id): HTMLButtonElement {
    return document.getElementById(id)! as HTMLButtonElement
  }
}
