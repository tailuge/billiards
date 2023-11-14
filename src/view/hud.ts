export class Hud {
  element: HTMLDivElement
  current_break: HTMLStyleElement

  disabled = true

  constructor() {
    this.element = this.getElement("snookerScore")
  }

  updateBreak(score) {
    if (this.element) {
      if (score > 0) {
        this.element.innerHTML = "Break</br>" + score
      } else {
        this.element.innerHTML = ""
      }
    }
  }

  getElement(id): HTMLDivElement {
    return document.getElementById(id)! as HTMLDivElement
  }
}
