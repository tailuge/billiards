import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { WatchShot } from "../../src/controller/watchshot"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { WatchEvent } from "../../src/events/watchevent"
import { HitEvent } from "../../src/events/hitevent"
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

  it("should display opponent shot in ballTray on handleStationary", () => {
    container.recorder.record(new HitEvent(container.table.serialiseHit()))
    const watchShot = new WatchShot(container)
    expect(container.ballTray.entries).to.have.lengthOf(0)

    watchShot.handleStationary(null)
    expect(container.ballTray.entries).to.have.lengthOf(1)
    expect(container.ballTray.entries[0].icon).to.equal("⊙")
  })

  it("should display opponent shot in ballTray on handleStartAim if handleStationary was bypassed", () => {
    container.recorder.record(new HitEvent(container.table.serialiseHit()))
    const watchShot = new WatchShot(container)
    expect(container.ballTray.entries).to.have.lengthOf(0)

    watchShot.handleStartAim(null)
    expect(container.ballTray.entries).to.have.lengthOf(1)
    expect(container.ballTray.entries[0].icon).to.equal("⊙")
  })

  it("should display opponent shot exactly once even if both handleStationary and handleWatch run", () => {
    container.recorder.record(new HitEvent(container.table.serialiseHit()))
    const watchShot = new WatchShot(container)
    expect(container.ballTray.entries).to.have.lengthOf(0)

    watchShot.handleStationary(null)
    watchShot.handleWatch(new WatchEvent(container.table.serialise()))

    expect(container.ballTray.entries).to.have.lengthOf(1)
    expect(container.ballTray.entries[0].icon).to.equal("⊙")
  })
})
