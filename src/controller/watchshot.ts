import { Controller } from "./controller"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"

export class WatchShot extends ControllerBase {
  allStationary = false
  pendingState: Controller

  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  handleAim(_) {
    if (this.allStationary) {
      this.container.log("all stationary so transition to Aim now")
      return new Aim(this.container)
    }
    this.container.log("pending transition to Aim")
    this.pendingState = new Aim(this.container)
    return this
  }

  handleWatch(_) {
    if (this.allStationary) {
      this.container.log("all stationary so transition to WatchAim now")
      return new WatchAim(this.container)
    }
    this.container.log("pending transition to WatchAim")
    this.pendingState = new WatchAim(this.container)
    return this
  }

  handleStationary(_) {
    this.allStationary = true
    this.container.log("stationary event")

    if (this.pendingState) {
      this.container.log("go to pending state now")
      return this.pendingState
    }
    this.container.log("no pending state")
    return this
  }
}
