export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string
  extra?: string
  duration?: number
}

export class Notification {
  element: HTMLDivElement
  timeoutId: number | null = null

  constructor() {
    this.element = document.getElementById("notification") as HTMLDivElement
  }

  private getIcon(type: NotificationData["type"]): string {
    if (type === "Foul") return "🎱"
    if (type === "GameOver") return "🏆"
    return "🔵"
  }

  show(data: NotificationData | string, defaultDuration: number = 3000) {
    if (!this.element) return

    let content = ""
    let typeClass = ""
    let duration = defaultDuration

    if (typeof data === "string") {
      content = `
        <div class="notification-banner">
          <div class="notification-text-group">
            <div class="notification-subtext">${data}</div>
          </div>
        </div>
      `
      typeClass = "type-Info"
    } else {
      const icon = this.getIcon(data.type)
      let extraContentHtml = ""
      if (data.extra) {
        if (data.extra.includes("<")) {
          extraContentHtml = `<div class="notification-extra">${data.extra}</div>`
        } else {
          extraContentHtml = `<div class="notification-badge">${data.extra}</div>`
        }
      }

      content = `
        <div class="notification-banner">
          <div class="notification-icon">${icon}</div>
          <div class="notification-text-group">
            <div class="notification-title">${data.title}</div>
            ${data.subtext ? `<div class="notification-subtext">${data.subtext}</div>` : ""}
          </div>
        </div>
        ${extraContentHtml}
      `
      typeClass = `type-${data.type}`
      if (data.duration !== undefined) {
        duration = data.duration
      }
    }

    this.element.innerHTML = content
    this.element.className = "" // Clear previous classes
    this.element.classList.add(typeClass)
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
