import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export abstract class Controller {

    handleEvent(event: GameEvent): Controller {
        return event.applyToController(this)
    }

    abstract handleAim(event: AimEvent): Controller
    abstract handleAbort(event: AbortEvent): Controller
}