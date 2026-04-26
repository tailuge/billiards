import { id } from "../utils/dom"
import { Rematch } from "../network/client/rematch"
import { Session } from "../network/client/session"

export interface NotificationHighBreak {
  score: number
  url: string
}

export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string | undefined
  matchScore?: string | undefined
  highBreaks?: NotificationHighBreak[] | undefined
  extra?: string | undefined
  duration?: number | undefined
  icon?: string | undefined
  extraClass?: string | undefined
}

export type NotificationActionHandlers = Record<string, () => void>

export class Notification {
  element: HTMLDivElement
  overlay: HTMLDivElement | null
  timeoutId: number | null = null
  actionHandlers: NotificationActionHandlers = {}

  constructor() {
    this.overlay = id("notificationOverlay") as HTMLDivElement | null
    this.element = id("notification") as HTMLDivElement
    this.bindActions()
  }

  private getIcon(data: NotificationData): string {
    if (data.icon) return data.icon
    if (data.type === "Foul") return "🎱"
    if (data.type === "GameOver") return "🏆"
    return "🔵"
  }

  show(
    data: NotificationData | string,
    defaultDuration: number = 3000,
    actionHandlers?: NotificationActionHandlers
  ) {
    if (!this.element) return
    this.actionHandlers = actionHandlers ?? {}

    let content: string
    let typeClass: string
    let duration = defaultDuration

    if (typeof data === "string") {
      content = this.renderStringContent(data)
      typeClass = "type-Info"
    } else {
      const result = this.processData(data)
      content = result.content
      typeClass = result.typeClass
      if (data.duration !== undefined) {
        duration = data.duration
      }
    }

    this.display(content, typeClass, duration)
  }

  private renderStringContent(message: string): string {
    return `
      <div class="notification-banner">
        <div class="notification-text-group">
          <div class="notification-subtext">${message}</div>
        </div>
      </div>
    `
  }

  private processData(data: NotificationData) {
    let typeClass = `type-${data.type}`
    if (data.extraClass) {
      typeClass += ` ${data.extraClass}`
    }
    const icon = this.getIcon(data)
    const footerContentHtml = this.renderFooter(data)

    const content = `
      <div class="notification-banner">
        <div class="notification-content-wrapper">
          <div class="notification-main">
            <div class="notification-icon">${icon}</div>
            <div class="notification-text-group">
              <div class="notification-title">${data.title}</div>
              ${(() => {
                if (!data.subtext) return ""
                const subtextClass =
                  data.type === "GameOver" ? " notification-subtext-light" : ""
                return `<div class="notification-subtext${subtextClass}">${data.subtext}</div>`
              })()}
            </div>
          </div>
          ${data.matchScore ? `<div class="notification-match-score">${data.matchScore}</div>` : ""}
        </div>
        ${footerContentHtml}
      </div>
    `

    return { content, typeClass }
  }

  private renderFooter(data: NotificationData): string {
    const highBreaksHtml = this.renderHighBreaks(data.highBreaks)
    const extraHtml = this.renderExtra(data.extra)
    if (!highBreaksHtml && !extraHtml) {
      return ""
    }

    return `
      <div class="notification-footer">
        ${highBreaksHtml}
        ${extraHtml}
      </div>
    `
  }

  private renderExtra(extra?: string): string {
    console.log("extra", extra)
    if (!extra) return ""
    if (extra.includes("<")) {
      return `<div class="notification-actions">${extra}</div>`
    }
    return `<div class="notification-badge">${extra}</div>`
  }

  private renderHighBreaks(highBreaks?: NotificationHighBreak[]): string {
    if (!highBreaks || highBreaks.length === 0) {
      return ""
    }

    const items = highBreaks
      .slice(0, 3)
      .map((highBreak, index) => this.renderHighBreakButton(highBreak, index))
      .join("")

    return `<div class="notification-high-breaks">${items}</div>`
  }

  private renderHighBreakButton(
    highBreak: NotificationHighBreak,
    index: number
  ): string {
    const medals = "🎖️".repeat(Math.max(0, 3 - index))
    return `
      <button
        type="button"
        class="notification-high-break"
        data-notification-upload-url="${highBreak.url}"
        title="Open high break ${highBreak.score}"
      >
        <span class="notification-high-break-label">Break : ${highBreak.score}</span>
        <span class="notification-high-break-icon">${medals}</span>
        <span class="notification-high-break-upload">upload⇗</span>
      </button>
    `
  }

  updateHighBreaks(highBreaks?: NotificationHighBreak[]) {
    const footer = this.element?.querySelector(".notification-footer")
    if (footer) {
      let container = footer.querySelector(
        ".notification-high-breaks"
      ) as HTMLElement | null
      if (!container) {
        container = document.createElement("div")
        container.className = "notification-high-breaks"
        footer.prepend(container)
      }
      container.innerHTML = highBreaks
        ? highBreaks
            .slice(0, 3)
            .map((hb, index) => this.renderHighBreakButton(hb, index))
            .join("")
        : ""
    }
  }

  private display(content: string, typeClass: string, duration: number) {
    if (!this.element) return
    this.element.innerHTML = content
    this.element.className = "" // Clear previous classes
    this.element.classList.add(...typeClass.split(" "))
    this.element.style.display = "flex"
    if (this.overlay) {
      this.overlay.style.pointerEvents = "auto"
    }

    if (this.timeoutId) {
      globalThis.clearTimeout(this.timeoutId)
    }

    if (duration > 0) {
      this.timeoutId = globalThis.setTimeout(() => {
        this.clear()
      }, duration) as unknown as number
    }
  }

  private bindActions() {
    if (!this.element) {
      return
    }
    ;["pointerdown", "mousedown", "touchstart", "click"].forEach(
      (eventName) => {
        this.element.addEventListener(eventName, (event) => {
          event.stopPropagation()
        })
      }
    )
    this.element.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null
      const uploadButton = target?.closest(
        "[data-notification-upload-url]"
      ) as HTMLElement | null
      const uploadUrl = uploadButton?.dataset.notificationUploadUrl
      if (uploadUrl) {
        globalThis.open(uploadUrl, "_blank", "noopener,noreferrer")
        return
      }
      const button = target?.closest(
        "[data-notification-action]"
      ) as HTMLElement | null
      const action = button?.dataset.notificationAction
      if (!action) return
      this.handleAction(action)
    })
  }

  private handleAction(action: string) {
    const handler = this.actionHandlers[action]
    if (handler) {
      handler()
      return
    }

    switch (action) {
      case "clear":
        this.clear()
        break
      case "reload":
      case "replay":
        globalThis.location.reload()
        break
      case "rematch":
        Rematch.navigate(Session.getInstance())
        break
      case "lobby":
        Rematch.redirectToLobby(undefined, Session.getInstance())
        break
    }
  }

  clear() {
    if (this.element) {
      this.element.innerHTML = ""
      this.element.style.display = "none"
      this.element.className = ""
    }
    if (this.overlay) {
      this.overlay.style.pointerEvents = "none"
    }
    this.actionHandlers = {}
    if (this.timeoutId) {
      globalThis.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
