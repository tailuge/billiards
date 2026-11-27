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
    expect(countElement?.textContent).toContain("TestPlayer")
  })

  it("renders the count in its own slot so its width is the CSS's to hold", async () => {
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    // Before the first presence snapshot the count is 0; what matters is that
    // the number is an element with a settable width, not a bare text node.
    const total = document
      .getElementById("lobbyOverlay")
      ?.querySelector(".lobby-count .lobby-total")
    expect(total?.textContent).toBe("0")
  })

  it("includes arenaId in presence when tournamentId is set", async () => {
    Session.init(
      "test-client",
      "TestPlayer",
      "test-table",
      false,
      false,
      false,
      false,
      2,
      true,
      false,
      "arena-123"
    )
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockClient = (indicator as any).messagingClient
    const joinLobbyPresence = mockClient.joinLobby.mock.calls[0][0]
    expect(joinLobbyPresence.arenaId).toBe("arena-123")

    // setTableId should also propagate arenaId
    const mockLobby = (indicator as any).lobby
    indicator.setTableId("new-table")
    expect(mockLobby.updatePresence).toHaveBeenCalledWith(
      expect.objectContaining({ arenaId: "arena-123" })
    )

    await indicator.stop()
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

    expect(document.getElementById("challengePill")?.textContent).toContain(
      "Bob"
    )
    expect(element?.getAttribute("aria-label")).toContain("CHALLENGE FROM Bob")

    const href = element?.getAttribute("href") ?? ""
    expect(href).toContain("action=join")
    expect(href).toContain("ruletype=nineball")
    expect(href).toContain("opponent.userId=u2")
    expect(href).toContain("opponent.userName=Bob")

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
    expect(element?.getAttribute("href")).toBe(LOBBY_URL)
  })

  it("forwards challenge options to the lobby URL", async () => {
    const mockRules = { rulename: "snooker" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const onChallengeCallback = mockLobby.onChallenge.mock.calls[0][0]

    // Snooker 3 reds on the small table: the options must survive the handoff
    // so the lobby can re-issue the challenge with the same settings.
    onChallengeCallback({
      type: "offer",
      challengerId: "u2",
      challengerName: "Bob",
      challengeeId: "default",
      ruleType: "snooker",
      options: { reds: "3", tableSize: "6" },
    })

    const element = document.getElementById("lobbyOverlay")
    const params = new URL(element?.getAttribute("href") ?? "").searchParams
    expect(params.get("reds")).toBe("3")
    expect(params.get("tableSize")).toBe("6")
    expect(params.get("opponent.userId")).toBe("u2")
    expect(params.get("ruletype")).toBe("snooker")

    await indicator.stop()
  })

  it("does not let challenge options clobber handoff params", async () => {
    const mockRules = { rulename: "snooker" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const onChallengeCallback = mockLobby.onChallenge.mock.calls[0][0]

    // Options come from the (remote) challenger, so they must not be able to
    // redirect this session to a different opponent/rule.
    onChallengeCallback({
      type: "offer",
      challengerId: "u2",
      challengerName: "Bob",
      challengeeId: "default",
      ruleType: "snooker",
      options: {
        "opponent.userId": "attacker",
        ruletype: "eightball",
        userId: "attacker",
        tableSize: "6",
      } as any,
    })

    const element = document.getElementById("lobbyOverlay")
    const params = new URL(element?.getAttribute("href") ?? "").searchParams
    expect(params.get("opponent.userId")).toBe("u2")
    expect(params.get("ruletype")).toBe("snooker")
    expect(params.get("userId")).toBeNull()
    expect(params.get("tableSize")).toBe("6")

    await indicator.stop()
  })

  describe("accepting a challenge", () => {
    const acceptChallenge = async (embedded = false) => {
      const mockRules = { rulename: "snooker" } as any
      const indicator = new LobbyIndicator(false, false, mockRules)
      // jsdom's `top` is the page itself, so framing is stubbed instead.
      if (embedded) {
        jest.spyOn(indicator as any, "isEmbedded").mockReturnValue(true)
      }
      await indicator.init()

      const mockLobby = (indicator as any).lobby
      mockLobby.onChallenge.mock.calls[0][0]({
        type: "offer",
        challengerId: "u2",
        challengerName: "Bob",
        ruleType: "snooker",
        tableId: "table-9",
      })

      const opened: [string, string | undefined][] = []
      const originalOpen = globalThis.open
      globalThis.open = ((url: string, target?: string) => {
        opened.push([url, target])
        return {}
      }) as any

      try {
        ;(document.getElementById("challengeAccept") as HTMLElement).click()
      } finally {
        globalThis.open = originalOpen
      }

      return { opened, mockLobby }
    }

    it("navigates in place when not embedded", async () => {
      const { opened, mockLobby } = await acceptChallenge()

      expect(opened).toHaveLength(1)
      expect(opened[0][1]).toBe("_self")
      expect(opened[0][0]).toContain("acceptTableId=table-9")
      expect(mockLobby.leave).not.toHaveBeenCalled()
    })

    it("opens a new tab and drops the presence when embedded", async () => {
      const { opened, mockLobby } = await acceptChallenge(true)

      expect(opened).toHaveLength(1)
      expect(opened[0][1]).toBe("_blank")
      expect(opened[0][0]).toContain("acceptTableId=table-9")
      // The old page keeps running, so it must not linger at the table.
      expect(mockLobby.leave).toHaveBeenCalled()
    })
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

  it("keeps the player in game when clicking the indicator against a real opponent", async () => {
    // practiceMode defaults to true for every rule except nineball, so a
    // three-cushion match still has practiceMode set. The click must not
    // bounce the player back to the lobby.
    Session.init("p1", "Player 1", "table-1", false, false, false, true)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "threecushion" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const element = document.getElementById("lobbyOverlay") as HTMLElement
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)

    await indicator.stop()
  })

  it("uses canonical rule names while preserving tableSize in presence", async () => {
    const originalSearch = globalThis.location.search
    globalThis.history.replaceState({}, "", "?tableSize=5")

    try {
      for (const rulename of ["sagu", "threecushion"]) {
        Session.init("test-client", "TestPlayer", "test-table", false)
        const indicator = new LobbyIndicator(false, false, { rulename } as any)
        await indicator.init()

        const messagingClient = (indicator as any).messagingClient
        const presence = messagingClient.joinLobby.mock.calls[0][0]
        expect(presence.ruleType).toBe(rulename)
        expect(presence.options).toEqual({ tableSize: "5" })

        await indicator.stop()
      }
    } finally {
      globalThis.history.replaceState({}, "", originalSearch || "?")
    }
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
    expect(firstCall[0]).toEqual({
      tableId: "table-123",
      options: {},
    })

    indicator.setTableId(null)
    const secondCall = updatePresenceFn.mock.calls[1]
    expect(secondCall[0]).toEqual({
      tableId: undefined,
      options: {},
    })

    await indicator.stop()
  })

  it("reports the opponent state that colours the status dot", async () => {
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)

    const countElement = document
      .getElementById("lobbyOverlay")
      ?.querySelector(".lobby-count") as HTMLElement

    await indicator.init()
    expect(countElement?.textContent).toContain("Player 1")
    // No presence snapshot yet: neutral, which must not read as either state.
    expect(countElement.dataset.opponent).toBe("unknown")

    // Access the mock lobby to trigger onUsersChange callback
    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    // Opponent connected at the same table
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    expect(countElement.dataset.opponent).toBe("online")

    // Opponent disconnected (not in list)
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])
    expect(countElement.dataset.opponent).toBe("offline")

    // Present, but at another table: away from this game, not at it.
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "other-table" },
    ])
    expect(countElement.dataset.opponent).toBe("offline")

    await indicator.stop()
  })

  it("keeps the status dot neutral outside a multiplayer game", async () => {
    const mockRules = { rulename: "nineball" } as any
    const dotState = () =>
      (
        document
          .getElementById("lobbyOverlay")
          ?.querySelector(".lobby-count") as HTMLElement
      )?.dataset.opponent

    // Bot mode: there is no opponent to report on.
    Session.init("p1", "Player 1", "table-1", false, true)
    const indicator = new LobbyIndicator(true, false, mockRules)
    await indicator.init()

    const element = document.getElementById("lobbyOverlay")
    const countElement = element?.querySelector(".lobby-count") as HTMLElement
    expect(countElement?.textContent).toContain("Player 1")
    expect(dotState()).toBe("unknown")
    await indicator.stop()

    // Replay mode: the chip shows the watcher's own name (session.playername at
    // construction), which is seeded from ?userName= ("Anon" when absent). A
    // name that would light the dot in a real game stays neutral here.
    Session.reset()
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")
    const indicator2 = new LobbyIndicator(false, true, mockRules)
    await indicator2.init()

    const countElement2 = element?.querySelector(".lobby-count") as HTMLElement
    expect(countElement2?.textContent).toContain("Player 1")

    const onUsersChangeCallback2 = (indicator2 as any).lobby.onUsersChange.mock
      .calls[0][0]
    onUsersChangeCallback2([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    expect(dotState()).toBe("unknown")
    await indicator2.stop()
  })

  it("sets the name as text, so a markup-shaped userName cannot run", async () => {
    // The name reaches this class from ?userName= with no sanitising step
    // (BrowserContainer reads it straight off the query string), so the row must
    // be built from text nodes: as innerHTML, this name would create an element.
    const injected = '<img src=x onerror="globalThis.pwned = true">'
    Session.init("p1", injected, "table-1", false)

    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const countElement = document
      .getElementById("lobbyOverlay")
      ?.querySelector(".lobby-count") as HTMLElement
    const nameElement = countElement.querySelector(".lobby-name") as HTMLElement

    // Round-trips as characters: nothing was parsed out of it, and there is no
    // handler left to fire.
    expect(nameElement.textContent).toBe(injected)
    expect(countElement.querySelector("img")).toBeNull()
    expect((globalThis as any).pwned).toBeUndefined()

    await indicator.stop()
  })

  it("shows the watched rule's emoji in replay and spectate modes", async () => {
    const mockRules = { rulename: "snooker" } as any
    const ruleBadge = () =>
      document
        .getElementById("lobbyOverlay")
        ?.querySelector(".lobby-count .lobby-rule")?.textContent

    const replay = new LobbyIndicator(false, true, mockRules)
    await replay.init()
    expect(ruleBadge()).toBe("⚫")
    await replay.stop()

    Session.reset()
    Session.init("p1", "Player 1", "table-1", true)
    const spectator = new LobbyIndicator(false, false, mockRules)
    await spectator.init()
    expect(ruleBadge()).toBe("⚫")
    await spectator.stop()
  })

  it("keeps the watcher's name when replay playback overwrites the session name", async () => {
    const mockRules = { rulename: "nineball" } as any
    Session.init("p1", "Player 1", "table-1", false)
    const indicator = new LobbyIndicator(false, true, mockRules)
    await indicator.init()

    // What BrowserContainer.startReplay() does once the replay is parsed.
    Session.getInstance().playername = "Recorder"

    // Any later presence update re-renders the chip.
    const mockLobby = (indicator as any).lobby
    mockLobby.onUsersChange.mock.calls[0][0]([])

    const countElement = document
      .getElementById("lobbyOverlay")
      ?.querySelector(".lobby-count") as HTMLElement
    expect(countElement?.textContent).toContain("Player 1")
    expect(countElement?.textContent).not.toContain("Recorder")

    await indicator.stop()
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

  it("logs local player offline and reconnect events with unique emojis", async () => {
    Session.init("p1", "Player 1", "table-1", false)

    const mockRules = { rulename: "nineball" } as any
    const mockOnChatMessage = jest.fn()
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      mockOnChatMessage
    )

    await indicator.init()

    // 1. Simulate local player going offline
    const offlineEvent = new window.Event("offline")
    globalThis.dispatchEvent(offlineEvent)
    expect(mockOnChatMessage).toHaveBeenCalled()

    mockOnChatMessage.mockClear()

    // 2. Simulate websocket/lobby reconnecting
    const joinLobbyCall = (indicator as any).messagingClient.joinLobby
    const joinLobbyOptions = joinLobbyCall.mock.calls[0][1]

    expect(joinLobbyOptions).toBeDefined()
    expect(joinLobbyOptions.onReconnect).toBeDefined()

    // Trigger onReconnect callback
    joinLobbyOptions.onReconnect()
    expect(mockOnChatMessage).toHaveBeenCalled()

    const { NetworkLogger } = require("../../src/utils/network-logger")
    const getGameLogLabels = () =>
      NetworkLogger.getGameLogs().map((log: any) => log.label)
    expect(getGameLogLabels()).toContain("lobby reconnect")

    await indicator.stop()
  })

  it("announces the opponent disconnect only after 30 seconds", async () => {
    jest.useFakeTimers()
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "nineball" } as any
    const mockOnChatMessage = jest.fn()
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      mockOnChatMessage
    )
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    // Waiting for the opponent to join is not a disconnect.
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])
    expect(mockOnChatMessage).not.toHaveBeenCalled()

    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    expect(mockOnChatMessage).not.toHaveBeenCalled()

    // The opponent leaving the table is the same transition the dot reports,
    // but the plug waits so a tab switch cannot flood the chat.
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])
    jest.advanceTimersByTime(29_999)
    expect(mockOnChatMessage).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockOnChatMessage).toHaveBeenCalledWith("🔌")

    mockOnChatMessage.mockClear()
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    expect(mockOnChatMessage).toHaveBeenCalledWith("⚡")

    await indicator.stop()
    jest.useRealTimers()
  })

  it("cancels the delayed disconnect when the opponent reconnects", async () => {
    jest.useFakeTimers()
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "nineball" } as any
    const mockOnChatMessage = jest.fn()
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      mockOnChatMessage
    )
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])
    jest.advanceTimersByTime(20_000)
    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    jest.advanceTimersByTime(30_000)

    // The plug was never shown, so the return is not a reconnect either.
    expect(mockOnChatMessage).not.toHaveBeenCalled()

    await indicator.stop()
    jest.useRealTimers()
  })

  it("announces the opponent disconnect immediately in End", async () => {
    Session.init("p1", "Player 1", "table-1", false)
    Session.getInstance().setOpponentClientId("p2")

    const mockRules = { rulename: "nineball" } as any
    const mockOnChatMessage = jest.fn()
    const indicator = new LobbyIndicator(
      false,
      false,
      mockRules,
      mockOnChatMessage,
      undefined,
      () => true
    )
    await indicator.init()

    const mockLobby = (indicator as any).lobby
    const onUsersChangeCallback = mockLobby.onUsersChange.mock.calls[0][0]

    onUsersChangeCallback([
      { userId: "p1", tableId: "table-1" },
      { userId: "p2", tableId: "table-1" },
    ])
    onUsersChangeCallback([{ userId: "p1", tableId: "table-1" }])

    expect(mockOnChatMessage).toHaveBeenCalledWith("🔌")

    await indicator.stop()
  })

  it("leaves the lobby after the scheduled delay", async () => {
    jest.useFakeTimers()
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockLobby = (indicator as any).lobby

    indicator.scheduleLeave(60 * 1000)
    jest.advanceTimersByTime(59 * 1000)
    expect(mockLobby.leave).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1000)
    expect(mockLobby.leave).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
    await indicator.stop()
  })

  it("cancels the scheduled leave on stop", async () => {
    jest.useFakeTimers()
    const mockRules = { rulename: "nineball" } as any
    const indicator = new LobbyIndicator(false, false, mockRules)
    await indicator.init()

    const mockLobby = (indicator as any).lobby

    indicator.scheduleLeave(60 * 1000)
    await indicator.stop()
    jest.advanceTimersByTime(60 * 1000)

    // stop() already leaves once; the cancelled timer must not leave again.
    expect(mockLobby.leave).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
  })
})
