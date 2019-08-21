import { BeginEvent } from "../events/beginevent"
import { WatchEvent } from "../events/watchevent"
import { Controller, HitEvent } from "./controller"
import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { WatchShot } from "./watchshot";

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

  handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.json)
    return new WatchShot(this.container)
  }

}
