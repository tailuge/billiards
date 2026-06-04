import { MessagingClient } from "@tailuge/messaging"
import { LobbyIndicator } from "../../src/view/lobbyindicator"
import { initDom } from "./dom"
import { Session } from "../../src/network/client/session"
import { LOBBY_URL } from "../../src/network/client/constants"

// Mock the @tailuge/messaging module
jest.mock("@tailuge/messaging", () => ({
  MessagingClient: jest.fn().mockImplementation(() => ({
    setVersion: jest.fn(),
    start: jest.fn(),
    joinLobby: jest.fn().mockResolvedValue({
      onUsersChange: jest.fn(),
      onChat: jest.fn(),
      onChallenge: jest.fn(),
      updatePresence: jest.fn(),
      leave: jest.fn(),
    }),
    stop: jest.fn(),
  })),
  Lobby: jest.fn(),
}))

describe("LobbyIndicator", () => {
  beforeEach(() => {
    initDom()
    Session.init("test-client", "TestPlayer", "test-table", false)
  })

  afterEach(() => {
    Session.reset()
  })

  it("updates text content on init", async () => {
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const element = document.getElementById("lobbyOverlay")
    const countElement = element?.querySelector(".lobby-count")
    expect(countElement?.textContent).toBe("TestPlayer 👥0 ⚪")
    expect(countElement?.classList.contains("is-hidden")).toBe(false)
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
      challengeeId: "default",
      ruleType: "nineball",
    })

    const countElement = element?.querySelector(".lobby-count")
    expect(countElement?.classList.contains("is-hidden")).toBe(false)
    expect(document.getElementById("challengePill")?.textContent).toContain(
      "Challenge of nineball from Bob"
    )
    expect(element?.getAttribute("aria-label")).toContain("CHALLENGE FROM Bob")

    const href = element?.getAttribute("href") ?? ""
    expect(href).toContain("action=join")
    expect(href).toContain("ruletype=nineball")
    expect(href).toContain("opponentId=u2")
    expect(href).toContain("opponentName=Bob")

    // Simulate challenge decline/cancel
    onChallengeCallback({
      type: "decline",
      challengerId: "u2",
      challengerName: "Bob",
      challengeeId: "default",
      ruleType: "nineball",
    })
    expect(document.getElementById("challengePill")?.hidden).toBe(true)
    expect(document.getElementById("challengeDecline")).not.toBeNull()
    expect(countElement?.classList.contains("is-hidden")).toBe(false)
    expect(element?.getAttribute("href")).toBe(LOBBY_URL)
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
    expect(openedUrl).toBe(LOBBY_URL)

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
    expect(updatePresenceFn.mock.calls.length).toBeGreaterThan(0)

    const firstCall = updatePresenceFn.mock.calls[0]
    expect(firstCall[0]).toEqual({ tableId: "table-123" })

    indicator.setTableId(null)
    const secondCall = updatePresenceFn.mock.calls[1]
    expect(secondCall[0]).toEqual({ tableId: undefined })

    await indicator.stop()
  })

  it("updates opponent status emoji correctly", async () => {
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)

    const element = document.getElementById("lobbyOverlay")
    const countElement = element?.querySelector(".lobby-count") as HTMLElement

    await indicator.init()
    expect(countElement.textContent).toBe("Player 1 👥0 ⚪")

    // Access the mock lobby to trigger onUsersChange callback
    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    // Simulate opponent connected at the same table
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    expect(countElement.textContent).toBe("Player 1 👥2 🟢")

    // Simulate opponent disconnected (not in list)
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])
    expect(countElement.textContent).toBe("Player 1 👥1 🔴")

    // Simulate opponent at a different table
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "other-table" },
    ])
    expect(countElement.textContent).toBe("Player 1 👥2 🔴")

    await indicator.stop()
  })

  it("hides opponent status emoji in non-multiplayer modes", async () => {
    const mockRules = { rulename: "nineball" } as any

    // Bot mode
    Session.init("p1", "Player 1", "table-1", false, true)
    const indicator = new LobbyIndicator(true, false, mockRules)
    await indicator.init()

    const element = document.getElementById("lobbyOverlay")
    const countElement = element?.querySelector(".lobby-count") as HTMLElement
    expect(countElement.textContent).toBe("Player 1 👥0 ⚪")
    await indicator.stop()

    // Replay mode
    Session.reset()
    Session.init("p1", "Player 1", "table-1", false)
    const indicator2 = new LobbyIndicator(false, true, mockRules)
    await indicator2.init()
    const countElement2 = element?.querySelector(".lobby-count") as HTMLElement
    expect(countElement2.textContent).toBe("Anon 👥0 ⚪")
    await indicator2.stop()
  })

  it("uses custom messaging URL when provided", async () => {
    const mockRules = { rulename: "nineball" } as any
    const customUrl = "custom.server.com"
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      undefined,
      customUrl
    )
    await indicator.init()

    expect(MessagingClient).toHaveBeenCalledWith({
      baseUrl: "https://custom.server.com",
    })

    await indicator.stop()
  })

  it("handles protocol-prefixed custom messaging URL", async () => {
    const mockRules = { rulename: "nineball" } as any
    const customUrl = "wss://custom.server.com"
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      undefined,
      customUrl
    )
    await indicator.init()

    expect(MessagingClient).toHaveBeenCalledWith({
      baseUrl: "https://custom.server.com",
    })

    await indicator.stop()
  })

  it("updates title with other user names on users change", async () => {
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const element = document.getElementById("lobbyOverlay")
    const countElement = element?.querySelector(".lobby-count") as HTMLElement

    // Access the mock lobby to trigger onUsersChange callback
    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    // Simulate several users
    onUsersChangeCallback([
      { userId: "test-client", userName: "TestPlayer" },
      { userId: "u2", userName: "Alice" },
      { userId: "u3", userName: "Bob" },
      { userId: "u2", userName: "Alice" }, // Duplicate session for Alice
    ])

    expect(countElement.getAttribute("title")).toBe("Online:\nAlice\nBob")

    // Empty users (except self)
    onUsersChangeCallback([{ userId: "test-client", userName: "TestPlayer" }])
    expect(countElement.hasAttribute("title")).toBe(false)
  })
})
