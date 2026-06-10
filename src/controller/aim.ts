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

      const params = new URLSearchParams(globalThis.location?.search)
      let customShot = false
      if (params.has("initShot")) {
        try {
          const shot = JSON.parse(params.get("initShot")!)
          if (shot) {
            if (typeof shot.cueBallId === "number") {
              table.cueball = table.balls[shot.cueBallId] || table.cueball
            }
            table.cue.aim.angle = shot.angle ?? table.cue.aim.angle
            table.cue.aim.power = shot.power ?? table.cue.aim.power
            if (shot.offset) {
              table.cue.aim.offset.set(
                shot.offset.x ?? 0,
                shot.offset.y ?? 0,
                0
              )
            }
            table.cue.aim.elevation = shot.elevation ?? 0
            customShot = true
          }
        } catch (e) {
          console.warn("Failed to parse initShot", e)
        }
      }

      table.cue.aim.i = table.balls.indexOf(table.cueball)
      table.cue.moveTo(table.cueball.pos)
      if (!customShot) {
        table.cue.aimAtNext(
          table.cueball,
          this.container.rules.nextCandidateBall()
        )
        table.cue.aim.elevation = 0
      }
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
