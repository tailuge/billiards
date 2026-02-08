import { Outcome } from "../../model/outcome"
import { Respot } from "../../utils/respot"
import { Table } from "../../model/table"

export interface FoulResult {
  points: number
  reason: string | null
}

export interface ShotInfo {
  pots: number
  firstCollision: any
  legalFirstCollision: boolean
  whitePotted: boolean
  targetIsRed: boolean
}

export class SnookerUtils {
  static shotInfo(
    table: Table,
    outcome: Outcome[],
    targetIsRed: boolean,
    previousPotRed: boolean
  ): ShotInfo {
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
  ): boolean {
    if (!firstCollision) {
      return false
    }
    const id = firstCollision.ballB!.id
    if (targetIsRed) {
      return id >= 7
    } else {
      if (previousPotRed) {
        return id >= 1 && id <= 6
      } else {
        const colours = SnookerUtils.coloursOnTable(table).sort(
          (a, b) => a.id - b.id
        )
        if (colours.length === 0) {
          return false
        }
        return id === colours[0].id
      }
    }
  }

  static calculateFoul(outcome: Outcome[], shotInfo: ShotInfo): FoulResult {
    const points = SnookerUtils.foulPoints(outcome, shotInfo)
    const reason = SnookerUtils.foulReason(outcome, shotInfo)
    return { points, reason }
  }

  private static foulPoints(outcome: Outcome[], shotInfo: ShotInfo): number {
    const potted = Outcome.pots(outcome)
      .map((b) => b.id)
      .filter((id) => id < 7)
    let firstCollisionId = shotInfo.firstCollision?.ballB?.id ?? 0
    if (firstCollisionId > 6) {
      firstCollisionId = 0
    }
    return Math.max(3, firstCollisionId, ...potted) + 1
  }

  private static foulReason(
    outcome: Outcome[],
    shotInfo: ShotInfo
  ): string | null {
    if (shotInfo.whitePotted) {
      return "White potted"
    }

    if (!shotInfo.firstCollision) {
      return "No ball hit"
    }

    const firstBallId = shotInfo.firstCollision.ballB?.id ?? 0

    if (shotInfo.targetIsRed) {
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
      const firstBallId2 = shotInfo.firstCollision?.ballB?.id ?? 0
      if (pottedId !== firstBallId2) {
        const pottedName = SnookerUtils.colourName(pottedId)
        const hitName = SnookerUtils.colourName(firstBallId2)
        return `Potted ${pottedName} instead of ${hitName}`
      }
    }

    return null
  }

  static respotAllPottedColours(table: Table, outcome: Outcome[]) {
    return Outcome.pots(outcome)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Respot.respot(ball, table))
  }

  static redsOnTable(table: Table) {
    const reds = table.balls.slice(7).filter((ball: any) => ball.onTable())
    return reds
  }

  static coloursOnTable(table: Table) {
    return table.balls.slice(1, 7).filter((ball: any) => ball.onTable())
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
