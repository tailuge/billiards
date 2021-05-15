import { Table } from "../model/table"
import { TableGeometry } from "../view/tablegeometry"
import { DiagramInputs } from "./diagraminputs"

export class Diagram {
  table: Table
  diagram: CanvasRenderingContext2D
  diagramInputs: DiagramInputs

  last = performance.now()

  readonly step = 0.001
  readonly tablecolor = "#0a5c5c"
  readonly colors = ["#aaaaaa", "#ff0000", "#ffff00"]

  constructor(state, diagram, control) {
    this.table = Table.fromSerialised(state)
    this.diagram = diagram
    this.diagramInputs = new DiagramInputs(state, control, () => this.restart())

    this.scale()
    this.drawTable()
    this.animate(this.last)
  }

  scale() {
    const x = this.diagram.canvas.clientWidth
    const y = this.diagram.canvas.clientHeight
    const scale = (0.45 * x) / TableGeometry.X
    this.diagram.setTransform(scale, 0, 0, scale, x * 0.5, y * 0.5)
  }

  drawTable() {
    const x = TableGeometry.X
    const y = TableGeometry.Y
    this.diagram.fillStyle = this.tablecolor
    this.diagram.fillRect(-x, -y, x * 2, y * 2)
  }

  drawBall(x, y, style) {
    this.diagram.fillStyle = style
    this.diagram.beginPath()
    this.diagram.ellipse(x, y, 0.5, 0.5, 0, 0, Math.PI * 2)
    this.diagram.fill()
  }

  drawBalls() {
    var index = 0
    this.table.balls.forEach((ball) =>
      this.drawBall(ball.pos.x, ball.pos.y, this.colors[index++])
    )
  }

  clearBalls() {
    this.table.balls.forEach((ball) =>
      this.drawBall(ball.pos.x, ball.pos.y, this.tablecolor)
    )
  }

  advance(elapsed) {
    const steps = Math.floor(elapsed / this.step)
    for (var i = 0; i < steps; i++) {
      this.table.advance(this.step)
    }
  }

  animate(timestamp): void {
    this.clearBalls()
    this.advance((timestamp - this.last) / 1000)
    this.last = timestamp
    this.drawBalls()
    if (!this.table.allStationary()) {
      requestAnimationFrame((t) => {
        this.animate(t)
      })
    } else {
      console.log("diagram complete")
    }
  }

  restart() {
    this.diagramInputs.readControls()
    this.table.updateFromSerialised(this.diagramInputs.state)

    this.drawTable()
    this.last = performance.now()
    this.animate(this.last)
  }
}
