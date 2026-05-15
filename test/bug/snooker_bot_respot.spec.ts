import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { Session } from "../../src/network/client/session"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { BotEventHandler } from "../../src/network/bot/boteventhandler"
import { Logger } from "../../src/network/bot/logger"
import { EventType } from "../../src/events/eventtype"
import { Controller } from "../../src/controller/controller"
import { GameEvent } from "../../src/events/gameevent"
import { Snooker } from "../../src/controller/rules/snooker"

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

describe("Snooker Bot Respot Bug", () => {
  let container: Container
  let publishedEvents: GameEvent[]

  beforeEach(() => {
    Ball.id = 0
    Session.init("test-client", "TestPlayer", "test-table", false)

    container = new Container({
      element: undefined,
      log: (_: any) => {},
      assets: Assets.localAssets(),
      ruletype: "snooker",
    })

    publishedEvents = []
  })

  it("should NOT respot potted yellow when no reds are remaining", () => {
    const table = container.table
    const cueball = table.cueball
    const yellow = table.balls[1] // yellow is id=1

    // Remove all reds from the table
    table.balls.slice(7).forEach(red => red.state = State.InPocket)

    const eventHandler = createBotEventHandler(container, publishedEvents)
    const botRules = (eventHandler as any).botRules as Snooker

    // Ensure bot rules know we are on the colors
    botRules.targetIsRed = false
    botRules.previousPotRed = false

    // Simulate potting yellow
    const outcome = [
      Outcome.hit(cueball, 1),
      Outcome.collision(cueball, yellow, 1),
      Outcome.pot(yellow, 1)
    ]
    table.outcome = outcome
    // The ball is already in pocket in the outcome, but we also set its state
    yellow.state = State.InPocket

    // This will trigger handleStationary
    eventHandler.handle(mockEvent(EventType.BEGIN))

    // Verify if yellow is on table.
    // EXPECTATION: It should be false because no reds remain.
    // ACTUAL BUG: It is true because BotEventHandler always calls respot()
    // and Snooker.respot always returns all colours.
    expect(yellow.onTable()).toBe(false)
  })
})
