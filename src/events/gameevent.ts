import { EventType } from "./eventtype"
import { Base } from "../controller/base"

export abstract class GameEvent {
    type: EventType
    abstract applyToController(controller: Base): void
}