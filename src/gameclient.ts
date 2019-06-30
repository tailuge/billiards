import { Init } from "./controller/init"
import { Controller } from "./controller/controller"

export { Init }
export { BeginEvent } from "./events/beginevent"

export class GameClient {
    controller: Controller

    constructor(element) {
        this.controller = new Init(element)
    }

}
