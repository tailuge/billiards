import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { WatchShot } from "../../src/controller/watchshot"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { WatchEvent } from "../../src/events/watchevent"
import { Vector3 } from "three"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Session } from "../../src/network/client/session"

initDom()

describe("WatchShot Controller", () => {
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

    const watchShot = new WatchShot(container)

    const newPos = new Vector3(0, 0, 0)
    const event = new PlaceBallEvent(new Vector3(10, 0, 0), {
      id: ball.id,
      pos: newPos,
    })

    watchShot.handlePlaceBall(event)

    expect(ball.pos.x).to.equal(0)
    expect(ball.pos.y).to.equal(0)
    expect(ball.state).to.equal(State.Stationary)
  })

  it("should update ball state from WatchEvent (Snooker Respot)", () => {
    const ball = container.table.balls[0]
    ball.state = State.InPocket
    ball.pos.set(100, 100, 0)

    const watchShot = new WatchShot(container)

    const newPos = new Vector3(0, 0, 0)
    const event = new WatchEvent({
      balls: [{ id: ball.id, pos: newPos }],
      rerack: true,
    })

    watchShot.handleWatch(event)

    expect(ball.pos.x).to.equal(0)
    expect(ball.pos.y).to.equal(0)
    expect(ball.state).to.equal(State.Stationary)
  })
})
