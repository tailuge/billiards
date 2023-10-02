import { Container } from "../container/container"
import { ChatEvent } from "../events/chatevent"
import { share, shorten } from "../utils/shorten"

export class Menu {
  container: Container
  togglemenu: HTMLElement
  menu

  constructor(container) {
    this.container = container
    this.menu = (document.getElementById("menu") as HTMLElement)?.style

    this.togglemenu = this.getElement("togglemenu")
    const toggleview = this.getElement("toggleview")
    if (this.togglemenu) {
      this.togglemenu.onclick = (_) => {
        this.toggleVisibility()
      }
      toggleview.onclick = (_) => {
        this.toggleView()
      }
    }
  }

  toggleVisibility() {
    this.menu.display = this.menu.display === "flex" ? "none" : "flex"
  }

  toggleView() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  replayMode(url) {
    this.togglemenu.innerHTML = "share"
    this.togglemenu.onclick = (_) => {
      shorten(url, (url) => {
        const response = share(url)
        this.container.eventQueue.push(new ChatEvent(null, response))
      })
    }
  }

  getElement(id): HTMLElement {
    return document.getElementById(id)!
  }
}
