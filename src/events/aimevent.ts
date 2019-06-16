
import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Base } from "../controller/base"

export class AimEvent extends GameEvent {
    x: Number
    constructor() {
        super()
        this.type = EventType.AIM
        this.x = 1;
    }

    applyToController(controller: Base) {
        return controller.handleAim(this)
    }

    static fromJson(json) {
        let event = new AimEvent()
        event.x = json.x
        return event
    }
}