export class AimInputs {
  private aimBall: HTMLElement | null
  private aimCoordinatesDisplay: HTMLElement | null
  private aimBallContainer: HTMLElement | null
  private powerSlider: HTMLInputElement | null
  private directionSlider: HTMLInputElement | null
  private readonly BALL_CONTAINER_RADIUS: number
  private readonly MAX_DISTANCE = 0.7
  private position = { x: 0, y: 0 }
  private power = 5
  private direction = 0

  constructor() {
    this.aimBall = document.getElementById("aim-ball")
    this.aimCoordinatesDisplay = document.getElementById("aim-coordinates")
    this.aimBallContainer = document.getElementById("aim-ball-container")
    this.powerSlider = document.getElementById("power") as HTMLInputElement
    this.directionSlider = document.getElementById(
      "direction"
    ) as HTMLInputElement
    this.BALL_CONTAINER_RADIUS = (this.aimBallContainer?.clientWidth || 0) / 2
    this.addEventListeners()
  }

  private addEventListeners() {
    this.aimBallContainer?.addEventListener("click", (event) =>
      this.handleClick(event)
    )

    this.powerSlider?.addEventListener("input", (event) => {
      this.power = parseInt((event.target as HTMLInputElement).value)
    })

    this.directionSlider?.addEventListener("input", (event) => {
      this.direction = parseInt((event.target as HTMLInputElement).value)
    })
  }

  private handleClick(event: MouseEvent) {
    if (!this.aimBallContainer || !this.aimBall) return

    const rect = this.aimBallContainer.getBoundingClientRect()
    let x = event.clientX - rect.left - rect.width / 2
    let y = event.clientY - rect.top - rect.height / 2

    // Calculate the distance from the center
    const distance = Math.sqrt(x * x + y * y)

    // Clamp the distance to MAX_DISTANCE * BALL_CONTAINER_RADIUS
    if (distance > this.MAX_DISTANCE * this.BALL_CONTAINER_RADIUS) {
      const angle = Math.atan2(y, x)
      x = this.MAX_DISTANCE * this.BALL_CONTAINER_RADIUS * Math.cos(angle)
      y = this.MAX_DISTANCE * this.BALL_CONTAINER_RADIUS * Math.sin(angle)
    }

    // Keep the ball within the container bounds
    const maxX = rect.width / 2 - this.aimBall.offsetWidth / 2
    const minX = -maxX
    const maxY = rect.height / 2 - this.aimBall.offsetHeight / 2
    const minY = -maxY

    const clampedX = Math.max(minX, Math.min(maxX, x))
    const clampedY = Math.max(minY, Math.min(maxY, y))

    // Update position
    this.position.x = clampedX / this.BALL_CONTAINER_RADIUS
    this.position.y = clampedY / this.BALL_CONTAINER_RADIUS

    this.updateDom()
  }

  private updateDom() {
    if (!this.aimBall || !this.aimBallContainer) return

    const rect = this.aimBallContainer.getBoundingClientRect()
    const x = this.position.x * this.BALL_CONTAINER_RADIUS
    const y = this.position.y * this.BALL_CONTAINER_RADIUS

    this.aimBall.style.left = `${x + rect.width / 2 - this.aimBall.offsetWidth / 2}px`
    this.aimBall.style.top = `${y + rect.height / 2 - this.aimBall.offsetHeight / 2}px`

    if (this.aimCoordinatesDisplay) {
      this.aimCoordinatesDisplay.textContent = `x: ${this.position.x.toFixed(2)}, y: ${this.position.y.toFixed(2)}`
    }
  }

  getAim(): {
    offset: { x: number; y: number; z: number }
    angle: number
    power: number
  } {
    return {
      offset: { x: this.position.x, y: this.position.y, z: 0 },
      angle: this.direction,
      power: this.power,
    }
  }

  setAim(state: {
    offset: { x: number; y: number }
    power: number
    angle: number
  }) {
    this.position.x = state.offset.x

    this.position.y = state.offset.y

    this.power = state.power
    this.powerSlider!.value = state.power.toString()

    this.direction = state.angle
    this.directionSlider!.value = state.angle.toString()

    console.log("set aim", state)
    this.updateDom()
  }
}
