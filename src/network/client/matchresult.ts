export interface MatchResult {
  winner: string
  loser?: string
  winnerScore: number
  loserScore?: number
  ruleType: string
  replayData?: string
}
