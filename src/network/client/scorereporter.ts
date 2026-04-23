// src/network/client/scorereporter.ts
import { MatchResult } from "./matchresult"

export class ScoreReporter {
  private readonly baseURL: string
  private readonly defaultBaseURL = "scoreboard-tailuge.vercel.app" // Default URL as per SCOREPLAN.md

  constructor(baseURL?: string) {
    // baseURL is now optional
    this.baseURL = baseURL || this.defaultBaseURL
  }

  async submitMatchResult(result: MatchResult): Promise<void> {
    const url = `https://${this.baseURL}/api/match-results`
    const maxRetries = 3

    console.log(
      "Submitting match result payload:",
      JSON.stringify(result, null, 2)
    )

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const success = await this.attemptSubmission(url, result)
      if (success) return

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
      // If it's a client error (4xx), don't retry, except maybe 429
      const { status } = response
      if (status >= 400 && status < 500 && status !== 429) {
        return true // Stop retrying by returning true (though submission failed)
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
