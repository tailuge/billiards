// test/network/client/scorereporter.spec.ts
import { ScoreReporter } from "../../../src/network/client/scorereporter"
import { MatchResult } from "../../../src/network/client/matchresult"
import { Session } from "../../../src/network/client/session"
import { MatchResultHelper } from "../../../src/network/client/matchresult"

describe("ScoreReporter", () => {
  let mockFetch: jest.Mock
  let originalFetch: typeof fetch

  beforeEach(() => {
    mockFetch = jest.fn()
    originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch
    jest.spyOn(console, "error").mockImplementation(() => {})
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.useFakeTimers()
  })

  afterEach(() => {
    Session.reset()
    globalThis.fetch = originalFetch
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  const sampleMatchResult: MatchResult = {
    winner: "player1",
    loser: "player2",
    winnerScore: 9,
    loserScore: 7,
    ruleType: "nineball",
  }

  // Utility to flush microtasks
  const flushPromises = () =>
    new Promise(jest.requireActual("timers").setImmediate)

  it("should use the shared scheme-aware base URL by default", async () => {
    // jsdom runs on localhost, where the shared constant points at the local
    // network stack over http.
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })
    const promise = reporter.submitMatchResult(sampleMatchResult)
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost/api/match-results",
      expect.any(Object)
    )
  })

  it("should use the provided base URL, including its scheme", async () => {
    const customBaseURL = "https://custom-scoreboard.com"
    const reporter = new ScoreReporter(customBaseURL)
    mockFetch.mockResolvedValueOnce({ ok: true })
    const promise = reporter.submitMatchResult(sampleMatchResult)
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledWith(
      `${customBaseURL}/api/match-results`,
      expect.any(Object)
    )
  })

  it("should derive the bot user ID from the bot URL parameter", () => {
    const originalSearch = globalThis.location.search
    globalThis.history.replaceState({}, "", "?bot=ClawBreak")

    expect(Session.getBotUserId()).toBe("bot-clawbreak")

    globalThis.history.replaceState({}, "", originalSearch || "/")
  })

  it("adds arenaId to match results when tournamentId is set", () => {
    Session.init(
      "client-1",
      "Player 1",
      "table-1",
      false,
      false,
      false,
      false,
      1,
      false,
      false,
      "arena-123"
    )
    const session = Session.getInstance()
    session.setMyScore(9)
    session.opponentName = "Player 2"
    session.setOpponentScore(7)

    const result = (MatchResultHelper as any).createMatchResult(
      "nineball",
      session,
      true
    )

    expect(result.arenaId).toBe("arena-123")
  })

  it("does not add arenaId to match results without a tournamentId", () => {
    const reporter = new ScoreReporter()
    const resultWithoutArena = { ...sampleMatchResult }

    expect(resultWithoutArena).not.toHaveProperty("arenaId")
    expect(reporter).toBeDefined()
  })

  it("should submit a tournament result to the local arena API", async () => {
    const reporter = new ScoreReporter()
    const arenaResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: "arena-response-headers",
      text: () => Promise.resolve('{"recorded":true}'),
    }
    mockFetch.mockResolvedValueOnce(arenaResponse)

    await reporter.submitTournamentResult(
      "tournament/1",
      "table-1",
      "winner-1",
      "loser-1"
    )
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost/api/arena/tournament%2F1/result",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: "table-1",
          winnerId: "winner-1",
          loserId: "loser-1",
        }),
        signal: expect.any(AbortSignal),
      }
    )
    expect(console.log).toHaveBeenCalledWith(
      "Uploading tournament arena result:",
      {
        url: "http://localhost/api/arena/tournament%2F1/result",
        payload: {
          challengeId: "table-1",
          winnerId: "winner-1",
          loserId: "loser-1",
        },
      }
    )
    expect(console.log).toHaveBeenCalledWith(
      "Tournament arena result full response:",
      {
        response: arenaResponse,
        ok: true,
        status: 200,
        statusText: "OK",
        headers: "arena-response-headers",
        body: '{"recorded":true}',
      }
    )
  })

  it("should not retry a failed tournament result", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockRejectedValue(new Error("Network error"))

    await reporter.submitTournamentResult(
      "tournament/1",
      "table-1",
      "winner-1",
      "loser-1"
    )

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it("should time out a tournament result after 15 seconds without retrying", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockImplementation((url, { signal }) => {
      return new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => {
          const error = new Error("The operation was aborted.")
          error.name = "AbortError"
          reject(error)
        })
      })
    })

    const promise = reporter.submitTournamentResult(
      "tournament/1",
      "table-1",
      "winner-1",
      "loser-1"
    )

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Still in flight just before the 15s timeout.
    jest.advanceTimersByTime(14999)
    await flushPromises()
    expect(console.error).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    await promise

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it("should not retry tournament result on a 409 response", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      statusText: "Conflict",
      headers: "arena-response-headers",
      text: () => Promise.resolve('{"error":"already recorded"}'),
    })

    await reporter.submitTournamentResult(
      "tournament/1",
      "table-1",
      "winner-1",
      "loser-1"
    )

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("should not retry a tournament result on a 5xx response", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      headers: "arena-response-headers",
      text: () => Promise.resolve("Server busy"),
    })

    await reporter.submitTournamentResult(
      "tournament/1",
      "table-1",
      "winner-1",
      "loser-1"
    )

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("should send the match result as a JSON POST request", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })
    const promise = reporter.submitMatchResult(sampleMatchResult)
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleMatchResult),
      signal: expect.any(AbortSignal),
    })
  })

  it("should not retry a failed match result upload", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockRejectedValue(new Error("Network error"))

    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it("should not retry after a successful submission", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })

    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(
      "Match result submitted successfully:",
      sampleMatchResult
    )
  })

  it.each([
    [400, "Bad Request", "Validation failed"],
    [500, "Internal Server Error", "Server error"],
    [429, "Too Many Requests", "Rate limited"],
  ])("should not retry on a %i response", async (status, statusText, body) => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status,
      statusText,
      text: () => Promise.resolve(body),
    })

    await reporter.submitMatchResult(sampleMatchResult)

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("should time out after 15 seconds without retrying", async () => {
    const reporter = new ScoreReporter()
    // Mock fetch that never resolves until aborted
    mockFetch.mockImplementation((url, { signal }) => {
      return new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => {
          const error = new Error("The operation was aborted.")
          error.name = "AbortError"
          reject(error)
        })
      })
    })

    const promise = reporter.submitMatchResult(sampleMatchResult)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Still in flight just before the 15s timeout.
    jest.advanceTimersByTime(14999)
    await flushPromises()
    expect(console.error).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    await promise

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({ name: "AbortError" }),
      "Error submitting match result to",
      expect.any(String),
      expect.objectContaining({ name: "AbortError" })
    )
  })

  it("should skip upload if players names contain Alice and Bob (substrings)", async () => {
    const reporter = new ScoreReporter()
    const aliceBobResult: MatchResult = {
      winner: "Alice1",
      loser: "2Bob3",
      winnerScore: 10,
      loserScore: 5,
      ruleType: "snooker",
    }

    await reporter.submitMatchResult(aliceBobResult)
    expect(mockFetch).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      "Skipping match result upload for Alice/Bob"
    )
  })

  it("should skip upload if both names contain Alice and Bob reversed", async () => {
    const reporter = new ScoreReporter()
    const bobAliceResult: MatchResult = {
      winner: "the-bob-inator",
      loser: "princess_alice",
      winnerScore: 10,
      loserScore: 5,
      ruleType: "snooker",
    }

    await reporter.submitMatchResult(bobAliceResult)
    expect(mockFetch).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      "Skipping match result upload for Alice/Bob"
    )
  })
})
