import { BeginEvent } from "../events/beginevent"
import { WatchEvent } from "../events/watchevent"
import { Controller } from "./controller"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { BreakEvent } from "../events/breakevent"
import { PlaceBall } from "./placeball"
import { Replay } from "./replay"

/**
 * Initial state of controller.
 *
 * Transitions into active player and watcher.
 */
export class Init extends ControllerBase {
  handleBegin(_: BeginEvent): Controller {
    this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
    return new Aim(this.container)
  }

  handleWatch(event: WatchEvent): Controller {
    this.container.table.updateFromSerialised(event.json)
    return new WatchAim(this.container)
  }

  handleBreak(event: BreakEvent): Controller {
    if (event.init) {
      console.log("ReplayMode")
      this.container.table.updateFromShortSerialised(event.init)
      return new Replay(this.container, event.shots)
    }
    // not replay so record a new game
    return new PlaceBall(this.container)
  }
}
