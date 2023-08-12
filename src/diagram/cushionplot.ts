import { rotateApplyUnrotate, isGripCushion } from "../model/physics/physics"
import { Vector3 } from "three"

export class CushionPlot {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  readonly endx = 100
  readonly endy = 100
  readonly scale = 75
  readonly dv = new Vector3()
  readonly dw = new Vector3()

  constructor(div: HTMLElement, title: string) {
    div.firstElementChild!.innerHTML = title
    this.canvas = div.lastElementChild as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
  }

  plot(
    angleStart: number,
    angleEnd: number,
    angleStep: number,
    fv: (a: number) => Vector3,
    fw: (a: number) => Vector3
  ) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = angleStart; i <= angleEnd; i += angleStep) {
      const v: Vector3 = fv(i)
      const w: Vector3 = fw(i)
      const lineDash = isGripCushion(v, w) ? [] : [2, 2]
      this.context.setLineDash(lineDash)
      this.context.strokeStyle = "blue"
      this.drawArrow(
        this.endx - v.x * this.scale,
        this.endy - v.y * this.scale,
        this.endx,
        this.endy
      )
      rotateApplyUnrotate(0, v, w, this.dv, this.dw)
      v.add(this.dv)
      this.context.strokeStyle = "red"
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
