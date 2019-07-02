import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"
import { Table } from "../model/table";
import { View } from "../view/view";

/**
 * Controller manages the state of the system reacting input and network events.
 *
 * Inputs are enqued for processing in animation loop.
 */
export abstract class Controller {

    table: Table
    view: View
    inputQueue: Input[] = []
    eventQueue: GameEvent[] = []
    last = performance.now()

    broadcast: (event: GameEvent) => void

    abstract advance(t: number): void
    abstract handleAim(event: AimEvent): Controller
    abstract handleAbort(event: AbortEvent): Controller
    handleEvent(event: GameEvent): Controller {
        return event.applyToController(this)
    }

    animate(timestamp): void {
        console.log((timestamp-this.last) / 1000.0)
        this.last = timestamp
        requestAnimationFrame(t => {
            this.animate(t)
        })
    }

}