import { expect } from "chai"
import { LobbyIndicator } from "../../src/view/lobbyindicator"
import { initDom } from "./dom"
import { Session } from "../../src/network/client/session"

// Mock the @tailuge/messaging module
jest.mock("@tailuge/messaging", () => ({
  MessagingClient: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    joinLobby: jest.fn().mockResolvedValue({
      onUsersChange: jest.fn(),
      onChallenge: jest.fn(),
      updatePresence: jest.fn(),
      leave: jest.fn(),
    }),
    stop: jest.fn(),
  })),
  Lobby: jest.fn(),
}))

initDom()

describe("LobbyIndicator", () => {
  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
  })

  afterEach(() => {
    Session.reset()
  })

  it("updates text content on init", async () => {
    const element = document.getElementById("lobbyOverlay")
    if (element) {
      element.textContent = "👥"
    }

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    expect(element?.textContent).to.equal(" 0 👥")
  })

  it("updates display when challenged", async () => {
    const element = document.getElementById("lobbyOverlay")
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    // Access the mock lobby to trigger challenge callback
    const mockLobby = (indicator as any).lobby
    const onChallengeCallback = mockLobby.onChallenge.mock.calls[0][0]

    // Simulate receiving a challenge offer
    onChallengeCallback({
      type: "offer",
      challengerId: "u2",
      challengerName: "Bob",
      recipientId: "default",
      ruleType: "nineball",
    })

    expect(element?.textContent).to.contain("⚔️")
    expect(element?.textContent).to.contain("Challenge from Bob")
    expect(element?.getAttribute("aria-label")).to.contain("CHALLENGE FROM Bob")

    const href = element?.getAttribute("href") ?? ""
    expect(href).to.contain("action=join")
    expect(href).to.contain("ruletype=nineball")
    expect(href).to.contain("opponentId=u2")
    expect(href).to.contain("opponentName=Bob")

    // Simulate challenge decline/cancel
    onChallengeCallback({
      type: "decline",
      challengerId: "u2",
      challengerName: "Bob",
      recipientId: "default",
      ruleType: "nineball",
    })
    expect(element?.textContent).to.not.contain("⚔️")
    expect(element?.getAttribute("href")).to.equal(
      "https://scoreboard-tailuge.vercel.app/game?userName=TestPlayer&userId=test-client"
    )
  })

  it("handles non-anchor elements and click events", async () => {
    // Create a div instead of a link
    const div = document.createElement("div")
    div.id = "lobbyOverlay-div"
    document.body.appendChild(div)

    // Mock id() to return our div
    const originalGetElementById = document.getElementById
    document.getElementById = (id: string) =>
      id === "lobbyOverlay" ? div : originalGetElementById.call(document, id)

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    let openedUrl = ""
    const originalOpen = globalThis.open
    globalThis.open = ((url: string) => {
      openedUrl = url
      return null
    }) as any

    div.click()
    expect(openedUrl).to.equal(
      "https://scoreboard-tailuge.vercel.app/game?userName=TestPlayer&userId=test-client"
    )

    await indicator.stop()
    div.remove()
    document.getElementById = originalGetElementById
    globalThis.open = originalOpen
  })

  it("setTableId updates presence", async () => {
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const updatePresenceFn = mockLobby.updatePresence

    indicator.setTableId("table-123")
    expect(updatePresenceFn.mock.calls.length).to.be.greaterThan(0)

    const firstCall = updatePresenceFn.mock.calls[0]
    expect(firstCall[0]).to.deep.equal({ tableId: "table-123" })

    indicator.setTableId(null)
    const secondCall = updatePresenceFn.mock.calls[1]
    expect(secondCall[0]).to.deep.equal({})

    await indicator.stop()
  })
})
