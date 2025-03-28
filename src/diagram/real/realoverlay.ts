import { RealPosition } from "./realposition"
import { RealDraw } from "./realdraw"
import { Container } from "../../container/container"
import { BreakEvent } from "../../events/breakevent"
import { AbortEvent } from "../../events/abortevent"

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
  animationTimer = -2.35
  isPlaying = false
  lastFrameTime = 0
  animationStartTime = 0
  realPosition: RealPosition | null = null
  elapsedTime = 0
  container: Container

  constructor(canvas: HTMLCanvasElement, container: any) {
    this.drawer = new RealDraw(canvas)
    this.container = container
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
      this.resetAnimation()
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

    for (const ballNum in ballPositions) {
      this.drawer.updateBallPaths(ballNum, ballPositions[ballNum])
    }

    this.drawer.clear()
    this.drawer.drawShot(ballPositions)
  }

  handleReplay() {
    this.resetAnimation()
  }

  resetAnimation() {
    this.isPlaying = false
    this.animationTimer = -3.7
    this.drawer.resetCanvas()
    this.drawShot(this.allShots[this.currentShotIndex], 0)
    this.resetSimulation(this.allShots[this.currentShotIndex])
  }

  resetSimulation(shotData: any) {
    this.container.eventQueue.push(new AbortEvent())
    const ballPositions = this.realPosition!.getPositionsAtTime(
      shotData.shotID,
      0
    )
    console.log(ballPositions)
    for (const ballNum in ballPositions) {
      const ball = Number(ballNum) - 1
      const pos = ballPositions[ballNum]
      this.container.table.balls[ball].pos.setX(2.3 * (0.71 - pos.x / 2))
      this.container.table.balls[ball].pos.setY(2.3 * (-0.36 + pos.y / 2))
    }
    // inject hit event
    var state = {
      init: [-0.8179, -0.2044, -0.8183, 0, 0.819, 0],
      shots: [
        {
          type: "AIM",
          offset: { x: -0.2783281572999748, y: 0.1481640786499874, z: 0 },
          angle: 0.149,
          power: 4.592,
          pos: { x: -0.8179000020027161, y: -0.20440000295639038, z: 0 },
          i: 0,
        },
      ],
    }

    this.container.eventQueue.push(new BreakEvent(state.init, state.shots))
    console.log("eventQueue depth:", this.container.eventQueue)
  }

  advance(elapsed: number) {
    this.elapsedTime += elapsed
    this.animationTimer += elapsed
    const currentShot = this.allShots[this.currentShotIndex]
    this.drawShot(currentShot, this.animationTimer)
  }
}
