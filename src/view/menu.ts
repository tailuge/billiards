import { Container } from "../container/container"

export class Menu {
  container: Container
  menu

  constructor(container) {
    this.container = container
    this.menu = (document.getElementById("menu") as HTMLElement)?.style

    const togglemenu = this.getElement("togglemenu")
    const toggleview = this.getElement("toggleview")
    togglemenu.onclick = (_) => {
      this.toggleVisibility()
    }
    toggleview.onclick = (_) => {
      this.toggleView()
    }
  }

  toggleVisibility() {
    this.menu.display = this.menu.display === "flex" ? "none" : "flex"
  }

  toggleView() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  getElement(id): HTMLElement {
    return document.getElementById(id)!
  }
}
