export class RealDraw {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private BALL_COLORS = { 1: "white", 2: "yellow", 3: "red" }
  private BALL_DIAMETER = 0.0615
  private TABLE_WIDTH = 2.84
  private PIXELS_PER_METER: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")!
    this.PIXELS_PER_METER = this.canvas.width / this.TABLE_WIDTH
  }

  private drawBall(x: number, y: number, color: string) {
    const radius = (this.BALL_DIAMETER / 2) * this.PIXELS_PER_METER
    const flippedX = this.canvas.width - x
    const flippedY = y
    this.ctx.beginPath()
    this.ctx.arc(flippedX, flippedY, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.strokeStyle = "black"
    this.ctx.lineWidth = 1
    this.ctx.stroke()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawShot(ballPositions: Record<string, { x: number; y: number }>) {
    for (const ballNum in ballPositions) {
      const ballPosition = ballPositions[ballNum]
      const color = this.BALL_COLORS[ballNum]
      const x = ballPosition.x * this.PIXELS_PER_METER
      const y = this.canvas.height - ballPosition.y * this.PIXELS_PER_METER
      this.drawBall(x, y, color)
    }
  }

  resetCanvas() {
    this.clear()
  }
}
