// src/network/client/scorereporter.ts
import { MatchResult } from "./matchresult"
import { ARENA_BASE_URL } from "./constants"
import { t } from "../../utils/i18n"
import { logusage } from "../../utils/usage"

/** Each upload is a single attempt with this timeout. */
const UPLOAD_TIMEOUT_MS = 15000

export class ScoreReporter {
  private readonly baseURL: string

  // A caller-supplied base URL must include its scheme,
  // e.g. "https://custom-scoreboard.com".
  constructor(baseURL: string = ARENA_BASE_URL) {
    this.baseURL = baseURL
  }

  async submitMatchResult(result: MatchResult): Promise<void> {
    if (this.shouldSkipUpload(result)) {
      console.log("Skipping match result upload for Alice/Bob")
      return
    }
    logusage("complete")

    const url = `${this.baseURL}/api/match-results`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)

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
        return
      }
      await this.handleErrorResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      this.handleFetchError(error, url)
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
    const payload = {
      challengeId: tableId,
      winnerId,
      ...(loserId ? { loserId } : {}),
      ...(berserk ? { berserk: true } : {}),
    }

    console.log("Uploading tournament arena result:", {
      url,
      payload,
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)

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

      this.updateArenaResultButton(response.ok)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Error submitting tournament result to", url, error)
      this.updateArenaResultButton(false)
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
   * Puts the "Back to Arena" button into an inert "Uploading result…" state for
   * the whole end-of-game upload, then restores its label so it can be clicked
   * again. Only the client doing the uploading runs this, so the opponent's
   * button is unaffected. Covers the scoreboard upload that precedes the arena
   * request too, so a click can't navigate away and cancel either one.
   */
  setArenaButtonUploading(uploading: boolean): void {
    const button = this.getArenaButton()
    if (!button) return
    button.disabled = uploading
    button.textContent = uploading ? t("Uploading result…") : t("Back to Arena")
  }

  private shouldSkipUpload(result: MatchResult): boolean {
    const players = [result.winner, result.loser]
      .filter((n): n is string => !!n)
      .map((n) => n.toLowerCase())

    const hasAlice = players.some((n) => n.includes("alice"))
    const hasBob = players.some((n) => n.includes("bob"))

    return hasAlice && hasBob
  }

  private async handleErrorResponse(response: Response): Promise<void> {
    let errorBody: string
    try {
      errorBody = await response.text()
    } catch {
      errorBody = `Could not read response body (status: ${response.status})`
    }
    console.error(
      new Error(
        `Failed to submit match result: ${response.status} ${response.statusText}`
      ),
      response.status,
      response.statusText,
      errorBody
    )
  }

  private handleFetchError(error: unknown, url: string): void {
    const failure = error instanceof Error ? error : new Error("Network error")
    console.error(failure, "Error submitting match result to", url, error)
  }
}
