import { Container } from "../controller/container"
import { Input } from "../events/input"

export class AimInputs {
  readonly cueBallElement
  readonly cueTipElement
  readonly cuePowerElement
  readonly cueHitElement

  ballWidth
  ballHeight
  tipRadius

  container: Container

  constructor(container) {
    this.container = container
    this.cueBallElement = document.getElementById("cueBall")
    this.cueTipElement = document.getElementById("cueTip")
    this.cuePowerElement = document.getElementById("cuePower")
    this.cueHitElement = document.getElementById("cueHit")
    this.addListeners()
  }

  addListeners() {
    this.cueBallElement?.addEventListener("pointermove", this.mousemove)
    this.cueBallElement?.addEventListener("click", (e) => {
      this.adjustSpin(e)
    })
    this.cueHitElement?.addEventListener("click", this.hit)
    document.addEventListener("dblclick", this.hit)
    document.addEventListener("wheel", this.mousewheel)
  }

  mousemove = (e) => {
    if (e.buttons === 1) {
      this.adjustSpin(e)
    }
  }

  readDimensions() {
    this.ballWidth = this.cueBallElement?.offsetWidth
    this.ballHeight = this.cueBallElement?.offsetHeight
    this.tipRadius = this.cueTipElement?.offsetWidth / 2
  }

  adjustSpin(e) {
    this.readDimensions()
    this.container.table.cue.setSpin(
      -(e.offsetX - this.ballWidth / 2) / this.ballWidth,
      -(e.offsetY - this.ballHeight / 2) / this.ballHeight
    )
  }

  updateVisualState(x: number, y: number) {
    const elt = this.cueTipElement?.style
    if (elt) {
      this.readDimensions()
      elt.left = (-x + 0.5) * this.ballWidth - this.tipRadius + "px"
      elt.top = (-y + 0.5) * this.ballHeight - this.tipRadius + "px"
    }
  }

  updatePowerSlider(power) {
    this.cuePowerElement?.value && (this.cuePowerElement.value = power * 100)
  }

  hit = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement.value / 100)
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  mousewheel = (e) => {
    this.cuePowerElement.value -= Math.sign(e.deltaY) * 10
  }
}
