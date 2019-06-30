import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RackEvent extends GameEvent {

    table

    constructor(table) {
        super()
        this.type = EventType.RACK
        this.table = table.serialise()
    }

    applyToController(controller: Controller): Controller {
        return controller.handleAbort(this)
    }
}