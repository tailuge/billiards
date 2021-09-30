import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"

export class WatchShot extends ControllerBase {
  allStationary = false

  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  handleAim(_) {
    return this.transitionTo(
      new Aim(this.container),
      "stationary so transition to Aim"
    )
  }

  handlePlaceBall(_) {
    return this.transitionTo(
      new PlaceBall(this.container),
      "stationary so transition to PlaceBall"
    )
  }

  handleWatch(_) {
    return this.transitionTo(
      new WatchAim(this.container),
      "stationary so transition to WatchAim"
    )
  }

  handleStationary(_) {
    this.allStationary = true
    this.container.log("stationary event")
    return this
  }

  transitionTo(state, message) {
    this.container.log(message)
    return state
  }
}
