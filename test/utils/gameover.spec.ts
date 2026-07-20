import { gameOverButtons } from "../../src/utils/gameover"

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

  describe("rematch", () => {
    it("should include standard rematch parameters", () => {
      if (globalThis.history) {
        globalThis.history.replaceState({}, "", "?")
      }

      const html = gameOverButtons.rematch("opponent-123", "Alice", "sagu", "turn-123")
      expect(html).toContain("opponentId=opponent-123")
      expect(html).toContain("opponentName=Alice")
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

      const html = gameOverButtons.rematch("opponent-123", "Alice", "sagu", "turn-123")
      expect(html).toContain("opponentId=opponent-123")
      expect(html).toContain("opponentName=Alice")
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
