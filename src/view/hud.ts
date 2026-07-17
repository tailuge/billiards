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
    hideScore: boolean = false,
    p1Star: boolean = false,
    p2Star: boolean = false
  ) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    this.setText(this.breakElement, "")

    if (hideScore) {
      // Drill mode: show the player name only, no score count, no break.
      this.setText(this.p1Element, p1Name ?? "")
      return
    }

    const p1Str = p1Star ? `${p1}⭐` : `${p1}`
    const p2Str = p2Star ? `⭐${p2}` : `${p2}`

    if (p1Name && p2Name) {
      this.setText(this.p1Element, `${p1Name} ${p1Str}`)
      this.setText(this.p2Element, `${p2Str} ${p2Name}`)
    } else if (p1Name) {
      this.setText(this.p1Element, `${p1Name} ${p1Str}`)
    } else if (p2Name) {
      this.setText(this.p2Element, `${p2Str} ${p2Name}`)
    } else {
      this.setText(this.p1Element, `${p1Str}`)
    }

    if (b > 0) {
      this.setText(this.breakElement, `Break: ${b}`)
    }
  }
}
