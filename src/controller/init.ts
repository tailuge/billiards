import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { BeginEvent } from "../events/beginevent";
import { Controller } from "./controller";
import { PlaceBall } from "./placeball";
import { End } from "./end";
import { View } from "../view/view";

/**
 * Initial state of controller.
 *
 * Transitions into active player and watcher.
 */
export class Init extends Controller {

    constructor(element) {
        super()
        this.view = new View(element)
    }

    advance(t: number): void {
        console.log(t)
    }

    handleBegin(event: BeginEvent): Controller {
        console.log("handling " + event)

        //rack
        // send rack
        return new PlaceBall(this.table, this.view)
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