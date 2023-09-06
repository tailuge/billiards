import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { Aim } from "./aim"
import { MathUtils, Vector3 } from "three"
import { TableGeometry } from "../view/tablegeometry"
import { BreakEvent } from "../events/breakevent"
import { round } from "../utils/utils"

/**
 * Place cue ball using input events.
 *
 * Needs to be configurable to break place ball and post foul place ball anywhere legal.
 */
export class PlaceBall extends ControllerBase {
  readonly placescale = 0.01

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.forceMode(this.container.view.camera.aimView)
  }

  override onFirst() {
    const cueBall = this.container.table.balls[0]
    cueBall.pos = new Vector3(-11, 0, 0)
    cueBall.setStationary()
    cueBall.updateMesh(0)
    this.container.table.cue.placeBallMode()
    this.container.table.cue.showHelper(false)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aimInputs.setButtonText("Place\nBall")
  }

  override handleInput(input: Input): Controller {
    const ballPos = this.container.table.balls[0].pos
    switch (input.key) {
      case "ArrowLeft":
        ballPos.y = MathUtils.clamp(
          round(ballPos.y + input.t * this.placescale),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
        break
      case "ArrowRight":
        ballPos.y = MathUtils.clamp(
          round(ballPos.y - input.t * this.placescale),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
        break
      case "movementXUp":
        ballPos.y = MathUtils.clamp(
          round(ballPos.y - input.t * this.placescale * 2),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
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

  placed() {
    this.container.table.cue.aim.round()
    this.container.table.cue.aimInputs.setButtonText("Hit")
    this.container.sound.playNotify()
    this.container.sendEvent(
      new BreakEvent(this.container.table.shortSerialise())
    )
    return new Aim(this.container)
  }
}
