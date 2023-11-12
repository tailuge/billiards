import { Outcome } from "../../model/outcome"
import { Respot } from "../../utils/respot"
import { Table } from "../../model/table"

export class SnookerUtils {
  static shotInfo(table: Table, outcome: Outcome[], targetIsRed) {
    const firstCollision = Outcome.firstCollision(outcome)
    return {
      pots: Outcome.potCount(outcome),
      firstCollision: firstCollision,
      legalFirstCollision: SnookerUtils.isLegal(
        table,
        targetIsRed,
        firstCollision
      ),
      whitePotted: Outcome.isCueBallPotted(table.cueball, outcome),
    }
  }

  static isLegal(table: Table, targetIsRed, firstCollision) {
    if (!firstCollision) {
      return false
    }
    const id = firstCollision.ballB!.id
    const lesserBallOnTable =
      SnookerUtils.coloursOnTable(table).filter((b) => b.id < id).length > 0
    if (targetIsRed) {
      const isRed = id >= 7
      return isRed
    }
    return !lesserBallOnTable
  }

  static respotAllPottedColours(table, outcome: Outcome[]) {
    return Outcome.pots(outcome)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Respot.respot(ball, table))
  }

  static redsOnTable(table) {
    return table.balls.slice(7).filter((ball) => ball.onTable())
  }

  static coloursOnTable(table) {
    return table.balls.slice(1, 7).filter((ball) => ball.onTable())
  }
}