import { Input } from "../events/input"
import type { Container } from "../container/container"

/** Max pointer displacement (px) between down and up for a click to count
 * as a tap. */
const TAP_SLOP_PX = 8
/** Max duration (ms) of a down/up pair for it to count as a tap. */
const TAP_MS = 500

/** True when a press/release pair is a tap: small displacement, short
 * duration, primary button, not touch, press did not start in the chat
 * input. Extracted pure so the boundaries can be unit tested headless. */
export function isTap(
  startX: number,
  startY: number,
  startT: number,
  e: { clientX: number; clientY: number; button: number; pointerType: string }
): boolean {
  if (e.button !== 0 || e.pointerType === "touch") {
    return false
  }
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  return Math.hypot(dx, dy) < TAP_SLOP_PX && performance.now() - startT < TAP_MS
}

/**
 * Trackpad-friendly click-to-aim: a tap on the view (a press/release pair
 * that stays within slop and duration and is not claimed by CueHit or
 * CueBallSpin) toggles aim-adjust mode. While active, horizontal hover-move
 * deltas are pushed onto the input queue as `movementXUp` inputs and vertical
 * deltas as `movementYUp` (camera height/zoom) — the same
 * code path the interactjs drag feeds — so the aim rotates exactly as if the
 * mouse were dragged. The next tap or Escape exits.
 *
 * Owned by `Container` and armed while `Aim` or `PlaceBall` is the active
 * controller, mirroring `CueHit`. No tap ever fires a shot or places the ball;
 * those stay with the Hit button / Space / double-click / drag-to-stroke.
 */
export class PointerTap {
  private readonly container: Container

  private armed = false
  private adjustActive = false
  private startX = 0
  private startY = 0
  private startT = 0
  private pointerId: number | null = null
  private lastHoverX: number | null = null
  private lastHoverY: number | null = null
  private flipX: boolean
  private removeListeners: (() => void) | null = null

  constructor(container: Container) {
    this.container = container
    this.flipX = new URLSearchParams(globalThis.location?.search).has("flip")
  }

  get adjusting(): boolean {
    return this.adjustActive
  }

  enable() {
    this.armed = true
    if (this.removeListeners) {
      return
    }
    const canvas = this.container.view.element as HTMLElement | undefined
    if (!canvas) {
      // Headless/test environments have no render target; stay armed but
      // never attach listeners (same approach as CueHit).
      return
    }
    canvas.addEventListener("pointerdown", this.onPointerDown)
    canvas.addEventListener("pointermove", this.onPointerMove)
    canvas.addEventListener("pointerup", this.onPointerUp)
    // Capture on window so Escape exits before Keyboard's
    // stopImmediatePropagation on the canvas can swallow it.
    globalThis.addEventListener("keydown", this.onKeyDown, true)
    this.removeListeners = () => {
      canvas.removeEventListener("pointerdown", this.onPointerDown)
      canvas.removeEventListener("pointermove", this.onPointerMove)
      canvas.removeEventListener("pointerup", this.onPointerUp)
      globalThis.removeEventListener("keydown", this.onKeyDown, true)
    }
  }

  disable() {
    this.armed = false
    this.pointerId = null
    this.lastHoverX = null
    this.lastHoverY = null
    this.exitAdjust()
    this.removeListeners?.()
    this.removeListeners = null
  }

  private exitAdjust() {
    this.adjustActive = false
    const canvas = this.container.view.element as HTMLElement | undefined
    if (canvas) {
      canvas.style.cursor = ""
    }
  }

  /** True while another gesture owns the pointer, so its presses and moves
   * never toggle or feed adjust mode. */
  private gestureOwned(): boolean {
    return !!(
      this.container.cueHit?.active || this.container.cueBallSpin?.active
    )
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.armed || !e.isPrimary || e.button !== 0 || this.gestureOwned()) {
      return
    }
    // Same exclusion as CueHit: presses on the chat dialog bubble up to
    // #viewP1; ignore them so clicking the chat input / emoji list never
    // toggles adjust mode.
    if ((e.target as Element | null)?.closest?.("#inputTextDiv")) {
      return
    }
    this.pointerId = e.pointerId
    this.startX = e.clientX
    this.startY = e.clientY
    this.startT = performance.now()
  }

  private onPointerMove = (e: PointerEvent) => {
    if (
      !this.armed ||
      !this.adjustActive ||
      e.pointerType === "touch" ||
      // A held button means an interactjs/CueHit drag owns this move.
      e.buttons !== 0 ||
      this.gestureOwned()
    ) {
      return
    }
    if (this.lastHoverX !== null) {
      let dx = e.clientX - this.lastHoverX
      // Same factors as Keyboard.mousetouch so hover feels like drag.
      let dy = (e.clientY - (this.lastHoverY ?? e.clientY)) * 0.8
      if (this.flipX) {
        dx = -dx
      }
      // Dominant axis wins vertically, as with drag.
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = 0
      }
      if (dx !== 0) {
        this.container.inputQueue.push(new Input(dx, "movementXUp"))
      }
      if (dy !== 0) {
        this.container.inputQueue.push(new Input(dy, "movementYUp"))
      }
    }
    this.lastHoverX = e.clientX
    this.lastHoverY = e.clientY
  }

  private onPointerUp = (e: PointerEvent) => {
    if (!this.armed || e.pointerId !== this.pointerId || this.gestureOwned()) {
      this.pointerId = null
      return
    }
    this.pointerId = null
    if (!isTap(this.startX, this.startY, this.startT, e)) {
      return
    }
    this.adjustActive = !this.adjustActive
    this.lastHoverX = this.adjustActive ? e.clientX : null
    this.lastHoverY = this.adjustActive ? e.clientY : null
    const canvas = this.container.view.element as HTMLElement | undefined
    if (canvas) {
      canvas.style.cursor = this.adjustActive ? "crosshair" : ""
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.adjustActive && e.key === "Escape") {
      this.exitAdjust()
    }
  }
}
