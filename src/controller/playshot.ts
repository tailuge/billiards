import { Controller } from "./controller";
import { AbortEvent } from "../events/abortevent"
import { End } from "./end";

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends Controller {

    constructor(controller) {
        super(controller)
    }

    handleInput(_) { return this }
    handleBegin(_) { return this }
    handleAim(_) { return this }
    handleHit(_) { return this }
    handleAbort(_: AbortEvent): Controller {
        return new End(this.container)
    }


}