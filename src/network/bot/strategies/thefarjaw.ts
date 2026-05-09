import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Ball } from "../../../model/ball"
import { Vector3 } from "three"
import { Respot } from "../../../utils/respot"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"
import { TableGeometry } from "../../../view/tablegeometry"



export class TheFarJaw implements BotStrategy {
  readonly name = "TheFarJaw"

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    const targetBall = this.pickTargetBall(context)
    if (!targetBall) {
      return []
    }

    if (!TableGeometry.hasPockets) {
      return this.aimThreeCushion(context, calculator, targetBall)
    }
    const targetPoint = targetBall.pos
    const aimPoint = calculator.getAimPoint(
      context.cueBall.pos,
      targetPoint,
      calculator.pockets
    )
    const knuckles = calculator.closestKnuckles(
      calculator.findBestPocket(
        context.cueBall.pos,
        targetPoint,
        calculator.pockets
      )
    )

    const farKnuckle =
      targetPoint.distanceTo(knuckles[0]) > targetPoint.distanceTo(knuckles[1])
        ? knuckles[0]
        : knuckles[1]

    const farKnuckleAimPoint = calculator.getAimPoint(
      context.cueBall.pos,
      targetPoint,
      [farKnuckle]
    )

    const pocketHitEvent = calculator.generateShot(
      context.table,
      0,
      AimCalculator.DEFAULT_SHOT_POWER,
      aimPoint,
      new Vector3(0, 0, 0)
    )
    const farKnuckleHitEvent = calculator.generateShot(
      context.table,
      0,
      AimCalculator.MAX_SHOT_POWER,
      farKnuckleAimPoint,
      new Vector3(0, -0.3, 0)
    )
    const aimEvent = AimEvent.fromJson(pocketHitEvent.tablejson.aim)
    const farKnuckleAimEvent = AimEvent.fromJson(
      farKnuckleHitEvent.tablejson.aim
    )
    return [aimEvent, farKnuckleAimEvent, farKnuckleHitEvent]
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

  private aimThreeCushion(context: BotShotContext, calculator: AimCalculator, targetBall: Ball): GameEvent[] {
    const overlap = 0.25
    const aimPoint = AimCalculator.ghostBallPosition(context.cueBall.pos, targetBall.pos, overlap)

    console.log("targetBall.id", targetBall?.id)
    console.log("targetBall.pos", targetBall?.pos)
    console.log("cueBall.pos", context.cueBall?.pos)
    console.log("table.shortSerialise()", context.table.shortSerialise())

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
