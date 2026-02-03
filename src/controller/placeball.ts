import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { Aim } from "./aim"
import { BreakEvent } from "../events/breakevent"
import { R } from "../model/physics/constants"
import { Vector3 } from "three"
import { CueMesh } from "../view/cuemesh"

/**
 * Place cue ball using input events.
 *
 * Needs to be configurable to break place ball and post foul place ball anywhere legal.
 */
export class PlaceBall extends ControllerBase {
  readonly placescale = 0.02 * R

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.cueball.pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.forceMode(this.container.view.camera.aimView)
  }

  override onFirst() {
    const cueball = this.container.table.cueball
    if (this.container.rules.allowsPlaceBall()) {
      cueball.pos.copy(this.container.rules.placeBall())
    }
    cueball.setStationary()
    cueball.updateMesh(0)
    this.container.table.cue.placeBallMode()
    this.container.table.cue.showHelper(false)
    this.container.table.cue.moveTo(this.container.table.cueball.pos)
    this.container.table.cue.aimInputs.setButtonText("Place\nBall")
    if (!this.container.rules.allowsPlaceBall()) {
      this.container.inputQueue.push(new Input(1, "SpaceUp"))
    }
  }

  override handleInput(input: Input): Controller {
    const ballPos = this.container.table.cueball.pos
    switch (input.key) {
      case "ArrowLeft":
        this.moveTo(0, input.t * this.placescale)
        break
      case "ArrowRight":
        this.moveTo(0, -input.t * this.placescale)
        break
      // use cursor movement for placing cueball
      case "movementXUp":
        this.moveTo(0, -input.t * this.placescale * 2)
        break
      case "movementYUp":
        this.moveTo(-input.t * this.placescale * 2, 0)
        break
      // use IJKL for placing cueball
      case "KeyI":
        this.moveTo(0, input.t * this.placescale)
        break
      case "KeyK":
        this.moveTo(0, -input.t * this.placescale)
        break
      case "KeyJ":
        this.moveTo(-input.t * this.placescale, 0)
        break
      case "KeyL":
        this.moveTo(input.t * this.placescale, 0)
        break
      case "SpaceUp":
        return this.placed()
      default:
        this.commonKeyHandler(input)
    }

    this.container.table.cue.moveTo(ballPos)
    this.container.view.camera.forceMove(this.container.table.cue.aim)
    this.container.sendEvent(this.container.table.cue.aim)

    return this
  }

  moveTo(dx, dy) {
    const delta = new Vector3(dx, dy)
    const ballPos = this.container.table.cueball.pos.add(delta)
    ballPos.copy(this.container.rules.placeBall(ballPos))
    CueMesh.indicateValid(!this.container.table.overlapsAny(ballPos))
  }

  placed() {
    if (this.container.table.overlapsAny(this.container.table.cueball.pos)) {
      return this
    }
    this.container.table.cue.aimInputs.setButtonText("Hit")
    this.container.sound.playNotify()
    this.container.sendEvent(
      new BreakEvent(this.container.table.shortSerialise())
    )
    return new Aim(this.container)
  }
}
