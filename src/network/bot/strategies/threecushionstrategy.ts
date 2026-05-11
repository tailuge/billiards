import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Vector3 } from "three"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"

export class ThreeStrategy implements BotStrategy {
  readonly name = "ThreeStrategy"

  aim(context: BotShotContext, calculator: AimCalculator): GameEvent[] {
    if (context.validTargetBalls.length === 0) {
      return []
    }

    const anchorBall = AimCalculator.findAnchor(context.validTargetBalls)
    const targetBall =
      context.validTargetBalls.find((b) => b !== anchorBall) ||
      context.validTargetBalls[0]
    const activeRailY = AimCalculator.getActiveRailY(anchorBall.pos)

    const ballNames = ["white", "yellow", "red"]
    const cueBallId = context.table.balls.indexOf(context.cueBall)
    const targets = context.validTargetBalls.map((b) => {
      const id = context.table.balls.indexOf(b)
      return `${id}-${ballNames[id]}`
    })
    console.log(
      `[ThreeStrategy] turn: cueball=${cueBallId}-${
        ballNames[cueBallId]
      }, targets=[${targets.join(", ")}], anchor=${ballNames[anchorBall.id]}, (Ypos=${anchorBall.pos.y}) activeRailY=${activeRailY}`
    )

    const overlaps = [0.25, -0.25]
    const candidates = overlaps.map((overlap) => {
      const ghostPos = AimCalculator.ghostBallPosition(
        context.cueBall.pos,
        targetBall.pos,
        overlap
      )
      const tangent = AimCalculator.getTangentVector(
        context.cueBall.pos,
        targetBall.pos,
        ghostPos
      )
      const toLongRail = AimCalculator.isHeadingToRail(
        ghostPos,
        tangent,
        activeRailY
      )
      return { overlap, ghostPos, toLongRail }
    })

    console.log(
      `[ThreeStrategy] candidates: ${JSON.stringify(candidates)}`
    )

    const [s1, s2] = candidates
    const best = !s1.toLongRail && s2.toLongRail ? s2 : s1
    console.log(
      `[ThreeStrategy] best: overlap=${best.overlap}, ghostPos=${best.ghostPos}, toLongRail=${best.toLongRail}`
    )

    const shot = calculator.generateShot(
      context.table,
      0,
      AimCalculator.MAX_SHOT_POWER,
      best.ghostPos,
      new Vector3(Math.sign(best.overlap) * 0.3, 0, 0)
    )

    return [AimEvent.fromJson(shot.tablejson.aim), shot]
  }
}
