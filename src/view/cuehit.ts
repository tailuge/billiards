import { Raycaster, Vector2 } from "three"
import { Input } from "../events/input"
import type { Container } from "../container/container"
import type { CueBallSpin } from "./cueballspin"

/**
 * Drag-to-strike gesture: click the 3D cue, pull it back, then push it
 * forward. The forward speed becomes the shot power and the hit fires when
 * the cue returns to its rest position (pull ≈ 0).
 *
 * Owned by `Container` and armed only while `Aim` is the active controller
 * (`Container.updateController` enables/disables it). Firing queues
 * `Input(0, "SpaceUp")` so the shot flows through `Aim.handleInput` →
 * `playShot()` → `updateController(PlayShot)` exactly like the Hit button.
 * Pull-back drives `Cue.dragT` for the visual retraction; the invisible fat
 * hit mesh is still to be added.
 *
 * Screen-vertical convention: down = pull the cue back, up = push it forward.
 * Owns the shared pointerdown decision: presses on the cue ball delegate to
 * `CueBallSpin` before the cue's own hit test runs.
 */
export class CueHit {
  private static readonly DEADZONE_PX = 20
  /** Lowest power a fired shot may have (5%). Gesture only. */
  private static readonly MIN_POWER = 0.05
  /** Forward pointer speed (px/s) that maps to 100% power. Tuneable.
   * Doubled from the original 800 to halve the deduced shot power. */
  private static readonly V_FULL = 2400
  /** Forward pointer speed (px/s) below which a push is a cancel, not a shot. */
  private static readonly V_MIN = 120
  /** Consecutive backward pointer moves needed to start a fresh speed window. */
  private static readonly BACKWARD_RESET_SAMPLES = 3
  /** Pointer px for a full cue retraction. Tuneable. */
  private static readonly MAX_PULL_PX = 250
  /** Cue `t` phase at which the swing reaches its maximum retraction. */
  private static readonly T_FULL = (2 * Math.PI) / 3

  private readonly container: Container
  private readonly raycaster = new Raycaster()
  private readonly ndc = new Vector2()

  private armed = false
  private state: "Idle" | "Pending" | "Pulling" | "Pushing" = "Idle"
  private pointerId: number | null = null
  private startX = 0
  private startY = 0
  private lastY = 0
  private lastT = 0
  private pullPx = 0
  private maxPullPx = 0
  private speedSamples: number[] = []
  private backwardSamples = 0
  private removeListeners: (() => void) | null = null

  constructor(container: Container) {
    this.container = container
  }

  /** The cue-ball spin gesture this hit gesture delegates to when a press
   * lands on the cue ball (wired by Container). */
  spin: CueBallSpin | null = null

  /** True from cue pointerdown until pointerup/pointercancel — even after the
   * shot has fired — so the trailing drag never feeds the interactjs
   * aim/height drag (drives the Keyboard.mousetouch guard). */
  get active(): boolean {
    return this.pointerId !== null
  }

  get phase(): "Idle" | "Pending" | "Pulling" | "Pushing" {
    return this.state
  }

  /** Cue `t` phase for the current pull (null when idle): 0 = cue at rest,
   * T_FULL = fully retracted. Written to `Cue.dragT` as the pointer moves. */
  get dragT(): number | null {
    if (this.state === "Idle") {
      return null
    }
    const ratio = Math.min(1, Math.max(0, this.pullPx) / CueHit.MAX_PULL_PX)
    return ratio * CueHit.T_FULL
  }

  enable() {
    this.armed = true
    if (this.removeListeners) {
      return
    }
    const canvas = this.container.view.element as HTMLElement | undefined
    if (!canvas) {
      // Headless/test environments have no render target; stay armed so the
      // gesture can be driven programmatically but never attach listeners.
      return
    }
    canvas.addEventListener("pointerdown", this.onPointerDown)
    canvas.addEventListener("pointermove", this.onPointerMove)
    canvas.addEventListener("pointerup", this.onPointerUp)
    canvas.addEventListener("pointercancel", this.onPointerCancel)
    this.removeListeners = () => {
      canvas.removeEventListener("pointerdown", this.onPointerDown)
      canvas.removeEventListener("pointermove", this.onPointerMove)
      canvas.removeEventListener("pointerup", this.onPointerUp)
      canvas.removeEventListener("pointercancel", this.onPointerCancel)
    }
  }

  disable() {
    this.armed = false
    this.reset()
    // A press in flight keeps the capture and listeners until pointerup /
    // pointercancel so the trailing drag after a fired shot stays suppressed.
    if (this.pointerId === null) {
      this.teardown()
    }
  }

  private teardown() {
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
    // table.cue.mesh holds the visible cue geometry (tiltMesh → cueBody) plus
    // the invisible fat hit zone (cueHitZone), so this same recursive ray picks
    // up both. root is deliberately NOT used (it also parents the helper,
    // shadow and placer meshes).
    return (
      this.raycaster.intersectObjects([this.container.table.cue.mesh], true)
        .length > 0
    )
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.armed || this.active || !e.isPrimary || e.button !== 0) {
      return
    }
    // CueHit listens on #viewP1 (the div the renderer canvas lives in), so
    // pointerdowns on the chat dialog bubble up here. Ignore them so clicking
    // the chat input / emoji list never engages the cue. Only checked at press
    // start, so an in-flight captured pull-back is unaffected.
    if ((e.target as Element | null)?.closest?.("#inputTextDiv")) {
      return
    }
    // The cue ball wins the overlapping zone at the tip: hand the press to the
    // spin gesture so both never own the same pointer.
    if (this.spin?.hitCueBall(e)) {
      this.spin.start(e)
      return
    }
    if (!this.hitCue(e)) {
      return
    }
    // Take ownership of the press but stay Pending: capture, preventDefault
    // and the dragT retraction are deferred until vertical motion wins, so a
    // sideways swipe can fall back to the aim drag instead.
    this.pointerId = e.pointerId
    this.state = "Pending"
    this.startX = e.clientX
    this.startY = e.clientY
    this.lastY = e.clientY
    this.lastT = performance.now()
    this.pullPx = 0
    this.maxPullPx = 0
    this.speedSamples = []
    this.backwardSamples = 0
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId || this.state === "Idle") {
      return
    }
    const now = performance.now()
    const dt = Math.max(now - this.lastT, 1) / 1000
    const dy = e.clientY - this.lastY
    this.pullPx = e.clientY - this.startY

    if (this.state === "Pending") {
      const dx = e.clientX - this.startX
      const absDx = Math.abs(dx)

      if (this.pullPx > CueHit.DEADZONE_PX) {
        if (absDx > 2 * this.pullPx) {
          this.reset()
          this.pointerId = null
          return
        }
        this.state = "Pulling"
        e.preventDefault()
        ;(this.container.view.element as HTMLElement).setPointerCapture(
          e.pointerId
        )
      } else if (absDx > CueHit.DEADZONE_PX) {
        this.reset()
        this.pointerId = null
      }
      return
    }

    this.container.table.cue.dragT = this.dragT

    if (this.state === "Pulling") {
      this.maxPullPx = Math.max(this.maxPullPx, this.pullPx)
      // A real pull followed by upward motion begins the push.
      if (this.maxPullPx > CueHit.DEADZONE_PX && dy < 0) {
        this.state = "Pushing"
      }
    }

    if (this.state === "Pushing") {
      this.updatePushingSpeed(dy, dt)
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

  private updatePushingSpeed(dy: number, dt: number) {
    // Ignore isolated backward noise, but start a fresh speed window after
    // three consecutive backward moves. This prevents an earlier forward
    // section from diluting the final forward push.
    if (dy > 0) {
      this.backwardSamples++
      if (this.backwardSamples >= CueHit.BACKWARD_RESET_SAMPLES) {
        this.speedSamples = []
      }
    } else if (dy < 0) {
      this.backwardSamples = 0
      this.speedSamples.push(-dy / dt)
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.releasePointer()
    this.reset()
    this.teardownIfUnarmed()
  }

  private onPointerCancel = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.releasePointer()
    this.reset()
    this.teardownIfUnarmed()
  }

  /** If we were disabled mid-press (left Aim), finish the teardown once the
   * pointer is released. */
  private teardownIfUnarmed() {
    if (!this.armed) {
      this.teardown()
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
    // Queue the same input the Hit button uses so the shot follows the
    // standard path: Aim.handleInput("SpaceUp") → playShot() → the returned
    // PlayShot reaches updateController() and advances the state machine.
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  private reset() {
    this.state = "Idle"
    this.pullPx = 0
    this.maxPullPx = 0
    this.speedSamples = []
    this.backwardSamples = 0
    this.container.table.cue.dragT = null
  }

  /** Release the captured pointer and end ownership of the interaction. Only
   * called on pointerup/pointercancel — the capture is kept for the whole
   * press so the trailing drag after a fired shot stays suppressed. */
  private releasePointer() {
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
