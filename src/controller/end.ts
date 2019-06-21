import { Controller } from "./base"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

export class End extends Controller {
    handleAim(event: AimEvent): Controller {
        console.log("handling "+event)
        return this
    }
    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring "+event)
        return this
    }

}
