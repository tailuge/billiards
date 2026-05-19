export class AngleInput extends HTMLElement {
  private _radians = 0
  private _disabled = false
  private area: HTMLElement | null = null

  constructor() {
    super()
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
  }

  get value(): string {
    return this._radians.toString()
  }

  set value(val: string) {
    const parsed = Number.parseFloat(val)
    if (!Number.isNaN(parsed)) {
      this.updateRadians(parsed)
    }
  }

  get radians(): number {
    return this._radians
  }

  set radians(val: number) {
    this.updateRadians(val)
  }

  get disabled(): boolean {
    return this._disabled
  }

  set disabled(val: boolean) {
    this._disabled = val
    if (this.area) {
      this.area.style.pointerEvents = val ? "none" : "auto"
      this.area.style.opacity = val ? "0.5" : "1"
    }
  }

  connectedCallback() {
    if (this.innerHTML.trim() === "") {
      const template = document.getElementById(
        "angle-input-template"
      ) as HTMLTemplateElement
      if (template) {
        this.appendChild(template.content.cloneNode(true))
      }
    }
    this.area = this.querySelector("#area") as HTMLElement
    this.updateRadians(Number.parseFloat(this.getAttribute("value") || "0"))
    this.area?.addEventListener(
      "pointerdown",
      this.onPointerDown as EventListener
    )
  }

  disconnectedCallback() {
    this.area?.removeEventListener(
      "pointerdown",
      this.onPointerDown as EventListener
    )
    this.cleanup()
  }

  private onPointerDown(e: PointerEvent) {
    if (this._disabled) return
    this.area?.setPointerCapture(e.pointerId)
    this.area?.addEventListener(
      "pointermove",
      this.onPointerMove as EventListener
    )
    this.area?.addEventListener("pointerup", this.onPointerUp as EventListener)
    this.area?.addEventListener(
      "pointercancel",
      this.onPointerUp as EventListener
    )
    this.onPointerMove(e)
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.area) return
    const rect = this.area.getBoundingClientRect()
    const offset = rect.width * 0.12
    const x = e.clientX - rect.left - offset
    const y = rect.bottom - e.clientY - offset

    const angleDeg = Math.atan2(y, x) * (180 / Math.PI)
    this.updateRadians(Math.max(0, Math.min(90, angleDeg)) * (Math.PI / 180))
  }

  private onPointerUp(e: PointerEvent) {
    this.area?.releasePointerCapture(e.pointerId)
    this.cleanup()
    this.dispatchEvent(new Event("change", { bubbles: true }))
  }

  private cleanup() {
    this.area?.removeEventListener(
      "pointermove",
      this.onPointerMove as EventListener
    )
    this.area?.removeEventListener("pointerup", this.onPointerUp as EventListener)
    this.area?.removeEventListener(
      "pointercancel",
      this.onPointerUp as EventListener
    )
  }

  private updateRadians(rad: number) {
    const clamped = Math.max(0, Math.min(Math.PI / 2, rad))
    if (this._radians === clamped) return

    this._radians = clamped
    const angleDeg = Math.round(clamped * (180 / Math.PI))
    this.style.setProperty("--angle", angleDeg.toString())

    this.dispatchEvent(new Event("input", { bubbles: true }))
  }
}
