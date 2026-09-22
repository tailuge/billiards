import { expect } from "chai"
import { Vector3 } from "three"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { Reveal } from "../../src/controller/rules/reveal"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { Aim } from "../../src/controller/aim"
import { End } from "../../src/controller/end"
import { Session } from "../../src/network/client/session"

initDom()

function initReveal(): { container: Container; reveal: Reveal } {
  Ball.id = 0
  Session.reset()
  Session.init("test-client", "TestPlayer", "test-table", false, false, false)
  const container = new Container({
    element: undefined,
    log: (_: any) => {},
    assets: Assets.localAssets(),
    ruletype: "reveal",
  })
  const reveal = container.rules as Reveal
  return { container, reveal }
}

describe("Reveal Rules", () => {
  let container: Container
  let reveal: Reveal

  beforeEach(() => {
    ;({ container, reveal } = initReveal())
  })

  afterEach(() => {
    Session.reset()
  })

  it("should be reveal with an eightball rack", () => {
    expect(reveal.rulename).to.equal("reveal")
    expect(container.table.balls).to.have.length(16)
  })

  it("should score one point for every ball potted", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
      Outcome.pot(ball9, 1),
    ]

    const nextController = reveal.update(outcome)

    expect(Session.getInstance().myScore()).to.equal(2)
    expect(reveal.currentBreak).to.equal(2)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should aim at the closest ball", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const ball9 = container.table.balls.find((b) => b.label === 9)!
    const cueball = container.table.cueball
    ball1.pos.copy(cueball.pos).add(new Vector3(1, 0, 0))
    ball9.pos.copy(cueball.pos).add(new Vector3(5, 0, 0))

    expect(reveal.nextCandidateBall()).to.equal(ball1)
  })

  it("should ignore fouls", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]

    expect(reveal.foulReason(outcome)).to.be.null
    expect(reveal.update(outcome)).to.be.an.instanceof(Aim)
  })

  it("should respot a potted cue ball without a foul", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(container.table.cueball, 1),
    ]

    expect(reveal.update(outcome)).to.be.an.instanceof(PlaceBall)
  })

  it("should win when all balls are potted", () => {
    const lastBall = container.table.balls.find((b) => b.label === 15)!
    container.table.balls.forEach((b) => {
      if (b !== container.table.cueball && b !== lastBall) {
        b.state = State.InPocket
      }
    })
    const outcome = [
      Outcome.collision(container.table.cueball, lastBall, 1),
      Outcome.pot(lastBall, 1),
    ]

    expect(reveal.isEndOfGame(outcome)).to.be.true
    expect(reveal.update(outcome)).to.be.an.instanceof(End)
    expect(Session.getInstance().myScore()).to.equal(1)
  })
})
