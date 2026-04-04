import { Container } from "../container/container"
import { id } from "../utils/dom"

interface ShotEntry {
  icon: string
  label: string
  color: string
  replayUri: string
  hiScoreUri?: string
  timestamp: number
  isBreak: boolean
  isPot: boolean
}

export class BallTray {
  container: Container
  expanded: boolean = false
  entries: ShotEntry[] = []

  private readonly trayElement: HTMLElement | null
  private readonly collapsedElement: HTMLElement | null
  private readonly expandedElement: HTMLElement | null

  constructor(container: Container) {
    this.container = container
    this.trayElement = id("ballTray")
    this.collapsedElement = this.trayElement?.querySelector(
      ".ball-tray-collapsed"
    ) as HTMLElement
    this.expandedElement = this.trayElement?.querySelector(
      ".ball-tray-expanded"
    ) as HTMLElement

    this.collapsedElement?.addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggle()
    })
    this.expandedElement?.addEventListener("click", (e) => {
      e.stopPropagation()
    })

    this.render()
  }

  addShot(isPartOfBreak: boolean, potCount: number, balls: any[], state: any) {
    const pots = potCount > 1 ? potCount - 1 : 0
    let color = "#000000"
    if (balls.length > 0) {
      const lastBall = balls[balls.length - 1]
      if (lastBall.ballmesh) {
        color = "#" + lastBall.ballmesh.color.getHexString()
      }
    }

    const icon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const replayUri = this.container.linkFormatter.getReplayUri(state)

    this.entries.push({
      icon,
      label: potCount > 0 ? `${potCount} pot${potCount > 1 ? "s" : ""}` : "Shot",
      color,
      replayUri,
      timestamp: Date.now(),
      isBreak: false,
      isPot: potCount > 0,
    })
    this.render()
  }

  addBreak(breakData: any, score: number) {
    const replayUri = this.container.linkFormatter.getReplayUri(breakData)
    const entry: ShotEntry = {
      icon: "⚈".repeat(score),
      label: `break(${score})`,
      color: "#ffd700",
      replayUri,
      timestamp: Date.now(),
      isBreak: true,
      isPot: true,
    }

    if (score >= 2) {
      entry.hiScoreUri = this.container.linkFormatter.getHiScoreUri(breakData)
    }

    this.entries.push(entry)
    this.render()
  }

  toggle() {
    this.expanded = !this.expanded
    this.render()
  }

  reset() {
    this.entries = []
    this.expanded = false
    this.render()
  }

  private render() {
    this.renderCollapsed()
    this.renderExpanded()
  }

  private renderCollapsed() {
    if (!this.collapsedElement) return

    if (this.entries.length === 0) {
      this.collapsedElement.innerHTML = `<span class="ball-tray-empty">No shots yet</span>`
      return
    }

    const lastEntries = this.entries.slice(-9)
    this.collapsedElement.innerHTML = lastEntries
      .map(
        (entry) => `
      <span class="ball-tray-shot-pill" style="color: ${entry.color}">${entry.icon}</span>
    `
      )
      .join("")
  }

  private renderExpanded() {
    if (!this.expandedElement) return

    if (this.expanded) {
      this.expandedElement.removeAttribute("hidden")
      this.expandedElement.style.display = "flex"
    } else {
      this.expandedElement.setAttribute("hidden", "")
      this.expandedElement.style.display = "none"
      return
    }

    if (this.entries.length === 0) {
      this.renderHistoryContent(
        `<div class="ball-tray-empty">No shot history yet</div>`
      )
      return
    }

    const lines: string[] = []
    let currentLine: string[] = []

    this.entries.forEach((entry) => {
      const hiScoreHtml = entry.hiScoreUri
        ? `<a href="${entry.hiScoreUri}" target="_blank" class="hi-score-pill" onclick="event.stopPropagation()">🏆 hi score</a>`
        : ""

      const linkHtml = `
        <span class="shot-inline-container">
          <a href="${entry.replayUri}" target="_blank" class="shot-inline" title="${entry.label}" style="color: ${entry.color}" onclick="event.stopPropagation()">
            ${entry.icon}
          </a>
          ${hiScoreHtml}
        </span>
      `

      currentLine.push(linkHtml)

      if (!entry.isPot) {
        lines.push(`<div class="shot-line">${currentLine.join("")}</div>`)
        currentLine = []
      }
    })

    if (currentLine.length > 0) {
      lines.push(`<div class="shot-line">${currentLine.join("")}</div>`)
    }

    const historyHtml = lines.reverse().join("")
    this.renderHistoryContent(historyHtml)
  }

  private renderHistoryContent(html: string) {
    if (!this.expandedElement) return
    const header = this.expandedElement.querySelector("header")
    if (!header) {
      this.expandedElement.innerHTML = `
        <header>
          <h2>Shot History</h2>
          <button class="ball-tray-close">Close</button>
        </header>
        <div class="ball-tray-history">
          ${html}
        </div>
      `
      this.expandedElement
        .querySelector(".ball-tray-close")
        ?.addEventListener("click", (e) => {
          e.stopPropagation()
          this.toggle()
        })
    } else {
      const historyContainer = this.expandedElement.querySelector(
        ".ball-tray-history"
      )
      if (historyContainer) {
        historyContainer.innerHTML = html
      }
    }
  }
}
