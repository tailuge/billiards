import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { Controller } from "../controller/controller"
import { Outcome } from "../model/outcome"
import { Table } from "../model/table"
import { Rack } from "../utils/rack"
import { TableGeometry } from "../view/tablegeometry"
import { Rules } from "./rules"

export class ThreeCushion implements Rules {
  readonly container: Container

  constructor(container) {
    this.container = container
  }

  table(): Table {
    const table = new Table(this.rack())
    table.hasPockets = false
    TableGeometry.tableX = 21.5
    TableGeometry.tableY = 10.5
    return table
  }

  rack() {
    return Rack.three()
  }

  update(_: Outcome[]): Controller {
    return new Aim(this.container)
  }
}
