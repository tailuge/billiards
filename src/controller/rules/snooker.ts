import { Vector3 } from "three"
import { WatchEvent } from "../../events/watchevent"
import { Outcome } from "../../model/outcome"
import { Rack } from "../../utils/rack"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class Snooker extends NineBall implements Rules {
  previousPotRed: boolean = false
  currentBreak = 0

  static readonly tablemodel = "models/snooker.min.gltf"
  override asset(): string {
    return Snooker.tablemodel
  }

  override startTurn() {
    this.previousPotRed = false
    this.currentBreak = 0
  }

  override rack() {
    return Rack.snooker()
  }

  override nextCandidateBall() {
    const table = this.container.table
    const redsOnTable = table.balls.slice(7).filter((ball) => ball.onTable())
    const coloursOnTable = table.balls
      .slice(1, 7)
      .filter((ball) => ball.onTable())
    if (this.previousPotRed) {
      return Rack.closest(table.cueball, coloursOnTable)
    }
    if (redsOnTable.length > 0) {
      return Rack.closest(table.cueball, redsOnTable)
    }

    if (coloursOnTable.length > 0) {
      return coloursOnTable[0]
    }
    return
  }

  override placeBall(target?): Vector3 {
    if (target) {
      return target
    }
    return new Vector3(Rack.baulk, -Rack.sixth / 3, 0)
  }

  override update(outcome: Outcome[]): Controller {
    const pots = Outcome.potCount(outcome)
    if (pots > 0) {
      if (this.previousPotRed) {
        this.previousPotRed = false
        this.respot(outcome)
      } else if (Outcome.onlyRedsPotted(outcome)) {
        this.previousPotRed = true
      } else if (pots === 1) {
        // out of order colour pot gets respotted
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
