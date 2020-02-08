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
    this.drawTable()
  }

  scale() {
    let scale = (0.8 * this.diagram.canvas.clientWidth) / TableGeometry.X
    this.diagram.setTransform(
      scale,
      0,
      0,
      scale,
      this.diagram.canvas.clientWidth * 0.9,
      this.diagram.canvas.clientHeight * 0.9
    )
  }

  drawTable() {
    this.scale()
    this.diagram.fillStyle = "#0a5c5c"
    this.diagram.fillRect(
      -TableGeometry.X,
      -TableGeometry.Y,
      TableGeometry.X,
      TableGeometry.Y
    )

    this.diagram.fillStyle = "#aa0000"
    this.diagram.moveTo(0, 0)
    this.diagram.beginPath()
    this.diagram.ellipse(0, 0, 0.5, 0.5, 0, 0, 7)
    this.diagram.fill()
  }
}
