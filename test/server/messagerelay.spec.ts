import { expect } from "chai"
import { InMemoryMessageRelay } from "../mocks/inmemorymessagerelay"
import { MessageRelay } from "../../src/network/client/messagerelay"
import { BreakEvent } from "../../src/events/breakevent"
import { GameEvent } from "../../src/events/gameevent"

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("MessageRelay", () => {
  const relay: MessageRelay<GameEvent> = new InMemoryMessageRelay<GameEvent>()

  it("validate subscriber receives published message", (done) => {
    const channel = "test"
    const message = new BreakEvent()
    relay.subscribe(channel, (msg) => {
      expect(msg).to.equal(message)
      done()
    })
    relay.publish(channel, message)
  })
})
