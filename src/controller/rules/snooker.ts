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
import { MatchResult } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"
import { RerackEvent } from "../../events/rerackevent"

export class Snooker implements Rules {
  cueball: Ball
  previousPotRed = false
  targetIsRed = true
  currentBreak = 0
  previousBreak = 0
  foulPoints = 0
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
      this.targetIsRed,
      this.previousPotRed
    )

    if (info.pots === 0) {
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0
      if (!info.legalFirstCollision) {
        return this.foul(outcome, info)
      }
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
    if (info.legalFirstCollision && Outcome.onlyRedsPotted(outcome)) {
      // legal pot of one or more reds
      this.currentBreak += info.pots
      this.container.scores[Session.playerIndex()] += info.pots
      this.targetIsRed = false
      this.previousPotRed = true
      return this.continueBreak()
    }

    return this.foul(outcome, info)
  }

  targetColourRule(outcome: Outcome[], info): Controller {
    if (info.whitePotted) {
      return this.foul(outcome, info)
    }

    if (info.pots > 1) {
      this.respot(outcome)
      return this.foul(outcome, info)
    }

    // This checks if the potted ball is a colour (ID 1-6)
    if (Outcome.pots(outcome)[0].id > 6) {
      // If it's a red, it's a foul
      return this.foul(outcome, info)
    }

    // exactly one non red potted

    const id = Outcome.pots(outcome)[0].id
    // This checks if the potted ball is the same as the first ball hit
    if (id !== info.firstCollision.ballB.id) {
      return this.foul(outcome, info)
    }

    if (this.previousPotRed) {
      this.respot(outcome)
      this.currentBreak += id + 1
      this.container.scores[Session.playerIndex()] += id + 1
      this.previousPotRed = false
      this.targetIsRed =
        SnookerUtils.redsOnTable(this.container.table).length > 0
      return this.continueBreak()
    }

    // This block is only reached if previousPotRed is false,
    // meaning all reds are off the table and colours are being cleared in order.
    // In this case, we need to check if a lesser ball is on the table.
    const lesserBallOnTable =
      SnookerUtils.coloursOnTable(this.container.table).filter((b) => b.id < id)
        .length > 0

    if (lesserBallOnTable) {
      return this.foul(outcome, info)
    }

    this.currentBreak += id + 1
    this.container.scores[Session.playerIndex()] += id + 1
    this.previousPotRed = false
    this.targetIsRed = SnookerUtils.redsOnTable(this.container.table).length > 0
    return this.continueBreak()
  }

  foul(outcome, info) {
    this.foulPoints = this.foulCalculation(outcome, info)
    const index = Session.playerIndex()
    this.container.scores[1 - index] += this.foulPoints
    const reason = this.foulReason(outcome, info)
    const notification = info.whitePotted
      ? ({
          type: "Foul",
          title: "FOUL",
          subtext: reason || `Foul (${this.foulPoints} points)`,
          extra: "Ball in hand",
        } as const)
      : ({
          type: "Foul",
          title: "FOUL",
          subtext: reason || `Foul (${this.foulPoints} points)`,
        } as const)
    this.container.notify(notification)
    this.respot(outcome)
    if (info.whitePotted) {
      return this.whiteInHand()
    }
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

  foulReason(outcome, info): string | null {
    if (info.whitePotted) {
      return "White potted"
    }

    if (!info.firstCollision) {
      return "No ball hit"
    }

    const firstBallId = info.firstCollision.ballB?.id ?? 0

    // Use info.targetIsRed for the foul message, as it reflects the state *before* the shot.
    if (info.targetIsRed) {
      if (firstBallId < 7 || firstBallId === 0) {
        const colourName = SnookerUtils.colourName(firstBallId)
        return `Hit ${colourName} instead of red`
      }
    } else {
      if (firstBallId >= 7) {
        return "Hit red instead of colour"
      }
    }

    const pottedColours = Outcome.pots(outcome).filter(
      (b) => b.id > 0 && b.id < 7
    )
    if (pottedColours.length > 1) {
      const colourNames = pottedColours
        .map((b) => SnookerUtils.colourName(b.id))
        .join(", ")
      return `Potted ${colourNames}`
    }

    if (pottedColours.length === 1) {
      const pottedId = pottedColours[0].id
      const firstBallId2 = info.firstCollision?.ballB?.id ?? 0
      if (pottedId !== firstBallId2) {
        const pottedName = SnookerUtils.colourName(pottedId)
        const hitName = SnookerUtils.colourName(firstBallId2)
        return `Potted ${pottedName} instead of ${hitName}`
      }
    }

    return null
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
    this.currentBreak = 0
  }

  getScores(): [number, number] {
    return this.container.scores
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
    const table = this.container.table
    this.container.sendEvent(new StartAimEvent(this.foulPoints))
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    this.startTurn()
    return new WatchAim(this.container)
  }

  continueBreak() {
    const table = this.container.table
    this.container.sound.playSuccess(table.inPockets())
    if (Outcome.isClearTable(table)) {
      return this.handleGameEnd(true)
    }
    this.container.sendEvent(new WatchEvent(table.serialise()))
    return new Aim(this.container)
  }

  handleGameEnd(isWinner: boolean): Controller {
    if (isWinner) {
      this.container.eventQueue.push(new ChatEvent(null, `game over`))
      this.container.recorder.wholeGameLink()
    }

    const session = Session.hasInstance() ? Session.getInstance() : null
    const playerIndex = Session.playerIndex()
    const opponentIndex = 1 - playerIndex
    const myScore = this.container.scores[playerIndex]
    const opponentScore = this.container.scores[opponentIndex]

    const actuallyWon = myScore > opponentScore
    const isDraw = myScore === opponentScore

    let title: string
    let subtext: string
    let icon: string
    let extraClass = ""

    if (actuallyWon) {
      title = "YOU WON"
      icon = "🏆"
      extraClass = "is-winner"
    } else if (isDraw) {
      title = "DRAW"
      icon = "🤝"
    } else if (!Session.isSpectator()) {
      title = "YOU LOST"
      icon = "🥈"
      extraClass = "is-loser"
    } else {
      title = "GAME OVER"
      icon = "🏆"
    }

    if (this.container.isSinglePlayer) {
      subtext = `Score: ${myScore}`
    } else {
      const p0Name =
        playerIndex === 0
          ? session?.playername || "You"
          : session?.opponentName || "Opponent"
      const p1Name =
        playerIndex === 1
          ? session?.playername || "You"
          : session?.opponentName || "Opponent"
      subtext = `${p0Name} ${this.container.scores[0]} - ${this.container.scores[1]} ${p1Name}`
    }

    this.container.notifyLocal({
      type: "GameOver",
      title: title,
      subtext: subtext,
      icon: icon,
      extraClass: extraClass,
      duration: 0,
    })

    const winnerIndex =
      this.container.scores[0] >= this.container.scores[1] ? 0 : 1
    const loserIndex = 1 - winnerIndex

    const winnerName =
      winnerIndex === playerIndex
        ? session?.playername || "Anon"
        : session?.opponentName || "Opponent"
    const loserName =
      loserIndex === playerIndex
        ? session?.playername || "Anon"
        : session?.opponentName || "Opponent"

    const result: MatchResult = {
      winner: winnerName,
      winnerScore: this.container.scores[winnerIndex],
      gameType: this.rulename,
    }

    if (session?.opponentName) {
      result.loser = loserName
      result.loserScore = this.container.scores[loserIndex]
    }

    const amIWinner = winnerIndex === playerIndex
    return new End(this.container, amIWinner ? result : undefined)
  }

  whiteInHand(): Controller {
    this.startTurn()
    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container)
    }
    this.container.sendEvent(new PlaceBallEvent(zero))
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
      const respot = RerackEvent.fromJson({
        balls: respotted.map((b) => b.serialise()),
      })
      this.container.sendEvent(respot)
    }
  }
}
