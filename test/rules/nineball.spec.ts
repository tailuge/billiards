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

import { PlaceBallEvent } from "../../src/events/placeballevent"

initDom()

describe("NineBall Rules", () => {
  let container: Container
  let nineball: NineBall

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets(),
      "nineball"
    )
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

  it("should continue turn if a ball is potted legally", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(ball1, 1),
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should end game if 9-ball is potted legally", () => {
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
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(End)
  })

  it("should detect foul if no ball is hit", () => {
    const outcome: Outcome[] = [] // Empty outcome means no collisions, no pots, no cushions
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if wrong ball is hit first", () => {
    const ball2 = container.table.balls.find((b) => b.label === 2)!
    const outcome = [Outcome.collision(container.table.cueball, ball2, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should detect foul if no cushion is hit after contact and no ball potted", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(PlaceBall)
  })

  it("should be legal if cushion is hit after contact", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.cushion(ball1, 1),
    ]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(Aim)
  })

  it("should respot 9-ball if potted on foul", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]

    // Before: 9-ball is on table (in this test we just care it's not InPocket)
    nineBall.state = State.Stationary

    nineball.update(outcome)

    // After: 9-ball should be Stationary (respotted)
    expect(nineBall.state).to.equal(State.Stationary)
  })

  it("should send PlaceBallEvent with respot data when 9-ball is respotted in multiplayer", () => {
    container.isSinglePlayer = false
    const sentEvents: any[] = []
    container.broadcast = (event) => {
      sentEvents.push(event)
    }

    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]

    nineball.update(outcome)

    const placeBallEvents = sentEvents.filter(
      (e) => e instanceof PlaceBallEvent
    )
    expect(placeBallEvents).to.have.length(1)
    const event = placeBallEvents[0] as PlaceBallEvent
    expect(event.respot).to.not.be.undefined
    expect(event.respot!.id).to.equal(nineBall.id)
  })

  it("should return WatchAim on foul in multi-player", () => {
    container.isSinglePlayer = false
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    const nextController = nineball.update(outcome)
    expect(nextController).to.be.an.instanceof(WatchAim)
  })

  it("should not end game if 9-ball is potted on foul", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.pot(container.table.cueball, 1),
      Outcome.pot(nineBall, 1),
    ]
    expect(nineball.isEndOfGame(outcome)).to.be.false
  })

  it("should end game if 9-ball is potted legally (isEndOfGame check)", () => {
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    const outcome = [
      Outcome.collision(container.table.cueball, ball1, 1),
      Outcome.pot(nineBall, 1),
    ]
    expect(nineball.isEndOfGame(outcome)).to.be.true
  })

  it("should trigger specific foul notification on cue ball potted", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const outcome = [Outcome.pot(container.table.cueball, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "Foul!",
      subtext: "Cue ball potted",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on no ball hit", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const outcome: Outcome[] = []
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "Foul!",
      subtext: "No ball hit",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on wrong ball hit first", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const ball2 = container.table.balls.find((b) => b.label === 2)!
    const outcome = [Outcome.collision(container.table.cueball, ball2, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "Foul!",
      subtext: "Wrong ball hit first",
      extra: "Ball in hand",
    })
  })

  it("should trigger specific foul notification on no cushion after contact", () => {
    const notifySpy = jest.spyOn(container, "notify")
    const ball1 = container.table.balls.find((b) => b.label === 1)!
    const outcome = [Outcome.collision(container.table.cueball, ball1, 1)]
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "Foul",
      title: "Foul!",
      subtext: "No cushion after contact",
      extra: "Ball in hand",
    })
  })

  it("should trigger game over notification", () => {
    const notifySpy = jest.spyOn(container, "notify")
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
    nineball.update(outcome)
    expect(notifySpy.mock.calls[0][0]).to.deep.equal({
      type: "GameOver",
      title: "Game Over!",
      subtext: "You won!",
      extra: `<button onclick="location.reload()">New Game</button>
<a href="https://scoreboard-tailuge.vercel.app/" class="button">Lobby</a>`,
      duration: 10000,
    })
  })
})
