export class RealDraw {
  private readonly ctx: CanvasRenderingContext2D
  private readonly canvas: HTMLCanvasElement
  private readonly BALL_COLORS = { 1: "white", 2: "yellow", 3: "red" }
  private readonly BALL_DIAMETER = 0.0615
  private readonly TABLE_WIDTH = 2.84
  private readonly PIXELS_PER_METER: number
  private ballPaths: Record<string, Array<{ x: number; y: number }>> = {}

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

  drawBallPath(ballNum: string, positions: Array<{ x: number; y: number }>) {
    const color = this.BALL_COLORS[ballNum]
    this.ctx.save()
    this.ctx.beginPath()
    positions.forEach((pos, index) => {
      const x = this.canvas.width - pos.x * this.PIXELS_PER_METER
      const y = this.canvas.height - pos.y * this.PIXELS_PER_METER
      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })
    this.ctx.setLineDash([4, 4])
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 1
    this.ctx.stroke()
    this.ctx.restore()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawShot(ballPositions: Record<string, { x: number; y: number }>) {
    // Draw paths first so balls appear on top
    for (const ballNum in this.ballPaths) {
      this.drawBallPath(ballNum, this.ballPaths[ballNum])
    }

    // Draw current ball positions
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
    this.ballPaths = {}
  }

  updateBallPaths(ballNum: string, position: { x: number; y: number }) {
    if (!this.ballPaths[ballNum]) {
      this.ballPaths[ballNum] = []
    }
    this.ballPaths[ballNum].push(position)
  }
}
