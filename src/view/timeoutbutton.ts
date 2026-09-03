export interface TimeoutOptions {
  duration?: number
  criticalMs?: number
  onComplete?: () => void
}

export class TimeoutButton {
  private readonly el: HTMLButtonElement
  private readonly elements: HTMLElement[]
  private readonly duration: number
  private readonly criticalMs: number
  private readonly onComplete: () => void
  private start: number | null = null
  private animationId: number | null = null
  private isRunning = false

  constructor(
    element: HTMLButtonElement,
    options: TimeoutOptions = {},
    secondaryElement?: HTMLElement | null
  ) {
    this.el = element
    this.elements = [element, secondaryElement].filter(
      (item): item is HTMLElement => item !== null && item !== undefined
    )
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
    this.setProperty("--timer-color", "#10b981")
    this.setProperty("--sweep", "360deg")
    this.setProperty("--progress", "100%")
    this.animationId = requestAnimationFrame(this.tick)
  }

  cancel() {
    this.isRunning = false
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.setProperty("--sweep", "0deg")
    this.setProperty("--progress", "0%")
  }

  private setProperty(name: string, value: string) {
    for (const el of this.elements) {
      el.style.setProperty(name, value)
    }
  }

  private readonly tick = (now: number) => {
    if (!this.isRunning) return
    if (!this.start) this.start = now
    const elapsed = now - this.start
    const remaining = this.duration - elapsed
    const progress = Math.max(0, remaining / this.duration)

    this.setProperty("--sweep", `${progress * 360}deg`)
    this.setProperty("--progress", `${progress * 100}%`)

    if (remaining <= this.criticalMs) {
      this.setProperty("--timer-color", "#ef4444")
    }

    if (elapsed < this.duration) {
      this.animationId = requestAnimationFrame(this.tick)
    } else {
      this.finalize()
    }
  }

  private finalize() {
    this.isRunning = false
    this.setProperty("--sweep", "0deg")
    this.setProperty("--progress", "0%")
    this.onComplete()
  }
}
