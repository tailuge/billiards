import { RealPosition } from "./realposition"
import { RealDraw } from "./realdraw"

export class RealOverlay {
  private drawer: RealDraw
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

  allShots: any[] = []
  currentShotIndex = 0
  animationTimer = -2.25
  isPlaying = false
  lastFrameTime = 0
  animationStartTime = 0
  realPosition: RealPosition | null = null
  elapsedTime = 0

  constructor(canvas: HTMLCanvasElement, container: any) {
    this.drawer = new RealDraw(canvas)
    container && (container.frame = this.advance.bind(this))
    this.start()
  }

  start() {
    console.log("real overlay start")
    this.loadDefaultData()
    this.addEventListeners()
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
  }

  processShots(shotsData: any[]) {
    this.allShots = shotsData
    this.realPosition = new RealPosition(this.allShots)
    if (this.allShots.length > 0) {
      this.currentShotIndex = 0
      this.populateShotSelector()
      this.updateDisplay()
      this.drawShot(this.allShots[this.currentShotIndex], 0)
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

  drawShot(shotData: any, currentTime: number = 0) {
    if (!this.realPosition) return

    const ballPositions = this.realPosition.getPositionsAtTime(
      shotData.shotID,
      currentTime
    )
    if (!ballPositions) return

    // Update ball paths with current positions
    for (const ballNum in ballPositions) {
      this.drawer.updateBallPaths(ballNum, ballPositions[ballNum])
    }

    // Clear and redraw everything
    this.drawer.clear()
    this.drawer.drawShot(ballPositions)
  }

  resetAnimation() {
    this.isPlaying = false
    this.animationTimer = -3.7
    this.drawer.resetCanvas() // This will clear both the canvas and the stored paths
    this.drawShot(this.allShots[this.currentShotIndex], 0)
  }

  advance(elapsed: number) {
    this.elapsedTime += elapsed
    if (this.realPosition && this.allShots.length > 0) {
      this.animationTimer += elapsed
      const currentShot = this.allShots[this.currentShotIndex]
      this.drawShot(currentShot, this.animationTimer)
    }
  }
}
