// src/network/client/scorereporter.ts
import { MatchResult } from "../../model/matchresult";

export class ScoreReporter {
  private baseURL: string;
  private readonly defaultBaseURL = "scoreboard-tailuge.vercel.app"; // Default URL as per SCOREPLAN.md

  constructor(baseURL?: string) { // baseURL is now optional
    this.baseURL = baseURL || this.defaultBaseURL;
  }

  async submitMatchResult(result: MatchResult): Promise<void> {
    const url = `https://${this.baseURL}/api/match-results`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });
      if (!response.ok) {
        // Log the full response for better debugging
        const errorBody = await response.text();
        console.error("Failed to submit match result:", response.status, response.statusText, errorBody);
      }
    } catch (error) {
      console.error("Error submitting match result:", error);
    }
  }
}
