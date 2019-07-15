import { Controller } from "./controller";
import { AbortEvent } from "../events/abortevent"
import { HitEvent } from "../events/hitevent"
import { End } from "./end";
import { upCross } from "../utils/utils"

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends Controller {

    constructor(controller) {
        super(controller)
        this.hit()
    }
    static fromEvent(_: HitEvent, controller) {
        //  copy state from event into table
        return new PlayShot(controller)
    }

    handleInput(_) { return this }
    handleBegin(_) { return this }
    handleAim(_) { return this }
    handleHit(_) { return this }
    handleAbort(_: AbortEvent): Controller {
        return new End(this.container)
    }

    hit() {
        let table = this.container.table
        let aim = table.cue.aim
        table.balls[0].vel.copy(aim.dir.clone().multiplyScalar(aim.power))
        let rvel = upCross(aim.dir).multiplyScalar((aim.power * aim.verticalOffset * 5) / 2)
        rvel.z = (-aim.sideOffset * 5) / 2
        table.balls[0].rvel.copy(rvel)
    }

}