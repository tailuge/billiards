import { Input } from "../events/input"
import { Controller } from "./controller";
import { AbortEvent } from "../events/abortevent"
import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { End } from "./end";
import { PlayShot } from "./playshot";


export class WatchAim extends Controller {

    readonly scale = 0.000001

    constructor(container) {
        super(container)
        this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    }

    handleInput(_: Input): Controller {
        return this
    }

    handleAim(event: AimEvent) {
        console.log(event)
        this.container.table.cue.aim = event
        return this
    }

    handleRack(_) { return this }
    handleBegin(_) { return this }
    handleHit(event :HitEvent) {
        this.container.table.updateFromSerialised(event.table)
        return new PlayShot(this.container)
    }

    handleAbort(_: AbortEvent): Controller {
        return new End(this.container)
    }

}