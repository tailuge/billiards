import { Base } from "./base"
import { AimEvent } from "../events/aimevent"

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Base {

    handle(event: AimEvent): void {
        console.log(event)
    }
}