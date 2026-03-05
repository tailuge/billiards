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

  it("updates display when challenged", async () => {
    const element = document.getElementById("lobby")
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(relay, mockRules)
    await indicator.init()

    // Trigger challenge (this is a bit tricky as presenceClient is private)
    // We can reach it via (indicator as any).presenceClient
    const presenceClient = (indicator as any).presenceClient
    presenceClient.challengeCallbacks.forEach((cb: any) =>
      cb({ userId: "u2", userName: "Bob" })
    )

    expect(element?.textContent).to.contain("⚔️")
    expect(element?.textContent).to.contain("Challenge from Bob")
    expect(element?.getAttribute("aria-label")).to.contain("CHALLENGE FROM Bob")

    const href = element?.getAttribute("href") ?? ""
    expect(href).to.contain("action=join")
    expect(href).to.contain("ruletype=nineball")
    expect(href).to.contain("opponentId=u2")
    expect(href).to.contain("opponentName=Bob")

    presenceClient.challengeCallbacks.forEach((cb: any) => cb(null))
    expect(element?.textContent).to.not.contain("⚔️")
    expect(element?.getAttribute("href")).to.equal(
      "https://scoreboard-tailuge.vercel.app/lobby"
    )
  })

  it("handles non-anchor elements and click events", async () => {
    // Create a div instead of a link
    const div = document.createElement("div")
    div.id = "lobby-div"
    document.body.appendChild(div)

    // Mock id() to return our div
    const originalGetElementById = document.getElementById
    document.getElementById = (id: string) =>
      id === "lobby" ? div : originalGetElementById.call(document, id)

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(relay, mockRules)
    await indicator.init()

    let openedUrl = ""
    const originalOpen = globalThis.open
    globalThis.open = ((url: string) => {
      openedUrl = url
      return null
    }) as any

    div.click()
    expect(openedUrl).to.equal("https://scoreboard-tailuge.vercel.app/lobby")

    indicator.stop()
    div.remove()
    document.getElementById = originalGetElementById
    globalThis.open = originalOpen
  })
})
