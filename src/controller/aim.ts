import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { BeginEvent } from "../events/beginevent"
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
        if (input.key == "ArrowLeft") {
            this.container.table.cue.rotateAim(input.t)
        }
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