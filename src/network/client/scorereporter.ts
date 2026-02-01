// src/network/client/scorereporter.ts
import { MatchResult } from "./matchresult"

export class ScoreReporter {
  private baseURL: string
  private readonly defaultBaseURL = "scoreboard-tailuge.vercel.app" // Default URL as per SCOREPLAN.md

  constructor(baseURL?: string) {
    // baseURL is now optional
    this.baseURL = baseURL || this.defaultBaseURL
  }

  async submitMatchResult(result: MatchResult): Promise<void> {
    const url = `https://${this.baseURL}/api/match-results`
    
    // Ensure mandatory fields are present
    if (!result.id) {
      result.id = "0"
    }
    if (!result.timestamp) {
      result.timestamp = Date.now()
    }

    console.log("Submitting match result payload:", JSON.stringify(result, null, 2))

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      })
      if (response.ok) {
        console.log("Match result submitted successfully:", result)
      } else {
        // Log the full response for better debugging
        const errorBody = await response.text()
        console.error(
          "Failed to submit match result:",
          response.status,
          response.statusText,
          errorBody
        )
      }
    } catch (error) {
      console.error("Error submitting match result:", error)
    }
  }
}
