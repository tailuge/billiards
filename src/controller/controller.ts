import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export abstract class Controller {

    inputQueue: [Input]

    handleInput(input: Input): void {
        this.inputQueue.push(input)
    }

    broadcast: (event: GameEvent)=>void

    handleEvent(event: GameEvent): Controller {
        return event.applyToController(this)
    }

    abstract handleAim(event: AimEvent): Controller
    abstract handleAbort(event: AbortEvent): Controller
}