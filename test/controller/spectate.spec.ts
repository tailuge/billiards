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
import { maxPower } from "../../src/model/physics/constants"
import { ScoreEvent } from "../../src/events/scoreevent"
import { NotificationEvent } from "../../src/events/notificationevent"
import { EventUtil } from "../../src/events/eventutil"
import { End } from "../../src/controller/end"
import { ThreeCushionConfig } from "../../src/utils/threecushionconfig"

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
    tablejson.aim.power = maxPower * 0.25

    spectate.handleHit(new HitEvent(tablejson))

    expect(powerSpy.mock.calls).to.not.be.empty
    expect(visualSpy.mock.calls).to.not.be.empty
    const powerArgs = powerSpy.mock.calls[powerSpy.mock.calls.length - 1]
    const visualArgs = visualSpy.mock.calls[visualSpy.mock.calls.length - 1]
    expect(powerArgs[0]).to.be.approximately(0.25, 0.0001)
    expect(visualArgs[0]).to.be.approximately(0.05, 0.0001)
    expect(visualArgs[1]).to.be.approximately(-0.2, 0.0001)
  })

  it("does not end the spectated game when the score reaches the local target", () => {
    Session.reset()
    Session.init("spec-client", "Spec", "test-table", true)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })
    container.isSinglePlayer = false
    const messageRelay: MessageRelay = {
      subscribe: () => {},
      publish: () => {},
    }
    const spectate = new Spectate(container, messageRelay, "test-table")
    const target = ThreeCushionConfig.raceTo
    const result = spectate.handleScore(new ScoreEvent(target, 3, 0))
    expect(result).to.equal(spectate)
    expect(result).to.not.be.an.instanceof(End)
    expect(result.name).to.equal("Spectate")
  })

  it("forwards broadcast GameOver notifications to the event queue", () => {
    Session.reset()
    Session.init("spec-client", "Spec", "test-table", true)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })
    container.isSinglePlayer = false
    let callback: (message: string) => void = () => {}
    const messageRelay: MessageRelay = {
      subscribe: (_tableId, cb) => {
        callback = cb
      },
      publish: () => {},
    }
    new Spectate(container, messageRelay, "test-table")
    const broadcast = new NotificationEvent({
      type: "GameOver",
      title: "YOU LOST",
      share: true,
      duration: 0,
    })
    callback(EventUtil.serialise(broadcast))
    const queued = container.eventQueue.filter(
      (event) => event instanceof NotificationEvent
    ) as NotificationEvent[]
    expect(queued).to.have.lengthOf(1)
    const data = queued[0].data
    expect(typeof data).to.not.equal("string")
    if (typeof data !== "string") {
      expect(data.type).to.equal("GameOver")
    }
  })

  it("shows the spectator banner once for duplicate GameOver broadcasts", () => {
    Session.reset()
    Session.init("spec-client", "Spec", "test-table", true)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })
    container.isSinglePlayer = false
    const messageRelay: MessageRelay = {
      subscribe: () => {},
      publish: () => {},
    }
    const spectate = new Spectate(container, messageRelay, "test-table")
    const showSpy = jest.spyOn(container.notification, "show")
    const first = new NotificationEvent({
      type: "GameOver",
      title: "YOU LOST",
      share: true,
      duration: 0,
    })
    const second = new NotificationEvent({
      type: "GameOver",
      title: "YOU WON",
      share: true,
      duration: 0,
    })
    const afterFirst = spectate.handleNotification(first)
    const afterSecond = (afterFirst as Spectate).handleNotification(second)
    expect(afterFirst).to.equal(spectate)
    expect(afterSecond).to.equal(spectate)
    expect(showSpy.mock.calls).to.have.lengthOf(1)
    const shown = showSpy.mock.calls[0][0]
    expect(typeof shown).to.not.equal("string")
    if (typeof shown !== "string") {
      expect(shown.type).to.equal("GameOver")
      expect(shown.title).to.equal("GAME OVER")
    }
    showSpy.mockRestore()
  })
})
