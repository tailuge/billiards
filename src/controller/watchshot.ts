import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"

export class WatchShot extends ControllerBase {
  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  handleAim(_) {
    return new Aim(this.container)
  }

  handlePlaceBall(_) {
    return new PlaceBall(this.container)
  }

  handleWatch(_) {
    return new WatchAim(this.container)
  }

  handleStationary(_) {
    return this
  }
}
