import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { PlaceBall } from "../../controller/placeball"
import { WatchAim } from "../../controller/watchaim"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rules } from "./rules"
import { R } from "../../model/physics/constants"
import { TableGeometry } from "../../view/tablegeometry"
import { StartAimEvent } from "../../events/startaimevent"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"
import { isFirstShot } from "../../utils/utils"
import { roundVec } from "../../utils/three-utils"
import { ScoreEvent } from "../../events/scoreevent"

export abstract class PoolRules implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  abstract rulename: string

  constructor(container: Container) {
    this.container = container
  }

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
  }

  abstract nextCandidateBall(): Ball | undefined

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

  abstract rack(): Ball[]
  abstract update(outcome: Outcome[]): Controller

  protected handleFoul(outcome: Outcome[], reason: string): Controller {
    this.container.notify({
      type: "Foul",
      title: "FOUL",
      subtext: reason,
      extra: "Ball in hand",
    })
    this.startTurn()
    const cueball = this.container.table.cueball

    const startPos = cueball.onTable() ? cueball.pos.clone() : this.placeBall()
    roundVec(startPos)
    const placeBallEvent = new PlaceBallEvent(startPos, undefined, true)
    this.container.sendEvent(placeBallEvent)

    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container, startPos)
    }
    return new WatchAim(this.container)
  }

  protected handlePot(outcome: Outcome[]): Controller {
    const table = this.container.table
    const pots = Outcome.potCount(outcome)
    this.currentBreak += pots
    Session.getInstance().addMyScore(pots)

    this.container.sound.playSuccess(table.inPockets())
    if (this.isEndOfGame(outcome)) {
      return this.handleGameEnd(true)
    }

    this.container.sendEvent(new WatchEvent(table.serialise()))
    return new Aim(this.container)
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )
  }

  protected handleMiss(): Controller {
    const table = this.container.table
    this.container.sendEvent(new StartAimEvent())
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  abstract isEndOfGame(outcome: Outcome[]): boolean

  otherPlayersCueBall(): Ball {
    return this.cueball
  }

  secondToPlay(): void {}

  allowsPlaceBall(): boolean {
    return true
  }

  handleScore(event: ScoreEvent): void {
    this.container.updateScoreHud(
      event.p1,
      event.p2,
      event.b,
      event.active,
      event.p1type
    )
  }
}
