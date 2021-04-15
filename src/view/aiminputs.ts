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
    const ballDiameter = this.cueBallElement.offsetWidth
    const tipRadius = this.cueTipElement.offsetWidth / 2
    let clamped = this.container.table.cue.setSpin(
      -(e.offsetX - ballDiameter / 2) / ballDiameter,
      -(e.offsetY - ballDiameter / 2) / ballDiameter
    )
    this.cueTipElement.style.left =
      (-clamped.x + 0.5) * ballDiameter - tipRadius + "px"
    this.cueTipElement.style.top =
      (-clamped.y + 0.5) * ballDiameter - tipRadius + "px"
  }

  hit = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement.value / 100)
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  mousewheel = (e) => {
    this.cuePowerElement.value -= Math.sign(e.deltaY) * 10
  }
}
