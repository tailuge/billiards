import { Container } from "../container/container"

export class Menu {
  container: Container
  share: HTMLButtonElement
  camera: HTMLButtonElement

  disabled = true

  constructor(container) {
    this.container = container

    this.share = this.getElement("share")
    this.camera = this.getElement("camera")
    if (this.camera) {
      this.camera.onclick = (_) => {
        this.adjustCamera()
      }
    }
  }

  adjustCamera() {
    this.container.view.camera.toggleMode()
    this.container.lastEventTime = performance.now()
  }

  getElement(id): HTMLButtonElement {
    return document.getElementById(id)! as HTMLButtonElement
  }
}
