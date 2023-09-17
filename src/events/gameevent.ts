import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export abstract class GameEvent {
  type: EventType
  sequence?: string
  abstract applyToController(controller: Controller): Controller
}
