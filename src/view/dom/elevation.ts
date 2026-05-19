export class AngleInput extends HTMLElement {
  private _radians = 0
  private _disabled = false
  private area: HTMLElement | null = null

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    aspect-ratio: 1;
                    touch-action: none; /* Prevents scrolling while dragging */
                    width: 100%;
                    height: 100%;
                }
                .area {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: #111827;
                    border: 2px solid #374151;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: grab;
                    box-sizing: border-box;
                }
                .area:active { cursor: grabbing; }

                /* Origin is pinned at 12% bottom-left */
                .ball {
                    position: absolute;
                    bottom: 12%;
                    left: 12%;
                    width: 8%;
                    height: 8%;
                    background: radial-gradient(circle at 35% 35%, #fff 0%, #ddd 70%, #999 100%);
                    border-radius: 50%;
                    transform: translate(-50%, 50%);
                    pointer-events: none;
                    z-index: 2;
                }
                .rotator {
                    position: absolute;
                    bottom: 12%;
                    left: 12%;
                    width: 80%;
                    height: 6%;
                    transform-origin: 0% 50%;
                    transform: translate(0, 50%) rotate(calc(-1deg * var(--angle, 0)));
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    z-index: 1;
                }
                .stick {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    margin-left: 12%; /* Space between ball and tip */
                    clip-path: polygon(0% 40%, 100% 20%, 100% 80%, 0% 60%);
                }
                .tip     { width: 3%; background: #256bb4; border-radius: 4px 0 0 4px; }
                .ferrule { width: 6%; background: #e4e4e4; }
                .shaft   { flex: 1;  background: #f6c386; }
                .butt    { width: 25%; background: #000; }
            </style>
            <div class="area" id="area">
                <div class="ball"></div>
                <div class="rotator" id="rot">
                    <div class="stick">
                        <div class="tip"></div>
                        <div class="ferrule"></div>
                        <div class="shaft"></div>
                        <div class="butt"></div>
                    </div>
                </div>
            </div>
        `
    }

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
    this.area = this.shadowRoot?.getElementById("area") as HTMLElement
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
