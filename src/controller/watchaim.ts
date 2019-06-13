import { Controller } from "./controller"

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim implements Controller {
    handleInputEvent(event: String) {
        return null
    }
    handleGameEvent(event: String) {
        return null
    }
    advance(deltat: Number) {
        return null
    }
}