// removed chai import
import { Container } from "../../../src/container/container"
import { Ball, State } from "../../../src/model/ball"
import { Outcome } from "../../../src/model/outcome"
import { Session } from "../../../src/network/client/session"
import { Assets } from "../../../src/view/assets"
import { initDom } from "../../view/dom"
import { BotEventHandler } from "../../../src/network/bot/boteventhandler"
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
    Session.getInstance().setMyScore(0)
    Session.getInstance().setOpponentScore(1)
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

    const eventHandler = createBotEventHandler(container, publishedEvents)
    jest.spyOn(eventHandler.botRules, "foulReason").mockReturnValue("Some foul")
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
    const eventHandler = createBotEventHandler(container, publishedEvents)
    jest.spyOn(eventHandler.botRules, "foulReason").mockReturnValue(null)
    jest.spyOn(container.rules, "getAmountScored").mockReturnValue(0)

    eventHandler.handle(mockEvent(EventType.BEGIN))

    const startAimEvent = publishedEvents.find(
      (e) => e instanceof StartAimEvent
    )
    expect(startAimEvent).toBeDefined()
  })

  it("should use fallback target point if no next candidate ball", () => {
    const eventHandler = createBotEventHandler(container, publishedEvents)
    jest
      .spyOn(eventHandler.botRules, "nextCandidateBall")
      .mockReturnValue(undefined)

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
    const eventHandler = createBotEventHandler(container, publishedEvents)
    jest.spyOn(eventHandler.botRules, "foulReason").mockReturnValue(null)
    jest.spyOn(eventHandler.botRules, "getAmountScored").mockReturnValue(1)

    eventHandler.handle(mockEvent(EventType.BEGIN))

    const watchEvent = publishedEvents.find((e) => e instanceof WatchEvent)
    expect(watchEvent).toBeDefined()
  })

  it("should handle foul with 9-ball potted and respot it", () => {
    const { cueball, nineBall } = setupCueballAndNineball(container)
    const outcome = [Outcome.pot(cueball, 1), Outcome.pot(nineBall, 1)]
    container.table.outcome = outcome

    const eventHandler = createBotEventHandler(container, publishedEvents)
    jest.spyOn(eventHandler.botRules, "foulReason").mockReturnValue("Foul")
    eventHandler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = publishedEvents.find(
      (e) => e instanceof PlaceBallEvent
    ) as PlaceBallEvent
    expect(placeBallEvent.respot).toBeDefined()
    expect(placeBallEvent.respot?.id).toBe(9)
  })

  it("eightball foul: bot pots black and cue ball with balls remaining - black is respotted", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    Session.getInstance().p1type = 1

    const eightBallContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "eightball",
    })
    const cueball = eightBallContainer.table.cueball
    const eightBall = eightBallContainer.table.balls.find((b) => b.label === 8)!
    cueball.state = State.InPocket
    eightBall.state = State.InPocket
    eightBallContainer.table.outcome = [
      Outcome.collision(cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
      Outcome.pot(cueball, 1),
    ]

    const events: GameEvent[] = []
    const handler = createBotEventHandler(eightBallContainer, events)
    handler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = events.find((e) => e instanceof PlaceBallEvent)
    expect(placeBallEvent).toBeInstanceOf(PlaceBallEvent)
    expect(eightBall.onTable()).toBe(true)
    expect((placeBallEvent as PlaceBallEvent).respot?.id).toBe(eightBall.id)
  })

  it("eightball early black after valid hit: bot respots black and gives ball in hand", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    Session.getInstance().p1type = 1

    const eightBallContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "eightball",
    })
    const cueball = eightBallContainer.table.cueball
    const stripe = eightBallContainer.table.balls.find((b) => b.label === 9)!
    const eightBall = eightBallContainer.table.balls.find((b) => b.label === 8)!
    eightBall.state = State.InPocket
    eightBallContainer.table.outcome = [
      Outcome.collision(cueball, stripe, 1),
      Outcome.pot(eightBall, 1),
    ]

    const events: GameEvent[] = []
    const handler = createBotEventHandler(eightBallContainer, events)
    handler.handle(mockEvent(EventType.BEGIN))

    const placeBallEvent = events.find((e) => e instanceof PlaceBallEvent)
    expect(placeBallEvent).toBeInstanceOf(PlaceBallEvent)
    expect(eightBall.onTable()).toBe(true)
    expect((placeBallEvent as PlaceBallEvent).respot?.id).toBe(eightBall.id)
  })

  it("eightball foul: bot pots black and cue ball with no balls remaining - bot wins", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    Session.getInstance().p1type = 1

    const eightBallContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "eightball",
    })
    eightBallContainer.table.balls.forEach((ball) => {
      if (ball !== eightBallContainer.table.cueball && ball.label !== 8) {
        ball.state = State.InPocket
      }
    })

    const cueball = eightBallContainer.table.cueball
    const eightBall = eightBallContainer.table.balls.find((b) => b.label === 8)!
    cueball.state = State.InPocket
    eightBall.state = State.InPocket
    eightBallContainer.table.outcome = [
      Outcome.collision(cueball, eightBall, 1),
      Outcome.pot(eightBall, 1),
      Outcome.pot(cueball, 1),
    ]

    const events: GameEvent[] = []
    const handler = createBotEventHandler(eightBallContainer, events)
    const updateControllerSpy = jest.spyOn(
      eightBallContainer,
      "updateController"
    )
    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof PlaceBallEvent)).toBeUndefined()
    expect(updateControllerSpy).toHaveBeenCalled()
  })

  it("snooker foul: white potted sends PlaceBallEvent with Ball in hand", () => {
    Ball.id = 0
    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    const cueball = snookerContainer.table.cueball
    cueball.state = State.InPocket
    const outcome = [Outcome.pot(cueball, 1)]
    snookerContainer.table.outcome = outcome

    const events: GameEvent[] = []
    const handler = createBotEventHandler(snookerContainer, events)
    jest.spyOn(handler.botRules, "foulReason").mockReturnValue("White potted")
    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof PlaceBallEvent)).toBeDefined()
    expect(events.find((e) => e instanceof StartAimEvent)).toBeUndefined()
  })

  it("snooker foul: white on table sends StartAimEvent not PlaceBallEvent", () => {
    Ball.id = 0
    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    const cueball = snookerContainer.table.cueball
    cueball.state = State.Stationary
    snookerContainer.table.outcome = []

    const events: GameEvent[] = []
    const handler = createBotEventHandler(snookerContainer, events)
    jest
      .spyOn(handler.botRules, "foulReason")
      .mockReturnValue("Hit colour instead of red")
    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof StartAimEvent)).toBeDefined()
    expect(events.find((e) => e instanceof PlaceBallEvent)).toBeUndefined()
  })

  it("snooker foul: bot foul adds points to player score", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    const cueball = snookerContainer.table.cueball
    cueball.state = State.Stationary
    snookerContainer.table.outcome = []

    const events: GameEvent[] = []
    const handler = createBotEventHandler(snookerContainer, events)
    const sendScoreUpdateSpy = jest.spyOn(snookerContainer, "sendScoreUpdate")

    jest.spyOn(handler.botRules, "foulReason").mockReturnValue("No ball hit")

    handler.handle(mockEvent(EventType.BEGIN))

    expect(Session.getInstance().myScore()).toBe(4)
    expect(sendScoreUpdateSpy).toHaveBeenCalledWith(4, 0, 0, 1)
  })

  it("snooker: bot pots final ball and game ends correctly without sending extra StartAimEvent", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })

    const events: GameEvent[] = []
    const handler = createBotEventHandler(snookerContainer, events)
    const updateControllerSpy = jest.spyOn(snookerContainer, "updateController")

    // Mock initial check to return false (as if score is stale)
    jest.spyOn(snookerContainer.rules, "isEndOfGame").mockReturnValue(false)
    // Mock botRules check to return true (after score update in handlePot)
    jest.spyOn(handler.botRules, "isEndOfGame").mockReturnValue(true)
    // Mock foulReason to be null
    jest.spyOn(handler.botRules, "foulReason").mockReturnValue(null)
    // Mock scoring
    jest.spyOn(handler.botRules, "getAmountScored").mockReturnValue(7)

    handler.handle(mockEvent(EventType.BEGIN))

    // Verify handleGameEnd was called
    expect(updateControllerSpy).toHaveBeenCalled()
    // Verify NO StartAimEvent was sent (which handlePot would have done otherwise)
    expect(events.find((e) => e instanceof StartAimEvent)).toBeUndefined()
  })

  it("snooker foul: bot pots red and black - black is respotted, StartAimEvent sent", () => {
    Ball.id = 0
    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    const table = snookerContainer.table
    const cueball = table.cueball
    const black = table.balls[6] // black is id=6
    const red = table.balls[7] // first red is id=7

    red.state = State.InPocket
    black.state = State.InPocket

    const outcome: Outcome[] = [
      Outcome.hit(cueball, 1),
      Outcome.collision(cueball, red, 1),
      Outcome.pot(red, 1),
      Outcome.pot(black, 1),
    ]
    table.outcome = outcome

    const events: GameEvent[] = []
    const handler = createBotEventHandler(snookerContainer, events)
    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof StartAimEvent)).toBeDefined()
    expect(events.find((e) => e instanceof PlaceBallEvent)).toBeUndefined()
    expect(black.onTable()).toBe(true)
  })

  it("threecushion bot keeps turn when point is valid for bot cue ball", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false, true)

    const threeContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })

    const balls = threeContainer.table.balls
    const playerCueBall = balls[0]
    const botCueBall = balls[1]
    const redBall = balls[2]
    threeContainer.rules.cueball = playerCueBall
    threeContainer.table.cueball = botCueBall

    const events: GameEvent[] = []
    const handler = createBotEventHandler(threeContainer, events)
    handler.botRules.cueball = botCueBall

    threeContainer.table.outcome = [
      Outcome.cushion(botCueBall, 1),
      Outcome.cushion(botCueBall, 1),
      Outcome.cushion(botCueBall, 1),
      Outcome.collision(botCueBall, playerCueBall, 1),
      Outcome.collision(botCueBall, redBall, 1),
    ]

    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof WatchEvent)).toBeDefined()
    expect(events.find((e) => e instanceof StartAimEvent)).toBeUndefined()
  })

  it("threecushion bot passes turn when only player cue ball would score", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false, true)

    const threeContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })

    const balls = threeContainer.table.balls
    const playerCueBall = balls[0]
    const botCueBall = balls[1]
    const redBall = balls[2]
    threeContainer.rules.cueball = playerCueBall
    threeContainer.table.cueball = botCueBall

    const events: GameEvent[] = []
    const handler = createBotEventHandler(threeContainer, events)
    handler.botRules.cueball = botCueBall

    threeContainer.table.outcome = [
      Outcome.cushion(playerCueBall, 1),
      Outcome.cushion(playerCueBall, 1),
      Outcome.cushion(playerCueBall, 1),
      Outcome.collision(playerCueBall, botCueBall, 1),
      Outcome.collision(playerCueBall, redBall, 1),
    ]

    handler.handle(mockEvent(EventType.BEGIN))

    expect(events.find((e) => e instanceof WatchEvent)).toBeUndefined()
    expect(events.find((e) => e instanceof StartAimEvent)).toBeDefined()
  })

  it("validTargetBalls returns non-8 balls on open eightball table", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const eightBallContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "eightball",
    })

    const handler = createBotEventHandler(eightBallContainer, [])
    const validTargetBalls = handler.validTargetBalls()

    expect(validTargetBalls).toHaveLength(14)
    expect(validTargetBalls.some((ball) => ball.label === 8)).toBe(false)
  })

  it("validTargetBalls returns eight ball once bot group is cleared", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)
    Session.getInstance().p1type = 1

    const eightBallContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "eightball",
    })

    eightBallContainer.table.balls.forEach((ball) => {
      if ((ball.label ?? 0) >= 9 && (ball.label ?? 0) <= 15) {
        ball.state = State.InPocket
      }
    })

    const handler = createBotEventHandler(eightBallContainer, [])
    const validTargetBalls = handler.validTargetBalls()

    expect(validTargetBalls).toHaveLength(1)
    expect(validTargetBalls[0].label).toBe(8)
  })

  it("validTargetBalls returns reds, then colours, for snooker", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    snookerContainer.recorder.entries.push({
      event: { type: EventType.AIM },
    } as any)

    const handler = createBotEventHandler(snookerContainer, [])
    const snookerRules = handler.botRules as any

    snookerRules.previousPotRed = false
    let validTargetBalls = handler.validTargetBalls()
    expect(validTargetBalls.every((ball) => ball.id >= 7)).toBe(true)

    snookerRules.previousPotRed = true
    validTargetBalls = handler.validTargetBalls()
    expect(validTargetBalls.every((ball) => ball.id >= 1 && ball.id <= 6)).toBe(
      true
    )
  })

  it("validTargetBalls returns next colour only when reds are gone in snooker", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const snookerContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })
    snookerContainer.recorder.entries.push({
      event: { type: EventType.AIM },
    } as any)

    snookerContainer.table.balls.forEach((ball) => {
      if (ball.id >= 7) {
        ball.state = State.InPocket
      }
    })

    const handler = createBotEventHandler(snookerContainer, [])
    const snookerRules = handler.botRules as any
    snookerRules.previousPotRed = false

    const validTargetBalls = handler.validTargetBalls()

    expect(validTargetBalls).toHaveLength(1)
    expect(validTargetBalls[0].id).toBe(1)
  })

  it("validTargetBalls excludes the bot cue ball in threecushion", () => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    const threeCushionContainer = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "threecushion",
    })
    threeCushionContainer.recorder.entries.push({
      event: { type: EventType.AIM },
    } as any)

    const handler = createBotEventHandler(threeCushionContainer, [])
    handler.botRules.cueball = threeCushionContainer.table.balls[1]

    const validTargetBalls = handler.validTargetBalls()

    expect(validTargetBalls).toHaveLength(2)
    expect(validTargetBalls).not.toContain(threeCushionContainer.table.balls[1])
  })
})
