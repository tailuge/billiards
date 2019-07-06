import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Controller } from "./controller";
import { End } from "./end";
import { Input } from "../events/input"

/**
 * Place cue ball using input events.
 *
 */
export class PlaceBall extends Controller {

    handleInput(input: Input): void {
        console.log(input)
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