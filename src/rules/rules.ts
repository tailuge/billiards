import { Controller } from "../controller/controller"
import { Ball } from "../model/ball"
import { Outcome } from "../model/outcome"
import { Table } from "../model/table"

export interface Rules {
  update(outcome: Outcome[]): Controller
  rack(): Ball[]
  table(): Table
  secondToPlay()
}
