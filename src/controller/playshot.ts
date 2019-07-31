import { Controller } from "./controller"
import { AbortEvent } from "../events/abortevent"
import { Aim } from "./aim"
import { End } from "./end"
import { upCross } from "../utils/utils"
import { WatchAim } from "./watchaim"

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends Controller {
  isWatch: boolean

  constructor(container, isWatch: boolean) {
    super(container)
    this.isWatch = isWatch
    this.container.table.outcome = []
    this.hit()
  }

  handleAim(_) {
    return new Aim(this.container)
  }

  handleStationary(_) {
    if (this.isWatch) {
      return this
    }
    if (this.container.table.outcome.some(x => x.outcome == "pot")) {
      console.log("pot!")
      return new Aim(this.container)
    }
    // if no pot switch to other player
    this.container.broadcast(this.container.table.cue.aim)
    return new WatchAim(this.container)
  }

  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }

  hit() {
    let table = this.container.table
    let aim = table.cue.aim
    table.balls[0].vel.copy(aim.dir.clone().multiplyScalar(aim.power))
    let rvel = upCross(aim.dir).multiplyScalar(
      (aim.power * aim.verticalOffset * 5) / 2
    )
    rvel.z = (-aim.sideOffset * 5) / 2
    table.balls[0].rvel.copy(rvel)
    table.cue.aim.power = 0
  }
}
