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
  it("instance created", () => {
    Session.init("c1", "u1", "t1", false)
    expect(Session.getInstance().clientId).to.equal("c1")
  })


  it("breakingPlayerIndex defaults to 0", () => {
    Session.init("c1", "u1", "t1", false)
    expect(Session.getInstance().breakingPlayerIndex).to.equal(0)
  })

  it("can set opponentName", () => {
    Session.init("c1", "u1", "t1", false)
    const session = Session.getInstance()
    session.opponentName = "Opponent"
    expect(session.opponentName).to.equal("Opponent")
  })
})
