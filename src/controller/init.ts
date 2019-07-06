import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { BeginEvent } from "../events/beginevent";
//import { RackEvent } from "../events/rackevent";
import { Controller } from "./controller";
import { PlaceBall } from "./placeball";
import { End } from "./end";
import { Input } from "../events/input"

/**
 * Initial state of controller.
 *
 * Transitions into active player and watcher.
 */
export class Init extends Controller {

    handleInput(input: Input): void {
        console.log(input)
    }

    handleBegin(event: BeginEvent): Controller {
        console.log("handling " + event)
        //this.container.broadcast(new RackEvent(this.container.table))
        return new PlaceBall()
    }

    handleAim(event: AimEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring " + event)
        return new End()
    }
}