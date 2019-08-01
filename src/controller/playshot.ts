import { Controller } from "./controller"
import { AbortEvent } from "../events/abortevent"
import { WatchEvent } from "../events/watchevent"
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
  allStationary = false
  pendingState: Controller

  constructor(container, isWatch: boolean) {
    super(container)
    this.isWatch = isWatch
    this.container.table.outcome = []
    this.hit()
  }

  handleAim(_) {
    if (this.allStationary) {
      this.container.log("all stationary so transition to Aim now")
      return new Aim(this.container)
    }
    this.container.log("pending transition to Aim")
    this.pendingState = new Aim(this.container)
    return this
  }

  handleWatch(_) {
    if (this.allStationary) {
      this.container.log("all stationary so transition to WatchAim now")
      return new WatchAim(this.container)
    }
    this.container.log("pending transition to WatchAim")
    this.pendingState = new WatchAim(this.container)
    return this
  }

  handleStationary(_) {
    this.allStationary = true
    this.container.log("stationary event")
    if (this.isWatch) {
      if (this.pendingState) {
        this.container.log("go to pending state now")
        return this.pendingState
      }
      this.container.log("no pending state")
      return this
    }
    if (this.container.table.outcome.some(x => x.type == "pot")) {
      this.container.log("pot! transition to Aim")
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      return new Aim(this.container)
    }
    // if no pot switch to other player
    this.container.log("no pot")
    this.container.sendEvent(this.container.table.cue.aim)
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
