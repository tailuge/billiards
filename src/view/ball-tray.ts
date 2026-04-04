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
}

export class BallTray {
  container: Container
  expanded: boolean = false
  entries: ShotEntry[] = []

  private trayElement: HTMLElement | null
  private collapsedElement: HTMLElement | null
  private expandedElement: HTMLElement | null

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
    })
    this.render()
  }

  addBreak(breakData: any, score: number) {
    const replayUri = this.container.linkFormatter.getReplayUri(breakData)
    const entry: ShotEntry = {
      icon: "🏆",
      label: `break(${score})`,
      color: "#ffd700",
      replayUri,
      timestamp: Date.now(),
      isBreak: true,
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

    const lastEntries = this.entries.slice(-3)
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

    const historyHtml =
      this.entries.length === 0
        ? `<div class="ball-tray-empty">No shot history yet</div>`
        : this.entries
            .map((entry) => {
              const date = new Date(entry.timestamp)
              const timeStr = `${date.getHours().toString().padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}:${date
                .getSeconds()
                .toString()
                .padStart(2, "0")}`
              const hiScoreHtml = entry.hiScoreUri
                ? `<a href="${entry.hiScoreUri}" target="_blank" class="hi-score-pill" onclick="event.stopPropagation()">🏆 hi score</a>`
                : ""
              return `
            <a href="${entry.replayUri}" target="_blank" class="shot-row" onclick="event.stopPropagation()">
              <span class="shot-time">${timeStr}</span>
              <span class="shot-icon" style="color: ${entry.color}">${entry.icon}</span>
              <span class="shot-label">${entry.label} ${hiScoreHtml}</span>
              <span class="shot-link-icon">↗</span>
            </a>
          `
            })
            .reverse()
            .join("")

    const header = this.expandedElement.querySelector("header")
    if (!header) {
      this.expandedElement.innerHTML = `
        <header>
          <h2>Shot History</h2>
          <button class="ball-tray-close">Close</button>
        </header>
        <div class="ball-tray-history">
          ${historyHtml}
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
        historyContainer.innerHTML = historyHtml
      }
    }
  }
}
