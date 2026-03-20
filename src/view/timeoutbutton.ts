export interface TimeoutOptions {
  duration?: number
  criticalMs?: number
  onComplete?: () => void
}

export class TimeoutButton {
  private readonly el: HTMLButtonElement
  private readonly duration: number
  private readonly criticalMs: number
  private readonly onComplete: () => void
  private start: number | null = null
  private animationId: number | null = null
  private isRunning = false

  constructor(element: HTMLButtonElement, options: TimeoutOptions = {}) {
    this.el = element
    this.duration = options.duration || 10000
    this.criticalMs = options.criticalMs || 2000
    this.onComplete = options.onComplete || (() => {})

    this.el.addEventListener("click", () => {
      this.cancel()
    })
  }

  startTimer() {
    this.cancel()
    this.isRunning = true
    this.start = null
    this.el.style.setProperty("--timer-color", "#10b981")
    this.animationId = requestAnimationFrame(this.tick)
  }

  cancel() {
    this.isRunning = false
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.el.style.setProperty("--sweep", "0deg")
  }

  private tick = (now: number) => {
    if (!this.isRunning) return
    if (!this.start) this.start = now
    const elapsed = now - this.start
    const remaining = this.duration - elapsed
    const progress = Math.max(0, remaining / this.duration)

    this.el.style.setProperty("--sweep", `${progress * 360}deg`)

    if (remaining <= this.criticalMs) {
      this.el.style.setProperty("--timer-color", "#ef4444")
    }

    if (elapsed < this.duration) {
      this.animationId = requestAnimationFrame(this.tick)
    } else {
      this.finalize()
    }
  }

  private finalize() {
    this.isRunning = false
    this.el.style.setProperty("--sweep", "0deg")
    this.onComplete()
  }
}
