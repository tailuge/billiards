import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Controller } from "../controller"
import { Rules } from "./rules"
import { TableGeometry } from "../../view/tablegeometry"
import { Rack } from "../../utils/rack"
import { isFirstShot } from "../../utils/utils"
import { R } from "../../model/physics/constants"
import { Session } from "../../network/client/session"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Aim } from "../aim"
import { WatchAim } from "../watchaim"
import { PlaceBall } from "../placeball"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { StartAimEvent } from "../../events/startaimevent"
import { ScoreEvent } from "../../events/scoreevent"
import { roundVec } from "../../utils/three-utils"
import { Respot } from "../../utils/respot"
import { RerackEvent } from "../../events/rerackevent"

export class EightBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "eightball"

  constructor(container: Container) {
    this.container = container
  }

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
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

  secondToPlay(): void {}

  otherPlayersCueBall(): Ball {
    return this.cueball
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  allowsPlaceBall(): boolean {
    return true
  }

  placeBall(target?: Vector3): Vector3 {
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      if (isFirstShot(this.container.recorder)) {
        const baulkline = (-R * 11) / 0.5
        max.setX(baulkline)
        min.setX(baulkline)
      }
      return target.clone().clamp(min, max)
    }
    const baulkline = (-R * 11) / 0.5
    return new Vector3(baulkline, 0, 0)
  }

  nextCandidateBall(): Ball | undefined {
    const session = Session.getInstance()
    const table = this.container.table
    const balls = table.balls.filter((b) => b !== this.cueball && b.onTable())

    if (session.p1type === 0) {
      return balls.find((b) => b.label !== 8)
    }

    const myGroup = balls.filter((b) => this.isMyType(b))
    if (myGroup.length > 0) {
      return Respot.closest(table.cueball, myGroup)
    }

    return table.balls.find((b) => b.label === 8 && b.onTable())
  }

  private isMyType(ball: Ball): boolean {
    const session = Session.getInstance()
    if (session.p1type === 1) {
      return (ball.label || 0) >= 1 && (ball.label || 0) <= 7
    }
    if (session.p1type === 2) {
      return (ball.label || 0) >= 9 && (ball.label || 0) <= 15
    }
    return false
  }

  isFoul(outcome: Outcome[]): boolean {
    return this.foulReason(outcome) !== null
  }

  private wrongBallHitReason(hitBall: Ball, outcome: Outcome[]): string | null {
    const session = Session.getInstance()
    if (session.p1type === 0) {
      return hitBall.label === 8 ? "Hitting the 8-ball first is a foul" : null
    }
    const cueball = this.container.table.cueball
    const pottedThisShot = new Set(Outcome.pots(outcome))
    const myGroupBefore = this.container.table.balls.filter(
      (b) =>
        b !== cueball &&
        (b.onTable() || pottedThisShot.has(b)) &&
        this.isMyType(b)
    )
    if (myGroupBefore.length > 0) {
      return this.isMyType(hitBall) ? null : "Wrong group hit first"
    }
    return hitBall.label !== 8 ? "Must hit 8-ball first" : null
  }

  foulReason(outcome: Outcome[]): string | null {
    const table = this.container.table
    const cueball = table.cueball

    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return "Cue ball potted"
    }

    const firstCollision = Outcome.firstCollision(
      Outcome.cueBallFirst(cueball, outcome)
    )

    if (!firstCollision) {
      return "No ball hit"
    }

    const wrongBall = this.wrongBallHitReason(firstCollision.ballB!, outcome)
    if (wrongBall) {
      return wrongBall
    }

    // 3. No cushion after contact
    if (Outcome.potCount(outcome) === 0) {
      const firstCollisionIndex = outcome.indexOf(firstCollision)
      const cushionsAfter = outcome
        .slice(firstCollisionIndex + 1)
        .some((o) => o.type === OutcomeType.Cushion)
      if (!cushionsAfter) {
        return "No cushion after contact"
      }
    }

    return null
  }

  update(outcome: Outcome[]): Controller {
    const reason = this.foulReason(outcome)

    if (reason) {
      return this.handleFoul(outcome, reason)
    }

    const pots = Outcome.pots(outcome)
    if (pots.length > 0) {
      return this.handlePot(outcome)
    }

    return this.handleMiss()
  }

  private handleFoul(outcome: Outcome[], reason: string): Controller {
    this.container.notify({
      type: "Foul",
      title: "FOUL",
      subtext: reason,
      extra: "Ball in hand",
    })
    this.startTurn()
    const pots = Outcome.pots(outcome)
    const eightBallPotted = pots.some((b) => b.label === 8)
    const cueball = this.container.table.cueball

    if (eightBallPotted) {
      return this.handleGameEnd(false, "8-ball pocketed on foul")
    }

    const startPos = cueball.onTable() ? cueball.pos.clone() : this.placeBall()
    roundVec(startPos)
    const placeBallEvent = new PlaceBallEvent(startPos, undefined, true)
    this.container.sendEvent(placeBallEvent)

    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container, startPos)
    }
    return new WatchAim(this.container)
  }

  private handlePot(outcome: Outcome[]): Controller {
    const session = Session.getInstance()
    const table = this.container.table
    const pots = Outcome.pots(outcome)

    if (this.isEndOfGame(outcome)) {
      return this.handleGameEnd(true)
    }

    if (pots.some((b) => b.label === 8)) {
      return this.respotEightBallFoul()
    }

    if (session.p1type === 0) {
      const solids = pots.filter((b) => b.label! >= 1 && b.label! <= 7)
      const stripes = pots.filter((b) => b.label! >= 9 && b.label! <= 15)

      if (solids.length > 0 && stripes.length === 0) {
        session.p1type = 1
      } else if (stripes.length > 0 && solids.length === 0) {
        session.p1type = 2
      }
    }

    this.currentBreak += pots.length
    session.addMyScore(pots.length)

    this.container.sound.playSuccess(table.inPockets())

    const scoreEvent = new ScoreEvent(
      session.playerIndex === 0 ? session.myScore() : session.opponentScore(),
      session.playerIndex === 1 ? session.myScore() : session.opponentScore(),
      this.currentBreak,
      (session.playerIndex + 1) as any,
      session.p1type
    )
    this.container.sendEvent(scoreEvent)

    this.container.sendEvent(new WatchEvent(table.serialise()))
    return new Aim(this.container)
  }

  private respotEightBallFoul(): Controller {
    const table = this.container.table
    const eightBall = table.balls.find((b) => b.label === 8)!
    const footSpot = new Vector3(TableGeometry.tableX / 2, 0, 0)
    Respot.respotBehind(footSpot, eightBall, table)
    eightBall.fround()
    this.container.sendEvent(
      RerackEvent.fromJson({ balls: [eightBall.serialise()] })
    )
    return this.handleFoul([], "8-ball pocketed early")
  }

  private handleMiss(): Controller {
    const table = this.container.table
    this.container.sendEvent(new StartAimEvent())
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  isEndOfGame(outcome: Outcome[]): boolean {
    const eightBall = this.container.table.balls.find((b) => b.label === 8)!
    const eightBallPotted = Outcome.pots(outcome).includes(eightBall)
    if (!eightBallPotted || this.isFoul(outcome)) {
      return false
    }

    const session = Session.getInstance()
    if (session.p1type === 0) {
      return false
    }

    const table = this.container.table
    const cueball = table.cueball
    const pottedThisShot = new Set(Outcome.pots(outcome))
    const myGroup = table.balls.filter(
      (b) =>
        b !== cueball &&
        b !== eightBall &&
        b.onTable() &&
        this.isMyType(b) &&
        !pottedThisShot.has(b)
    )

    return myGroup.length === 0
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )
  }
}
