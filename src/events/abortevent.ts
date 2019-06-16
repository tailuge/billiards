
import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"

export class AbortEvent extends GameEvent {
    constructor() {
        super()
        this.type = EventType.ABORT
    }
}