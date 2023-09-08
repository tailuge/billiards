import { HitEvent } from "../events/hitevent"
import { ControllerBase } from "./controllerbase"
import { AimEvent } from "../events/aimevent"
import { Controller, Input } from "./controller"

export class Replay extends ControllerBase {
  delay: number
  shots: AimEvent[]

  constructor(container, shots, delay = 1500) {
    super(container)
    this.shots = shots
    this.delay = delay
  }

  override onFirst() {
    this.playNextShot(this.delay * 2)
  }

  playNextShot(delay) {
    const shot = this.shots.shift()
    const aim = AimEvent.fromJson(shot)
    this.container.table.balls[0].pos.copy(aim.pos)
    this.container.table.cue.aim = aim
    this.container.table.cue.updateAimInput()
    this.container.table.cue.t = 1
    this.container.view.camera.forceMode(this.container.view.camera.topView)
    setTimeout(() => {
      this.container.eventQueue.push(new HitEvent(this.container.table.cue.aim))
    }, delay)
  }

  override handleHit(_: HitEvent) {
    this.hit()
    return this
  }

  override handleStationary(_) {
    if (this.shots.length > 0) {
      setTimeout(() => {
        this.playNextShot(this.delay)
      }, this.delay)
    }

    return this
  }

  override handleInput(input: Input): Controller {
    if (input.key == "KeyOUp") {
      this.container.view.camera.toggleMode()
    }
    return this
  }
}
