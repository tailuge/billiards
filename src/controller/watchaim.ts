import { Input } from "../events/input"
import { Controller } from "./controller";
import { AbortEvent } from "../events/abortevent"
import { End } from "./end";


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
        this.container.table.cue.aim = event
        return this
    }

    handleRack(_) { return this }
    handleBegin(_) { return this }
    handleHit(_) { return this }
    handleAbort(_: AbortEvent): Controller {
        return new End(this.container)
    }

}