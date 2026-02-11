import { id } from "../utils/dom"
import { ButtonConfig } from "../utils/gameover"

export interface NotificationData {
  type: "Foul" | "GameOver" | "Info"
  title: string
  subtext?: string
  extra?: string | ButtonConfig | ButtonConfig[]
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
      if (typeof data.extra === "string") {
        extraDiv.className = "notification-badge"
        extraDiv.textContent = data.extra
      } else {
        extraDiv.className = "notification-extra"
        const buttons = Array.isArray(data.extra) ? data.extra : [data.extra]
        buttons.forEach((btnConfig) => {
          const btn = document.createElement("button")
          btn.textContent = btnConfig.text
          btn.onclick = () => {
            if (btnConfig.action === "reload") {
              location.reload()
            } else if (btnConfig.action === "href" && btnConfig.url) {
              this.handleHref(btnConfig.url)
            }
          }
          extraDiv.appendChild(btn)
        })
      }
      this.element.appendChild(extraDiv)
    }
  }

  private handleHref(url: string) {
    const trimmed = url.trim()
    const lower = trimmed.toLowerCase()
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:") ||
      lower.startsWith("vbscript:")
    ) {
      return
    }
    location.href = trimmed
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
