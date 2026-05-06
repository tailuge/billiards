import { Vector3 } from "three"
import { Controller } from "../../controller/controller"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"

export interface Rules {
  cueball: Ball
  currentBreak: number
  previousBreak: number
  rulename: string
  readonly asset: string
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
  nextCandidateBall(p1type?: number): Ball | undefined
  startTurn(): void
  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller
  foulReason(outcome: Outcome[]): string | null
  getAmountScored(outcome: Outcome[]): number
  respot(outcome: Outcome[]): Ball[]
}
