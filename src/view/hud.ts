import { id } from "../utils/dom"

export class Hud {
  p1Element: HTMLElement | null
  p2Element: HTMLElement | null
  breakElement: HTMLElement | null

  constructor() {
    this.p1Element = id("p1Score")
    this.p2Element = id("p2Score")
    this.breakElement = id("breakScore")
  }

  setActivePlayer(active: 0 | 1 | 2) {
    this.p1Element?.classList.toggle("is-active", active === 1)
    this.p2Element?.classList.toggle("is-active", active === 2)
  }

  private setText(element: HTMLElement | null, text: string) {
    if (element) {
      element.textContent = text
    }
  }

  updateBreak(score: number) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    if (score > 0 && this.breakElement) {
      this.breakElement.textContent = ""
      this.breakElement.appendChild(document.createTextNode("Break"))
      this.breakElement.appendChild(document.createElement("br"))
      this.breakElement.appendChild(document.createTextNode(score.toString()))
    } else {
      this.setText(this.breakElement, "")
    }
  }

  updateScores(
    p1: number,
    p2: number,
    p1Name?: string,
    p2Name?: string,
    b: number = 0,
    p1type: number = 0
  ) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    this.setText(this.breakElement, "")

    const group = (a: number) => {
      if (a === 1) return " (Solids)"
      if (a === 2) return " (Stripes)"
      return ""
    }

    const p2type = p1type === 0 ? 0 : p1type === 1 ? 2 : 1
    const n1 = p1Name ? `${p1Name}${group(p1type)}` : ""
    const n2 = p2Name ? `${group(p2type)}${p2Name}` : ""

    if (n1 && n2) {
      this.setText(this.p1Element, `${n1} ${p1}`)
      this.setText(this.p2Element, `${p2} ${n2}`)
    } else if (n1) {
      this.setText(this.p1Element, `${n1} ${p1}`)
    } else if (n2) {
      this.setText(this.p2Element, `${p2} ${n2}`)
    } else {
      this.setText(this.p1Element, `${p1}`)
    }

    if (b > 0) {
      this.setText(this.breakElement, `Break: ${b}`)
    }
  }
}
