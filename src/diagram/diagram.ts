import { Table } from "../model/table"
import { TableGeometry } from "../view/tablegeometry"

export class Diagram {
  state
  table: Table
  diagram: CanvasRenderingContext2D
  control: HTMLElement
  last = performance.now()
  readonly step = 0.01

  constructor(state, diagram, control) {
    this.state = state
    this.table = Table.fromSerialised(this.state)
    this.diagram = diagram
    this.control = control
    this.addControls(control)
    this.drawTable()
    this.animate(this.last)
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

  readValue(id: string) {
    var input = this.control.querySelector<HTMLInputElement>(id)
    return input ? input.valueAsNumber : 0
  }

  readControls() {
    this.state.balls[0].pos.x = this.readValue("#x")
    this.state.balls[0].pos.y = this.readValue("#y")
    this.state.balls[0].vel.x = this.readValue("#vx")
    this.state.balls[0].vel.y = this.readValue("#vy")
    this.state.balls[0].rvel.x = this.readValue("#wx")
    this.state.balls[0].rvel.y = this.readValue("#wy")
    this.state.balls[0].rvel.z = this.readValue("#wz")
    this.table.updateFromSerialised(this.state)
  }

  addControls(elt: HTMLElement) {
    var b = this.state.balls[0]
    elt.innerHTML = `
        x
		<input id="x" type="number" step="0.1" value="${b.pos.x}">
		<input id="y" type="number" step="0.1" value="${b.pos.y}">
        ẋ
		<input id="vx" type="number" step="0.1" value="${b.vel.x}">
		<input id="vy" type="number" step="0.1" value="${b.vel.y}">
        ω
		<input id="wx" type="number" step="0.1" value="${b.rvel.x}">
		<input id="wy" type="number" step="0.1" value="${b.rvel.y}">
        <input id="wz" type="number" step="0.1" value="${b.rvel.z}">
        <button id="restart">↻</button>`

    var button = elt.getElementsByTagName("button")
    button[0].onclick = () => this.restart()
  }

  restart() {
    this.readControls()
    this.drawTable()
    this.animate(this.last)
  }
}
