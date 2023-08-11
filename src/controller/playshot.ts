import { Controller, Input } from "./controller"
import { WatchEvent } from "../events/watchevent"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { Outcome } from "../model/outcome"
import { PlaceBallEvent } from "../events/placeballevent"
import { zero } from "../utils/utils"
import { PlaceBall } from "./placeball"

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends ControllerBase {
  allStationary = false
  pendingState: Controller

  constructor(container) {
    super(container)
    this.container.table.outcome = [
      Outcome.hit(
        this.container.table.balls[0],
        this.container.table.cue.aim.power
      ),
    ]
    this.container.table.hit()
    this.container.view.camera.suggestMode(
      this.container.view.camera.afterHitView
    )
  }

  handleStationary(_) {
    this.allStationary = true

    // if white potted switch to other player
    if (Outcome.pottedCueBall(this.container.table.outcome)) {
      this.container.log("in off")
      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      this.container.sendEvent(new PlaceBallEvent(zero, true))
      return new WatchAim(this.container)
    }
    if (Outcome.pottedBallNoFoul(this.container.table.outcome)) {
      this.container.log("pot")
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      return new Aim(this.container)
    }
    // if no pot and no foul switch to other player
    this.container.log("no pot")
    this.container.sendEvent(this.container.table.cue.aim)
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
