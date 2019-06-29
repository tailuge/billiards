import { AbortEvent } from "../events/abortevent";
import { AimEvent } from "../events/aimevent";
import { Controller } from "./controller";
import { End } from "./end";
import { Table } from "../model/table";
import { View } from "../view/view";

/**
 * Place cue ball using input events.
 *
 */
export class PlaceBall extends Controller {

    constructor(table: Table, view: View) {
        super()
        this.table = table
        this.view = view
    }

    handleAim(event: AimEvent): Controller {
        console.log("handling " + event)
        return this
    }

    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring " + event)
        return new End()
    }
}