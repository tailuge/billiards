import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Controller } from "./controller";
import { End } from "./end";

/**
 * Place cue ball using input events.
 *
 */
export class PlaceBall extends Controller {

    advance(t: number): void {
        console.log(t)
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