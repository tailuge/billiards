export class RealOverlay {
  canvas
  ctx
  fileInput = document.getElementById("fileInput")! as HTMLInputElement
  shotIndexDisplay = document.getElementById(
    "shotIndexDisplay"
  )! as HTMLSpanElement
  shotSelector = document.getElementById("shotSelector")! as HTMLSelectElement
  replayButton = document.getElementById("replayButton")
  myIframe = document.getElementById("myIframe")

  BALL_COLORS = { 1: "white", 2: "yellow", 3: "red" }
  BALL_DIAMETER = 0.0615
  TABLE_WIDTH = 2.84
  CUSHION_WIDTH = 0.01
  TABLE_HEIGHT = this.TABLE_WIDTH / 2
  PIXELS_PER_METER

  allShots = []
  currentShotIndex = 0
  animationTimer = 0
  animationInterval
  isPlaying = false
  tableDrawn = false
  lastFrameTime = 0
  animationStartTime = 0

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.PIXELS_PER_METER = this.canvas.width / this.TABLE_WIDTH
    console.log("this.canvas.width ", this.canvas.width)
  }

  interpolateUntilMove(data, delta = 0.3, epsilon = 0.00001) {
    if (data.t.length > 1 && data.t[1] - data.t[0] > delta) {
      data.t.splice(1, 0, data.t[1] - epsilon)
      data.x.splice(1, 0, data.x[0])
      data.y.splice(1, 0, data.y[0])
    }
    return data
  }

  interpolateAllBalls(shot) {
    shot.balls = Object.fromEntries(
      Object.entries(shot.balls).map(([num, data]) => [
        num,
        this.interpolateUntilMove(data),
      ])
    )
    return shot
  }

  processShots(shotsData) {
    console.log("processShots", shotsData)
    this.allShots = shotsData
    //    this.allShots = this.allShots.map(shot => this.interpolateAllBalls(shot))

    if (this.allShots.length > 0) {
      this.currentShotIndex = 0
      //        this.populateShotSelector();
      //        this.updateDisplay();
      //        this.drawTable();
      //        this.drawShot(allShots[currentShotIndex], 0);
    } else {
      console.log("No shots found in the data.")
    }
  }

  loadDefaultData() {
    fetch("simple_shots.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(this.processShots)
      .catch((error) => {
        console.error("Error loading default JSON:", error)
      })
  }

  populateShotSelector() {
    this.shotSelector.innerHTML = ""
    this.allShots.forEach((shot: any, index) => {
      const option = document.createElement("option") as HTMLOptionElement
      option.value = `${index}`
      option.text = `Shot ${index + 1} (ID: ${shot.shotID})`
      this.shotSelector.add(option)
    })
    if (this.allShots.length > 0) {
      this.shotSelector.value = `${this.currentShotIndex}`
    }
  }

  updateDisplay() {
    this.shotIndexDisplay.textContent = `Shot: ${this.currentShotIndex + 1}`
    if (this.allShots[this.currentShotIndex]) {
      this.shotSelector.value = `${this.currentShotIndex}`
    }
  }

  drawTable() {
    // No scaling or translation here
    this.ctx.fillStyle = "#222255"
    this.ctx.fillRect(
      0,
      this.canvas.height - this.CUSHION_WIDTH * this.PIXELS_PER_METER,
      this.canvas.width,
      this.CUSHION_WIDTH * this.PIXELS_PER_METER
    )
    this.ctx.fillRect(
      0,
      0,
      this.canvas.width,
      this.CUSHION_WIDTH * this.PIXELS_PER_METER
    )
    this.ctx.fillRect(
      0,
      this.canvas.height - this.CUSHION_WIDTH * this.PIXELS_PER_METER,
      this.CUSHION_WIDTH * this.PIXELS_PER_METER,
      -this.canvas.height
    )
    this.ctx.fillRect(
      this.canvas.width - this.CUSHION_WIDTH * this.PIXELS_PER_METER,
      this.canvas.height,
      this.CUSHION_WIDTH * this.PIXELS_PER_METER,
      -this.canvas.height
    )

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    this.ctx.lineWidth = 1

    this.tableDrawn = true
  }

  drawBall(x, y, color) {
    const radius = (this.BALL_DIAMETER / 2) * this.PIXELS_PER_METER
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.strokeStyle = "black"
    this.ctx.lineWidth = 1
    this.ctx.stroke()
  }

  drawShot(shotData, currentTime = 0) {
    if (!this.tableDrawn) {
      this.drawTable()
    }

    const getInterpolatedPosition = (times, positions, targetTime) => {
      if (!times || times.length === 0) return positions[0]

      if (targetTime <= times[0]) return positions[0]
      if (targetTime >= times[times.length - 1])
        return positions[positions.length - 1]

      let lowIndex = 0
      let highIndex = times.length - 1
      while (lowIndex < highIndex - 1) {
        const midIndex = Math.floor((lowIndex + highIndex) / 2)
        if (times[midIndex] < targetTime) {
          lowIndex = midIndex
        } else {
          highIndex = midIndex
        }
      }

      const t1 = times[lowIndex]
      const t2 = times[highIndex]
      const p1 = positions[lowIndex]
      const p2 = positions[highIndex]
      const alpha = (targetTime - t1) / (t2 - t1)
      return p1 + alpha * (p2 - p1)
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawTable()

    for (const ballNum in shotData.balls) {
      const ballData = shotData.balls[ballNum]
      const color = this.BALL_COLORS[ballNum]
      const xPositions = ballData.x
      const yPositions = ballData.y
      const times = ballData.t

      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 2
      this.ctx.beginPath()

      let currentX, currentY
      if (times && times.length > 0) {
        currentX =
          getInterpolatedPosition(times, xPositions, currentTime) *
          this.PIXELS_PER_METER
        currentY =
          this.canvas.height -
          getInterpolatedPosition(times, yPositions, currentTime) *
            this.PIXELS_PER_METER

        // Draw path
        let prevX = xPositions[0] * this.PIXELS_PER_METER
        let prevY = this.canvas.height - yPositions[0] * this.PIXELS_PER_METER
        this.ctx.moveTo(prevX, prevY)

        for (let i = 1; i < times.length; i++) {
          if (times[i] <= currentTime) {
            const x = xPositions[i] * this.PIXELS_PER_METER
            const y = this.canvas.height - yPositions[i] * this.PIXELS_PER_METER
            this.ctx.lineTo(x, y)
            prevX = x
            prevY = y
          } else {
            const x =
              getInterpolatedPosition(times, xPositions, currentTime) *
              this.PIXELS_PER_METER
            const y =
              this.canvas.height -
              getInterpolatedPosition(times, yPositions, currentTime) *
                this.PIXELS_PER_METER
            this.ctx.lineTo(x, y)
            break
          }
        }
        this.ctx.stroke()
      }
      this.drawBall(currentX, currentY, color)
    }
  }

  animate(timestamp) {
    if (!this.isPlaying) return

    if (!this.animationStartTime) {
      this.animationStartTime = timestamp
      this.lastFrameTime = timestamp
    }

    // Calculate elapsed time since last frame
    const elapsedTime = (timestamp - this.lastFrameTime) / 1000 // Convert to seconds
    this.lastFrameTime = timestamp

    this.animationTimer += elapsedTime // Advance simulation time

    const currentShot: any = this.allShots[this.currentShotIndex]
    if (!currentShot || !currentShot.balls) {
      this.resetAnimation()
      return
    }

    // Find the max time available for this shot
    let maxTime = 0
    for (const ballNum in currentShot.balls) {
      const ballData = currentShot.balls[ballNum]
      if (ballData.t && ballData.t.length > 0) {
        maxTime = Math.max(maxTime, ballData.t[ballData.t.length - 1])
      }
    }

    if (this.animationTimer > maxTime) {
      this.resetAnimation()
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawTable()
    this.drawShot(currentShot, this.animationTimer)

    requestAnimationFrame(this.animate)
  }

  startAnimation() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.animationStartTime = 0
    this.animationTimer = 0
    this.lastFrameTime = performance.now()
    requestAnimationFrame(this.animate)
  }

  resetAnimation() {
    this.isPlaying = false
    this.animationTimer = 0
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawTable()
    this.drawShot(this.allShots[this.currentShotIndex], 0)
  }

  start() {
    console.log("real overlay start")
    this.loadDefaultData()
  }
}
