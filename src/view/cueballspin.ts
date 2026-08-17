import { Raycaster, Vector2, Vector3 } from "three"
import type { Container } from "../container/container"
import { offCenterLimit, R } from "../model/physics/constants"

/**
 * Drag-to-spin gesture: pointerdown on the 3D cue ball and drag to adjust spin.
 *
 * Owned by `Container` and armed only while `Aim` is the active controller.
 * Feeds spin offset into `table.cue.setSpin`, exactly matching the 2D ball UI.
 */
export class CueBallSpin {
  private readonly container: Container
  private readonly raycaster = new Raycaster()
  private readonly ndc = new Vector2()
  private readonly ballCenterScreen = new Vector2()
  private readonly ballEdgeScreen = new Vector2()
  private readonly tempVec3 = new Vector3()

  private armed = false
  private pointerId: number | null = null
  private removeListeners: (() => void) | null = null

  constructor(container: Container) {
    this.container = container
  }

  /** True while a drag on the cue ball is active (drives mousetouch guard). */
  get active(): boolean {
    return this.pointerId !== null
  }

  enable() {
    this.armed = true
    if (this.removeListeners) {
      return
    }
    const canvas = this.container.view?.element as HTMLElement | undefined
    if (!canvas) {
      // Headless/test environments have no render target
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
    if (this.pointerId === null) {
      this.teardown()
    }
  }

  private teardown() {
    this.removeListeners?.()
    this.removeListeners = null
  }

  private hitCueBall(e: PointerEvent): boolean {
    const canvas = this.container.view?.element as HTMLElement | undefined
    if (!canvas) {
      return false
    }
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return false
    }
    const cueball = this.container.table?.cueball
    const mesh = cueball?.ballmesh?.mesh
    if (!mesh) {
      return false
    }
    this.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    )
    const camera = this.container.view?.camera?.camera
    if (!camera) {
      return false
    }
    this.raycaster.setFromCamera(this.ndc, camera)
    return this.raycaster.intersectObjects([mesh], true).length > 0
  }

  private updateSpinFromPointer(e: PointerEvent) {
    const canvas = this.container.view?.element as HTMLElement | undefined
    const camera = this.container.view?.camera?.camera
    const cueball = this.container.table?.cueball
    if (!canvas || !camera || !cueball) {
      return
    }
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    // Cue ball 3D center projected to screen coordinates
    this.tempVec3.copy(cueball.pos)
    this.tempVec3.project(camera)
    const centerX = ((this.tempVec3.x + 1) / 2) * rect.width + rect.left
    const centerY = ((-this.tempVec3.y + 1) / 2) * rect.height + rect.top
    this.ballCenterScreen.set(centerX, centerY)

    // Project ball top edge (pos + camera.up * R) to determine screen radius
    this.tempVec3.copy(cueball.pos).addScaledVector(camera.up, R)
    this.tempVec3.project(camera)
    const edgeX = ((this.tempVec3.x + 1) / 2) * rect.width + rect.left
    const edgeY = ((-this.tempVec3.y + 1) / 2) * rect.height + rect.top
    this.ballEdgeScreen.set(edgeX, edgeY)

    const screenRadius = Math.max(
      1,
      this.ballCenterScreen.distanceTo(this.ballEdgeScreen)
    )

    // Pointer offset in screen pixels
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY

    // Screen convention:
    // Drag right (dx > 0) -> right spin (x < 0 in Cue.setSpin / AimInputs convention)
    // Drag left (dx < 0) -> left spin (x > 0)
    // Drag up (dy < 0) -> top / follow spin (y > 0)
    // Drag down (dy > 0) -> back / draw spin (y < 0)
    const spinX = -(dx / screenRadius) * offCenterLimit
    const spinY = -(dy / screenRadius) * offCenterLimit

    this.container.table.cue.setSpin(
      new Vector3(spinX, spinY, 0),
      this.container.table
    )
    this.container.lastEventTime = performance.now()
  }

  private onPointerDown = (e: PointerEvent) => {
    if (
      !this.armed ||
      this.active ||
      !e.isPrimary ||
      e.button !== 0 ||
      this.container.table?.cue?.aimInputs?.isDisabled()
    ) {
      return
    }
    if ((e.target as Element | null)?.closest?.("#inputTextDiv")) {
      return
    }
    if (!this.hitCueBall(e)) {
      return
    }

    this.pointerId = e.pointerId
    const canvas = this.container.view?.element as HTMLElement | undefined
    try {
      canvas?.setPointerCapture(e.pointerId)
    } catch {
      // Ignore pointer capture failures
    }
    e.preventDefault()
    this.updateSpinFromPointer(e)
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    e.preventDefault()
    this.updateSpinFromPointer(e)
  }

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.releasePointer()
    if (!this.armed) {
      this.teardown()
    }
  }

  private onPointerCancel = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) {
      return
    }
    this.releasePointer()
    if (!this.armed) {
      this.teardown()
    }
  }

  private releasePointer() {
    if (this.pointerId !== null) {
      const canvas = this.container.view?.element as HTMLElement | undefined
      try {
        canvas?.releasePointerCapture(this.pointerId)
      } catch {
        // Ignore
      }
      this.pointerId = null
    }
  }
}
