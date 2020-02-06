import { Table } from "../model/table"

export class Diagram {
  table: Table
  diagram: HTMLCanvasElement
  control: HTMLElement
  context: CanvasRenderingContext2D | null

  constructor(state, diagram, control) {
    this.table = Table.fromSerialised(state)
    this.diagram = diagram
    this.control = control

    this.context = this.diagram.getContext("2d")
    if (this.context == null) {
      return
    }
    this.context.fillStyle = "#555500"
    this.context.fillRect(0, 0, 150, 75)
    this.context.moveTo(0, 0)
    this.context.lineTo(200, 100)
    this.context.stroke()
  }
}
