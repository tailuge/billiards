import { id } from "../utils/dom"

export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string
  extra?: string
  duration?: number
  icon?: string
  extraClass?: string
}

export class Notification {
  element: HTMLDivElement
  timeoutId: number | null = null

  constructor() {
    this.element = id("notification") as HTMLDivElement
  }

  private getIcon(data: NotificationData): string {
    if (data.icon) return data.icon
    if (data.type === "Foul") return "🎱"
    if (data.type === "GameOver") return "🏆"
    return "🔵"
  }

  show(data: NotificationData | string, defaultDuration: number = 3000) {
    if (!this.element) return

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
      window.clearTimeout(this.timeoutId)
    }

    if (duration > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.clear()
      }, duration)
    }
  }

  clear() {
    if (this.element) {
      this.element.innerHTML = ""
      this.element.style.display = "none"
      this.element.className = ""
    }
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
