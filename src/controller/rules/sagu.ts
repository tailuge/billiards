import { ThreeCushion } from "./threecushion"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Controller } from "../../controller/controller"
import { Aim } from "../../controller/aim"
import { WatchAim } from "../../controller/watchaim"
import { WatchEvent } from "../../events/watchevent"
import { StartAimEvent } from "../../events/startaimevent"
import { Session } from "../../network/client/session"
import { Rack } from "../../utils/rack"
import { ThreeCushionConfig } from "../../utils/threecushionconfig"
import { Table } from "../../model/table"
import { Camera } from "../../view/camera"

export class Sagu extends ThreeCushion {
  rulename = "sagu"

  rack(): Ball[] {
    return Rack.fromInitParam(Rack.fourBall())
  }

  table(): Table {
    this.tableGeometry()
    Camera.configureForRule("sagu")
    const table = new Table(this.rack())
    table.proximityEnabled = false
    this.cueball = table.cueball
    return table
  }

  private getShooterScoreAndTarget(): { score: number; target: number } {
    const session = Session.getInstance()
    if (this.container.isSinglePlayer) {
      const score = session.myScore()
      const target = session.getRaceTargetForPlayer(session.clientId)
      return { score, target }
    }

    const balls = this.container.table.balls
    const isPlayer1 = this.cueball === balls[0]

    let score: number
    let clientId: string

    if (isPlayer1) {
      if (session.playerIndex === 0) {
        score = session.myScore()
        clientId = session.clientId
      } else {
        score = session.opponentScore()
        clientId = session.opponentClientId ?? "opponent"
      }
    } else {
      if (session.playerIndex === 0) {
        score = session.opponentScore()
        clientId = session.opponentClientId ?? "opponent"
      } else {
        score = session.myScore()
        clientId = session.clientId
      }
    }

    const target = session.getRaceTargetForPlayer(clientId)
    return { score, target }
  }

  isSuccessfulShot(outcomes: Outcome[]): boolean {
    const { score, target } = this.getShooterScoreAndTarget()
    if (score === target - 1) {
      return !this.foulReason(outcomes) && this.isSaguThreeCushionShot(outcomes)
    }
    return !this.foulReason(outcomes) && this.hitsBothReds(outcomes)
  }

  private hitsBothReds(outcomes: Outcome[]): boolean {
    const redBalls = [
      this.container.table.balls[2],
      this.container.table.balls[3],
    ]
    const hitReds = new Set<Ball>()

    for (const o of outcomes) {
      if (o.type === OutcomeType.Collision) {
        if (o.ballA === this.cueball && redBalls.includes(o.ballB!)) {
          hitReds.add(o.ballB!)
        } else if (o.ballB === this.cueball && redBalls.includes(o.ballA)) {
          hitReds.add(o.ballA!)
        }
      }
    }
    return hitReds.size === 2
  }

  private isSaguThreeCushionShot(outcomes: Outcome[]): boolean {
    const redBalls = [
      this.container.table.balls[2],
      this.container.table.balls[3],
    ]
    const filteredOutcomes = outcomes.filter((o) => {
      if (o.type === OutcomeType.Collision) {
        const isRed = redBalls.includes(o.ballA!) || redBalls.includes(o.ballB!)
        const isCueBall = o.ballA === this.cueball || o.ballB === this.cueball
        return isCueBall && isRed
      }
      return true
    })
    return Outcome.isThreeCushionPoint(this.cueball, filteredOutcomes)
  }

  foulReason(outcomes: Outcome[]): string | null {
    // 1. Check if the opponent's cue ball was struck (Sub-cue Foul)
    const opponentCue = this.otherPlayersCueBall()
    const hitOpponent = outcomes.some(
      (o) =>
        o.type === OutcomeType.Collision &&
        ((o.ballA === this.cueball && o.ballB === opponentCue) ||
          (o.ballB === this.cueball && o.ballA === opponentCue))
    )

    if (hitOpponent) {
      return "Foul: Contacted the opponent's cue ball!"
    }

    // 2. Check if any ball was hit at all
    const hitAny = outcomes.some(
      (o) =>
        o.type === OutcomeType.Collision &&
        (o.ballA === this.cueball || o.ballB === this.cueball)
    )

    if (!hitAny) {
      return "Foul: No ball hit"
    }

    return null
  }

  getAmountScored(outcome: Outcome[]): number {
    return this.isSuccessfulShot(outcome) ? 1 : 0
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return this.isSuccessfulShot(outcome)
  }

  advanceState(outcomes: Outcome[]): void {
    if (!this.isSuccessfulShot(outcomes)) {
      this.cueball = this.otherPlayersCueBall()
    }
  }

  update(outcomes: Outcome[]): Controller {
    if (this.isSuccessfulShot(outcomes)) {
      this.container.sound.playSuccess(outcomes.length / 3)
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      const scored = this.getAmountScored(outcomes)
      this.currentBreak += scored

      Session.getInstance().addMyScore(scored)

      if (this.isEndOfGame(outcomes)) {
        return this.handleGameEnd(true)
      }
      return new Aim(this.container)
    }

    this.startTurn()

    const reason = this.foulReason(outcomes)
    if (reason) {
      const session = Session.getInstance()
      session.setMyScore(Math.max(0, session.myScore() - 1))

      this.container.notify({
        type: "Foul",
        title: "FOUL",
        subtext: reason,
      })
    }

    if (this.container.isSinglePlayer) {
      this.cueball = this.otherPlayersCueBall()
      const cue = this.container.table.cue
      if (cue) {
        cue.aim.i = this.container.table.balls.indexOf(this.cueball)
      }
      return new Aim(this.container)
    }

    this.container.sendEvent(new StartAimEvent())
    return new WatchAim(this.container)
  }
}
