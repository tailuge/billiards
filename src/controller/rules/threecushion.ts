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
import { Respot } from "../../utils/respot"
import { ThreeCushionConfig } from "../../utils/threecushionconfig"
import { StartAimEvent } from "../../events/startaimevent"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"

export class ThreeCushion implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "threecushion"

  constructor(container) {
    this.container = container
  }

  getScores(): [number, number] {
    return this.container.scores
  }

  startTurn() {
    // not used
  }

  nextCandidateBall() {
    return Respot.closest(
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

  tableGeometry() {
    TableGeometry.tableX = R * 49
    TableGeometry.tableY = R * 24
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
    TableGeometry.hasPockets = false
  }

  table(): Table {
    this.tableGeometry()
    CameraTop.zoomFactor = 0.92
    const table = new Table(this.rack())
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
      this.currentBreak++
      this.container.scores[Session.playerIndex()]++
      if (this.isEndOfGame(outcomes)) {
        return this.handleGameEnd(true)
      }
      return new Aim(this.container)
    }

    this.previousBreak = this.currentBreak
    this.currentBreak = 0

    if (this.container.isSinglePlayer) {
      this.cueball = this.otherPlayersCueBall()
      this.container.table.cue.aim.i = this.container.table.balls.indexOf(
        this.cueball
      )
      return new Aim(this.container)
    }

    this.container.sendEvent(new StartAimEvent())
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
    const [s1, s2] = this.container.scores
    return s1 >= ThreeCushionConfig.raceTo || s2 >= ThreeCushionConfig.raceTo
  }

  handleGameEnd(_: boolean): Controller {
    return MatchResultHelper.presentGameEnd(this.container, this.rulename)
  }

  allowsPlaceBall() {
    return false
  }
}
