import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export abstract class GameEvent {
  type: EventType
  abstract applyToController(controller: Controller): Controller
}
