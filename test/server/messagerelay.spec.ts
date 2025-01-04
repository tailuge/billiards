import { expect } from "chai"
import { InMemoryMessageRelay } from "../mocks/inmemorymessagerelay"
import { MessageRelay } from "../../src/network/client/messagerelay"
import { BreakEvent } from "../../src/events/breakevent"
import { EventUtil } from "../../src/events/eventutil"

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("MessageRelay", () => {
  const relay: MessageRelay = new InMemoryMessageRelay()

  it("validate subscriber receives published message", (done) => {
    const channel = "test"
    const message = EventUtil.serialise(new BreakEvent())
    relay.subscribe(channel, (msg) => {
      expect(msg).to.equal(message)
      done()
    })
    relay.publish(channel, message)
  })
  /*
  it("test message replay", (done) => {
    const realRelay = new NchanMessageRelay()
    const channel = "101"
    const message = EventUtil.serialise(new BreakEvent())
    realRelay.subscribe(channel, (msg) => {
      expect(msg).to.be.not.null
      //      done()
    })
        realRelay.publish(channel, message)
  })
        */
})
