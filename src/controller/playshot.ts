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
    this.container.table.outcome.length = 0
    this.container.table.outcome.push(
      Outcome.hit(
        this.container.table.balls[0],
        this.container.table.cue.aim.power
      )
    )
    this.container.table.hit()
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
    this.container.table.cue.showHelper(false)
  }

  override handleStationary(_) {
    this.allStationary = true
    const table = this.container.table
    // if white potted switch to other player
    if (Outcome.isCueBallPotted(table.balls[0], table.outcome)) {
      this.container.log("in off")
      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      this.container.sendEvent(new PlaceBallEvent(zero, true))
      return new WatchAim(this.container)
    }
    if (Outcome.isBallPottedNoFoul(table.balls[0], table.outcome)) {
      this.container.sound.playSuccess(table.inPockets())
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }
    // if no pot and no foul switch to other player
    this.container.log("no pot")
    this.container.sendEvent(table.cue.aim)
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
