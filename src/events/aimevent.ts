
import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"

export class AimEvent extends GameEvent {
    public x: Number
    constructor() {
        super()
        this.type = EventType.AIM
        this.x = 1;
    }
}