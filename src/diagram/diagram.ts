import { Table } from "../model/table"
import { TableGeometry } from "../view/tablegeometry"

export class Diagram {
  table: Table
  diagram: CanvasRenderingContext2D
  control: HTMLElement

  constructor(state, diagram, control) {
    this.table = Table.fromSerialised(state)
    this.diagram = diagram
    this.control = control
  }

  drawTable() {
    let scale = (0.9 * this.diagram.canvas.clientWidth) / TableGeometry.X
    this.control.innerHTML = "w" + scale

    this.diagram.fillStyle = "#555500"
    this.diagram.fillRect(
      0,
      0,
      TableGeometry.X * scale,
      TableGeometry.Y * scale
    )
    this.diagram.moveTo(0, 0)
    this.diagram.lineTo(200, 100)
    this.diagram.stroke()
  }
}
