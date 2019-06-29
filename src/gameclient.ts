import { Table } from "./model/table";
import { Init } from "./controller/init";
import { Controller } from "./controller/controller";
import { View } from "./view/view";

export class GameClient {
    view: View
    controller: Controller
    table: Table

    constructor(element) {
//        this.table = new Table()
        this.view = new View(element)
        this.controller = new Init()
    }

}
