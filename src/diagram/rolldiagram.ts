import { Vector3 } from "three"
import { Ball, State } from "../model/ball"
import { R } from "../model/physics/constants"
import { zero } from "../utils/utils"

export class RollDiagram {
  ball: Ball
  theta = 0.0
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  readonly step = 0.01

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")!
    this.ball = new Ball(zero)
    this.ball.vel.copy(new Vector3(32 * R, 0, 0))
    this.ball.rvel.copy(new Vector3(0, -(2.0 * this.ball.vel.x) / R, 0))
    this.ball.state = State.Sliding
  }

  drawBall(x, y, style) {
    const w = this.canvas.width
    const h = this.canvas.height
    const s = w / (27 * R)
    this.ctx.beginPath()
    this.ctx.strokeStyle = style
    this.ctx.fillStyle = style
    const sx = x * s + 2 * R * s
    const sy = y * s + h / 2
    const sr = R * s
    this.ctx.ellipse(sx, sy, sr, sr, 0, 0, Math.PI * 2)
    this.ctx.stroke()

    const endx = sx + R * -Math.sin(this.theta) * s
    const endy = sy + R * Math.cos(this.theta) * s

    this.ctx.beginPath()
    this.ctx.strokeStyle = "black"
    this.ctx.moveTo(sx, sy)
    this.ctx.lineTo(endx, endy)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.fillStyle = "black"
    this.ctx.arc(endx, endy, 3, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  advance(t) {
    this.ball.update(t)
    const angle = this.ball.rvel.length() * t
    this.theta += angle
  }

  draw(duration): void {
    this.ctx.clearRect(0, 0, 1, 1)
    let t = 0
    while (t < duration) {
      let color = "blue"
      if (this.ball.isRolling()) {
        color = "red"
      } else if (this.ball.inMotion()) {
        color = "green"
      }

      this.drawBall(this.ball.pos.x, 0, color)
      this.advance(this.step)
      t += this.step
    }
  }
}
