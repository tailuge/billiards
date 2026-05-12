import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Ball } from "../../../model/ball"
import { Vector3 } from "three"
import { Respot } from "../../../utils/respot"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"
import { TableGeometry } from "../../../view/tablegeometry"
import { ThreeStrategy } from "./threecushionstrategy"

export class BankShot implements BotStrategy {
  readonly name = "BankShot"

  private static readonly RAIL_THRESHOLD = 0.8
  private static readonly BANK_POWER_MULTIPLIER = 1.15

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    if (!TableGeometry.hasPockets) {
      return new ThreeStrategy(AimCalculator.MAX_SHOT_POWER).aim(
        context,
        calculator
      )
    }

    const targetBall = this.pickTargetBall(context)
    if (!targetBall) {
      return []
    }

    const bankShot = this.tryBankShot(context, calculator, targetBall)
    if (bankShot) {
      return bankShot
    }

    const aimPoint = calculator.getAimPoint(
      context.cueBall.pos,
      targetBall.pos
    )
    const hitEvent = calculator.generateShot(
      context.table,
      0,
      AimCalculator.DEFAULT_SHOT_POWER,
      aimPoint ?? undefined
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
  }

  private tryBankShot(
    context: BotShotContext,
    calculator: AimCalculator,
    targetBall: Ball
  ): GameEvent[] | null {
    const x = TableGeometry.tableX
    const y = TableGeometry.tableY
    const tp = targetBall.pos

    const nearRail = this.findNearestRail(tp, x, y)
    if (!nearRail) {
      return null
    }

    const bestPocket = calculator.findBestPocket(
      context.cueBall.pos,
      tp,
      calculator.pockets
    )

    const mirror = this.mirrorAcrossRail(bestPocket, nearRail)
    const aimPoint = calculator.getAimPoint(tp, mirror, calculator.pockets)

    if (!aimPoint) {
      return null
    }

    const hitEvent = calculator.generateShot(
      context.table,
      0.05,
      AimCalculator.DEFAULT_SHOT_POWER * BankShot.BANK_POWER_MULTIPLIER,
      aimPoint,
      new Vector3(0, 0.15, 0)
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
  }

  private findNearestRail(
    pos: Vector3,
    tableX: number,
    tableY: number
  ): string | null {
    const dx = Math.abs(pos.x) / tableX
    const dy = Math.abs(pos.y) / tableY
    if (dy > BankShot.RAIL_THRESHOLD && dy > dx) {
      return pos.y > 0 ? "top" : "bottom"
    }
    if (dx > BankShot.RAIL_THRESHOLD) {
      return pos.x > 0 ? "right" : "left"
    }
    return null
  }

  private mirrorAcrossRail(pocket: Vector3, rail: string): Vector3 {
    const m = pocket.clone()
    switch (rail) {
      case "top":
        m.y = -m.y
        break
      case "bottom":
        m.y = -m.y
        break
      case "left":
        m.x = -m.x
        break
      case "right":
        m.x = -m.x
        break
    }
    return m
  }

  private pickTargetBall(context: BotShotContext): Ball | undefined {
    if (context.validTargetBalls.length === 0) {
      return undefined
    }

    if (context.table.proximityEnabled) {
      return Respot.furthest(context.cueBall, context.validTargetBalls)
    }

    return Respot.closest(context.cueBall, context.validTargetBalls)
  }
}
