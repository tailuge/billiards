// src/network/client/scorereporter.ts
import { MatchResult } from "./matchresult"
import { ARENA_BASE_URL } from "./constants"

export class ScoreReporter {
  private readonly baseURL: string
  private readonly defaultBaseURL = "scoreboard-tailuge.vercel.app" // Default URL as per SCOREPLAN.md

  constructor(baseURL?: string) {
    // baseURL is now optional
    this.baseURL = baseURL || this.defaultBaseURL
  }

  async submitMatchResult(result: MatchResult): Promise<void> {
    if (this.shouldSkipUpload(result)) {
      console.log("Skipping match result upload for Alice/Bob")
      return
    }
    const url = `https://${this.baseURL}/api/match-results`
    const maxRetries = 3

    console.log(
      "Submitting match result payload:",
      JSON.stringify(result, null, 2)
    )

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const completed = await this.attemptSubmission(url, result)
      if (completed) return

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(
          `Retrying match result submission in ${delay}ms... (Attempt ${
            attempt + 1
          }/${maxRetries})`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  async submitTournamentResult(
    tournamentId: string,
    tableId: string,
    winnerId: string,
    loserId?: string
  ): Promise<void> {
    const url = `${ARENA_BASE_URL}/api/arena/${encodeURIComponent(
      tournamentId
    )}/result`
    const payload: {
      challengeId: string
      winnerId: string
      loserId?: string
    } = {
      challengeId: tableId,
      winnerId,
    }
    if (loserId) {
      payload.loserId = loserId
    }

    console.log("Uploading tournament arena result:", {
      url,
      payload,
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      let responseBody: string
      try {
        responseBody = await response.text()
      } catch (error) {
        responseBody = `Could not read response body: ${String(error)}`
      }
      console.log("Tournament arena result full response:", {
        response,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: responseBody,
      })
    } catch (error) {
      console.error("Error submitting tournament result to", url, error)
    }
  }

  private shouldSkipUpload(result: MatchResult): boolean {
    const players = [result.winner, result.loser]
      .filter((n): n is string => !!n)
      .map((n) => n.toLowerCase())

    const hasAlice = players.some((n) => n.includes("alice"))
    const hasBob = players.some((n) => n.includes("bob"))

    return hasAlice && hasBob
  }

  private async attemptSubmission(
    url: string,
    result: MatchResult
  ): Promise<boolean> {
    const timeoutMs = 10000
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        console.log("Match result submitted successfully:", result)
        return true
      }

      await this.handleErrorResponse(response)
      // If it's a client error (4xx), don't retry, except 429.
      const { status } = response
      if (status >= 400 && status < 500 && status !== 429) {
        return true
      }
    } catch (error) {
      clearTimeout(timeoutId)
      this.handleFetchError(error, url)
    }
    return false
  }

  private async handleErrorResponse(response: Response): Promise<void> {
    const { status, statusText } = response
    let errorBody: string
    try {
      errorBody = await response.text()
    } catch {
      errorBody = `Could not read response body (status: ${status})`
    }
    console.error(
      new Error(`Failed to submit match result: ${status} ${statusText}`),
      status,
      statusText,
      errorBody
    )
  }

  private handleFetchError(error: unknown, url: string): void {
    const isTimeout = error instanceof Error && error.name === "AbortError"
    const message = isTimeout
      ? "Request timed out"
      : "Network error or Load failed"

    console.error(
      error instanceof Error ? error : new Error(message),
      "Error submitting match result to",
      url,
      error
    )
  }
}
