import { Vector3 } from "three"
import { WatchEvent } from "../../events/watchevent"
import { Outcome } from "../../model/outcome"
import { Rack } from "../../utils/rack"
import { Controller } from "../controller"
import { Rules } from "./rules"
import { Respot } from "../../utils/respot"
import { Aim } from "../aim"
import { WatchAim } from "../watchaim"
import { ChatEvent } from "../../events/chatevent"
import { End } from "../end"
import { Container } from "../../container/container"
import { Ball } from "../../model/ball"
import { Table } from "../../model/table"
import { TableGeometry } from "../../view/tablegeometry"
import { PlaceBall } from "../placeball"
import { PlaceBallEvent } from "../../events/placeballevent"
import { zero } from "../../utils/utils"
import { SnookerUtils } from "./snookerutils"
import { StartAimEvent } from "../../events/startaimevent"

export class Snooker implements Rules {
  cueball: Ball
  previousPotRed = false
  targetIsRed = true
  currentBreak = 0
  previousBreak = 0
  foulPoints = 0
  score = 0
  rulename = "snooker"

  static readonly tablemodel = "models/d-snooker.min.gltf"

  readonly container: Container

  constructor(container) {
    this.container = container
  }

  snookerrule(outcome: Outcome[]): Controller {
    this.foulPoints = 0
    const info = SnookerUtils.shotInfo(
      this.container.table,
      outcome,
      this.targetIsRed
    )

    if (info.pots === 0) {
      if (!info.legalFirstCollision) {
        const firstCollisionId = info.firstCollision?.ballB?.id ?? 0
        this.foulPoints = Math.max(4, firstCollisionId + 1)
      }
      if (this.currentBreak > 0) {
        // end of break, reset break score
      }
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0
      return this.switchPlayer()
    }

    // ball has been potted
    if (this.targetIsRed) {
      return this.targetRedRule(outcome, info)
    }

    // non red potted
    return this.targetColourRule(outcome, info)
  }

  targetRedRule(outcome: Outcome[], info): Controller {
    console.log("applying target red rule")
    if (info.legalFirstCollision && Outcome.onlyRedsPotted(outcome)) {
      // legal pot of one or more reds
      this.currentBreak += info.pots
      this.targetIsRed = false
      this.previousPotRed = true
      this.container.hud.updateBreak(this.currentBreak)
      return this.continueBreak()
    }

    this.foulPoints = this.foulCalculation(outcome, info)
    this.respot(outcome)

    if (info.whitePotted) {
      return this.whiteInHand()
    }

    return this.switchPlayer()
  }

  targetColourRule(outcome: Outcome[], info): Controller {
    console.log("applying target colour rule")

    if (info.whitePotted) {
      this.respot(outcome)
      return this.whiteInHand()
    }

    if (info.pots > 1) {
      this.foulPoints = this.foulCalculation(outcome, info)
      this.respot(outcome)
      return this.switchPlayer()
    }

    if (Outcome.pots(outcome)[0].id > 6) {
      this.foulPoints = this.foulCalculation(outcome, info)
      return this.switchPlayer()
    }

    this.targetIsRed = SnookerUtils.redsOnTable(this.container.table).length > 0

    // exactly one non red potted

    const id = Outcome.pots(outcome)[0].id
    if (id !== info.firstCollision.ballB.id) {
      return this.foul(outcome, info)
    }

    if (this.previousPotRed) {
      this.respot(outcome)
      this.currentBreak += id + 1
      this.previousPotRed = false
      return this.continueBreak()
    }

    const lesserBallOnTable =
      SnookerUtils.coloursOnTable(this.container.table).filter((b) => b.id < id)
        .length > 0

    if (lesserBallOnTable) {
      return this.foul(outcome, info)
    }

    this.currentBreak += id + 1
    this.previousPotRed = false
    return this.continueBreak()
  }

  foul(outcome, info) {
    this.foulPoints = this.foulCalculation(outcome, info)
    this.respot(outcome)
    return this.switchPlayer()
  }

  foulCalculation(outcome, info) {
    const potted = Outcome.pots(outcome)
      .map((b) => b.id)
      .filter((id) => id < 7)
    let firstCollisionId = info.firstCollision?.ballB?.id ?? 0
    if (firstCollisionId > 6) {
      firstCollisionId = 0
    }
    return Math.max(3, firstCollisionId, ...potted) + 1
  }

  tableGeometry() {
    TableGeometry.hasPockets = true
  }

  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  otherPlayersCueBall(): Ball {
    // only for three cushion
    return this.cueball
  }

  secondToPlay() {
    // only for three cushion
  }

  isPartOfBreak(_: Outcome[]): boolean {
    return this.currentBreak > 0
  }

  isEndOfGame(_: Outcome[]): boolean {
    return Outcome.isClearTable(this.container.table) && this.currentBreak > 0
  }

  allowsPlaceBall(): boolean {
    return true
  }

  asset(): string {
    return Snooker.tablemodel
  }

  startTurn() {
    this.previousPotRed = false
    this.targetIsRed = SnookerUtils.redsOnTable(this.container.table).length > 0
    this.previousBreak = this.currentBreak
    this.score += this.currentBreak
    this.currentBreak = 0
    this.container.hud.updateBreak(this.currentBreak)
  }

  rack() {
    return Rack.snooker()
  }

  nextCandidateBall() {
    const table = this.container.table
    const redsOnTable = SnookerUtils.redsOnTable(table)
    const coloursOnTable = SnookerUtils.coloursOnTable(table)
    if (this.previousPotRed) {
      return Respot.closest(table.cueball, coloursOnTable)
    }
    if (redsOnTable.length > 0) {
      return Respot.closest(table.cueball, redsOnTable)
    }

    if (coloursOnTable.length > 0) {
      return coloursOnTable[0]
    }
    return undefined
  }

  placeBall(target?: Vector3): Vector3 {
    if (target) {
      // constrain to "D"
      const centre = new Vector3(Rack.baulk, 0, 0)
      const radius = Rack.sixth
      const distance = target.distanceTo(centre)
      if (target.x >= Rack.baulk) {
        target.x = Rack.baulk
      }
      if (distance > radius) {
        const direction = target.clone().sub(centre).normalize()
        return centre.add(direction.multiplyScalar(radius))
      } else {
        return target
      }
    }
    return new Vector3(Rack.baulk, -Rack.sixth / 2.6, 0)
  }

  switchPlayer() {
    if (this.foulPoints > 0) {
      console.log(`foul, ${this.foulPoints} to opponent`)
    }
    console.log("end of break, switch player")
    const table = this.container.table
    console.log(table.cue.aim)
    this.container.sendEvent(new StartAimEvent(this.foulPoints))
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  continueBreak() {
    this.container.hud.updateBreak(this.currentBreak)
    const table = this.container.table
    this.container.sound.playSuccess(table.inPockets())
    if (Outcome.isClearTable(table)) {
      this.container.eventQueue.push(new ChatEvent(null, `game over`))
      this.container.recorder.wholeGameLink()
      return new End(this.container)
    }
    this.container.sendEvent(new WatchEvent(table.serialise()))
    return new Aim(this.container)
  }

  whiteInHand(): Controller {
    if (this.foulPoints > 0) {
      console.log(`foul, ${this.foulPoints} to opponent`)
    }
    this.startTurn()
    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container)
    }
    this.container.sendEvent(new PlaceBallEvent(zero, true))
    return new WatchAim(this.container)
  }

  update(outcome: Outcome[]): Controller {
    return this.snookerrule(outcome)
  }

  respot(outcome: Outcome[]) {
    const respotted = SnookerUtils.respotAllPottedColours(
      this.container.table,
      outcome
    )
    if (respotted.length > 0) {
      const changes = {
        balls: respotted.map((b) => b.serialise()),
        rerack: true,
      }
      const respot = new WatchEvent(changes)
      this.container.sendEvent(respot)
      this.container.recorder.record(respot)
    }
  }
}
