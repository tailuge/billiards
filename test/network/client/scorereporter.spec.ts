// test/network/client/scorereporter.spec.ts
import { ScoreReporter } from "../../../src/network/client/scorereporter"
import { MatchResult } from "../../../src/network/client/matchresult"

describe("ScoreReporter", () => {
  let mockFetch: jest.Mock

  beforeEach(() => {
    mockFetch = jest.fn()
    // Mock the global fetch function
    globalThis.fetch = mockFetch
    jest.spyOn(console, "error").mockImplementation(() => {}) // Suppress console.error during tests
  })

  afterEach(() => {
    jest.restoreAllMocks() // Restore console.error
  })

  const sampleMatchResult: MatchResult = {
    winner: "player1",
    loser: "player2",
    winnerScore: 9,
    loserScore: 7,
    ruleType: "nineball",
  }

  it("should use the default base URL if none is provided", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true }) // Mock a successful response
    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledWith(
      "https://scoreboard-tailuge.vercel.app/api/match-results",
      expect.any(Object)
    )
  })

  it("should use the provided base URL if specified", async () => {
    const customBaseURL = "custom-scoreboard.com"
    const reporter = new ScoreReporter(customBaseURL)
    mockFetch.mockResolvedValueOnce({ ok: true })
    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledWith(
      `https://${customBaseURL}/api/match-results`,
      expect.any(Object)
    )
  })

  it("should send the match result as a JSON POST request", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })
    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleMatchResult),
    })
  })

  it("should not log an error for a successful submission", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })
    await reporter.submitMatchResult(sampleMatchResult)

    expect(console.error).not.toHaveBeenCalled()
  })

  it("should log an error for an unsuccessful submission (response not ok)", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve("Error details"), // Mock text() method
    })
    await reporter.submitMatchResult(sampleMatchResult)

    expect(console.error).toHaveBeenCalledWith(
      "Failed to submit match result:",
      400,
      "Bad Request",
      "Error details"
    )
  })

  it("should log an error for a fetch network error", async () => {
    const reporter = new ScoreReporter()
    const networkError = new Error("Network is down")
    mockFetch.mockRejectedValueOnce(networkError)
    await reporter.submitMatchResult(sampleMatchResult)

    expect(console.error).toHaveBeenCalledWith(
      "Error submitting match result:",
      networkError
    )
  })
})
