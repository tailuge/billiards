import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export abstract class Base {
    handleEvent(event: GameEvent) {
        if (event instanceof AimEvent) {
            this.handleAim(event)
        }
        if (event instanceof AbortEvent) {
            this.handleAbort(event)
        }

    }
    abstract handleAim(event: AimEvent): void     
    abstract handleAbort(event: AbortEvent): void 
}