import { BreakEvent } from "../events/breakevent"
import { Controller, HitEvent, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { PlayShot } from "./playshot"
import { Replay } from "./replay"

/**
 * Aim using input events.
 *
 */
export class Aim extends ControllerBase {
  override get name(): string {
    return "Aim"
  }
  constructor(container) {
    super(container)
    const table = this.container.table
    if (table.cue) {
      table.cue.aimMode()
      table.cue.showHelper(true)
      table.cueball = this.container.rules.cueball
      table.cue.aim.i = table.balls.indexOf(table.cueball)
      table.cue.moveTo(table.cueball.pos)
      table.cue.aimAtNext(
        table.cueball,
        this.container.rules.nextCandidateBall()
      )
      table.cue.aim.elevation = 0
      this.container.view.camera.suggestMode(this.container.view.camera.aimView)
      table.cue.updateAimInput()
    }
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(false)
  }

  override handleInput(input: Input): Controller {
    switch (input.key) {
      case "Space":
        this.container.table.cue.setPower(input.t * this.scale)
        break
      case "SpaceUp":
        return this.playShot()
      default:
        if (!this.commonKeyHandler(input)) {
          return this
        }
    }

    this.container.sendEvent(this.container.table.cue.aim)
    return this
  }

  override handleBreak(breakEvent: BreakEvent): Controller {
    return new Replay(
      this.container,
      breakEvent.init,
      breakEvent.shots,
      breakEvent.retry,
      1500,
      breakEvent.diagram
    )
  }

  playShot() {
    this.container.inputQueue.length = 0
    this.container.table.cue.aimInputs.setDisabled(true)
    const hitEvent = new HitEvent(this.container.table.serialiseHit())
    this.container.sendEvent(hitEvent)
    return new PlayShot(this.container)
  }
}
