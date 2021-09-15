import { Controller, Input } from "./controller"
import { WatchEvent } from "../events/watchevent"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"

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
      { type: "hit", incidentSpeed: this.container.table.cue.aim.power },
    ]
    this.container.table.hit()
    this.container.view.camera.suggestMode(
      this.container.view.camera.afterHitView
    )
  }

  handleStationary(_) {
    this.allStationary = true
    this.container.log("stationary event")
    if (this.container.table.outcome.some((x) => x.type == "pot")) {
      this.container.log("pot! transition to Aim")
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      return new Aim(this.container)
    }
    // if no pot switch to other player
    this.container.log("no pot")
    this.container.sendEvent(this.container.table.cue.aim)
    return new WatchAim(this.container)
    //this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
    //return new Aim(this.container)
  }

  handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
