export class Notification {
  element: HTMLDivElement
  timeoutId: number | null = null

  constructor() {
    this.element = document.getElementById("notification") as HTMLDivElement
  }

  show(message: string, duration: number = 2000) {
    if (!this.element) return

    this.element.innerHTML = message
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
    }
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
