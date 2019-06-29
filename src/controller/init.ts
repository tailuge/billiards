import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Controller } from "./controller";
import { End } from "./end";

/**
 * Initial state of controller.
 *
 * Transitions into active player and watcher.
 */
export class Init extends Controller {

    handleAim(event: AimEvent): Controller {
        console.log("handling "+event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring "+event)
        return new End()
    }
}