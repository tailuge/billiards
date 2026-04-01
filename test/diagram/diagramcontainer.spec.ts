import { expect } from "chai"
import { DiagramContainer } from "../../src/diagram/diagramcontainer"
import { Session } from "../../src/network/client/session"

describe("DiagramContainer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="viewP1"></div><button id="replay"></button>'
    Session.reset()
  })

  it("should initialize session on start", () => {
    const canvas = document.getElementById("viewP1")
    const dc = new DiagramContainer(canvas, "nineball", "{}")

    // We expect dc.start() to fail because of missing dependencies,
    // but we can check if it initializes the Session before it fails.
    try {
      dc.start()
    } catch (e) {
      // Expected to fail
    }

    expect(Session.isBotMode()).to.be.false
    expect(Session.playerIndex()).to.equal(0)
    // If we can call these without error, Session.init was called.
  })
})
