import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Controller } from "./controller";
import { End } from "./end";
import { Input } from "../events/input";

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Controller {

    handleAim(event: AimEvent): Controller {
        console.log("handling "+event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring "+event)
        return new End()
    }

    handleInput(input: Input) {
        console.log(input)
    }
}