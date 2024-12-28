import { expect } from "chai"
import { Session } from "../../src/network/client/session"

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Session", () => {
  it("instance created", (done) => {
    Session.init("client1", "userId1", "tableId1")
    expect(Session.getInstance).to.be.not.null
    expect(Session.getInstance().clientId).to.be.equal("client1")
    done()
  })
})
