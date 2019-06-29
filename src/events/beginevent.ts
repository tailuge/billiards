import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class BeginEvent extends GameEvent {
    constructor() {
        super()
        this.type = EventType.BEGIN
    }

    applyToController(controller: Controller): Controller {
        return controller.handleAbort(this)
    }
}