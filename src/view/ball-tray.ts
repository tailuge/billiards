import { Container } from "../container/container"
import { id } from "../utils/dom"

interface ShotEntry {
  icon: string
  label: string
  color: string
  replayUri: string
  hiScoreUri?: string
  isPot: boolean
  isBreak: boolean
}

export class BallTray {
  container: Container
  entries: ShotEntry[] = []

  private readonly trayElement: HTMLElement | null
  private readonly listElement: HTMLElement | null
  private readonly leftBtn: HTMLElement | null
  private readonly rightBtn: HTMLElement | null

  constructor(container: Container) {
    this.container = container
    this.trayElement = id("ballTray")
    this.listElement = id("ballTrayList")
    this.leftBtn = id("trayLeft")
    this.rightBtn = id("trayRight")

    const stop = (e: Event) => {
      if ((e.target as HTMLElement).closest("a")) {
        return
      }
      e.stopPropagation()
    }

    this.leftBtn?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.scroll(-80)
    })
    this.rightBtn?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.scroll(80)
    })

    this.trayElement?.addEventListener("click", stop)
    this.trayElement?.addEventListener("mousedown", stop)
    this.trayElement?.addEventListener("touchstart", stop)

    this.updateVisibility()
  }

  addShot(isPartOfBreak: boolean, potCount: number, balls: any[], state: any) {
    const pots = potCount > 1 ? potCount - 1 : 0
    let color = "#ffffff"
    if (balls.length > 0) {
      const lastBall = balls[balls.length - 1]
      if (lastBall.ballmesh) {
        color = "#" + lastBall.ballmesh.color.getHexString()
      }
    }

    const icon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const replayUri = this.container.linkFormatter.getReplayUri(state)

    let label = "Shot"
    if (potCount > 0) {
      label = `${potCount} pot${potCount > 1 ? "s" : ""}`
    }

    const entry: ShotEntry = {
      icon,
      label,
      color,
      replayUri,
      isPot: potCount > 0,
      isBreak: false,
    }

    this.entries.push(entry)
    this.renderEntry(entry)
    this.updateVisibility()
  }

  addBreak(breakData: any, score: number) {
    const replayUri = this.container.linkFormatter.getReplayUri(breakData)
    const entry: ShotEntry = {
      icon: `(${score})`,
      label: `break(${score})`,
      color: "#ffd700",
      replayUri,
      isPot: true,
      isBreak: true,
    }

    if (score >= 2) {
      entry.hiScoreUri = this.container.linkFormatter.getHiScoreUri(breakData)
    }

    this.entries.push(entry)
    this.renderEntry(entry)
    this.updateVisibility()
  }

  addGame(gameData: any) {
    const replayUri = this.container.linkFormatter.getReplayUri(gameData)
    const entry: ShotEntry = {
      icon: "Ⓡ",
      label: "Whole Game",
      color: "#ffffff",
      replayUri,
      isPot: true,
      isBreak: false,
    }

    this.entries.push(entry)
    this.renderEntry(entry)
    this.updateVisibility()
  }

  reset() {
    this.entries = []
    if (this.listElement) {
      this.listElement.innerHTML = ""
    }
    this.updateVisibility()
  }

  private updateVisibility() {
    if (this.trayElement) {
      this.trayElement.style.display = this.entries.length > 0 ? "flex" : "none"
    }
  }

  private scroll(distance: number) {
    if (this.listElement) {
      this.listElement.scrollBy({ left: distance, behavior: "smooth" })
    }
  }

  private renderEntry(entry: ShotEntry) {
    if (!this.listElement) return

    const lastGroup = this.listElement.lastElementChild as HTMLElement
    const canAppendToGroup =
      lastGroup?.classList.contains("break-group") &&
      !lastGroup.querySelector(".miss")

    const hiScoreHtml = entry.hiScoreUri
      ? `<a href="${entry.hiScoreUri}" target="_blank" class="hi-score-pill" title="hi score">🏆</a>`
      : ""

    const ballHtml = `
      <a href="${entry.replayUri}" target="_blank" class="ball-item ${entry.isPot ? "pot" : "miss"}"
         title="${entry.label}" style="color: ${entry.color}">
        ${entry.icon}
      </a>
      ${hiScoreHtml}
    `

    if (entry.isPot) {
      if (canAppendToGroup) {
        const div = document.createElement("div")
        div.innerHTML = ballHtml
        while (div.firstChild) {
          lastGroup.appendChild(div.firstChild)
        }
      } else {
        const newGroup = document.createElement("div")
        newGroup.className = "break-group"
        newGroup.innerHTML = ballHtml
        this.listElement.appendChild(newGroup)
      }
    } else {
      const div = document.createElement("div")
      div.innerHTML = ballHtml
      while (div.firstChild) {
        this.listElement.appendChild(div.firstChild)
      }
    }

    // Auto-scroll to end
    requestAnimationFrame(() => {
      if (this.listElement) {
        this.listElement.scrollLeft = this.listElement.scrollWidth
      }
    })
  }
}
