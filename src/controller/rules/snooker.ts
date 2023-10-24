import { WatchEvent } from "../../events/watchevent"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class Snooker extends NineBall implements Rules {
  static readonly tablemodel = "models/snooker.min.gltf"
  override asset(): string {
    return Snooker.tablemodel
  }

  override rack() {
    return Rack.snooker()
  }

  override update(outcome: Outcome[]): Controller {
    const table = this.container.table
    if (Outcome.potCount(outcome) > 0) {
      if (
        this.redsOnTable(table) ||
        Outcome.isCueBallPotted(table.cueball, outcome)
      ) {
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
    }
    return super.update(outcome)
  }

  redsOnTable(table: Table) {
    return table.balls.filter((b, i) => i > 6 && b.onTable()).length > 0
  }

  respotAllPottedColours(outcome: Outcome[]) {
    return outcome
      .filter((o) => o.type === OutcomeType.Pot)
      .map((o) => o.ballA!)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Rack.respot(ball, this.container.table))
  }
}
