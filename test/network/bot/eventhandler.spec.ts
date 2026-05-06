// removed chai import
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
import { StartAimEvent } from "../../../src/events/startaimevent"
import { WatchEvent } from "../../../src/events/watchevent"
import { Controller } from "../../../src/controller/controller"
import { AimEvent } from "../../../src/events/aimevent"

initDom()

function setupCueballAndNineball(container: Container): {
  cueball: Ball
  nineBall: Ball
} {
  container.table.balls.forEach((ball) => {
    if (ball.id !== 0 && ball.id !== 9) {
      ball.state = State.InPocket
    }
  })

  const cueball = container.table.cueball
  const nineBall = container.table.balls[9]
  return { cueball, nineBall }
}

function createOutcomeWithPots(cueball: Ball, nineBall: Ball): Outcome[] {
  return [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]
}

function createBotEventHandler(
  container: Container,
  publishedEvents: GameEvent[]
): BotEventHandler {
  const logs = new Logger()
  const publishFn = (events: GameEvent[], _delay?: number) => {
    publishedEvents.push(...events)
  }
  const enqueueFn = (_message: string) => {}
  return new BotEventHandler(logs, container, publishFn, enqueueFn)
}

function mockEvent(type: EventType): GameEvent {
  return {
    type,
    applyToController: function (_: Controller): Controller {
      throw new Error("Function not implemented.")
    },
  } as GameEvent
}

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
    const { cueball, nineBall } = setupCueballAndNineball(container)

    expect(cueball.onTable()).toBe(true)
    expect(nineBall.onTable()).toBe(true)

    const outcome = createOutcomeWithPots(cueball, nineBall)
    container.table.outcome = outcome

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvents = publishedEvents.filter(
      (e) => e instanceof PlaceBallEvent
    )
    expect(placeBallEvents).toHaveLength(1)

    const placeBallEvent = placeBallEvents[0]
    if (!(placeBallEvent instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent")

    const cueBallPos = placeBallEvent.pos
    expect(cueBallPos.x).toBeLessThan(0)

    expect(placeBallEvent.respot).toBeDefined()
    const nineBallPos = placeBallEvent.respot?.pos
    if (!nineBallPos) throw new Error("Respot position missing")

    const footSpotX = TableGeometry.tableX / 2
    expect(nineBallPos.x).toBeGreaterThan(footSpotX - R * 10)

    const distance = cueBallPos.distanceTo(nineBallPos)
    expect(distance).toBeGreaterThan(R * 2)
  })

  it("should correctly serialize and deserialize respot data", () => {
    const { cueball, nineBall } = setupCueballAndNineball(container)

    const outcome = createOutcomeWithPots(cueball, nineBall)
    container.table.outcome = outcome

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    )
    if (!(placeBallEvent instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent")

    // Serialize and deserialize
    const serialized = EventUtil.serialise(placeBallEvent)
    const deserialized = EventUtil.fromSerialised(serialized)
    if (!(deserialized instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent after deserialization")

    // Verify respot data is correctly preserved after deserialization
    expect(deserialized.respot).toBeDefined()
    const respot = deserialized.respot
    if (!respot) throw new Error("Respot missing")
    expect(respot.id).toBe(9)
    expect(respot.pos).toBeDefined()

    // Verify the nine ball position is valid (behind foot spot)
    const footSpotX = TableGeometry.tableX / 2
    expect(respot.pos.x).toBeGreaterThan(footSpotX - R * 10)
  })

  it("should correctly respot nine ball when WatchShot processes PlaceBallEvent", () => {
    const { cueball, nineBall } = setupCueballAndNineball(container)

    const outcome = createOutcomeWithPots(cueball, nineBall)
    container.table.outcome = outcome

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    )
    if (!(placeBallEvent instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent")

    // Capture the correct positions before serialization
    const respotData = placeBallEvent.respot
    if (!respotData) throw new Error("Expected respot data")
    const expectedNineBallPos = respotData.pos.clone()
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
    const deserialized = EventUtil.fromSerialised(serialized)
    if (!(deserialized instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent")

    // Process on recipient side using WatchShot.handlePlaceBall
    const watchShot = new WatchShot(recipientContainer)
    const resultController = watchShot.handlePlaceBall(deserialized)

    // Verify nine ball was respotted correctly
    expect(recipientNineBall.state).toBe(State.Stationary)
    expect(recipientNineBall.onTable()).toBe(true)

    // Nine ball should be respotted behind the foot spot
    const footSpotX = TableGeometry.tableX / 2
    expect(recipientNineBall.pos.x).toBeGreaterThan(footSpotX - R * 10)

    // Verify result is PlaceBall controller with correct position
    expect(resultController).toBeInstanceOf(PlaceBall)
    const placeBallController = resultController

    // Cue ball position should be in kitchen (negative x)
    expect((placeBallController as any).startPos.x).toBeLessThan(0)

    // Nine ball and cue ball should be at different positions
    const distance = recipientNineBall.pos.distanceTo(
      (placeBallController as any).startPos
    )
    expect(distance).toBeGreaterThan(R * 2)

    // Verify positions match what was intended
    expect(recipientNineBall.pos.x).toBeCloseTo(expectedNineBallPos.x, 3)
    expect((placeBallController as any).startPos.x).toBeCloseTo(
      expectedCueBallPos.x,
      3
    )
  })

  it("should set bot aim.pos from placed cue ball after PLACEBALL", () => {
    const eventHandler = createBotEventHandler(container, publishedEvents)

    container.table.cueball.state = State.InPocket
    const placedPos = new Vector3(-0.7205, 0, 0)

    eventHandler.handle(new PlaceBallEvent(placedPos, undefined, true))

    const hit = publishedEvents.find((e) => e instanceof HitEvent)
    if (!(hit instanceof HitEvent)) throw new Error("Expected HitEvent")

    expect(hit.tablejson.aim.pos.x).toBeCloseTo(Math.fround(placedPos.x), 9)
    expect(hit.tablejson.aim.pos.y).toBeCloseTo(Math.fround(placedPos.y), 9)
    expect(hit.tablejson.aim.pos.z).toBeCloseTo(Math.fround(placedPos.z), 9)
    expect(hit.tablejson.aim.i).toBe(0)
  })

  it("should publish a matching AimEvent before bot HitEvent", () => {
    const eventHandler = createBotEventHandler(container, publishedEvents)

    eventHandler.handle(mockEvent(EventType.STARTAIM))

    expect(publishedEvents[0]).toBeInstanceOf(AimEvent)
    expect(publishedEvents[1]).toBeInstanceOf(HitEvent)

    const aimEvent = publishedEvents[0] as AimEvent
    const hitEvent = publishedEvents[1] as HitEvent

    expect(aimEvent.pos.x).toBeCloseTo(hitEvent.tablejson.aim.pos.x, 9)
    expect(aimEvent.pos.y).toBeCloseTo(hitEvent.tablejson.aim.pos.y, 9)
    expect(aimEvent.pos.z).toBeCloseTo(hitEvent.tablejson.aim.pos.z, 9)
    expect(aimEvent.angle).toBe(hitEvent.tablejson.aim.angle)
    expect(aimEvent.power).toBe(hitEvent.tablejson.aim.power)
    expect(aimEvent.i).toBe(hitEvent.tablejson.aim.i)
  })

  it("should notify player and stop when game is over", () => {
    const eventHandler = createBotEventHandler(container, publishedEvents)
    const notifySpy = jest.spyOn(container, "notifyLocal")

    // Mock isEndOfGame to return true
    jest.spyOn(container.rules, "isEndOfGame").mockReturnValue(true)

    eventHandler.handle(mockEvent(EventType.BEGIN))

    expect(notifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "GameOver",
        title: "YOU LOST",
      })
    )
  })

  it("should handle foul with cue ball already on table", () => {
    const cueball = container.table.cueball
    cueball.state = State.Stationary
    cueball.pos.set(0, 0, 0)

    jest.spyOn(container.rules, "foulReason").mockReturnValue("Some foul")

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    )
    if (!(placeBallEvent instanceof PlaceBallEvent))
      throw new Error("Expected PlaceBallEvent")
    expect(placeBallEvent.pos.x).toBe(0)
    expect(placeBallEvent.pos.y).toBe(0)
  })

  it("should handle miss and switch turn", () => {
    jest.spyOn(container.rules, "foulReason").mockReturnValue(null)
    jest.spyOn(container.rules, "getAmountScored").mockReturnValue(0)

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const startAimEvent = publishedEvents.find(
      (e) => e instanceof StartAimEvent
    )
    expect(startAimEvent).toBeDefined()
  })

  it("should use fallback target point if no next candidate ball", () => {
    jest.spyOn(container.rules, "nextCandidateBall").mockReturnValue(undefined)

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.STARTAIM))

    const hitEvent = publishedEvents.find((e) => e instanceof HitEvent)
    expect(hitEvent).toBeDefined()
  })

  it("should respot ball during handlePlaceBall if respot data is present", () => {
    const ball = container.table.balls[1]
    ball.state = State.InPocket
    const respotPos = new Vector3(1, 1, 0)

    const eventHandler = createBotEventHandler(container, publishedEvents)
    const placeBallEvent = new PlaceBallEvent(
      new Vector3(),
      { id: ball.id, pos: respotPos },
      true
    )

    eventHandler.handle(placeBallEvent)

    expect(ball.state).toBe(State.Stationary)
    expect(ball.pos.x).toBe(1)
  })

  it("should handle pot success and continue turn", () => {
    jest.spyOn(container.rules, "foulReason").mockReturnValue(null)
    jest.spyOn(container.rules, "getAmountScored").mockReturnValue(1)

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const watchEvent = publishedEvents.find((e) => e instanceof WatchEvent)
    expect(watchEvent).toBeDefined()
  })

  it("should handle foul with 9-ball potted and respot it", () => {
    const { cueball, nineBall } = setupCueballAndNineball(container)
    const outcome = [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]
    container.table.outcome = outcome

    jest.spyOn(container.rules, "foulReason").mockReturnValue("Foul")

    const eventHandler = createBotEventHandler(container, publishedEvents)
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    ) as PlaceBallEvent
    expect(placeBallEvent.respot).toBeDefined()
    expect(placeBallEvent.respot?.id).toBe(9)
  })
})
