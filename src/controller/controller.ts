import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"
import { Table } from "../model/table";

/**
 * Controller manages the state of the system reacting input and network events.
 *
 * Inputs are enqued for processing in animation loop.
 */
export abstract class Controller {

    table:Table

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