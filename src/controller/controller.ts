import { BeginEvent } from "../events/beginevent"
import { BreakEvent } from "../events/breakevent"
import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { Input } from "../events/input"
import { AbortEvent } from "../events/abortevent"
import { WatchEvent } from "../events/watchevent"
import { StationaryEvent } from "../events/stationaryevent"
import { Container } from "../container/container"
import { ChatEvent } from "../events/chatevent"
import { PlaceBallEvent } from "../events/placeballevent"
import { RejoinEvent } from "../events/rejoinevent"
import { StartAimEvent } from "../events/startaimevent"

export { BeginEvent, AimEvent, HitEvent, Input, AbortEvent, StationaryEvent }

/**
 * Controller manages the state of the system reacting to input and network events in the animation loop.
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
  handleBreak(_: BreakEvent): Controller {
    return this
  }
  handleStartAim(_: StartAimEvent): Controller {
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
  handlePlaceBall(_: PlaceBallEvent): Controller {
    return this
  }
  handleStationary(_: StationaryEvent): Controller {
    return this
  }
  handleChat(_: ChatEvent): Controller {
    return this
  }
  handleRejoin(_: RejoinEvent): Controller {
    return this
  }
  onFirst() {}
}
