import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Init } from "../../src/controller/init"
import { PlaceBall } from "../../src/controller/placeball"
import { WatchEvent } from "../../src/events/watchevent"
import { GameEvent } from "../../src/events/gameevent"
import { Ball } from "../../src/model/ball"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { BotRelay } from "../../src/network/bot/botrelay"
import { EventUtil } from "../../src/events/eventutil"
import { Logger } from "../../src/network/bot/logger"
import { BotEventHandler } from "../../src/network/bot/boteventhandler"
import { StartAimEvent } from "../../src/events/startaimevent"
import { AimEvent } from "../../src/events/aimevent"
import { HitEvent } from "../../src/events/hitevent"
import { initDom } from "../view/dom"

initDom()

describe("Bot Mode", () => {
  let container: Container
  let broadcastEvents: GameEvent[]

  beforeEach(function (done) {
    Session.reset()
    Ball.id = 0
    done()
  })

  afterEach(function (done) {
    Session.reset()
    done()
  })

  it("OLD BEHAVIOR (now fixed): Bot mode stays in Init when no relay is used", (done) => {
    Session.init("testId", "testPlayer", "testTable", false, true)

    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
    })

    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)

    container.isSinglePlayer = false

    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Init)

    const watchEvents = broadcastEvents.filter((e) => e instanceof WatchEvent)
    expect(watchEvents).to.have.lengthOf(0)

    done()
  })

  it("Bot mode should transition to PlaceBall and broadcast WatchEvent", (done) => {
    Session.init("testId", "testPlayer", "testTable", false, true)

    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
      relay: null,
    })

    const logs = new Logger()
    const relay = new BotRelay(logs, container)
    container.relay = relay

    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)

    container.isSinglePlayer = false

    relay.subscribe("testTable", (e) => {
      const event = EventUtil.fromSerialised(e)
      container.eventQueue.push(event)
    })

    container.processEvents()

    setTimeout(() => {
      container.processEvents()

      expect(container.controller).to.be.an.instanceof(PlaceBall)

      const watchEvents = broadcastEvents.filter((e) => e instanceof WatchEvent)
      expect(watchEvents).to.have.lengthOf(1)

      done()
    }, 10)
  })

  it("BotEventHandler should handle libre rule type and generate shot events on StartAimEvent", (done) => {
    Session.init("testId", "testPlayer", "testTable", false, true)

    container = new Container({
      element: document.getElementById("viewP1"),
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "libre",
    })

    const logs = new Logger()
    const publishedEvents: GameEvent[] = []
    const botEventHandler = new BotEventHandler(
      logs,
      container,
      (events) => {
        publishedEvents.push(...events)
      },
      () => {}
    )

    // Initially recorder has no shots, so validTargetBalls returns []
    expect(botEventHandler.validTargetBalls()).to.deep.equal([])

    // Record an AIM event to simulate player's shot having taken place
    container.recorder.entries.push({ event: new AimEvent() } as any)

    // Now validTargetBalls should return balls[0] and balls[2]
    const validTargets = botEventHandler.validTargetBalls()
    expect(validTargets).to.have.lengthOf(2)
    expect(validTargets).to.include(container.table.balls[0])
    expect(validTargets).to.include(container.table.balls[2])

    // Trigger handle(StartAimEvent)
    botEventHandler.handle(new StartAimEvent())

    // Check that events were published (e.g. AimEvent, HitEvent)
    expect(publishedEvents.length).to.be.greaterThan(0)
    const aimEvents = publishedEvents.filter((e) => e instanceof AimEvent)
    const hitEvents = publishedEvents.filter((e) => e instanceof HitEvent)
    expect(aimEvents.length).to.be.greaterThan(0)
    expect(hitEvents.length).to.be.greaterThan(0)

    done()
  })
})
