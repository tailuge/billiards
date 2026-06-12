import { Vector3, Raycaster, Plane, Vector2 } from "three"
import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { Aim } from "./aim"
import { BreakEvent } from "../events/breakevent"
import { CueMesh } from "../view/cuemesh"
import { R } from "../model/physics/constants"
import type { Ball } from "../model/ball"
import type { Container } from "../container/container"

const BALL_LABELS = ["Place White", "Place Yellow", "Place Red"]

export class PlaceAllBalls extends ControllerBase {
  override get name() {
    return "PlaceAllBalls"
  }
  readonly placescale = 0.02 * R
  private readonly balls: Ball[]
  private currentIndex = 0
  private readonly raycaster = new Raycaster()
  private readonly tablePlane = new Plane(new Vector3(0, 0, 1), 0)
  private readonly dragOffset = new Vector3()
  private isDragging = false
  private removeListeners: (() => void) | null = null

  constructor(container: Container) {
    super(container)
    this.balls = [...container.table.balls]
  }

  override onFirst() {
    this.setupForCurrentBall()
    this.container.table.cue.aimInputs.setDisabled(false)
    this.addDragListeners()
  }

  private setupForCurrentBall() {
    const ball = this.balls[this.currentIndex]
    ball.setStationary()
    ball.updateMesh(0)
    this.container.table.cue.placeBallMode()
    this.container.table.cue.showHelper(false)
    this.container.table.cue.moveTo(ball.pos)
    this.container.view.camera.forceMode(this.container.view.camera.topView)
    this.container.table.cue.aimInputs.setButtonText(
      BALL_LABELS[this.currentIndex] ?? "Place Ball"
    )
    // Re-focus the canvas for each ball in turn, otherwise arrow-key input
    // only works for the first ball (e.g. after the "Place Balls" button
    // click left focus on the button) until the user clicks the table.
    ;(this.container.view.element as HTMLElement).focus()
  }

  private addDragListeners() {
    const canvas = this.container.view.element as HTMLElement
    const camera = this.container.view.camera.camera

    const toTable = (clientX: number, clientY: number): Vector3 | null => {
      const rect = canvas.getBoundingClientRect()
      const ndc = new Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      )
      this.raycaster.setFromCamera(ndc, camera)
      const hit = new Vector3()
      return this.raycaster.ray.intersectPlane(this.tablePlane, hit)
        ? hit
        : null
    }

    const onPointerDown = (e: PointerEvent) => {
      const tablePos = toTable(e.clientX, e.clientY)
      if (!tablePos) return
      const ball = this.balls[this.currentIndex]
      this.dragOffset.copy(ball.pos).sub(tablePos)
      this.isDragging = true
      canvas.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return
      try {
        const tablePos = toTable(e.clientX, e.clientY)
        if (!tablePos) return
        const ball = this.balls[this.currentIndex]
        const newPos = tablePos.add(this.dragOffset)
        newPos.copy(this.container.rules.placeBall(newPos))
        newPos.x = Math.fround(newPos.x)
        newPos.y = Math.fround(newPos.y)
        newPos.copy(this.container.rules.placeBall(newPos))
        ball.pos.copy(newPos)
        CueMesh.indicateValid(!this.container.table.overlapsAny(ball.pos, ball))
        this.container.table.cue.moveTo(ball.pos)
      } catch (e) {
        this.isDragging = false
        console.error("PlaceAllBalls drag error:", e)
      }
    }

    const stopDrag = (e: PointerEvent) => {
      this.isDragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (_) {}
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerup", stopDrag)
    canvas.addEventListener("pointercancel", stopDrag)

    this.removeListeners = () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", stopDrag)
      canvas.removeEventListener("pointercancel", stopDrag)
    }
  }

  override handleInput(input: Input): Controller {
    try {
      const ball = this.balls[this.currentIndex]
      switch (input.key) {
        case "ArrowLeft":
          this.moveTo(-input.t * this.placescale, 0)
          break
        case "ArrowRight":
          this.moveTo(input.t * this.placescale, 0)
          break
        case "ArrowUp":
          this.moveTo(0, input.t * this.placescale)
          break
        case "ArrowDown":
          this.moveTo(0, -input.t * this.placescale)
          break
        case "movementXUp":
        case "movementYUp":
          break
        case "SpaceUp":
        case "EnterUp":
          return this.placed()
        default:
          this.commonKeyHandler(input)
      }

      this.container.table.cue.moveTo(ball.pos)
      this.container.view.camera.forceMove(this.container.table.cue.aim)
      this.container.sendEvent(this.container.table.cue.aim)
    } catch (e) {
      console.error("PlaceAllBalls.handleInput error:", e)
    }

    return this
  }

  private moveTo(dx: number, dy: number) {
    const ball = this.balls[this.currentIndex]
    const ballPos = ball.pos.add(new Vector3(dx, dy))
    ballPos.copy(this.container.rules.placeBall(ballPos))
    ball.fround()
    ballPos.copy(this.container.rules.placeBall(ballPos))
    CueMesh.indicateValid(!this.container.table.overlapsAny(ballPos, ball))
  }

  private placed(): Controller {
    const ball = this.balls[this.currentIndex]
    if (this.container.table.overlapsAny(ball.pos, ball)) {
      return this
    }
    ball.fround()
    this.currentIndex++
    if (this.currentIndex < this.balls.length) {
      this.setupForCurrentBall()
      return this
    }
    this.removeListeners?.()
    this.removeListeners = null
    this.isDragging = false
    this.container.table.cue.aimInputs.setButtonText("Hit")
    this.container.sound.playNotify()
    this.container.sendEvent(
      new BreakEvent(this.container.table.shortSerialise())
    )
    this.container.view.camera.forceMode(this.container.view.camera.aimView)
    return new Aim(this.container)
  }
}
