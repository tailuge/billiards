import { Container } from "../container/container"

export class Menu {
  container: Container
  menu

  constructor(container) {
    this.container = container
    this.menu = (document.getElementById("menu") as HTMLElement)?.style

    const togglemenu = this.getElement("togglemenu")
    const dismiss = this.getElement("dismiss")
    const toggleview = this.getElement("toggleview")
    dismiss.onclick = (_) => {
      this.toggleVisibility()
    }
    togglemenu.onclick = (_) => {
      this.toggleVisibility()
    }
    toggleview.onclick = (_) => {
      this.toggleView()
    }
  }

  toggleVisibility() {
    this.menu.visibility =
      this.menu.visibility === "visible" ? "hidden" : "visible"
  }

  toggleView() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  getElement(id): HTMLElement {
    return document.getElementById(id)!
  }
}
