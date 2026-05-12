import { id } from "../utils/dom"

export class HelpButton {
  private btn: HTMLElement | null
  private panel: HTMLElement | null

  constructor() {
    this.btn = id("helpBtn")
    this.panel = id("helpOverlay")
    if (this.btn) {
      this.btn.addEventListener("click", () => this.toggle())
    }
  }

  private toggle() {
    if (this.panel) {
      this.panel.classList.toggle("visible")
    }
  }
}
