export class Graph {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  xAxis
  yAxis
  readonly gutter = 20

  constructor(canvasId: string, title: string, label: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d")!
    ;(this.canvas.previousElementSibling as HTMLParagraphElement).innerHTML =
      title
    ;(this.canvas.nextElementSibling as HTMLParagraphElement).innerHTML = label
  }

  plot(xValues, y1, y2) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.shadowColor = "grey"
    this.ctx.shadowBlur = 2
    const allY = [...y1, ...y2]
    allY.push(0)
    this.xAxis = this.axisInfo(xValues, this.canvas.width)
    this.yAxis = this.axisInfo(allY, this.canvas.height)
    this.drawXAxis(xValues)
    this.drawYAxis(allY)
    this.plotLine(xValues, y1, "blue")
    this.plotLine(xValues, y2, "red")
  }

  plotLine(xs, ys, colour) {
    this.ctx.beginPath()
    for (let i = 0; i < xs.length; i++) {
      const x = this.scale(xs[i], this.xAxis)
      const y =
        this.canvas.height - this.scale(ys[i], this.yAxis) * 0.8 - this.gutter
      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.strokeStyle = colour
    this.ctx.stroke()
  }

  drawXAxis(xs) {
    const h = this.canvas.height - this.gutter
    this.ctx.beginPath()
    this.ctx.moveTo(0, h)
    this.ctx.lineTo(this.canvas.width, h)
    this.ctx.strokeStyle = "grey"
    this.ctx.stroke()

    this.ctx.font = "8px Arial"
    this.ctx.strokeStyle = "grey"

    let skip = false
    for (let i = 2; i < xs.length - 2; i++) {
      const x = this.scale(xs[i], this.xAxis)
      this.ctx.beginPath()
      this.ctx.moveTo(x, h)
      this.ctx.lineTo(x, h + 4)
      this.ctx.stroke()
      if (!skip) {
        this.ctx.fillText(xs[i], x - 5, h + 10)
      }
      skip = !skip
    }
  }

  drawYAxis(ys) {
    const min = 0
    const max = Math.max(...ys)
    const maxy =
      this.canvas.height - this.scale(max, this.yAxis) * 0.8 - this.gutter

    const miny =
      this.canvas.height - this.scale(min, this.yAxis) * 0.8 - this.gutter

    this.ctx.beginPath()
    this.ctx.moveTo(0, miny)
    this.ctx.lineTo(0, maxy)
    this.ctx.strokeStyle = "grey"
    this.ctx.stroke()
    this.ctx.fillText(`${min.toFixed(3)}`, 0, miny)
    this.ctx.fillText(`${max.toFixed(3)}`, 0, maxy)
  }

  scale(p, pAxis) {
    return (p - pAxis.min) * pAxis.scale
  }

  axisInfo(values: number[], pixels) {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    return { min: min, max: max, scale: pixels / range }
  }
}
