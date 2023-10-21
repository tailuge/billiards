import { WatchEvent } from "../../events/watchevent"
import { Outcome } from "../../model/outcome"
import { Rack } from "../../utils/rack"
import { Aim } from "../aim"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class FourteenOne extends NineBall implements Rules {
  override rack() {
    return Rack.triangle()
  }

  override update(outcome: Outcome[]): Controller {
    const table = this.container.table
    if (Outcome.isBallPottedNoFoul(table.cueball, outcome)) {
      const onTable = table.balls.filter((b) => b.onTable())
      if (onTable.length === 2) {
        Rack.rerack(onTable[1], table)
        this.container.recoder.wholeGameLink()
        this.container.sound.playSuccess(table.inPockets())
        const state = table.serialise()
        const rerack = { ...state, rerack: true }
        this.container.sendEvent(new WatchEvent(rerack))
        return new Aim(this.container)
      }
    }
    return super.update(outcome)
  }
}
