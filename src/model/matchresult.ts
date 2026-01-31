// src/model/matchresult.ts
export interface MatchResult {
  id?: string
  winner: string
  loser: string
  winnerScore: number
  loserScore: number
  gameType: "nineball" | "snooker" | "threecushion"
  timestamp?: number
}
