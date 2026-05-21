import { AimEvent } from "../../../events/aimevent"
import { GameEvent } from "../../../events/gameevent"
import { Vector3 } from "three"
import { AimCalculator } from "../aimcalculator"
import { BotShotContext, BotStrategy } from "../botstrategy"
import { Cushion } from "../../../model/physics/cushion"

type ShotCandidate = {
  overlap: number
  ghostPos: Vector3
  tangent: Vector3
  toLongRail: boolean
}

type ShotCategory = "LongShortLongNatural" | "FallbackRandom"

export class ThreeStrategy implements BotStrategy {
  readonly name = "ThreeStrategy"
  private readonly power: number

  constructor(power: number = AimCalculator.MAX_SHOT_POWER) {
    this.power = power
  }

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
    const candidates: ShotCandidate[] = overlaps.map((overlap) => {
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
      return { overlap, ghostPos, tangent, toLongRail }
    })

    console.log(`[ThreeStrategy] candidates: ${JSON.stringify(candidates)}`)

    // Categorisation phase
    const { category, candidate } = this.categorise(candidates, activeRailY)
    console.log(`[ThreeStrategy] category: ${category}`)

    switch (category) {
      case "LongShortLongNatural":
        return this.handleLongShortLongNatural(candidate!, context, calculator)
      case "FallbackRandom":
      default:
        return this.handleFallbackRandom(candidate!, context, calculator)
    }
  }

  /**
   * Determines the shot category by checking if any candidate trajectory
   * heading away from the anchor rail hits the opposite long cushion on-table.
   */
  private categorise(
    candidates: ShotCandidate[],
    activeRailY: number
  ): { category: ShotCategory; candidate?: ShotCandidate } {
    const oppositeRailY = -activeRailY

    // Find candidates heading away from anchor rail
    const awayFromAnchor = candidates.filter((c) => !c.toLongRail)

    // Check if the trajectory intersects the opposite long rail within table bounds
    const validCandidate = awayFromAnchor.find((c) => {
      if (Math.abs(c.tangent.y) < 1e-6) return false
      const t = (oppositeRailY - c.ghostPos.y) / c.tangent.y
      if (t < 0) return false
      const intersectionPoint = new Vector3(
        c.ghostPos.x + c.tangent.x * t,
        oppositeRailY,
        0
      )
      return Cushion.willBounceLong(intersectionPoint, false)
    })

    if (validCandidate) {
      console.log(
        `[ThreeStrategy] Categorisation: Long cushion associated with anchor is AVAILABLE`
      )
      return { category: "LongShortLongNatural", candidate: validCandidate }
    }

    console.log(
      `[ThreeStrategy] Categorisation: Long cushion associated with anchor is NOT AVAILABLE`
    )
    return { category: "FallbackRandom", candidate: candidates[0] }
  }

  /**
   * Handles the LongShortLongNatural shot: the cue ball deflects away from
   * the anchor rail, hits the opposite long cushion with running side spin,
   * then travels via the short cushion back to the anchor's long cushion.
   */
  private handleLongShortLongNatural(
    best: ShotCandidate,
    context: BotShotContext,
    calculator: AimCalculator
  ): GameEvent[] {
    console.log(`[ThreeStrategy] LongShortLongNatural: overlap=${best.overlap}`)

    // The ball will bounce off the cushion it is heading towards.
    // The inward normal of the target cushion points in the opposite direction.
    const normal = new Vector3(0, best.tangent.y > 0 ? -1 : 1, 0)
    const isClockwise = AimCalculator.isClockwiseSpin(best.tangent, normal)
    const sideSpin = isClockwise ? 0.3 : -0.3

    const shot = calculator.generateShot(
      context.table,
      0,
      this.power,
      best.ghostPos,
      new Vector3(sideSpin, 0, 0)
    )

    return [AimEvent.fromJson(shot.tablejson.aim), shot]
  }

  /**
   * Fallback when no valid long cushion path is available.
   * Aims at the first target ball with some noise and random spin.
   */
  private handleFallbackRandom(
    best: ShotCandidate,
    context: BotShotContext,
    calculator: AimCalculator
  ): GameEvent[] {
    console.log(`[ThreeStrategy] FallbackRandom: using random shot`)

    return this.handleLongShortLongNatural(best, context, calculator)
  }
}
