import { id } from "../utils/dom"
import { getLobbyUrl } from "../network/client/constants"

export interface NotificationHighBreak {
  score: number
  url: string
}

export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string
  matchScore?: string
  highBreaks?: NotificationHighBreak[]
  extra?: string
  duration?: number
  icon?: string
  extraClass?: string
  /** Show the share button in the banner's top-right corner. */
  share?: boolean
}

export type NotificationActionHandlers = Record<string, () => void>

export class Notification {
  element: HTMLDivElement
  overlay: HTMLDivElement | null
  timeoutId: number | null = null
  actionHandlers: NotificationActionHandlers = {}
  /** Fallback for the banner share button, wired by the container so
   * notifications delivered over the network (shown without a handler map)
   * can share too. */
  shareHandler?: () => void
  private shareDone = false

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
        ${data.share ? this.renderShareButton() : ""}
      </div>
    `

    return { content, typeClass }
  }

  private renderShareButton(): string {
    return `
      <button
        type="button"
        class="notification-share"
        title="share"
        aria-label="Share replay link"
        data-notification-action="share"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `
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
    this.shareDone = false
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
        globalThis.location.replace(uploadUrl)
        return
      }
      const button = target?.closest(
        "[data-notification-action]"
      ) as HTMLElement | null
      const action = button?.dataset.notificationAction
      if (!action) return
      if (action === "share") {
        // One-shot: sharing is already under way, so ignore further presses on
        // this banner (a later banner renders a fresh button).
        button.setAttribute("disabled", "true")
      }
      this.handleAction(action, button.dataset.notificationUrl)
    })
  }

  private handleAction(action: string, url?: string) {
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
      case "lobby":
        globalThis.location.href = getLobbyUrl(
          new URLSearchParams(globalThis.location.search).get("tournamentId") ??
            undefined
        )
        break
      case "rematch":
        if (url) {
          globalThis.location.href = url
        }
        break
      case "share":
        // One press per banner, however the click got here.
        if (!this.shareDone) {
          this.shareDone = true
          this.shareHandler?.()
        }
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
