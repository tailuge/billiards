import { expect } from "chai"
import { Vector3 } from "three"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { isFirstShot } from "../../src/utils/utils"
import { EightBall } from "../../src/controller/rules/eightball"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { End } from "../../src/controller/end"
import { Session } from "../../src/network/client/session"
import { ScoreEvent } from "../../src/events/scoreevent"

initDom()

function initEightBall(): {
  container: Container
  eightball: EightBall
} {
  Ball.id = 0
  Session.reset()
  Session.init("test-client", "TestPlayer", "test-table", false, false, false)
  const container = new Container({
    element: undefined,
    log: (_: any) => {},
    assets: Assets.localAssets(),
    ruletype: "eightball",
  })
  const eightball = container.rules as EightBall
  return { container, eightball }
}

describe("EightBall Rules", () => {
  let container: Container
  let eightball: EightBall

  beforeEach(() => {
    ;({ container, eightball } = initEightBall())
  })

  afterEach(() => {
    Session.reset()
  })

  it("should be eightball", () => {
    expect(eightball.rulename).to.equal("eightball")
    expect(container.table.balls).to.have.length(16) // Cue ball + 15 balls
  })

  it("should have open table initially", () => {
    expect(Session.getInstance().p1type).to.equal(0)
  })

  it("should detect foul if 8-ball hit first on open table", () => {
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [Outcome.collision(container.table.cueball, eightBall, 1)]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
    expect(eightball.foulReason(outcome)).to.equal(
      "Hitting the 8-ball first is a foul"
    )
  })

  it("should assign solids if only solids are potted", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
    ]
    eightball.update(outcome)
    expect(Session.getInstance().p1type).to.equal(1) // Solids
  })

  it("should assign stripes if only stripes are potted", () => {
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball9, 1),
      Outcome.pot(ball9, 1),
    ]
    eightball.update(outcome)
    expect(Session.getInstance().p1type).to.equal(2) // Stripes
  })

  it("should remain open if both solid and stripe are potted", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
      Outcome.pot(ball9, 1),
    ]
    eightball.update(outcome)
    expect(Session.getInstance().p1type).to.equal(0)
  })

  it("should foul if wrong group hit first after assignment", () => {
    Session.getInstance().p1type = 1 // Solids
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    const outcome = [Outcome.collision(container.table.cueball, ball9, 1)]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
    expect(eightball.foulReason(outcome)).to.equal("Wrong group hit first")
  })

  it("should foul if no cushion hit and no pot", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should respot 8-ball and give ball in hand if 8-ball potted early", () => {
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(eightBall, 1),
    ]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
    expect(eightBall.onTable()).to.be.true
  })

  it("should win if 8-ball potted after clearing group", () => {
    Session.getInstance().p1type = 1 // Solids
    // Clear solids
    container.table.balls.forEach((b) => {
      if ((b.label || 0) >= 1 && (b.label || 0) <= 7) {
        b.state = State.InPocket
      }
    })
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.collision(container.table.cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
    ]
    expect(eightball.isEndOfGame(outcome)).to.be.true
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should lose if 8-ball potted on open table with no other balls remaining", () => {
    // Clear all non-8-ball, non-cue balls so it's a valid end-game foul
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 8) {
        b.state = State.InPocket
      }
    })
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.collision(container.table.cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
    ]
    expect(eightball.isEndOfGame(outcome)).to.be.false
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should lose if 8-ball potted on foul with no other balls remaining", () => {
    Session.getInstance().p1type = 1
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 8) {
        b.state = State.InPocket
      }
    })
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(eightBall, 1),
    ]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should respot 8-ball and give ball in hand if cue ball and 8-ball both potted with other balls remaining", () => {
    Session.getInstance().p1type = 1 // Solids assigned
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    // Leave some solids and stripes on the table
    const outcome = [
      Outcome.collision(container.table.cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
      Outcome.pot(container.table.cueball, 1),
    ]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
    expect(eightBall.onTable()).to.be.true
  })

  it("should lose if cue ball and 8-ball both potted with only those two on table", () => {
    Session.getInstance().p1type = 1 // Solids assigned
    // Remove all balls except cue ball and 8-ball
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 8) {
        b.state = State.InPocket
      }
    })
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.collision(container.table.cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
      Outcome.pot(container.table.cueball, 1),
    ]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
    expect(eightball.isEndOfGame(outcome)).to.be.false // foul means no win
  })

  it("should allow placeBall anywhere on the table after a foul", () => {
    // Simulate it's NOT the first shot
    container.recorder.record({ type: "PLACEBALL" } as any)
    container.recorder.record({
      type: "HIT",
      tablejson: { aim: { pos: { x: 0, y: 0 } } },
    } as any)
    // Manually force an AIM type entry if recorder doesn't do it automatically from HIT
    container.recorder.entries.push({ event: { type: "AIM" } } as any)
    expect(isFirstShot(container.recorder)).to.be.false

    const pos = new Vector3(1, 0, 0) // Beyond the kitchen (which is at -0.72)
    const result = eightball.placeBall(pos)
    expect(result.x).to.equal(1)
  })

  it("should broadcast ScoreEvent with p1type", () => {
    const sentEvents: any[] = []
    container.broadcast = (event) => sentEvents.push(event)

    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
    ]
    eightball.update(outcome)

    const scoreEvents = sentEvents.filter((e) => e instanceof ScoreEvent)
    expect(scoreEvents).to.have.length(1)
    expect(scoreEvents[0].p1type).to.equal(1)
  })

  it("nextCandidateBall should return group ball", () => {
    Session.getInstance().p1type = 1 // Solids
    const candidate = eightball.nextCandidateBall()
    expect(candidate?.label).to.be.at.least(1).and.at.most(7)
  })

  describe("getAmountScored", () => {
    it("returns 0 when no balls potted", () => {
      const ball1 = container.table.balls.find((b) => b.label === 1)!
      const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
      expect(eightball.getAmountScored(outcome)).to.equal(0)
    })

    it("returns pot count when balls are potted", () => {
      const ball1 = container.table.balls.find((b) => b.label === 1)!
      const ball9 = container.table.balls.find((b) => b.label === 9)!
      const outcome = [
        Outcome.collision(container.table.cueball, ball1, 1),
        Outcome.pot(ball1, 1),
        Outcome.pot(ball9, 1),
      ]
      expect(eightball.getAmountScored(outcome)).to.equal(2)
    })
  })

  it("nextCandidateBall should return 8-ball if group cleared", () => {
    Session.getInstance().p1type = 1 // Solids
    container.table.balls.forEach((b) => {
      if ((b.label || 0) >= 1 && (b.label || 0) <= 7) {
        b.state = State.InPocket
      }
    })
    const candidate = eightball.nextCandidateBall()
    expect(candidate?.label).to.equal(8)
  })
})
