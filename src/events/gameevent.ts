import { EventType } from "./eventtype"
import { Controller } from "../controller/base"

export abstract class GameEvent {
    type: EventType
    abstract applyToController(controller: Controller): Controller
}