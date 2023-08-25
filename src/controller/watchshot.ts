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

  override handleAim(_) {
    return new Aim(this.container)
  }

  override handlePlaceBall(_) {
    return new PlaceBall(this.container)
  }

  override handleWatch(_) {
    return new WatchAim(this.container)
  }
}
