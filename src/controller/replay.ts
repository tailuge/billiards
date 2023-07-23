import { HitEvent } from "../events/hitevent"
import { ControllerBase } from "./controllerbase"
import { AimEvent } from "../events/aimevent"
import { Controller, Input } from "./controller"

export class Replay extends ControllerBase {
  readonly delay = 1500
  shots: AimEvent[]

  constructor(container, shots) {
    super(container)
    this.shots = shots
    console.log(JSON.stringify(shots))
  }

  onFirst() {
    this.playNextShot()
  }

  playNextShot() {
    const shot = this.shots.shift()
    const aim = AimEvent.fromJson(shot)
    this.container.table.cue.aim = aim
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.view.camera.suggestMode(this.container.view.camera.aimView)
    setTimeout(() => {
      this.container.eventQueue.push(new HitEvent(this.container.table.cue.aim))
    }, this.delay)
  }

  handleHit(_: HitEvent) {
    this.container.table.outcome = []
    this.container.table.hit()
    this.container.view.camera.suggestMode(
      this.container.view.camera.afterHitView
    )
    return this
  }

  handleStationary(_) {
    if (this.shots.length > 0) {
      setTimeout(() => {
        this.playNextShot()
      }, this.delay)
    }

    return this
  }

  handleInput(input: Input): Controller {
    if (input.key == "KeyOUp") {
      this.container.view.camera.toggleMode()
    }
    return this
  }
}
