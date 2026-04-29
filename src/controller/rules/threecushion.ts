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
import { isFirstShot } from "../../utils/utils"
import { zero } from "../../utils/three-utils"
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

  constructor(container: Container) {
    this.container = container
  }

  startTurn(): void {
    // not used
  }

  nextCandidateBall(): Ball | undefined {
    if (isFirstShot(this.container.recorder)) {
      return undefined
    }
    return Respot.closest(
      this.container.table.cueball,
      this.container.table.balls
    )
  }

  placeBall(_?: Vector3): Vector3 {
    return zero
  }

  asset(): string {
    return "models/threecushion.min.gltf"
  }

  secondToPlay(): void {
    this.cueball = this.container.table.balls[1]
  }

  tableGeometry(): void {
    const UMB_TABLE_X = 92.36
    const UMB_TABLE_Y = 46.18

    TableGeometry.tableX = R * (UMB_TABLE_X / 2 - 1)
    TableGeometry.tableY = R * (UMB_TABLE_Y / 2 - 1)

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

  rack(): Ball[] {
    return Rack.three()
  }

  update(outcomes: Outcome[]): Controller {
    this.container.table.proximityIndicator.hide()
    this.container.table.proximityTarget = null
    this.container.table.proximityThreeCushionsMet = false

    if (Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.container.sound.playSuccess(outcomes.length / 3)
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      this.currentBreak++
      Session.getInstance().addMyScore(1)

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

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.isThreeCushionPoint(this.cueball, outcome)
  }

  isEndOfGame(_: Outcome[]): boolean {
    const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()

    return s1 >= ThreeCushionConfig.raceTo || s2 >= ThreeCushionConfig.raceTo
  }

  handleGameEnd(_: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      undefined,
      endSubtext
    )
  }

  allowsPlaceBall(): boolean {
    return false
  }
}
