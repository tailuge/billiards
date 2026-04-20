import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Controller } from "../controller"
import { Rules } from "./rules"
import { TableGeometry } from "../../view/tablegeometry"
import { Rack } from "../../utils/rack"
import { isFirstShot } from "../../utils/utils"
import { R } from "../../model/physics/constants"

export class EightBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "nineball"

  constructor(container: Container) {
    this.container = container
  }
  update(outcome: Outcome[]): Controller {
    throw new Error("Method not implemented.")
  }
  asset(): string {
    return "models/p8.min.gltf"
  }

  tableGeometry(): void {
    TableGeometry.hasPockets = true
  }
  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  rack(): Ball[] {
    return Rack.eightBall()
  }
  secondToPlay(): void {
    throw new Error("Method not implemented.")
  }
  otherPlayersCueBall(): Ball {
    throw new Error("Method not implemented.")
  }
  isPartOfBreak(outcome: Outcome[]): boolean {
    throw new Error("Method not implemented.")
  }
  isEndOfGame(outcome: Outcome[]): boolean {
    throw new Error("Method not implemented.")
  }
  allowsPlaceBall(): boolean {
    return true
  }
  placeBall(target?: Vector3): Vector3 {
    const baulkline = (-R * 11) / 0.5
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      if (isFirstShot(this.container.recorder)) {
        max.setX(baulkline)
        min.setX(baulkline)
      }
      return target.clone().clamp(min, max)
    }
    return new Vector3(baulkline, 0, 0)
  }
  nextCandidateBall(): Ball | undefined {
    // need to respect solids/ stripes choice when made
    return this.container.table.balls
      .filter((b) => b !== this.cueball && b.onTable())
      .sort((a, b) => (a.label || 0) - (b.label || 0))[0]
  }
  startTurn(): void {
    throw new Error("Method not implemented.")
  }
  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    throw new Error("Method not implemented.")
  }
}
