import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Ball } from "../../../model/ball"
import { Respot } from "../../../utils/respot"
import { zero } from "../../../utils/three-utils"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"
import { TableGeometry } from "../../../view/tablegeometry"
import { ThreeStrategy } from "./threecushionstrategy"

export class ClawBreak implements BotStrategy {
  readonly name = "ClawBreak"

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    if (!TableGeometry.hasPockets) {
      return new ThreeStrategy(AimCalculator.DEFAULT_SHOT_POWER).aim(
        context,
        calculator
      )
    }

    const targetBall = this.pickTargetBall(context)
    const targetPoint = targetBall?.pos ?? zero
    const aimPoint = calculator.getAimPoint(context.cueBall.pos, targetPoint)
    const hitEvent = calculator.generateShot(
      context.table,
      0,
      AimCalculator.DEFAULT_SHOT_POWER,
      aimPoint ?? undefined
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
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
