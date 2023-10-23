import { WatchEvent } from "../../events/watchevent"
import { Ball, State } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { R } from "../../model/physics/constants"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { TableGeometry } from "../../view/tablegeometry"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class Snooker extends NineBall implements Rules {
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
        if (this.respotAllPottedColours(outcome)) {
          const state = table.serialise()
          const rerack = new WatchEvent({ ...state, rerack: true })
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
      .map((ball) => this.respot(ball))
      .some((e) => e === true)
  }

  respot(ball: Ball) {
    const positions = Rack.snookerColourPositions()
    positions.push(positions[ball.id - 1])
    positions.reverse()
    // add positions as close as possible to spot behind, then infront
    let pos = positions[0].clone()
    for (let x = pos.x; x < TableGeometry.tableX; x += R / 4) {
      positions.push(pos.setX(x).clone())
    }
    pos = positions[0].clone()
    for (let x = pos.x; x > -TableGeometry.tableX; x -= R / 4) {
      positions.push(pos.setX(x).clone())
    }
    return positions.some((p) => {
      if (!this.container.table.overlapsAny(p, ball)) {
        ball.pos.copy(p)
        ball.state = State.Stationary
        return true
      }
      return false
    })
  }
}
