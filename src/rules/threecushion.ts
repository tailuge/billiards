import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { Controller } from "../controller/controller"
import { Ball } from "../model/ball"
import { Outcome } from "../model/outcome"
import { Table } from "../model/table"
import { Rack } from "../utils/rack"
import { TableGeometry } from "../view/tablegeometry"
import { Rules } from "./rules"

export class ThreeCushion implements Rules {
  readonly container: Container

  cueball: Ball

  constructor(container) {
    this.container = container
  }

  secondToPlay() {
    this.cueball = this.container.table.balls[1]
  }

  table(): Table {
    const table = new Table(this.rack())
    table.hasPockets = false
    TableGeometry.tableX = 21.5
    TableGeometry.tableY = 10.5
    this.cueball = table.balls[0]
    return table
  }

  rack() {
    return Rack.three()
  }

  update(outcomes: Outcome[]): Controller {
    if (Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.container.sound.playSuccess(5)
    }
    return new Aim(this.container)
  }
}
