import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { End } from "./end"

export class WatchShot extends ControllerBase {
  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  override handleStationary(_) {
    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome)) {
      return new End(this.container)
    }
    return this
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
