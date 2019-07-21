
import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { Vector3 } from "three"
import { vec } from "../utils/utils"

export class AimEvent extends GameEvent {
    pos: Vector3 = new Vector3(1,0,0)
    dir: Vector3 = new Vector3(1,0,0)
    verticalOffset = 0
    sideOffset = 0
    angle = 0
    power = 0

    constructor() {
        super()
        this.type = EventType.AIM
    }

    applyToController(controller: Controller) {
        return controller.handleAim(this)
    }

    static fromJson(json) {
        let event = new AimEvent()
        event.pos = vec(json.pos)
        event.dir = vec(json.dir)
        event.angle = json.angle
        event.verticalOffset = json.verticalOffset
        event.sideOffset = json.sideOffset
        event.power = json.power
        return event
    }

    copy(): AimEvent {
        let event = AimEvent.fromJson(this)
        return event
    }
}