import { Controller } from "./controller";

/**
 * PlayShot starts balls rolling using cue state.
 *
 */
export class PlayShot extends Controller {

    constructor(controller) {
        super(controller)
    }

    handleInput(_){return this}
    handleBegin(_){return this}
    handleAim(_){return this}
    handleAbort(_){return this}

}