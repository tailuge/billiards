import { Controller } from "../controller/controller"
import { Outcome } from "../model/outcome"

export interface Rules {
  update(outcome: Outcome[]): Controller
}
