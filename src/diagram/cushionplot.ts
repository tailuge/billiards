import {
  rotateApplyUnrotate,
  isGripCushion,
  mathavenAdapter,
} from "../model/physics/physics"
import { Vector3 } from "three"

export class CushionPlot {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  readonly endx = 100
  readonly endy = 100
  readonly scale = 2000
  readonly r = 20

  constructor(div: HTMLElement, title: string) {
    div.firstElementChild!.innerHTML = title
    this.canvas = div.lastElementChild as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
  }

  drawBall() {
    this.context.beginPath()
    this.context.strokeStyle = "lightgray"
    this.context.fillStyle = "beige"
    this.context.arc(this.endx, this.endy, this.r, 0, 2 * Math.PI, false)
    this.context.fill()
    this.context.stroke()
  }

  drawCushion() {
    const gradient = this.context.createLinearGradient(10, 90, 200, 90)
    gradient.addColorStop(0, "lightgray")
    gradient.addColorStop(0.75, "white")
    this.context.fillStyle = gradient
    this.context.fillRect(this.endx + this.r, 10, 200, 250)
  }

  plot(
    angleStart: number,
    angleEnd: number,
    angleStep: number,
    fv: (a: number) => Vector3,
    fw: (a: number) => Vector3
  ) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawCushion()
    this.drawBall()
    for (let i = angleStart; i <= angleEnd; i += angleStep) {
      const v: Vector3 = fv(i)
      const w: Vector3 = fw(i)
      const lineDash = isGripCushion(v, w) ? [] : [2, 2]
      this.context.setLineDash(lineDash)
      const hue = ((i + 360) * 101) % 360
      this.context.strokeStyle = `hsl(${hue},50%,50%)`
      this.drawArrow(
        this.endx - v.x * this.scale,
        this.endy - v.y * this.scale,
        this.endx,
        this.endy
      )
      const delta = rotateApplyUnrotate(0, v, w, mathavenAdapter)
      v.add(delta.v)
      this.drawArrow(
        this.endx,
        this.endy,
        this.endx + v.x * this.scale,
        this.endy + v.y * this.scale
      )
    }
  }

  private drawArrow(x1, y1, x2, y2, t = 0.9) {
    const arrow = {
      dx: x2 - x1,
      dy: y2 - y1,
    }
    const middle = {
      x: arrow.dx * t + x1,
      y: arrow.dy * t + y1,
    }
    const tip = {
      dx: x2 - middle.x,
      dy: y2 - middle.y,
    }
    this.context.beginPath()
    this.context.moveTo(x1, y1)
    this.context.lineTo(middle.x, middle.y)
    this.context.moveTo(middle.x + 0.5 * tip.dy, middle.y - 0.5 * tip.dx)
    this.context.lineTo(middle.x - 0.5 * tip.dy, middle.y + 0.5 * tip.dx)
    this.context.lineTo(x2, y2)
    this.context.closePath()
    this.context.stroke()
  }
}
