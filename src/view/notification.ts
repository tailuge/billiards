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
    this.element.innerHTML = ""

    let typeClass: string
    let duration = defaultDuration

    if (typeof data === "string") {
      this.renderStringContent(data)
      typeClass = "type-Info"
    } else {
      this.renderDataContent(data)
      typeClass = `type-${data.type}`
      if (data.extraClass) {
        typeClass += ` ${data.extraClass}`
      }
      if (data.duration !== undefined) {
        duration = data.duration
      }
    }

    this.display(typeClass, duration)
  }

  private renderStringContent(message: string): void {
    const banner = document.createElement("div")
    banner.className = "notification-banner"
    const textGroup = document.createElement("div")
    textGroup.className = "notification-text-group"
    const subtext = document.createElement("div")
    subtext.className = "notification-subtext"
    subtext.textContent = message
    textGroup.appendChild(subtext)
    banner.appendChild(textGroup)
    this.element.appendChild(banner)
  }

  private renderDataContent(data: NotificationData) {
    const banner = document.createElement("div")
    banner.className = "notification-banner"

    const iconDiv = document.createElement("div")
    iconDiv.className = "notification-icon"
    iconDiv.textContent = this.getIcon(data)
    banner.appendChild(iconDiv)

    const textGroup = document.createElement("div")
    textGroup.className = "notification-text-group"

    const title = document.createElement("div")
    title.className = "notification-title"
    title.textContent = data.title
    textGroup.appendChild(title)

    if (data.subtext) {
      const subtext = document.createElement("div")
      subtext.className = "notification-subtext"
      subtext.textContent = data.subtext
      textGroup.appendChild(subtext)
    }
    banner.appendChild(textGroup)
    this.element.appendChild(banner)

    if (data.extra) {
      const extraDiv = document.createElement("div")
      if (data.extra.includes("<")) {
        extraDiv.className = "notification-extra"
        extraDiv.innerHTML = data.extra
      } else {
        extraDiv.className = "notification-badge"
        extraDiv.textContent = data.extra
      }
      this.element.appendChild(extraDiv)
    }
  }

  private display(typeClass: string, duration: number) {
    if (!this.element) return
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

  clear() {
    if (this.element) {
      this.element.innerHTML = ""
      this.element.style.display = "none"
      this.element.className = ""
    }
    if (this.timeoutId) {
      globalThis.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
