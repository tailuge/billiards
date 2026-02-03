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

  show(data: NotificationData | string, defaultDuration: number = 3000) {
    if (!this.element) return

    let content = ""
    let typeClass = ""
    let duration = defaultDuration

    if (typeof data === "string") {
      content = data
      typeClass = "type-Info"
    } else {
      content = `
        <div class="notification-content">
          <div class="notification-title">${data.title}</div>
          ${data.subtext ? `<div class="notification-subtext">${data.subtext}</div>` : ""}
          ${data.extra ? `<div class="notification-extra">${data.extra}</div>` : ""}
        </div>
      `
      typeClass = `type-${data.type}`
      if (data.duration !== undefined) {
        duration = data.duration
      }
    }

    this.element.innerHTML = content
    this.element.className = "" // Clear previous classes
    this.element.classList.add(typeClass)
    this.element.style.display = "block"

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
