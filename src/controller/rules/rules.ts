import { Vector3 } from "three"
import { Controller } from "../../controller/controller"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"

export interface Rules {
  cueball: Ball
  currentBreak: number
  previousBreak: number
  update(outcome: Outcome[]): Controller
  rack(): Ball[]
  tableGeometry()
  table(): Table
  secondToPlay()
  otherPlayersCueBall(): Ball
  isPartOfBreak(outcome: Outcome[]): boolean
  isEndOfGame(outcome: Outcome[]): boolean
  allowsPlaceBall(): boolean
  placeBall(target?): Vector3
  asset(): string
  nextCandidateBall()
  startTurn()
}
