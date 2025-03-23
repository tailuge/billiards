export class RealOverlay {
  canvas
  ctx
  fileInput = document.getElementById("fileInput")
  shotIndexDisplay = document.getElementById("shotIndexDisplay")
  shotSelector = document.getElementById("shotSelector")
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

  start() {
    console.log("real overlay start")
    this.loadDefaultData()
  }
}
