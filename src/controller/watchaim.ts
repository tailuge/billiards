import { Input } from "../events/input"
import { Controller } from "./controller";
import { PlayShot } from "./playshot";
import { AbortEvent } from "../events/abortevent"
import { End } from "./end";
import { HitEvent } from "../events/hitevent";

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class WatchAim extends Controller {

    readonly scale = 0.000001

    constructor(container) {
        super(container)
        this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    }

    handleInput(_: Input): Controller {
        return this
    }

    handleAim(event) {
        return this
    }

    handleBegin(_) { return this }
    handleHit(_) { return this }
    handleAbort(_: AbortEvent): Controller {
        return new End(this.container)
    }

}