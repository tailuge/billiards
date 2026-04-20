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
import { WatchAim } from "../../src/controller/watchaim"

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

  const testAssignment = (
    ballLabel: number,
    activePlayer: number,
    expectedP1Type: number
  ) => {
    if (activePlayer === 2) {
      container.updateController(new WatchAim(container))
    }
    const ball = container.table.balls.find((b) => b.label === ballLabel)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball, 1),
      Outcome.pot(ball, 1),
    ]
    eightball.update(outcome)
    expect(Session.getInstance().p1type).to.equal(expectedP1Type)
  }

  it("should assign solids if only solids are potted", () => {
    testAssignment(1, 1, 1) // P1 pots solid -> P1 type 1
    expect(Session.getInstance().p1type).to.equal(1)
  })

  it("should assign stripes if only stripes are potted", () => {
    testAssignment(9, 1, 2) // P1 pots stripe -> P1 type 2
    expect(Session.getInstance().p1type).to.equal(2)
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

  it("should lose if 8-ball potted on open table", () => {
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.collision(container.table.cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
    ]
    expect(eightball.isEndOfGame(outcome)).to.be.false
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
    // Here we should ideally verify that it was a loss, e.g. by checking notification title
    // but the test as-is confirms it's not a win according to isEndOfGame.
  })

  it("should lose if 8-ball potted on foul", () => {
    const eightBall = container.table.balls.find((b) => b.label === 8)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(eightBall, 1),
    ]
    const nextController = eightball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
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

  describe("2-Player Rules", () => {
    it("should assign p1type=2 if Player 2 pots solids on open table", () => {
      testAssignment(1, 2, 2) // P2 pots solid -> P1 type 2
      expect(Session.getInstance().p1type).to.equal(2)
    })

    it("should assign p1type=1 if Player 2 pots stripes on open table", () => {
      testAssignment(9, 2, 1) // P2 pots stripe -> P1 type 1
      expect(Session.getInstance().p1type).to.equal(1)
    })

    it("should foul if Player 2 hits wrong group", () => {
      Session.getInstance().p1type = 1 // P1: Solids, P2: Stripes
      container.updateController(new WatchAim(container))

      const ball1 = container.table.balls.find((b) => b.label === 1)! // Solid
      const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
      const nextController = eightball.update(outcome)
      expect(nextController).to.be.an.instanceof(PlaceBall)
      expect(eightball.foulReason(outcome)).to.equal("Wrong group hit first")
    })

    it("should win if Player 2 pots 8-ball after clearing group", () => {
      Session.getInstance().p1type = 1 // P1: Solids, P2: Stripes
      // Clear Player 2's group (Stripes 9-15)
      container.table.balls.forEach((b) => {
        if ((b.label || 0) >= 9 && (b.label || 0) <= 15) {
          b.state = State.InPocket
        }
      })
      container.updateController(new WatchAim(container))

      const eightBall = container.table.balls.find((b) => b.label === 8)!
      const outcome = [
        Outcome.collision(container.table.cueball, eightBall, 1),
        Outcome.pot(eightBall, 1),
      ]
      expect(eightball.isEndOfGame(outcome)).to.be.true
      const nextController = eightball.update(outcome)
      expect(nextController).to.be.an.instanceof(End)
    })

    it("should lose if Player 2 pots 8-ball early", () => {
      Session.getInstance().p1type = 1 // P1: Solids, P2: Stripes
      container.updateController(new WatchAim(container))

      const eightBall = container.table.balls.find((b) => b.label === 8)!
      const outcome = [
        Outcome.collision(container.table.cueball, eightBall, 1),
        Outcome.pot(eightBall, 1),
      ]
      expect(eightball.isEndOfGame(outcome)).to.be.false
      const nextController = eightball.update(outcome)
      expect(nextController).to.be.an.instanceof(End)
    })
  })
})
