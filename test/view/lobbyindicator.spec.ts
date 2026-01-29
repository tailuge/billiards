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

    // Mock getOnlineCount to return 5
    relay.getOnlineCount = async () => 5

    new LobbyIndicator(relay)
    // Wait for async init
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(element?.textContent).to.equal(" 5 👥")
  })

  it("updates text content on message", async () => {
    const element = document.getElementById("lobby")
    relay.getOnlineCount = async () => 5

    new LobbyIndicator(relay)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(element?.textContent).to.equal(" 5 👥")

    // Change count and publish message
    relay.getOnlineCount = async () => 6
    relay.publish("lobby", JSON.stringify({ action: "connected" }), "lobby")

    // Wait for async refresh
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(element?.textContent).to.equal(" 6 👥")
  })
})
