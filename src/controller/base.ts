import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export abstract class Base {

    handleEvent(event: GameEvent) {
        event.applyToController(this)
    }

    abstract handleAim(event: AimEvent): void
    abstract handleAbort(event: AbortEvent): void
}