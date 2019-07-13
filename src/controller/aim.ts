import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Input } from "../events/input"
import { Controller } from "./controller";
import { End } from "./end";

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Controller {

    handleInput(input: Input): void {
        console.log(input)
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