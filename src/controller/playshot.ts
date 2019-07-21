import { Controller } from "./controller";
import { AbortEvent } from "../events/abortevent"
import { Aim } from "./aim";
import { End } from "./end";
import { upCross } from "../utils/utils"
import { WatchAim } from "./watchaim";

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends Controller {

    isWatch: boolean

    constructor(controller, isWatch: boolean) {
        super(controller)
        this.isWatch = isWatch
        this.hit()
    }

    handleInput(_) { return this }
    handleBegin(_) { return this }
    handleAim(_) { return new WatchAim(this.container) }
    handleHit(_) { return this }
    handleRack(_) { return this }
    handleStationary(_) {
        return this.isWatch ? this : new Aim(this.container)
    }
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