import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { WatchAim } from "../../controller/watchaim"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { R } from "../../model/physics/constants"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { CameraTop } from "../../view/cameratop"
import { TableGeometry } from "../../view/tablegeometry"
import { Rules } from "./rules"
import { zero } from "../../utils/utils"

export class ThreeCushion implements Rules {
  readonly container: Container

  cueball: Ball

  constructor(container) {
    this.container = container
  }

  startTurn() {}

  nextCandidateBall() {
    return Rack.closest(
      this.container.table.cueball,
      this.container.table.balls
    )
  }

  placeBall(_?): Vector3 {
    return zero
  }

  asset(): string {
    return "models/threecushion.min.gltf"
  }

  secondToPlay() {
    this.cueball = this.container.table.balls[1]
  }

  table(): Table {
    TableGeometry.tableX = R * 49
    TableGeometry.tableY = R * 24
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
    CameraTop.zoomFactor = 0.92

    const table = new Table(this.rack())
    table.hasPockets = false
    this.cueball = table.cueball
    return table
  }

  rack() {
    return Rack.three()
  }

  update(outcomes: Outcome[]): Controller {
    if (Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.container.sound.playSuccess(outcomes.length / 3)
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      return new Aim(this.container)
    }

    if (this.container.isSinglePlayer) {
      this.cueball = this.otherPlayersCueBall()
      this.container.table.cue.aim.i = this.container.table.balls.indexOf(
        this.cueball
      )
      return new Aim(this.container)
    }

    this.container.sendEvent(this.container.table.cue.aim)
    return new WatchAim(this.container)
  }

  otherPlayersCueBall(): Ball {
    const balls = this.container.table.balls
    return this.cueball === balls[0] ? balls[1] : balls[0]
  }

  isPartOfBreak(outcome: Outcome[]) {
    return Outcome.isThreeCushionPoint(this.cueball, outcome)
  }

  isEndOfGame(_: Outcome[]) {
    return false
  }

  allowsPlaceBall() {
    return false
  }
}
