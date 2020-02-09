import { Table } from "../model/table"
import { TableGeometry } from "../view/tablegeometry"

export class Diagram {
  table: Table
  diagram: CanvasRenderingContext2D
  control: HTMLElement
  last = performance.now()
  readonly step = 0.01

  constructor(state, diagram, control) {
    this.table = Table.fromSerialised(state)
    this.diagram = diagram
    this.control = control
    this.drawTable()
    this.animate(this.last)
    this.addControls(control)
  }

  scale() {
    const x = this.diagram.canvas.clientWidth
    const y = this.diagram.canvas.clientHeight
    let scale = (0.45 * x) / TableGeometry.X
    this.diagram.setTransform(scale, 0, 0, scale, x * 0.5, y * 0.5)
  }

  drawTable() {
    this.scale()
    this.diagram.fillStyle = "#0a5c5c"
    this.diagram.fillRect(
      -TableGeometry.X,
      -TableGeometry.Y,
      TableGeometry.X * 2,
      TableGeometry.Y * 2
    )
  }

  drawBalls(style) {
    this.diagram.fillStyle = style
    this.table.balls.forEach(ball => {
      this.diagram.beginPath()
      this.diagram.ellipse(ball.pos.x, ball.pos.y, 0.5, 0.5, 0, 0, Math.PI * 2)
      this.diagram.fill()
    })
  }

  advance(elapsed) {
    const steps = Math.max(15, Math.floor(elapsed / this.step))
    for (var i = 0; i < steps; i++) {
      this.table.advance(this.step)
    }
  }

  animate(timestamp): void {
    this.drawBalls("#0a5050")
    this.advance((timestamp - this.last) / 1000)
    this.last = timestamp
    this.drawBalls("#aaaaaa")
    if (!this.table.allStationary()) {
      requestAnimationFrame(t => {
        this.animate(t)
      })
    }
  }

  addControls(elt: HTMLElement) {
    elt.innerHTML = `
        x
		<input id="x" type="number" step="0.1" value="4.0">
		<input id="y" type="number" step="0.1" value="0.1">
        ẋ
		<input id="vx" type="number" step="0.1" value="-3.0">
		<input id="vy" type="number" step="0.1" value="0.0">
        ω
		<input id="wx" type="number" step="0.1" value="0.0">
		<input id="wy" type="number" step="0.1" value="0.0">
        <input id="wz" type="number" step="0.1" value="0.0">
        <button id="restart">↻</button>`
    var button = elt.getElementsByTagName("button")
    button[0].onclick = () => this.restart()
  }

  restart() {
    console.log("restart")
  }
}
