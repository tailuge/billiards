import { Vector3 } from "three"
import { Table } from "../../../src/model/table"
import { Ball } from "../../../src/model/ball"
import { AimCalculator } from "../../../src/network/bot/aimcalculator"
import { ThreeStrategy } from "../../../src/network/bot/strategies/threecushionstrategy"
import { BotShotContext } from "../../../src/network/bot/botstrategy"

describe("ThreeStrategy", () => {
  let table: Table
  let cueBall: Ball
  let targetBall1: Ball
  let targetBall2: Ball
  let strategy: ThreeStrategy
  let calculator: AimCalculator

  beforeEach(() => {
    cueBall = new Ball(new Vector3(0, 0, 0))
    targetBall1 = new Ball(new Vector3(0.3, 0, 0)) // First object ball, in front of cue ball
    targetBall2 = new Ball(new Vector3(0.5, 0.4, 0)) // Anchor ball, near the top rail (Y ~ 0.6)

    table = new Table([cueBall, targetBall1, targetBall2])
    strategy = new ThreeStrategy()
    calculator = new AimCalculator()
  })

  it("should choose the trajectory moving away from the anchor rail and apply running side spin", () => {
    const context: BotShotContext = {
      table,
      cueBall,
      validTargetBalls: [targetBall1, targetBall2],
      ballInHand: false,
    }

    const events = strategy.aim(context, calculator)
    expect(events.length).toBeGreaterThan(0)

    const shotEvent = events.find((e) => e.type === "HIT") as any
    expect(shotEvent).toBeDefined()

    // In this configuration:
    // Anchor ball (targetBall2) is near the top rail (Y > 0).
    // The first target ball (targetBall1) is in front of the cue ball.
    // The candidate trajectories from targetBall1:
    // - One deflecting upwards towards the top rail (towards the anchor).
    // - One deflecting downwards towards the bottom rail (away from the anchor).
    // Under the fixed logic:
    // 1. It should choose the downward trajectory (tangent.y < 0).
    // 2. The target cushion is the bottom cushion (normal = (0, 1, 0)).
    // 3. For a ball moving downwards and to the right, to apply running side spin at the bottom cushion,
    //    it needs clockwise spin (w.z < 0).
    // 4. In cueStrike, a positive offset.x (0.3) translates to w.z < 0 (clockwise spin).
    // Therefore, the sideSpin should be 0.3.
    const aimOffset = shotEvent.tablejson.aim.offset
    expect(aimOffset.x).toBeCloseTo(0.3)
  })
})
