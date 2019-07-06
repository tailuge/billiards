import { AimEvent } from "../events/aimevent"
import { Input } from "../events/input"
import { AbortEvent } from "../events/abortevent"

/**
 * Controller manages the state of the system reacting input and network events in the animation loop.
 */
export abstract class Controller {

    abstract handleInput(input: Input): void
    abstract handleAim(event: AimEvent): Controller
    abstract handleAbort(event: AbortEvent): Controller

}