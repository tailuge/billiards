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

  override handleStartAim(_) {
    return new Aim(this.container)
  }

  override handlePlaceBall(_) {
    return new PlaceBall(this.container)
  }

  override handleWatch(event) {
    if ("rerack" in event.json) {
      console.log("Respot")
      this.container.table.updateFromSerialised(event.json)
      return this
    }
    return new WatchAim(this.container)
  }
}
