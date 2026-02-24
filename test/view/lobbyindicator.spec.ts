import { expect } from "chai"
import { LobbyIndicator } from "../../src/view/lobbyindicator"
import { InMemoryMessageRelay } from "../mocks/inmemorymessagerelay"
import { initDom } from "./dom"

initDom()

describe("LobbyIndicator", () => {
  let relay: InMemoryMessageRelay

  beforeEach(() => {
    relay = new InMemoryMessageRelay()
  })

  it("updates text content on init", async () => {
    const element = document.getElementById("lobby")
    if (element) {
      element.textContent = "👥"
    }

    relay.getOnlineCount = async () => 5

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(relay, mockRules)
    await indicator.init()

    expect(element?.textContent).to.equal(" 5 👥")
  })
})
