import "mocha"
import { expect } from "chai"
import { InMemoryMessageRelay } from "../mocks/inmemorymessagerelay"
import { MessageRelay } from "../../src/network/client/messagerelay"

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("MessageRelay", () => {
  const relay: MessageRelay<string> = new InMemoryMessageRelay<string>()

  it("validate subscriber receives published message", (done) => {
    const channel = "test"
    const message = "hello"
    relay.subscribe(channel, (msg) => {
      expect(msg).to.equal(message)
      done()
    })
    relay.publish(channel, message)
  })
})
