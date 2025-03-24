import { RealPosition } from "./realposition"

export class RealOverlay {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  fileInput: HTMLInputElement = document.getElementById(
    "fileInput"
  )! as HTMLInputElement
  shotIndexDisplay: HTMLSpanElement = document.getElementById(
    "shotIndexDisplay"
  )! as HTMLSpanElement
  shotSelector: HTMLSelectElement = document.getElementById(
    "shotSelector"
  )! as HTMLSelectElement
  replayButton: HTMLButtonElement = document.getElementById(
    "replayButton"
  )! as HTMLButtonElement
  myIframe = document.getElementById("myIframe")

  BALL_COLORS = { 1: "white", 2: "yellow", 3: "red" }
  BALL_DIAMETER = 0.0615
  TABLE_WIDTH = 2.84
  CUSHION_WIDTH = 0.01
  TABLE_HEIGHT = this.TABLE_WIDTH / 2
  PIXELS_PER_METER: number

  allShots: any[] = []
  currentShotIndex = 0
  animationTimer = -2.25
  isPlaying = false
  tableDrawn = false
  lastFrameTime = 0
  animationStartTime = 0
  realPosition: RealPosition | null = null

  elapsedTime = 0

  constructor(canvas: HTMLCanvasElement, container: any) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")!
    this.PIXELS_PER_METER = this.canvas.width / this.TABLE_WIDTH
    container && (container.frame = this.advance.bind(this))
    console.log("this.canvas.width ", this.canvas.width)
    this.start()
  }

   start() {
    console.log("real overlay start")
     this.loadDefaultData()
    this.addEventListeners() //add event listeners
  }

  addEventListeners() {
    this.fileInput.addEventListener("change", (event) =>
      this.handleFileChange(event)
    )
    this.shotSelector.addEventListener("change", () => this.handleShotSelect())
  }

  handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const shotsData = JSON.parse(e.target!.result as string)
          this.processShots(shotsData)
        } catch (error) {
          console.error("Error parsing JSON:", error)
          alert("Error parsing JSON file.")
        }
      }
      reader.readAsText(file)
    }
  }

  handleShotSelect() {
    this.currentShotIndex = parseInt(this.shotSelector.value, 10)
    this.updateDisplay()
    this.resetAnimation()
  }

  handleReplay() {
    this.resetAnimation()
  }

  loadDefaultData() {
    fetch("simple_shots.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((shotsData) => this.processShots(shotsData))
      .catch((error) => {
        console.error("Error loading default JSON:", error)
      })
  }

  processShots(shotsData: any[]) {
    this.allShots = shotsData
    this.realPosition = new RealPosition(this.allShots) // Initialize the simulator
    if (this.allShots.length > 0) {
      this.currentShotIndex = 0
      this.populateShotSelector()
      this.updateDisplay()
      this.drawTable()
      this.drawShot(this.allShots[this.currentShotIndex], 0)
    } else {
      console.log("No shots found in the data.")
    }
  }

  populateShotSelector() {
    this.shotSelector.innerHTML = ""
    this.allShots.forEach((shot, index) => {
      const option = document.createElement("option")
      option.value = index.toString()
      option.text = `Shot ${index + 1} (ID: ${shot.shotID})`
      this.shotSelector.appendChild(option)
    })
    if (this.allShots.length > 0) {
      this.shotSelector.value = this.currentShotIndex.toString()
    }
  }

  updateDisplay() {
    this.shotIndexDisplay.textContent = `Shot: ${this.currentShotIndex + 1}`
    if (this.allShots[this.currentShotIndex]) {
      this.shotSelector.value = this.currentShotIndex.toString()
    }
  }

  drawTable() {
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

    for (let i = 0; i <= 8; i++) {
      let x =
        this.CUSHION_WIDTH * this.PIXELS_PER_METER +
        (i *
          (this.canvas.width -
            2 * this.CUSHION_WIDTH * this.PIXELS_PER_METER)) /
          8
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.canvas.height)
      this.ctx.lineTo(x, 0)
      this.ctx.stroke()
    }

    for (let i = 0; i <= 4; i++) {
      let y =
        this.canvas.height -
        (this.CUSHION_WIDTH * this.PIXELS_PER_METER +
          (i *
            (this.canvas.height -
              2 * this.CUSHION_WIDTH * this.PIXELS_PER_METER)) /
            4)
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.canvas.width, y)
      this.ctx.stroke()
    }
    this.tableDrawn = true
  }

  drawBall(x: number, y: number, color: string) {
    const radius = (this.BALL_DIAMETER / 2) * this.PIXELS_PER_METER
    const flippedX = this.canvas.width - x
    const flippedY =  y
    this.ctx.beginPath()
    this.ctx.arc(flippedX, flippedY, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.strokeStyle = "black"
    this.ctx.lineWidth = 1
    this.ctx.stroke()
  }

  drawShot(shotData: any, currentTime: number = 0) {
    if (!this.tableDrawn) {
      this.drawTable()
    }
console.log("drawShot", shotData.shotID, currentTime)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawTable()

    if (!this.realPosition) return
    const ballPositions = this.realPosition.getPositionsAtTime(
      shotData.shotID,
      currentTime
    )

    if (!ballPositions) return

    for (const ballNum in ballPositions) {
      const ballPosition = ballPositions[ballNum]
      const color = this.BALL_COLORS[ballNum]
      const x = ballPosition.x * this.PIXELS_PER_METER
      const y = this.canvas.height - ballPosition.y * this.PIXELS_PER_METER
      this.drawBall(x, y, color)
    }
  }

  resetAnimation() {
    this.isPlaying = false
    this.animationTimer = -3.7
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawTable()
    this.drawShot(this.allShots[this.currentShotIndex], 0)
  }

  advance(elapsed: number) {
    this.elapsedTime += elapsed
//    console.log("elapsed time", this.elapsedTime)
    if (this.realPosition && this.allShots.length > 0) {
      this.animationTimer += elapsed
      const currentShot = this.allShots[this.currentShotIndex]


      this.drawShot(currentShot, this.animationTimer)
    }
  }
}
