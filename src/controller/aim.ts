import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { BeginEvent } from "../events/beginevent"
import { Input } from "../events/input"
import { Controller } from "./controller";
import { End } from "./end";

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Controller {

    readonly scale = 0.1

    handleInput(input: Input): void {
        switch (input.key) {
            case "ArrowLeft":
                this.container.table.cue.rotateAim(-input.t * this.scale)
                break
            case "ArrowRight":
                this.container.table.cue.rotateAim(input.t * this.scale)
                break
            case "ArrowDown":
                this.container.table.cue.adjustHeight(-input.t * this.scale)
                break
            case "ArrowUp":
                this.container.table.cue.adjustHeight(input.t * this.scale)
                break
            case "ShiftArrowLeft":
                this.container.table.cue.adjustSide(-input.t * this.scale)
                break
            case "ShiftArrowRight":
                this.container.table.cue.adjustSide(input.t * this.scale)
                break
            case "Space":
                this.container.table.cue.hit(2)
                break
            default:
        }
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
        return new End(this.container)
    }
}