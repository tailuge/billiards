import { id } from "../utils/dom"
import { LOBBY_URL } from "../utils/gameover"

export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string
  extra?: string
  duration?: number
  icon?: string
  extraClass?: string
}

export type NotificationActionHandlers = Record<string, () => void>

export class Notification {
  element: HTMLDivElement
  timeoutId: number | null = null
  actionHandlers: NotificationActionHandlers = {}

  constructor() {
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
    const extraContentHtml = this.renderExtra(data.extra)

    const content = `
      <div class="notification-banner">
        <div class="notification-icon">${icon}</div>
        <div class="notification-text-group">
          <div class="notification-title">${data.title}</div>
          ${data.subtext ? `<div class="notification-subtext">${data.subtext}</div>` : ""}
        </div>
      </div>
      ${extraContentHtml}
    `

    return { content, typeClass }
  }

  private renderExtra(extra?: string): string {
    if (!extra) return ""
    if (extra.includes("<")) {
      return `<div class="notification-extra">${extra}</div>`
    }
    return `<div class="notification-badge">${extra}</div>`
  }

  private display(content: string, typeClass: string, duration: number) {
    if (!this.element) return
    this.element.innerHTML = content
    this.element.className = "" // Clear previous classes
    this.element.classList.add(...typeClass.split(" "))
    this.element.style.display = "flex"

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
    if (!this.element) return
    this.element.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null
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

    if (action === "clear") {
      this.clear()
      return
    }
    if (action === "reload" || action === "replay") {
      globalThis.location.reload()
      return
    }
    if (action === "lobby") {
      globalThis.location.href = LOBBY_URL
    }
  }

  clear() {
    if (this.element) {
      this.element.innerHTML = ""
      this.element.style.display = "none"
      this.element.className = ""
    }
    this.actionHandlers = {}
    if (this.timeoutId) {
      globalThis.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
