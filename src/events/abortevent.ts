import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Base } from "../controller/base"

export class AbortEvent extends GameEvent {
    constructor() {
        super()
        this.type = EventType.ABORT
    }

    applyToController(controller: Base) {
        return controller.handleAbort(this)
    }
}