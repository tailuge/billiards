import { Outcome } from "../../model/outcome"
import { Respot } from "../../utils/respot"
import { Table } from "../../model/table"

export class SnookerUtils {
  static shotInfo(
    table: Table,
    outcome: Outcome[],
    targetIsRed: boolean,
    previousPotRed: boolean
  ) {
    const firstCollision = Outcome.firstCollision(outcome)
    return {
      pots: Outcome.potCount(outcome),
      firstCollision: firstCollision,
      legalFirstCollision: SnookerUtils.isLegalFirstCollision(
        table,
        targetIsRed,
        previousPotRed,
        firstCollision
      ),
      whitePotted: Outcome.isCueBallPotted(table.cueball, outcome),
      targetIsRed: targetIsRed,
    }
  }

  static isLegalFirstCollision(
    table: Table,
    targetIsRed: boolean,
    previousPotRed: boolean,
    firstCollision
  ) {
    if (!firstCollision) {
      return false
    }
    const id = firstCollision.ballB!.id
    if (targetIsRed) {
      // Player is targeting red
      return id >= 7 // First hit ball must be a red
    } else {
      // Player is targeting colour
      if (previousPotRed) {
        // Just potted a red, now hitting *any* colour
        return id >= 1 && id <= 6 // First hit ball must be a colour (1-6)
      } else {
        // All reds off the table, clearing colours in order
        const colours = SnookerUtils.coloursOnTable(table).sort(
          (a, b) => a.id - b.id
        )
        if (colours.length === 0) {
          // No colours left
          return false
        }
        return id === colours[0].id // First hit ball must be the lowest ID colour
      }
    }
  }

  static respotAllPottedColours(table, outcome: Outcome[]) {
    return Outcome.pots(outcome)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Respot.respot(ball, table))
  }

  static redsOnTable(table) {
    const reds = table.balls.slice(7).filter((ball) => ball.onTable())
    return reds
  }

  static coloursOnTable(table) {
    return table.balls.slice(1, 7).filter((ball) => ball.onTable())
  }

  static colourName(id: number): string {
    const names: { [key: number]: string } = {
      1: "Yellow",
      2: "Green",
      3: "Brown",
      4: "Blue",
      5: "Pink",
      6: "Black",
    }
    return names[id] || `Ball ${id}`
  }
}
