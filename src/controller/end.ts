import { Controller } from "./controller"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"
import { BeginEvent } from "../events/beginevent"
import { Input } from "../events/input"

export class End extends Controller {

    handleInput(_: Input) {
        return this
    }

    handleBegin(event: BeginEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAim(event: AimEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring " + event)
        return this
    }
}
