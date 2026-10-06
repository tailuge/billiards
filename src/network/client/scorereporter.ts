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
    loserId?: string,
    berserk?: boolean
  ): Promise<void> {
    const url = `${ARENA_BASE_URL}/api/arena/${encodeURIComponent(
      tournamentId
    )}/result`
    const payload: {
      challengeId: string
      winnerId: string
      loserId?: string
      berserk?: boolean
    } = {
      challengeId: tableId,
      winnerId,
    }
    if (loserId) {
      payload.loserId = loserId
    }
    if (berserk) {
      payload.berserk = true
    }

    console.log("Uploading tournament arena result:", {
      url,
      payload,
    })

    // Retry once on connection failure (network error or timeout) or when
    // the server looks slow/busy (5xx or 429). A definitive response — 2xx
    // or a 4xx like 409 (already recorded) — means the result was handled
    // and no retry is needed.
    //
    // Keep the button inert until the upload resolves so a click can't
    // navigate away and cancel the request. Only the uploading client reaches
    // this path, so the non-uploading opponent's button stays active.
    this.setArenaButtonDisabled(true)
    try {
      const maxRetries = 1
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const completed = await this.attemptTournamentSubmission(url, payload)
        if (completed) return

        if (attempt < maxRetries) {
          const delay = 1000
          console.log(
            `Retrying tournament arena result submission in ${delay}ms... (Attempt ${
              attempt + 1
            }/${maxRetries})`
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    } finally {
      this.setArenaButtonDisabled(false)
    }
  }

  private async attemptTournamentSubmission(
    url: string,
    payload: {
      challengeId: string
      winnerId: string
      loserId?: string
      berserk?: boolean
    }
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
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
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

      // 2xx, or a 4xx other than 429 (e.g. 409 already recorded): the server
      // handled the result — treat as final, no retry. 5xx and 429 mean the
      // server was slow/busy, so one retry is worthwhile.
      const { status } = response
      this.updateArenaResultButton(response.ok)
      return response.ok || (status >= 400 && status < 500 && status !== 429)
    } catch (error) {
      clearTimeout(timeoutId)
      // Connection failure or timeout — signal that a retry is worthwhile.
      console.error("Error submitting tournament result to", url, error)
      this.updateArenaResultButton(false)
      return false
    }
  }

  private getArenaButton(): HTMLButtonElement | null {
    if (typeof document === "undefined") return null
    return document.getElementById("arenabutton") as HTMLButtonElement | null
  }

  /**
   * Colours the "Back to Arena" button in the game-over banner (rendered with
   * id="arenabutton" by gameover.ts) to reflect the arena result upload: green
   * on success (2xx), red otherwise. No-ops outside the browser or when the
   * banner is no longer on screen.
   */
  private updateArenaResultButton(ok: boolean): void {
    const button = this.getArenaButton()
    if (!button) return
    button.classList.toggle("is-upload-ok", ok)
    button.classList.toggle("is-upload-fail", !ok)
  }

  /**
   * Makes the arena result button inert while the upload is in flight so a
   * click can't navigate away and cancel the request. Only the uploading
   * client runs this, so the opponent's button is unaffected.
   */
  private setArenaButtonDisabled(disabled: boolean): void {
    const button = this.getArenaButton()
    if (button) {
      button.disabled = disabled
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
