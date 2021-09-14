import { Controller, HitEvent, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { PlayShot } from "./playshot"

/**
 * Aim using input events.
 *
 */
export class Aim extends ControllerBase {
  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
  }

  handleInput(input: Input): Controller {
    switch (input.key) {
      case "Space":
        this.container.table.cue.adjustPower(input.t * this.scale * 0.7)
        break
      case "SpaceUp":
        return this.hit()
      default:
        if (!this.commonKeyHandler(input)) {
          return this
        }
    }
    // rate limit this?
    this.container.sendEvent(this.container.table.cue.aim)
    return this
  }

  hit() {
    this.container.table.cue.aim.round()
    this.container.sendEvent(new HitEvent(this.container.table.cue.aim))
    return new PlayShot(this.container)
  }
}
