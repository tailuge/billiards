import { AbortEvent } from "../events/abortevent"
import { AimEvent } from "../events/aimevent"
import { BeginEvent } from "../events/beginevent"
import { Controller } from "./controller"
import { End } from "./end"
import { Input } from "../events/input"

/**
 * Place cue ball using input events.
 *
 */
export class PlaceBall extends Controller {
  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }
}
