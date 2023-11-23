import { WatchEvent } from "../../events/watchevent"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { Controller } from "../controller"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class FourteenOne extends NineBall implements Rules {
  override asset(): string {
    return "models/p8.min.gltf"
  }

  constructor(container) {
    super(container)
    this.rulename = "fourteenone"
  }

  override rack() {
    return Rack.triangle()
  }

  override update(outcome: Outcome[]): Controller {
    const table = this.container.table
    this.checkRerack(table)
    return super.update(outcome)
  }

  checkRerack(table: Table) {
    const onTable = table.balls
      .filter((b) => b.onTable())
      .filter((b) => b !== table.cueball)
    if (onTable.length === 1) {
      Rack.rerack(onTable[0], table)
      this.container.sound.playSuccess(table.inPockets())
      const state = table.serialise()
      const rerack = new WatchEvent({ ...state, rerack: true })
      this.container.sendEvent(rerack)
      this.container.recorder.record(rerack)
      this.container.recorder.wholeGameLink()
    }
  }
}
