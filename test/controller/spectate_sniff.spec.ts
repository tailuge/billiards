import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball } from "../../src/model/ball"
import { Spectate } from "../../src/controller/spectate"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Session } from "../../src/network/client/session"
import { MessageRelay } from "../../src/network/client/messagerelay"
import { BeginEvent } from "../../src/events/beginevent"
import { WatchEvent } from "../../src/events/watchevent"
import { EventUtil } from "../../src/events/eventutil"

initDom()

describe("Spectate Name Sniffing", () => {
  let container: Container
  let messageRelay: MessageRelay
  let capturedCallback: (message: string) => void

  beforeEach(() => {
    Ball.id = 0
    // Initialize as spectator
    Session.init("spectator-client", "Spectator", "test-table", true)

    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    container.isSinglePlayer = false

    messageRelay = {
      subscribe: (channel, callback) => {
        capturedCallback = callback
      },
      publish: () => {},
      getOnlineCount: () => Promise.resolve(null),
    }
  })

  it("should sniff names from BEGIN and WATCHAIM events", () => {
    new Spectate(container, messageRelay, "test-table")
    const session = Session.getInstance()

    // Simulate BEGIN event from P1 (Peter)
    const beginEvent = new BeginEvent()
    beginEvent.clientId = "p1-id"
    beginEvent.playername = "Peter"
    capturedCallback(EventUtil.serialise(beginEvent))

    expect(session.spectatedP1Name).to.equal("Peter")
    expect(session.spectatedP2Name).to.be.undefined

    // Simulate WATCHAIM event from P2 (Yvette)
    const watchEvent = new WatchEvent({})
    watchEvent.clientId = "p2-id"
    watchEvent.playername = "Yvette"
    capturedCallback(EventUtil.serialise(watchEvent))

    expect(session.spectatedP2Name).to.equal("Yvette")

    const names = session.orderedNamesForHud()
    expect(names.p1Name).to.equal("Peter")
    expect(names.p2Name).to.equal("Yvette")
  })

  it("should not override names once set", () => {
    new Spectate(container, messageRelay, "test-table")
    const session = Session.getInstance()

    const begin1 = new BeginEvent()
    begin1.clientId = "p1-id"
    begin1.playername = "Peter"
    capturedCallback(EventUtil.serialise(begin1))

    const begin2 = new BeginEvent()
    begin2.clientId = "other-id"
    begin2.playername = "Imposter"
    capturedCallback(EventUtil.serialise(begin2))

    expect(session.spectatedP1Name).to.equal("Peter")
  })

  it("should ignore events from the spectator itself", () => {
    new Spectate(container, messageRelay, "test-table")
    const session = Session.getInstance()

    const begin = new BeginEvent()
    begin.clientId = "spectator-client"
    begin.playername = "Spectator"
    capturedCallback(EventUtil.serialise(begin))

    expect(session.spectatedP1Name).to.be.undefined
  })
})
