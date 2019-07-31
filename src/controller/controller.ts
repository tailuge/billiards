import { BeginEvent } from "../events/beginevent"
import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { Input } from "../events/input"
import { AbortEvent } from "../events/abortevent"
import { WatchEvent } from "../events/watchevent"
import { StationaryEvent } from "../events/stationaryevent"
import { Container } from "./container"

export { BeginEvent, AimEvent, HitEvent, Input, AbortEvent, StationaryEvent }

/**
 * Controller manages the state of the system reacting input and network events in the animation loop.
 */
export abstract class Controller {
  container: Container

  constructor(container: Container) {
    this.container = container
  }

  handleInput(_: Input): Controller {
    return this
  }
  handleBegin(_: BeginEvent): Controller {
    return this
  }
  handleAim(_: AimEvent): Controller {
    return this
  }
  handleHit(_: HitEvent): Controller {
    return this
  }
  handleAbort(_: AbortEvent): Controller {
    return this
  }
  handleWatch(_: WatchEvent): Controller {
    return this
  }
  handleStationary(_: StationaryEvent): Controller {
    return this
  }
}
