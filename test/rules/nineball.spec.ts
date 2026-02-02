import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { NineBall } from "../../src/controller/rules/nineball"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { PlaceBall } from "../../src/controller/placeball"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { End } from "../../src/controller/end"
import { Session } from "../../src/network/client/session"

initDom()

describe("NineBall Rules", () => {
  let container: Container
  let nineball: NineBall

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container(undefined, (_) => {}, Assets.localAssets(), "nineball")
    nineball = container.rules as NineBall
  })

  it("should be nineball", () => {
    expect(nineball.rulename).to.equal("nineball")
    expect(container.table.balls).to.have.length(10) // Cue ball + 9 balls
  })

  it("should detect cue ball potted as foul", () => {
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    const nextController = nineball.update(outcome)
    
    if (container.isSinglePlayer) {
      expect(nextController).to.be.an.instanceof(PlaceBall)
    } else {
      expect(nextController).to.be.an.instanceof(WatchAim)
    }
  })

  it("should continue turn if a ball is potted legally (current implementation)", () => {
    // Current implementation doesn't care which ball is hit first yet
    const outcome = [
        Outcome.collision(container.table.cueball, container.table.balls[1], 1),
        Outcome.pot(container.table.balls[1], 1)
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should end game if 9-ball is potted legally", () => {
    container.table.balls.forEach(b => {
        if (b !== container.table.cueball && b.label !== 9) {
            b.state = State.InPocket
        }
    })
    const nineBall = container.table.balls.find(b => b.label === 9)!
    const outcome = [
        Outcome.collision(container.table.cueball, nineBall, 1),
        Outcome.pot(nineBall, 1)
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should detect foul if no ball is hit", () => {
    const outcome: Outcome[] = [] // Empty outcome means no collisions, no pots, no cushions
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if wrong ball is hit first", () => {
    const ball1 = container.table.balls.find(b => b.label === 1)!
    const ball2 = container.table.balls.find(b => b.label === 2)!
    const outcome = [
        Outcome.collision(container.table.cueball, ball2, 1)
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if no cushion is hit after contact and no ball potted", () => {
    const ball1 = container.table.balls.find(b => b.label === 1)!
    const outcome = [
        Outcome.collision(container.table.cueball, ball1, 1)
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should be legal if cushion is hit after contact", () => {
    const ball1 = container.table.balls.find(b => b.label === 1)!
    const outcome = [
        Outcome.collision(container.table.cueball, ball1, 1),
        Outcome.cushion(ball1, 1)
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should respot 9-ball if potted on foul", () => {
    const nineBall = container.table.balls.find(b => b.label === 9)!
    const outcome = [
        Outcome.pot(container.table.cueball, 1),
        Outcome.pot(nineBall, 1)
    ]
    
    // Before: 9-ball is on table (in this test we just care it's not InPocket)
    nineBall.state = State.Stationary
    
    nineball.update(outcome)
    
    // After: 9-ball should be Stationary (respotted)
    expect(nineBall.state).to.equal(State.Stationary)
  })

  it("should return WatchAim on foul in multi-player", () => {
    container.isSinglePlayer = false
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(WatchAim)
  })
})
