import { expect } from "chai"
import { HitEvent } from "../../src/controller/controller"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Spectate } from "../../src/controller/spectate"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { Vector3 } from "three"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Session } from "../../src/network/client/session"
import { MessageRelay } from "../../src/network/client/messagerelay"

initDom()

describe("Spectate Controller", () => {
  let container: Container

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    container.isSinglePlayer = false
  })

  it("should update ball state from PlaceBallEvent", () => {
    const ball = container.table.balls[0]
    ball.state = State.InPocket
    ball.pos.set(100, 100, 0)

    const messageRelay: MessageRelay = {
      subscribe: () => {},
      publish: () => {},
      getOnlineCount: () => Promise.resolve(null),
    }
    const spectate = new Spectate(container, messageRelay, "test-table")

    const event = new PlaceBallEvent(new Vector3(10, 0, 0), {
      id: ball.id,
      pos: new Vector3(0, 0, 0),
    })

    const result = spectate.handlePlaceBall(event)

    expect(ball.pos.x).to.equal(0)
    expect(ball.pos.y).to.equal(0)
    expect(ball.state).to.equal(State.Stationary)
    expect(result).to.equal(spectate)
  })

  it("should return this to stay in spectate state", () => {
    const messageRelay: MessageRelay = {
      subscribe: () => {},
      publish: () => {},
      getOnlineCount: () => Promise.resolve(null),
    }
    const spectate = new Spectate(container, messageRelay, "test-table")

    const event = new PlaceBallEvent(new Vector3(10, 0, 0), undefined)

    const result = spectate.handlePlaceBall(event)

    expect(result).to.equal(spectate)
  })

  it("handleHit should update aim input UI", () => {
    const messageRelay: MessageRelay = {
      subscribe: () => {},
      publish: () => {},
      getOnlineCount: () => Promise.resolve(null),
    }
    const spectate = new Spectate(container, messageRelay, "test-table")
    const powerSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updatePowerSlider"
    )
    const visualSpy = jest.spyOn(
      container.table.cue.aimInputs,
      "updateVisualState"
    )

    const tablejson = container.table.serialise()
    tablejson.aim.offset.x = 0.05
    tablejson.aim.offset.y = -0.2
    tablejson.aim.power = container.table.cue.maxPower * 0.25

    spectate.handleHit(new HitEvent(tablejson))

    expect(powerSpy.mock.calls).to.not.be.empty
    expect(visualSpy.mock.calls).to.not.be.empty
    const powerArgs = powerSpy.mock.calls[powerSpy.mock.calls.length - 1]
    const visualArgs = visualSpy.mock.calls[visualSpy.mock.calls.length - 1]
    expect(powerArgs[0]).to.be.approximately(0.25, 0.0001)
    expect(visualArgs[0]).to.be.approximately(0.05, 0.0001)
    expect(visualArgs[1]).to.be.approximately(-0.2, 0.0001)
  })
})
