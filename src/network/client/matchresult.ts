export interface MatchResult {
  id: string
  winner: string
  loser?: string
  winnerScore: number
  loserScore?: number
  gameType: string
  timestamp: number
}