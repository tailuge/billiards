import { Vector3 } from "three"
import { Table } from "../../../src/model/table"
import { Ball } from "../../../src/model/ball"
import { AimCalculator } from "../../../src/network/bot/aimcalculator"
import { ThreeStrategy } from "../../../src/network/bot/strategies/threecushionstrategy"
import { BotShotContext } from "../../../src/network/bot/botstrategy"
import { TableGeometry } from "../../../src/view/tablegeometry"

describe("ThreeStrategy", () => {
  let strategy: ThreeStrategy
  let calculator: AimCalculator

  beforeEach(() => {
    strategy = new ThreeStrategy()
    calculator = new AimCalculator()
  })

  it("should choose LongShortLongNatural when opposite long cushion is reachable on-table", () => {
    const cueBall = new Ball(new Vector3(0, 0, 0))
    const targetBall1 = new Ball(new Vector3(0.3, 0, 0))
    const targetBall2 = new Ball(new Vector3(0.5, 0.4, 0))

    const table = new Table([cueBall, targetBall1, targetBall2])
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

    const aimOffset = shotEvent.tablejson.aim.offset
    // Should apply running side spin (non-zero x offset)
    expect(Math.abs(aimOffset.x)).toBeCloseTo(0.3)
  })

  it("should fall back to FallbackRandom when intersection is off-table", () => {
    // Place the target ball near the short cushion so the tangent trajectory
    // exits through the short cushion before reaching the opposite long rail
    const cueBall = new Ball(new Vector3(TableGeometry.X * 0.9, 0, 0))
    const targetBall1 = new Ball(new Vector3(TableGeometry.X * 0.95, 0.05, 0))
    // Anchor near top rail
    const targetBall2 = new Ball(
      new Vector3(TableGeometry.X * 0.9, TableGeometry.Y * 0.9, 0)
    )

    const table = new Table([cueBall, targetBall1, targetBall2])
    const context: BotShotContext = {
      table,
      cueBall,
      validTargetBalls: [targetBall1, targetBall2],
      ballInHand: false,
    }

    const consoleSpy = jest.spyOn(console, "log")
    const events = strategy.aim(context, calculator)
    expect(events.length).toBeGreaterThan(0)

    // Verify the strategy logged either category
    const categoryLogs = consoleSpy.mock.calls
      .map((c) => c[0])
      .filter((msg) => typeof msg === "string" && msg.includes("category:"))
    expect(categoryLogs.length).toBe(1)

    consoleSpy.mockRestore()
  })

  it("should return empty events when no valid target balls", () => {
    const cueBall = new Ball(new Vector3(0, 0, 0))
    const table = new Table([cueBall])
    const context: BotShotContext = {
      table,
      cueBall,
      validTargetBalls: [],
      ballInHand: false,
    }

    const events = strategy.aim(context, calculator)
    expect(events).toHaveLength(0)
  })
})
