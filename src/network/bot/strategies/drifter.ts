import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Ball } from "../../../model/ball"
import { Vector3 } from "three"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"
import { TableGeometry } from "../../../view/tablegeometry"
import { ThreeStrategy } from "./threecushionstrategy"

export class Drifter implements BotStrategy {
  readonly name = "Drifter"

  private static readonly CONTROL_POWER = AimCalculator.DEFAULT_SHOT_POWER * 0.65
  private static readonly MAX_POWER = AimCalculator.DEFAULT_SHOT_POWER * 0.85
  private static readonly CENTER_BIAS = 0.3

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    if (!TableGeometry.hasPockets) {
      return new ThreeStrategy(Drifter.CONTROL_POWER).aim(
        context,
        calculator
      )
    }

    const targetBall = this.pickTargetBall(context)
    if (!targetBall) {
      return []
    }

    const pocket = calculator.findBestPocket(
      context.cueBall.pos,
      targetBall.pos,
      calculator.pockets
    )
    const aimPoint = calculator.getAimPoint(
      context.cueBall.pos,
      targetBall.pos,
      calculator.pockets
    )

    if (!aimPoint) {
      return []
    }

    const power = this.calculatePower(
      context.cueBall.pos,
      targetBall.pos,
      pocket
    )
    const spin = this.calculatePositionSpin(
      context.cueBall.pos,
      targetBall.pos,
      pocket
    )

    const hitEvent = calculator.generateShot(
      context.table,
      0.03,
      power,
      aimPoint,
      spin
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
  }

  private calculatePower(
    cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3
  ): number {
    const dist = cuePos.distanceTo(targetPos) + targetPos.distanceTo(pocket)
    const maxDist = TableGeometry.tableX * 2 + TableGeometry.tableY * 2
    const ratio = Math.min(dist / maxDist, 1)
    return Drifter.CONTROL_POWER + ratio * (Drifter.MAX_POWER - Drifter.CONTROL_POWER)
  }

  private calculatePositionSpin(
    _cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3
  ): Vector3 {
    const center = new Vector3(0, 0, 0)
    const targetToPocket = new Vector3().subVectors(pocket, targetPos).normalize()
    const targetToCenter = new Vector3().subVectors(center, targetPos).normalize()
    const dot = targetToPocket.dot(targetToCenter)

    const sideAmount = Math.max(0, dot) * 0.15
    const drawAmount = -0.15

    return new Vector3(sideAmount, drawAmount, 0)
  }

  private pickTargetBall(context: BotShotContext): Ball | undefined {
    if (context.validTargetBalls.length === 0) {
      return undefined
    }

    const scored = context.validTargetBalls
      .filter((b) => b.onTable())
      .map((b) => ({
        ball: b,
        centerDist: b.pos.length(),
        cueDist: context.cueBall.pos.distanceTo(b.pos),
      }))
      .sort(
        (a, b) =>
          a.cueDist * (1 - Drifter.CENTER_BIAS) +
          a.centerDist * Drifter.CENTER_BIAS -
          (b.cueDist * (1 - Drifter.CENTER_BIAS) +
            b.centerDist * Drifter.CENTER_BIAS)
      )

    return scored[0]?.ball
  }
}
