import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { Controller } from "./controller"
import { Table } from "../model/table";
import { View } from "../view/view";
import { Init } from "./init";
import { Rack } from "../utils/rack";

/**
 * Model, View, Controller container.
 */
export class Container {

    table: Table
    view: View
    controller: Controller

    inputQueue: Input[] = []
    eventQueue: GameEvent[] = []

    last = performance.now()

    broadcast: (event: GameEvent) => void

    constructor(element) {
        this.table = new Table(Rack.diamond())
        this.view = new View(element)
        this.table.balls.forEach(b => this.view.addMesh(b.mesh.mesh))
        this.view.addMesh(this.table.cue.mesh)
        this.controller = new Init()
    }

    advance(elapsed) {
        try {
            let step = 0.01
            let steps = Math.max(15, Math.floor(elapsed / step))
            let i = 0
            while (i++ < steps) {
                this.table.advance(step)
            }
            this.view.update(steps * step)
            // this.keyboard.applyKeys(elapsed, this.table, this.camera)
        } catch (error) {
            console.log(error)
        }
    }

    animate(timestamp): void {
        this.advance((timestamp - this.last) / 1000.0)
        this.view.render()
        this.last = timestamp
        let event = this.eventQueue.pop()
        if (event != null) {
            this.controller = event.applyToController(this.controller)
        }
        requestAnimationFrame(t => { this.animate(t) })
    }

}