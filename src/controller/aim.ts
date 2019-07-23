import { Controller, HitEvent, Input, AbortEvent } from "./controller"
import { PlayShot } from "./playshot"
import { End } from "./end"

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Controller {
  readonly scale = 0.0000005

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.mode = this.container.view.camera.aimView
  }

  handleInput(input: Input): Controller {
    switch (input.key) {
      case "ArrowLeft":
        this.container.table.cue.rotateAim(-input.t * this.scale)
        break
      case "ArrowRight":
        this.container.table.cue.rotateAim(input.t * this.scale)
        break
      case "ArrowDown":
        this.container.table.cue.adjustHeight(-input.t * this.scale)
        break
      case "ArrowUp":
        this.container.table.cue.adjustHeight(input.t * this.scale)
        break
      case "ShiftArrowLeft":
        this.container.table.cue.adjustSide(input.t * this.scale)
        break
      case "ShiftArrowRight":
        this.container.table.cue.adjustSide(-input.t * this.scale)
        break
      case "Space":
        this.container.table.cue.adjustPower(input.t * this.scale * 10)
        break
      case "SpaceUp":
        return this.hit()
      default:
        return this
    }
    this.container.broadcast(this.container.table.cue.aim)
    return this
  }

  hit() {
    this.container.broadcast(new HitEvent(this.container.table.serialise()))
    return new PlayShot(this.container, false)
  }

  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }
}
