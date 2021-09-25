import { Controller } from "./controller"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"

export class WatchShot extends ControllerBase {
  allStationary = false
  pendingState: Controller

  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  handleAim(_) {
    return this.afterStationary(
      new Aim(this.container),
      "stationary so transition to Aim"
    )
  }

  handlePlaceBall(_) {
    return this.afterStationary(
      new PlaceBall(this.container),
      "stationary so transition to PlaceBall"
    )
  }

  handleWatch(_) {
    return this.afterStationary(
      new WatchAim(this.container),
      "stationary so transition to WatchAim"
    )
  }

  handleStationary(_) {
    this.allStationary = true
    this.container.log("stationary event")

    if (this.pendingState) {
      this.container.log("go to pending state now")
      this.container.table.cue.moveTo(this.container.table.balls[0].pos)
      return this.pendingState
    }
    this.container.log("no pending state")
    return this
  }

  afterStationary(state, message) {
    if (this.allStationary) {
      this.container.log(message)
      return state
    }
    this.container.log(`pending ${message}`)
    this.pendingState = state
    return this
  }
}
