import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { NineBall } from "../../src/controller/rules/nineball"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { Aim } from "../../src/controller/aim"
import { Session } from "../../src/network/client/session"
import { RerackEvent } from "../../src/events/rerackevent"

initDom()

describe("NineBall Practice Mode Rules", () => {
  let container: Container
  let nineball: NineBall

  beforeEach(() => {
    Ball.id = 0
    // Initialize session with practiceMode = true
    Session.init("test-client", "TestPlayer", "test-table", false, false, true)
    container = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    nineball = container.rules as NineBall
  })

  afterEach(() => {
    Session.reset()
  })

  it("should be in practice mode", () => {
    expect(Session.isPracticeMode()).to.be.true
  })

  it("should allow hitting any ball 1-8 first", () => {
    const ball2 = container.table.balls.find((b) => b.label === 2)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball2, 1),
      Outcome.cushion(ball2, 1),
    ]
    const nextController = nineball.update(outcome)
    // In normal mode, this would be a foul (PlaceBall), but in practice mode it's legal (Aim)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should still foul if 9-ball hit first while other balls remain", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [Outcome.collision(container.table.cueball, nineBall, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
    // Foul reason should be "Wrong ball hit first"
    const reason = NineBall.foulReason(container.table, outcome)
    expect(reason).to.equal("Wrong ball hit first")
  })

  it("should not end game if 9-ball is potted early", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(nineBall, 1),
    ]
    expect(nineball.isEndOfGame(outcome)).to.be.false
  })

  it("should respot 9-ball if potted early on a legal shot", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(nineBall, 1),
    ]

    const sentEvents: any[] = []
    container.broadcast = (event) => {
      sentEvents.push(event)
    }

    const nextController = nineball.update(outcome)

    // Should continue turn
    expect(nextController).to.be.an.instanceof(Aim)
    // 9-ball should be back on table
    expect(nineBall.state).to.equal(State.Stationary)
    // RerackEvent should have been sent for the respot
    const rerackEvents = sentEvents.filter((e) => e instanceof RerackEvent)
    expect(rerackEvents).to.have.length(1)
  })

  it("should end game if 9-ball is potted last", () => {
    // Pocket all balls except cue and 9
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b.label !== 9) {
        b.state = State.InPocket
      }
    })

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, nineBall, 1),
      Outcome.pot(nineBall, 1),
    ]

    expect(nineball.isEndOfGame(outcome)).to.be.true
  })
})
