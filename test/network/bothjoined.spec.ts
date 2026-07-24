import { expect } from "chai"
import { Container } from "../../src/container/container"
import { BrowserContainer } from "../../src/container/browsercontainer"
import { Session } from "../../src/network/client/session"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Spectate } from "../../src/controller/spectate"
import { BeginEvent } from "../../src/events/beginevent"
import { WatchEvent } from "../../src/events/watchevent"
import { EventUtil } from "../../src/events/eventutil"

initDom()

describe("bothJoined Promise and Callback", () => {
  beforeEach(() => {
    Session.reset()
  })

  it("should resolve Container.bothJoined when triggerBothJoined is called", async () => {
    const container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })

    let callbackCalled = false
    container.onBothJoined = () => {
      callbackCalled = true
    }

    container.triggerBothJoined()

    await container.bothJoined
    expect(callbackCalled).to.be.true
  })

  it("should link BrowserContainer.bothJoined to Container.bothJoined", async () => {
    const params = new URLSearchParams("ruletype=nineball")
    const browserContainer = new BrowserContainer(undefined, params)

    const container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })

    browserContainer.container = container

    // Setup the link manually as is done in onAssetsReady
    container.bothJoined.then(() => {
      const bc = browserContainer as any
      bc.resolveBothJoined()
      browserContainer.onBothJoined?.()
    })

    let callbackCalled = false
    browserContainer.onBothJoined = () => {
      callbackCalled = true
    }

    container.triggerBothJoined()

    await browserContainer.bothJoined
    expect(callbackCalled).to.be.true
  })

  it("should resolve immediately in single-player or bot mode inside BrowserContainer", async () => {
    const params = new URLSearchParams("ruletype=nineball")
    const browserContainer = new BrowserContainer(undefined, params)

    const container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
      isSinglePlayer: true,
    })
    browserContainer.container = container

    // link them
    container.bothJoined.then(() => {
      const bc = browserContainer as any
      bc.resolveBothJoined()
      browserContainer.onBothJoined?.()
    })

    // Simulate the onAssetsReady check
    if (container.isSinglePlayer || browserContainer.botMode) {
      container.triggerBothJoined()
    }

    await browserContainer.bothJoined
  })

  it("should trigger bothJoined in spectator mode once both names are sniffed", async () => {
    Session.init("spectator-client", "Spectator", "test-table", true)

    const container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    container.isSinglePlayer = false

    let triggered = false
    container.onBothJoined = () => {
      triggered = true
    }

    let capturedCallback: (message: string) => void = () => {}
    const messageRelay = {
      subscribe: (channel: string, callback: (message: string) => void) => {
        capturedCallback = callback
      },
      publish: () => {},
    }

    const spectate = new Spectate(container, messageRelay, "test-table")
    expect(spectate).to.not.be.null

    // Simulate BEGIN event from P1
    const beginEvent = new BeginEvent()
    beginEvent.clientId = "p1-id"
    beginEvent.playername = "Peter"
    capturedCallback(EventUtil.serialise(beginEvent))

    expect(triggered).to.be.false // Only P1 sniffed

    // Simulate WATCHAIM event from P2
    const watchEvent = new WatchEvent({})
    watchEvent.clientId = "p2-id"
    watchEvent.playername = "Yvette"
    capturedCallback(EventUtil.serialise(watchEvent))

    await container.bothJoined
    expect(triggered).to.be.true // Both sniffed and promise resolved!
  })

  it("should trigger bothJoined in multiplayer netEvent when opponent joins", async () => {
    // Setup URL search params with userName to override default "Anon"
    const params = new URLSearchParams("ruletype=nineball&websocketserver=ws://localhost&userName=Peter&userId=p1-client")
    const browserContainer = new BrowserContainer(undefined, params)

    const container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
      isSinglePlayer: false,
    })
    browserContainer.container = container

    // Link them
    container.bothJoined.then(() => {
      const bc = browserContainer as any
      bc.resolveBothJoined()
      browserContainer.onBothJoined?.()
    })

    let triggered = false
    browserContainer.onBothJoined = () => {
      triggered = true
    }

    // Simulate opponent sending a WATCHAIM netEvent
    const watchEvent = new WatchEvent({})
    watchEvent.clientId = "p2-client"
    watchEvent.playername = "Yvette"
    const serialised = EventUtil.serialise(watchEvent)

    browserContainer.netEvent(serialised)

    await browserContainer.bothJoined
    expect(triggered).to.be.true
  })
})
