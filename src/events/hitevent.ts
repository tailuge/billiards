import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class HitEvent extends GameEvent {

    table
    aim

    constructor(container) {
        super()
        this.type = EventType.HIT
        this.table = container.table.serialise()
        this.aim = container.table.cue.aim
    }

    applyToController(controller: Controller): Controller {
        return controller.handleHit(this)
    }
}