import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { PoolRules } from "./poolrules"
import { RerackEvent } from "../../events/rerackevent"
import { Respot } from "../../utils/respot"
import { Session } from "../../network/client/session"
import { Ball } from "../../model/ball"
import { Controller } from "../controller"

export class NineBall extends PoolRules {
  rulename = "nineball"

  override nextCandidateBall(): Ball | undefined {
    return this.container.table.balls
      .filter((b) => b !== this.cueball && b.onTable())
      .sort((a, b) => (a.label || 0) - (b.label || 0))[0]
  }

  override rack(): Ball[] {
    return Rack.diamond()
  }

  override update(outcome: Outcome[]): Controller {
    const reason = NineBall.foulReason(this.container.table, outcome)

    if (reason) {
      this.startTurn()
      const pots = Outcome.pots(outcome)
      const nineBallPotted = pots.includes(this.container.table.balls[9])

      if (nineBallPotted) {
        this.respotAndBroadcastNineBall()
      }
      return this.handleFoul(outcome, reason)
    }

    if (Outcome.potCount(outcome) > 0) {
      if (Session.isPracticeMode()) {
        if (Outcome.pots(outcome).includes(this.container.table.balls[9])) {
          this.respotAndBroadcastNineBall()
        }
      }
      return this.handlePot(outcome)
    }

    return this.handleMiss()
  }

  override isEndOfGame(outcome: Outcome[]): boolean {
    const nineBall = this.container.table.balls[9]
    const nineBallPotted = Outcome.pots(outcome).includes(nineBall)
    if (!nineBallPotted || this.isFoul(outcome)) {
      return false
    }

    if (Session.isPracticeMode()) {
      return !NineBall.hasOtherObjectBalls(this.container.table)
    }

    return true
  }

  protected isFoul(outcome: Outcome[]): boolean {
    return NineBall.foulReason(this.container.table, outcome) !== null
  }

  public static foulReason(table: Table, outcome: Outcome[]): string | null {
    const cueball = table.cueball

    // 1. Cue ball potted
    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return "Cue ball potted"
    }

    // 2. Wrong ball hit first
    const lowestBall = NineBall.getLowestBallAtStartOfShot(table, outcome)
    const firstCollision = Outcome.firstCollision(
      Outcome.cueBallFirst(cueball, outcome)
    )

    if (!firstCollision) {
      return "No ball hit"
    }

    if (firstCollision.ballB !== lowestBall) {
      if (Session.isPracticeMode()) {
        if (
          firstCollision.ballB === table.balls[9] &&
          NineBall.hasOtherObjectBalls(table)
        ) {
          return "Wrong ball hit first"
        }
      } else {
        return "Wrong ball hit first"
      }
    }

    // 3. No cushion after contact
    if (Outcome.potCount(outcome) === 0) {
      // Find cushions after first collision
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

  public static getLowestBallAtStartOfShot(
    table: Table,
    outcome: Outcome[]
  ): Ball | undefined {
    const potted = Outcome.pots(outcome)
    const onTable = table.balls.filter(
      (b) => b !== table.cueball && b.onTable()
    )
    const all = [...potted, ...onTable]
    all.sort((a, b) => (a.label || 0) - (b.label || 0))
    return all[0]
  }

  private static hasOtherObjectBalls(table: Table): boolean {
    return table.balls.some(
      (b) => b !== table.cueball && b !== table.balls[9] && b.onTable()
    )
  }

  private respotAndBroadcastNineBall() {
    Respot.nineBall(this.container.table)
    const nineBall = this.container.table.balls[9]
    if (nineBall) {
      nineBall.fround()
      const respotEvent = RerackEvent.fromJson({
        balls: [nineBall.serialise()],
      })
      console.log("Respot nine ball sending rerack event", respotEvent)
      this.container.sendEvent(respotEvent)
    }
  }
}
