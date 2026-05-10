import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { Session } from "../../src/network/client/session"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { BotEventHandler } from "../../src/network/bot/boteventhandler"
import { Logger } from "../../src/network/bot/logger"
import { GameEvent } from "../../src/events/gameevent"
import { EventType } from "../../src/events/eventtype"
import { Controller } from "../../src/controller/controller"
import { Snooker } from "../../src/controller/rules/snooker"
import { RerackEvent } from "../../src/events/rerackevent"
import { WatchEvent } from "../../src/events/watchevent"

initDom()

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

describe("Snooker Bot Foul Detection", () => {
  let container: Container
  let publishedEvents: GameEvent[]

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    container = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets("snooker"),
      ruletype: "snooker",
    })

    publishedEvents = []
  })

  it("should detect foul when bot hits pink instead of yellow during colors phase", () => {
    const table = container.table
    const cueball = table.cueball
    const pink = table.balls[5]

    // Clear all reds
    table.balls.forEach(b => {
      if (b.id >= 7) b.state = State.InPocket
    })

    // Set bot rules state
    const handler = createBotEventHandler(container, publishedEvents)
    const botRules = (handler as any).botRules as Snooker
    botRules.targetIsRed = false
    botRules.previousPotRed = false

    // Simulate hitting pink and potting it
    const outcome = [
      Outcome.hit(cueball, 1),
      Outcome.collision(cueball, pink, 1),
      Outcome.pot(pink, 1)
    ]
    table.outcome = outcome
    pink.state = State.InPocket

    // Trigger stationary handling
    const notifySpy = jest.spyOn(container, "notify")
    handler.handle(mockEvent(EventType.BEGIN))

    expect(notifySpy).toHaveBeenCalled()
    const lastCall = notifySpy.mock.calls[notifySpy.mock.calls.length - 1][0] as any
    expect(lastCall.title).toBe("FOUL")
    expect(lastCall.subtext).toBe("Hit Pink instead of Yellow")

    // Check if pink was respotted and synchronized
    expect(pink.onTable()).toBe(true)
    const respotEvent = publishedEvents.find(e => e instanceof RerackEvent)
    expect(respotEvent).toBeDefined()
  })

  it("should synchronize legally potted color when reds remain", () => {
    const table = container.table
    const cueball = table.cueball
    const black = table.balls[6]
    const red = table.balls[7]

    // Set bot rules state - targeting color after red
    const handler = createBotEventHandler(container, publishedEvents)
    const botRules = (handler as any).botRules as Snooker
    botRules.targetIsRed = false
    botRules.previousPotRed = true

    // Simulate hitting black and potting it
    const outcome = [
      Outcome.hit(cueball, 1),
      Outcome.collision(cueball, black, 1),
      Outcome.pot(black, 1)
    ]
    table.outcome = outcome
    black.state = State.InPocket

    // Trigger stationary handling
    handler.handle(mockEvent(EventType.BEGIN))

    // Black should be respotted on the bot's table before broadcasting
    expect(black.onTable()).toBe(true)

    // Should have sent a WatchEvent with the respotted table state
    const watchEvent = publishedEvents.find(e => e instanceof WatchEvent) as WatchEvent
    expect(watchEvent).toBeDefined()

    const blackInfo = watchEvent.json.balls.find(b => b.id === 6)
    // In snooker, black is at (dx, 0, 0) or similar. Check onTable state if possible,
    // but at least check it exists in the serialized balls.
    expect(blackInfo).toBeDefined()
  })
})
