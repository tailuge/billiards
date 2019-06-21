import { Controller } from "./controller"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"
import { Input } from "../events/input"

export class End extends Controller {

    handleAim(event: AimEvent): Controller {
        console.log("handling "+event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring "+event)
        return this
    }

    handleInput(input: Input) {
        console.log(input)
    }

}
