import { Raycaster, Vector2 } from "three"
import type { Container } from "../container/container"
import type { Aim } from "../controller/aim"

/**
 * Drag-to-strike gesture: click the 3D cue, pull it back, then push it
 * forward. The forward speed becomes the shot power and the hit fires when
 * the cue returns to its rest position (pull ≈ 0).
 *
 * NOT WIRED IN YET — this class is intentionally standalone. It is never
 * instantiated anywhere; `Aim` will own it and call `enable()`/`disable()`
 * once the surrounding plumbing (Cue.dragBack visual offset, Keyboard guard,
 * fat hit mesh) lands.
 *
 * Screen-vertical convention: down = pull the cue back, up = push it forward.
 */
export class CueHit {
  private static readonly DEADZONE_PX = 10
  /** Lowest power a fired shot may have (5%). Gesture only. */
  private static readonly MIN_POWER = 0.05
  /** Forward pointer speed (px/s) that maps to 100% power. Tuneable. */
  private static readonly V_FULL = 800
  /** Forward pointer speed (px/s) below which a push is a cancel, not a shot. */
  private static readonly V_MIN = 120
  /** Pointer px → cue retraction in world units. Tuneable. */
  private static readonly PX_TO_WORLD = 0.0005

  private readonly container: Container
  private readonly aim: Aim
  private readonly raycaster = new Raycaster()
  private readonly ndc = new Vector2()

  private state: "Idle" | "Pulling" | "Pushing" = "Idle"
  private pointerId: number | null = null
  private startY = 0
  private lastY = 0
  private lastT = 0
  private pullPx = 0
  private maxPullPx = 0
  private speedSamples: number[] = []
  private removeListeners: (() => void) | null = null

  constructor(container: Container, aim: Aim) {
    this.container = container
    this.aim = aim
  }

  /** True while a gesture is in progress (drives the Keyboard.mousetouch guard). */
  get active(): boolean {
    return this.state !== "Idle"
  }

  get phase(): "Idle" | "Pulling" | "Pushing" {
    return this.state
  }

  /** Current cue retraction in world units (positive = retracted). Consumed by
   * the future Cue wiring as `strokeX - cueHit.dragBack`. */
  get dragBack(): number {
    return Math.max(0, this.pullPx) * CueHit.PX_TO_WORLD
  }

  enable() {
    if (this.removeListeners) {
      return
    }
    const canvas = this.container.view.element as HTMLElement
    canvas.addEventListener("pointerdown", this.onPointerDown)
    canvas.addEventListener("pointermove", this.onPointerMove)
    canvas.addEventListener("pointerup", this.onPointerUp)
    canvas.addEventListener("pointercancel", this.onPointerCancel)
    canvas.addEventListener("keydown", this.onKeyDown)
    this.removeListeners = () => {
      canvas.removeEventListener("pointerdown", this.onPointerDown)
      canvas.removeEventListener("pointermove", this.onPointerMove)
      canvas.removeEventListener("pointerup", this.onPointerUp)
      canvas.removeEventListener("pointercancel", this.onPointerCancel)
      canvas.removeEventListener("keydown", this.onKeyDown)
    }
  }

  disable() {
    this.reset()
    this.removeListeners?.()
    this.removeListeners = null
  }

  private hitCue(e: PointerEvent): boolean {
    const canvas = this.container.view.element as HTMLElement
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return false
    }
    this.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    )
    this.raycaster.setFromCamera(this.ndc, this.container.view.camera.camera)
    // table.cue.mesh is the visible cue geometry (tiltMesh → cueBody). The
    // future invisible fat hit mesh will be a child of it, so this same ray
    // picks it up. root is deliberately NOT used (it also parents the helper,
    // shadow and placer meshes).
    return (
      this.raycaster.intersectObjects([this.container.table.cue.mesh], true)
        .length > 0
    )
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.active || !e.isPrimary || e.button !== 0) {
      return
    }
    const aimInputs = this.container.table.cue.aimInputs
    if (!aimInputs || aimInputs.isDisabled()) {
      return
    }
    if (!this.hitCue(e)) {
      return
    }
    e.preventDefault()
    this.pointerId = e.pointerId
    this.state = "Pulling"
    this.startY = e.clientY
    this.lastY = e.clientY
    this.lastT = performance.now()
    this.pullPx = 0
    this.maxPullPx = 0
    this.speedSamples = []
    const canvas = this.container.view.element as HTMLElement
    canvas.setPointerCapture(e.pointerId)
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId || this.state === "Idle") {
      return
    }
    const now = performance.now()
    const dt = Math.max(now - this.lastT, 1) / 1000
    const dy = e.clientY - this.lastY

    this.pullPx = e.clientY - this.startY

    if (this.state === "Pulling") {
      this.maxPullPx = Math.max(this.maxPullPx, this.pullPx)
      // A real pull followed by upward motion begins the push.
      if (this.maxPullPx > CueHit.DEADZONE_PX && dy < 0) {
        this.state = "Pushing"
      }
    }

    if (this.state === "Pushing") {
      // Collect forward (upward) speed samples; the final half of them is
      // averaged at the zero point, so a slow early push doesn't dilute it.
      if (dy < 0) {
        this.speedSamples.push(-dy / dt)
      }
      if (this.pullPx <= 0) {
        this.lastY = e.clientY
        this.lastT = now
        this.resolveAtZero()
        return
      }
    }

    this.lastY = e.clientY
    this.lastT = now
  }

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.reset()
  }

  private onPointerCancel = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.reset()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Escape" && this.active) {
      this.reset()
    }
  }

  private resolveAtZero() {
    const avg = this.finalHalfSpeed()
    if (avg >= CueHit.V_MIN) {
      this.fire(avg)
    } else {
      this.reset()
    }
  }

  /** Arithmetic mean of the final half of the collected forward-speed samples. */
  private finalHalfSpeed(): number {
    const n = this.speedSamples.length
    if (n === 0) {
      return 0
    }
    const start = Math.floor(n / 2)
    let sum = 0
    for (let i = start; i < n; i++) {
      sum += this.speedSamples[i]
    }
    return sum / (n - start)
  }

  private fire(avg: number) {
    const ratio = Math.min(1, Math.max(CueHit.MIN_POWER, avg / CueHit.V_FULL))
    this.reset()
    // setPower updates the slider/percent to the deduced power before the shot
    // (playShot disables the inputs, so this must happen first).
    this.container.table.cue.setPower(ratio)
    this.aim.playShot()
  }

  private reset() {
    this.state = "Idle"
    this.pullPx = 0
    this.maxPullPx = 0
    this.speedSamples = []
    if (this.pointerId !== null) {
      const canvas = this.container.view.element as HTMLElement
      try {
        canvas.releasePointerCapture(this.pointerId)
      } catch {
        // Pointer capture may already be released.
      }
      this.pointerId = null
    }
  }
}
