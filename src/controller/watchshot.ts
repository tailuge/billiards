import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { End } from "./end"
import { PlaceBallEvent } from "../events/placeballevent"

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
    const table = this.container.table
    table.cue.aimAtNext(table.cueball, this.container.rules.nextCandidateBall())
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
    return new PlaceBall(this.container)
  }

  override handleWatch(event) {
    if ("rerack" in event.json) {
      console.log("Respot")
      this.container.table.updateFromSerialised(event.json)
      if (event.json.balls) {
        event.json.balls.forEach((bData) => {
          const ball = this.container.table.balls.find((b) => b.id === bData.id)
          if (ball) {
            ball.setStationary()
          }
        })
      }
      return this
    }
    return new WatchAim(this.container)
  }
}
