import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { BeginEvent } from "../events/beginevent"
import { Controller } from "./controller";
import { End } from "./end";
import { Input } from "../events/input"

/**
 * Place cue ball using input events.
 *
 */
export class PlaceBall extends Controller {

    handleInput(_: Input) {
        return this
    }

    handleBegin(event: BeginEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAim(event: AimEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring " + event)
        return new End(this.container)
    }
}