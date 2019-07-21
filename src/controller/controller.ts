import { BeginEvent } from "../events/beginevent"
import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { Input } from "../events/input"
import { AbortEvent } from "../events/abortevent"
import { StationaryEvent } from "../events/stationaryevent"
import { Container } from "./container";


/**
 * Controller manages the state of the system reacting input and network events in the animation loop.
 */
export abstract class Controller {

    container: Container

    constructor(container: Container) {
        this.container = container
    }

    abstract handleInput(input: Input): Controller
    abstract handleBegin(event: BeginEvent): Controller
    abstract handleAim(event: AimEvent): Controller
    abstract handleHit(event: HitEvent): Controller
    abstract handleAbort(event: AbortEvent): Controller
    abstract handleRack(event: AbortEvent): Controller
    abstract handleStationary(event: StationaryEvent): Controller



}