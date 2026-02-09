import { Container } from "../container/container"
import { getButton } from "../utils/dom"

export class Menu {
  container: Container
  share: HTMLButtonElement
  camera: HTMLButtonElement

  disabled = true

  constructor(container) {
    this.container = container

    this.share = this.getElement("share")
    this.camera = this.getElement("camera")
    if (this.share) {
      this.share.disabled = true
    }
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
    return getButton(id)!
  }
}
