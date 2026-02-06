export class Hud {
  element: HTMLDivElement

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

  updateScores(p1: number, p2: number, b: number, p1Name?: string, p2Name?: string) {
    if (!this.element) return

    let html = ""
    if (p1Name && p2Name) {
      html = `<div class="p1Score">${p1Name}: ${p1}</div>`
      html += `<div class="p2Score">${p2Name}: ${p2}</div>`
    } else if (p1Name) {
      html = `<div class="p1Score">${p1Name}: ${p1}</div>`
    } else if (p2Name) {
      html = `<div class="p2Score">${p2Name}: ${p2}</div>`
    } else if (b === 0) {
      html = `<div class="p1Score">Score: ${p1}</div>`
    }

    if (b > 0) {
      html += `<div class="breakScore">Break: ${b}</div>`
    }

    this.element.innerHTML = html
  }

  getElement(id): HTMLDivElement {
    return document.getElementById(id)! as HTMLDivElement
  }
}
