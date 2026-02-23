import { expect } from "chai"
import { Container } from "../../../src/container/container"
import { Ball, State } from "../../../src/model/ball"
import { Outcome } from "../../../src/model/outcome"
import { Session } from "../../../src/network/client/session"
import { Assets } from "../../../src/view/assets"
import { initDom } from "../../view/dom"
import { BotEventHandler } from "../../../src/network/bot/eventhandler"
import { Logger } from "../../../src/network/bot/logger"
import { R } from "../../../src/model/physics/constants"
import { TableGeometry } from "../../../src/view/tablegeometry"
import { PlaceBallEvent } from "../../../src/events/placeballevent"
import { GameEvent } from "../../../src/events/gameevent"
import { EventType } from "../../../src/events/eventtype"
import { EventUtil } from "../../../src/events/eventutil"
import { HitEvent } from "../../../src/events/hitevent"
import { WatchShot } from "../../../src/controller/watchshot"
import { PlaceBall } from "../../../src/controller/placeball"
import { Vector3 } from "three"

initDom()

describe("BotEventHandler Respot Logic", () => {
  let container: Container
  let publishedEvents: GameEvent[]

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    container = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })

    publishedEvents = []
  })

  it("should respot nine ball and cue ball to different positions when both are potted", () => {
    container.table.balls.forEach((ball) => {
      if (ball.id !== 0 && ball.id !== 9) {
        ball.state = State.InPocket
      }
    })

    const cueball = container.table.cueball
    const nineBall = container.table.balls[9]

    expect(cueball.onTable()).to.be.true
    expect(nineBall.onTable()).to.be.true

    const outcome = [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]

    container.table.outcome = outcome

    const logs = new Logger()
    const publishFn = (events: GameEvent[], _delay?: number) => {
      publishedEvents.push(...events)
    }
    const enqueueFn = (_message: string) => {}

    const eventHandler = new BotEventHandler(
      logs,
      container,
      publishFn,
      enqueueFn
    )

    eventHandler.handle({ type: EventType.BEGIN })

    const placeBallEvents = publishedEvents.filter(
      (e) => e instanceof PlaceBallEvent
    )
    expect(placeBallEvents).to.have.length(1)

    const placeBallEvent = placeBallEvents[0]

    const cueBallPos = placeBallEvent.pos
    expect(cueBallPos.x).to.be.lessThan(0)

    expect(placeBallEvent.respot).to.not.be.undefined
    const nineBallPos = placeBallEvent.respot!.pos

    // Nine ball should be respotted behind the foot spot
    // The foot spot is at tableX / 2
    const footSpotX = TableGeometry.tableX / 2
    // Allow a wider range since the ball may be moved back if there's overlap
    expect(nineBallPos.x).to.be.greaterThan(footSpotX - R * 10)

    const distance = cueBallPos.distanceTo(nineBallPos)
    expect(distance).to.be.greaterThan(R * 2)
  })

  it("should correctly serialize and deserialize respot data", () => {
    // Set up table with only cue ball and nine ball
    container.table.balls.forEach((ball) => {
      if (ball.id !== 0 && ball.id !== 9) {
        ball.state = State.InPocket
      }
    })

    const cueball = container.table.cueball
    const nineBall = container.table.balls[9]

    const outcome = [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]
    container.table.outcome = outcome

    const logs = new Logger()
    const publishFn = (events: GameEvent[], _delay?: number) => {
      publishedEvents.push(...events)
    }
    const enqueueFn = (_message: string) => {}

    const eventHandler = new BotEventHandler(
      logs,
      container,
      publishFn,
      enqueueFn
    )

    eventHandler.handle({ type: EventType.BEGIN })

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    ) as PlaceBallEvent

    // Serialize and deserialize
    const serialized = EventUtil.serialise(placeBallEvent)
    const deserialized = EventUtil.fromSerialised(serialized) as PlaceBallEvent

    // Verify respot data is correctly preserved after deserialization
    expect(deserialized.respot).to.not.be.undefined
    expect(deserialized.respot!.id).to.equal(9)
    expect(deserialized.respot!.pos).to.not.be.undefined

    // Verify the nine ball position is valid (behind foot spot)
    const footSpotX = TableGeometry.tableX / 2
    expect(deserialized.respot!.pos.x).to.be.greaterThan(footSpotX - R * 10)
  })

  it("should correctly respot nine ball when WatchShot processes PlaceBallEvent", () => {
    // Set up sender (bot) container
    container.table.balls.forEach((ball) => {
      if (ball.id !== 0 && ball.id !== 9) {
        ball.state = State.InPocket
      }
    })

    const cueball = container.table.cueball
    const nineBall = container.table.balls[9]

    const outcome = [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]
    container.table.outcome = outcome

    const logs = new Logger()
    const publishFn = (events: GameEvent[], _delay?: number) => {
      publishedEvents.push(...events)
    }
    const enqueueFn = (_message: string) => {}

    const eventHandler = new BotEventHandler(
      logs,
      container,
      publishFn,
      enqueueFn
    )

    eventHandler.handle({ type: EventType.BEGIN })

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    ) as PlaceBallEvent

    // Capture the correct positions before serialization
    const expectedNineBallPos = placeBallEvent.respot!.pos.clone()
    const expectedCueBallPos = placeBallEvent.pos.clone()

    // Set up recipient container
    Ball.id = 0
    const recipientContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })

    // Set up recipient table state (same as sender after potted balls)
    recipientContainer.table.balls.forEach((ball) => {
      if (ball.id !== 0 && ball.id !== 9) {
        ball.state = State.InPocket
      }
    })
    recipientContainer.table.cueball.state = State.InPocket
    recipientContainer.table.balls[9].state = State.InPocket

    const recipientNineBall = recipientContainer.table.balls[9]

    // Serialize and deserialize as would happen over network
    const serialized = EventUtil.serialise(placeBallEvent)
    const deserialized = EventUtil.fromSerialised(serialized) as PlaceBallEvent

    // Process on recipient side using WatchShot.handlePlaceBall
    const watchShot = new WatchShot(recipientContainer)
    const resultController = watchShot.handlePlaceBall(deserialized)

    // Verify nine ball was respotted correctly
    expect(recipientNineBall.state).to.equal(State.Stationary)
    expect(recipientNineBall.onTable()).to.be.true

    // Nine ball should be respotted behind the foot spot
    const footSpotX = TableGeometry.tableX / 2
    expect(recipientNineBall.pos.x).to.be.greaterThan(footSpotX - R * 10)

    // Verify result is PlaceBall controller with correct position
    expect(resultController).to.be.instanceof(PlaceBall)
    const placeBallController = resultController

    // Cue ball position should be in kitchen (negative x)
    expect(placeBallController.startPos.x).to.be.lessThan(0)

    // Nine ball and cue ball should be at different positions
    const distance = recipientNineBall.pos.distanceTo(
      placeBallController.startPos
    )
    expect(distance).to.be.greaterThan(R * 2)

    // Verify positions match what was intended
    expect(recipientNineBall.pos.x).to.be.approximately(
      expectedNineBallPos.x,
      0.001
    )
    expect(placeBallController.startPos.x).to.be.approximately(
      expectedCueBallPos.x,
      0.001
    )
  })

  it("should set bot aim.pos from placed cue ball after PLACEBALL", () => {
    const logs = new Logger()
    const publishFn = (events: GameEvent[], _delay?: number) => {
      publishedEvents.push(...events)
    }
    const enqueueFn = (_message: string) => {}

    const eventHandler = new BotEventHandler(
      logs,
      container,
      publishFn,
      enqueueFn
    )

    container.table.cueball.state = State.InPocket
    const placedPos = new Vector3(-0.7205, 0, 0)

    eventHandler.handle(new PlaceBallEvent(placedPos, undefined, true))

    const hit = publishedEvents.find((e) => e instanceof HitEvent) as HitEvent
    expect(hit).to.not.be.undefined

    expect(hit.tablejson.aim.pos.x).to.be.closeTo(placedPos.x, 1e-9)
    expect(hit.tablejson.aim.pos.y).to.be.closeTo(placedPos.y, 1e-9)
    expect(hit.tablejson.aim.pos.z).to.be.closeTo(placedPos.z, 1e-9)
    expect(hit.tablejson.aim.i).to.equal(0)
  })
})
