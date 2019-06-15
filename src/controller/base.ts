import { GameEvent } from "../events/gameevent"
import { EventType } from "../events/eventtype"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export abstract class Base {

    handleGameEvent(event: GameEvent) {
        switch (event.type) {
            case EventType.AIM:
                this.handle(new AimEvent())
                return
            case EventType.ABORT:
                this.handle(new AbortEvent())
                return
            default:
        }
    }

    abstract handle(event: AbortEvent): void 
    abstract handle(event: AimEvent): void 

}