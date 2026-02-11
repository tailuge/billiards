import { id } from "../utils/dom"
import { ButtonConfig } from "../utils/gameover"
import { isSafeUrl } from "../utils/security"

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

  private createBanner() {
    const banner = document.createElement("div")
    banner.className = "notification-banner"
    const textGroup = document.createElement("div")
    textGroup.className = "notification-text-group"
    banner.appendChild(textGroup)
    return { banner, textGroup }
  }

  private renderStringContent(message: string): void {
    this.renderContent(undefined, message)
  }

  private renderDataContent(data: NotificationData) {
    this.renderContent(data.title, data.subtext, this.getIcon(data))

    if (data.extra) {
      const extraDiv = document.createElement("div")
      if (typeof data.extra === "string") {
        extraDiv.className = "notification-badge"
        extraDiv.appendChild(document.createTextNode(data.extra))
      } else {
        extraDiv.className = "notification-extra"
        const buttons = Array.isArray(data.extra) ? data.extra : [data.extra]
        buttons.forEach((btnConfig) => {
          const btn = document.createElement("button")
          btn.appendChild(document.createTextNode(btnConfig.text))
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

  private renderContent(titleText?: string, subtextText?: string, icon?: string) {
    const { banner, textGroup } = this.createBanner()

    if (icon) {
      const iconDiv = document.createElement("div")
      iconDiv.className = "notification-icon"
      iconDiv.appendChild(document.createTextNode(icon))
      banner.insertBefore(iconDiv, textGroup)
    }

    if (titleText) {
      const title = document.createElement("div")
      title.className = "notification-title"
      title.appendChild(document.createTextNode(titleText))
      textGroup.appendChild(title)
    }

    if (subtextText) {
      const subtext = document.createElement("div")
      subtext.className = "notification-subtext"
      subtext.appendChild(document.createTextNode(subtextText))
      textGroup.appendChild(subtext)
    }
    this.element.appendChild(banner)
  }

  private handleHref(url: string) {
    if (isSafeUrl(url)) {
      location.href = url.trim()
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
