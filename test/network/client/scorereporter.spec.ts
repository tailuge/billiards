// test/network/client/scorereporter.spec.ts
import { ScoreReporter } from "../../../src/network/client/scorereporter"
import { MatchResult } from "../../../src/network/client/matchresult"

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

  it("should use the default base URL if none is provided", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({ ok: true })
    const promise = reporter.submitMatchResult(sampleMatchResult)
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledWith(
      "https://scoreboard-tailuge.vercel.app/api/match-results",
      expect.any(Object)
    )
  })

  it("should use the provided base URL if specified", async () => {
    const customBaseURL = "custom-scoreboard.com"
    const reporter = new ScoreReporter(customBaseURL)
    mockFetch.mockResolvedValueOnce({ ok: true })
    const promise = reporter.submitMatchResult(sampleMatchResult)
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledWith(
      `https://${customBaseURL}/api/match-results`,
      expect.any(Object)
    )
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

  it("should retry 3 times on network failure with exponential backoff", async () => {
    const reporter = new ScoreReporter()
    const networkError = new Error("Network error")
    mockFetch.mockRejectedValue(networkError)

    const promise = reporter.submitMatchResult(sampleMatchResult)

    // Attempt 0 fails, wait 1s
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1000)

    // Attempt 1 fails, wait 2s
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(2000)

    // Attempt 2 fails, wait 4s
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    jest.advanceTimersByTime(4000)

    // Attempt 3 fails, stop
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(4)

    await promise
    expect(console.error).toHaveBeenCalledTimes(4)
  })

  it("should stop retrying if an attempt succeeds", async () => {
    const reporter = new ScoreReporter()
    mockFetch
      .mockRejectedValueOnce(new Error("Failure 1"))
      .mockRejectedValueOnce(new Error("Failure 2"))
      .mockResolvedValueOnce({ ok: true })

    const promise = reporter.submitMatchResult(sampleMatchResult)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1000)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(2000)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(3)

    await promise
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(console.log).toHaveBeenCalledWith(
      "Match result submitted successfully:",
      sampleMatchResult
    )
  })

  it("should not retry on 4xx errors (except 429)", async () => {
    const reporter = new ScoreReporter()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve("Validation failed"),
    })

    const promise = reporter.submitMatchResult(sampleMatchResult)
    await flushPromises()
    jest.runAllTimers()
    await promise

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("should retry on 5xx errors", async () => {
    const reporter = new ScoreReporter()
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: () => Promise.resolve("Server error"),
      })
      .mockResolvedValueOnce({ ok: true })

    const promise = reporter.submitMatchResult(sampleMatchResult)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1000)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(2)

    await promise
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("should retry on 429 Too Many Requests", async () => {
    const reporter = new ScoreReporter()
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: () => Promise.resolve("Rate limited"),
      })
      .mockResolvedValueOnce({ ok: true })

    const promise = reporter.submitMatchResult(sampleMatchResult)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1000)

    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(2)

    await promise
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("should timeout after 10 seconds", async () => {
    const reporter = new ScoreReporter()
    // Mock fetch that never resolves until aborted
    mockFetch.mockImplementation((url, { signal }) => {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          const error = new Error("The operation was aborted.")
          error.name = "AbortError"
          return reject(error)
        }

        if (signal) {
          signal.addEventListener("abort", () => {
            const error = new Error("The operation was aborted.")
            error.name = "AbortError"
            reject(error)
          })
        }
      })
    })

    const promise = reporter.submitMatchResult(sampleMatchResult)

    // Attempt 0
    await flushPromises()
    jest.advanceTimersByTime(10000) // Trigger timeout

    // Wait for the catch block and retry delay to start
    await flushPromises()
    jest.advanceTimersByTime(1000)

    // Attempt 1
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(2)

    // Attempt 1 timeout
    jest.advanceTimersByTime(10000)
    await flushPromises()
    jest.advanceTimersByTime(2000)

    // Attempt 2
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(3)

    // Attempt 2 timeout
    jest.advanceTimersByTime(10000)
    await flushPromises()
    jest.advanceTimersByTime(4000)

    // Attempt 3
    await flushPromises()
    expect(mockFetch).toHaveBeenCalledTimes(4)

    // Attempt 3 timeout
    jest.advanceTimersByTime(10000)

    await promise

    expect(mockFetch).toHaveBeenCalledTimes(4)
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({ name: "AbortError" }),
      "Error submitting match result to",
      expect.any(String),
      expect.objectContaining({ name: "AbortError" })
    )
  })
})
