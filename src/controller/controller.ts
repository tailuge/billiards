import {AimEvent} from "../events/aimevent"

export interface Controller {
    handleInputEvent(event: String): Controller
    handleGameEvent(event: String): Controller
    handle(event: AimEvent): Controller
}