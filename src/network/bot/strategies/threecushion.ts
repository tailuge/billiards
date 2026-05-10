import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Vector3 } from "three"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"

export class ThreeCushion implements BotStrategy {
  readonly name = "ThreeCushion"

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    if (context.validTargetBalls.length === 0) {
      return []
    }

    const anchorBall = AimCalculator.findAnchor(context.validTargetBalls)
    const targetBall =
      context.validTargetBalls.find((b) => b !== anchorBall) ||
      context.validTargetBalls[0]

    const overlap = 0.25
    const aimPoint = AimCalculator.ghostBallPosition(
      context.cueBall.pos,
      targetBall.pos,
      overlap
    )

    const shot = calculator.generateShot(
      context.table,
      0,
      AimCalculator.MAX_SHOT_POWER,
      aimPoint,
      new Vector3(Math.sign(overlap) * 0.3, 0, 0)
    )

    return [AimEvent.fromJson(shot.tablejson.aim), shot]
  }
}
