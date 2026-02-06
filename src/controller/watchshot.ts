import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"

export class WatchShot extends ControllerBase {
  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  override handleStationary(_) {
    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome)) {
      return this.container.rules.handleGameEnd(false)
    }
    return this
  }

  override handleStartAim(_) {
    this.container.rules.startTurn()
    return new Aim(this.container)
  }

  override handlePlaceBall(event: PlaceBallEvent) {
    if (event.respot) {
      const ball = this.container.table.balls.find(
        (b) => b.id === event.respot!.id
      )
      if (ball) {
        ball.pos.copy(event.respot!.pos)
        ball.setStationary()
      }
    }
    if (event.useStartPos) {
      this.container.rules.startTurn()
      return new PlaceBall(this.container, event.pos.clone())
    }
    this.container.rules.startTurn()
    return new PlaceBall(this.container)
  }

  override handleWatch(event) {
    if ("rerack" in event.json) {
      console.log("Respot")
      RerackEvent.applyBallinfoToTable(this.container.table, event.json)
      return this
    }
    return new WatchAim(this.container)
  }
}
