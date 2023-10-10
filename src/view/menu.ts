import { Container } from "../container/container"
import { BreakEvent } from "../events/breakevent"
import { ChatEvent } from "../events/chatevent"
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

  replayMode(url, breakEvent: BreakEvent) {
    this.menu.display = "flex"
    const queue = this.container.eventQueue
    this.share.onclick = (_) => {
      shorten(url, (url) => {
        const response = share(url)
        queue.push(new ChatEvent(null, response))
      })
    }
    this.redo.onclick = (_) => {
      const redoEvent = new BreakEvent(breakEvent.init, breakEvent.shots)
      redoEvent.retry = true
      this.interuptEventQueue(redoEvent)
    }
    this.replay.onclick = (_) => {
      this.interuptEventQueue(breakEvent)
    }
  }

  interuptEventQueue(breakEvent: BreakEvent) {
    this.container.table.halt()
    const queue = this.container.eventQueue
    queue.length = 0
    queue.push(new StationaryEvent())
    queue.push(breakEvent)
  }

  getElement(id): HTMLButtonElement {
    return document.getElementById(id)! as HTMLButtonElement
  }
}
