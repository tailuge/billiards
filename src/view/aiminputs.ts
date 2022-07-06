import { Container } from "../controller/container"
import { Input } from "../events/input"

export class AimInputs {
  cueBallElement
  cueTipElement
  cuePowerElement
  cueHitElement

  container: Container

  constructor(container) {
    this.container = container
    this.cueBallElement = document.getElementById("cueBall")
    this.cueTipElement = document.getElementById("cueTip")
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
    const ballWidth = this.cueBallElement.offsetWidth
    const ballHeight = this.cueBallElement.offsetHeight
    const tipRadius = this.cueTipElement.offsetWidth / 2
    const clamped = this.container.table.cue.setSpin(
      -(e.offsetX - ballWidth / 2) / ballWidth,
      -(e.offsetY - ballHeight / 2) / ballHeight
    )
    this.cueTipElement.style.left =
      (-clamped.x + 0.5) * ballWidth - tipRadius + "px"
    this.cueTipElement.style.top =
      (-clamped.y + 0.5) * ballHeight - tipRadius + "px"
  }

  hit = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement.value / 100)
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  mousewheel = (e) => {
    this.cuePowerElement.value -= Math.sign(e.deltaY) * 10
  }
}
