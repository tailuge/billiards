import { gameOverButtons } from "../../src/utils/gameover"
import { getLobbyUrl } from "../../src/network/client/constants"

describe("gameOverButtons", () => {
  let originalSearch: string

  beforeAll(() => {
    originalSearch = globalThis.location?.search || ""
  })

  afterAll(() => {
    if (globalThis.history && globalThis.location) {
      globalThis.history.replaceState({}, "", originalSearch || "?")
    }
  })

  describe("translations", () => {
    it("translates a notification button when Korean is selected", () => {
      try {
        globalThis.history.replaceState({}, "", "?locale=ko")
        let buttons: typeof import("../../src/utils/gameover").gameOverButtons
        jest.isolateModules(() => {
          buttons = require("../../src/utils/gameover").gameOverButtons
        })

        // One phrase is enough to prove the labels are routed through t().
        expect(buttons!.lobby).toContain("로비로 돌아가기")
        // Actions stay English so the handlers keep matching.
        expect(buttons!.lobby).toContain('data-notification-action="lobby"')
      } finally {
        globalThis.history.replaceState({}, "", originalSearch || "?")
      }
    })
  })

  describe("lobby URL", () => {
    it("uses the lobby page with the tournament id", () => {
      expect(getLobbyUrl("tournament/123")).toBe(
        "http://localhost/lobby.html?tournamentId=tournament%2F123"
      )
    })

    it("uses the lobby page without a tournament id", () => {
      expect(getLobbyUrl()).toBe("http://localhost/lobby.html")
    })

    it("uses only the arena button when a tournament id is present", () => {
      const html = gameOverButtons.forMode(
        false,
        "opponent-123",
        "Alice",
        "nineball",
        "turn-123",
        "tournament/123"
      )

      expect(html).toContain("Back to Arena")
      expect(html).not.toContain("Back to Lobby")
      expect(html).not.toContain("Rematch")
      expect(html.match(/<button\b/g)).toHaveLength(1)
    })
  })

  describe("map club", () => {
    afterEach(() => {
      if (globalThis.history) {
        globalThis.history.replaceState({}, "", "?")
      }
    })

    it("sends a single Update map button back to the club on a win", () => {
      globalThis.history.replaceState({}, "", "?club=matsuyama&raceTo=7")

      const html = gameOverButtons.forMode(
        true,
        undefined,
        undefined,
        "threecushion",
        undefined,
        undefined,
        true
      )

      expect(html).toContain("Update map")
      expect(html).toContain('data-notification-action="rematch"')
      expect(html).toContain("club=matsuyama")
      expect(html).toContain("won=1")
      expect(html.match(/<button\b/g)).toHaveLength(1)
    })

    it("reports won=0 when the run ends without a win", () => {
      globalThis.history.replaceState({}, "", "?club=matsuyama")

      const html = gameOverButtons.forMode(
        true,
        undefined,
        undefined,
        "threecushion"
      )

      expect(html).toContain("Update map")
      expect(html).toContain("won=0")
    })

    it("keeps the ordinary single player buttons when no club id was sent", () => {
      if (globalThis.history) {
        globalThis.history.replaceState({}, "", "?")
      }

      const html = gameOverButtons.forMode(
        true,
        undefined,
        undefined,
        "threecushion"
      )

      expect(html).not.toContain("Update map")
      expect(html).toContain("New Game")
    })
  })

  describe("rematch", () => {
    it("should include standard rematch parameters", () => {
      if (globalThis.history) {
        globalThis.history.replaceState({}, "", "?")
      }

      const html = gameOverButtons.rematch(
        "opponent-123",
        "Alice",
        "sagu",
        "turn-123"
      )
      expect(html).toContain("opponent.userId=opponent-123")
      expect(html).toContain("opponent.userName=Alice")
      expect(html).toContain("ruletype=sagu")
      expect(html).toContain("nextTurnId=turn-123")
    })

    it("should carry over custom parameters like tableSize and raceTo", () => {
      if (globalThis.history) {
        globalThis.history.replaceState(
          {},
          "",
          "?userId=me&userName=Me&tableId=t123&websocketserver=ws://localhost&tableSize=5&raceTo=5&first=true"
        )
      }

      const html = gameOverButtons.rematch(
        "opponent-123",
        "Alice",
        "sagu",
        "turn-123"
      )
      expect(html).toContain("opponent.userId=opponent-123")
      expect(html).toContain("opponent.userName=Alice")
      expect(html).toContain("ruletype=sagu")
      expect(html).toContain("nextTurnId=turn-123")

      // Custom params must be carried over
      expect(html).toContain("tableSize=5")
      expect(html).toContain("raceTo=5")

      // System params must be excluded
      expect(html).not.toContain("userId=me")
      expect(html).not.toContain("userName=Me")
      expect(html).not.toContain("tableId=t123")
      expect(html).not.toContain("first=true")
    })
  })
})
