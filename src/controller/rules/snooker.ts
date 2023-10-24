import { WatchEvent } from "../../events/watchevent"
import { Outcome } from "../../model/outcome"
import { Rack } from "../../utils/rack"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class Snooker extends NineBall implements Rules {
  previousPotRed: boolean = false
  static readonly tablemodel = "models/snooker.min.gltf"
  override asset(): string {
    return Snooker.tablemodel
  }

  override rack() {
    return Rack.snooker()
  }

  override update(outcome: Outcome[]): Controller {
    const pots = Outcome.potCount(outcome)
    if (pots > 0) {
      if (this.previousPotRed) {
        this.previousPotRed = false
        this.respot(outcome)
      } else if (Outcome.onlyRedsPotted(outcome)) {
        this.previousPotRed = true
      } else {
        // out of order colour pot gets respotted
        if (pots === 1) {
          const id = Outcome.pots(outcome)[0].id
          const lesserBallOnTable =
            id > 1 &&
            this.container.table.balls
              .filter((b) => b.id < id)
              .filter((b) => b.id > 0)
              .some((b) => b.onTable())
          if (lesserBallOnTable) {
            this.respot(outcome)
          }
        } else {
          // multiple colour pots get respotted
          this.respot(outcome)
        }
      }
    }
    return super.update(outcome)
  }

  respot(outcome: Outcome[]) {
    const respotted = this.respotAllPottedColours(outcome)
    if (respotted.length > 0) {
      const changes = {
        balls: respotted.map((b) => b.serialise()),
        rerack: true,
      }
      const rerack = new WatchEvent(changes)
      this.container.sendEvent(rerack)
      this.container.recoder.record(rerack)
    }
  }

  respotAllPottedColours(outcome: Outcome[]) {
    return Outcome.pots(outcome)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Rack.respot(ball, this.container.table))
  }
}
