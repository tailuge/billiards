import { Vector3 } from "three"
import { Controller } from "../../controller/controller"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { ScoreEvent } from "../../events/scoreevent"

export interface Rules {
  cueball: Ball
  currentBreak: number
  previousBreak: number
  rulename: string
  update(outcome: Outcome[]): Controller
  rack(): Ball[]
  tableGeometry(): void
  table(): Table
  secondToPlay(): void
  otherPlayersCueBall(): Ball
  isPartOfBreak(outcome: Outcome[]): boolean
  isEndOfGame(outcome: Outcome[]): boolean
  allowsPlaceBall(): boolean
  placeBall(target?: Vector3): Vector3
  asset(): string
  nextCandidateBall(): Ball | undefined
  startTurn(): void
  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller
  handleScore(event: ScoreEvent): void
}
