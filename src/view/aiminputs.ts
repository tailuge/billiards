import { Container } from "../controller/container"
import { Input } from "../events/input"

export class AimInputs {
  cueBallElement
  cueTipElement
  cuePowerElement
  cueHitElement

  readonly ballWidth
  readonly ballHeight
  readonly tipRadius

  container: Container

  constructor(container) {
    this.container = container
    this.cueBallElement = document.getElementById("cueBall")
    this.cueTipElement = document.getElementById("cueTip")
    this.ballWidth = this.cueBallElement?.offsetWidth
    this.ballHeight = this.cueBallElement?.offsetHeight
    this.tipRadius = this.cueTipElement?.offsetWidth / 2

    this.cueBallElement?.addEventListener("pointermove", this.mousemove)
    this.cueBallElement?.addEventListener("click", this.click)

    this.cuePowerElement = document.getElementById("cuePower")
    document.addEventListener("wheel", this.mousewheel)

    this.cueHitElement = document.getElementById("cueHit")
    this.cueHitElement?.addEventListener("click", this.hit)
    document.addEventListener("dblclick", this.hit)
  }

  click = (e) => {
    this.adjustSpin(e)
  }

  mousemove = (e) => {
    if (e.buttons === 1) {
      this.adjustSpin(e)
    }
  }

  adjustSpin(e) {
    this.container.table.cue.setSpin(
      -(e.offsetX - this.ballWidth / 2) / this.ballWidth,
      -(e.offsetY - this.ballHeight / 2) / this.ballHeight
    )
  }

  updateVisualState(x: number, y: number) {
    const elt = this.cueTipElement?.style
    if (elt) {
      elt.left = (-x + 0.5) * this.ballWidth - this.tipRadius + "px"
      elt.top = (-y + 0.5) * this.ballHeight - this.tipRadius + "px"
    }
  }

  hit = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement.value / 100)
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  mousewheel = (e) => {
    this.cuePowerElement.value -= Math.sign(e.deltaY) * 10
  }
}
