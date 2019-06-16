import { Base } from "./base"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Base {
    handleAim(event: AimEvent): void {
        console.log(event)
    }
    handleAbort(event: AbortEvent): void {
        console.log("ignoring "+event)
    }
}