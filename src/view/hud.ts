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

  private setText(element: HTMLElement | null, text: string) {
    if (element) {
      element.textContent = text
    }
  }

  updateBreak(score: number) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    if (score > 0 && this.breakElement) {
      this.breakElement.innerHTML = "Break</br>" + score
    } else {
      this.setText(this.breakElement, "")
    }
  }

  updateScores(
    p1: number,
    p2: number,
    p1Name?: string,
    p2Name?: string,
    b: number = 0
  ) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    this.setText(this.breakElement, "")

    if (p1Name && p2Name) {
      this.setText(this.p1Element, `${p1Name}: ${p1}`)
      this.setText(this.p2Element, `${p2Name}: ${p2}`)
    } else if (p1Name) {
      this.setText(this.p1Element, `${p1Name}: ${p1}`)
    } else if (p2Name) {
      this.setText(this.p2Element, `${p2Name}: ${p2}`)
    } else {
      this.setText(this.p1Element, `Score: ${p1}`)
    }

    if (b > 0) {
      this.setText(this.breakElement, `Break: ${b}`)
    }
  }
}
