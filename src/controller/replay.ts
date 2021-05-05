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
    this.playNextShot()
    return this
  }

  playNextShot() {
    var aim = AimEvent.fromJson(this.shots.shift())
    this.container.table.cue.aim = aim
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.view.camera.mode = this.container.view.camera.aimView
    setTimeout(() => {
      this.container.eventQueue.push(new HitEvent({}))
    }, this.delay)
  }

  handleHit(_: HitEvent) {
    this.container.table.outcome = []
    this.container.table.hit()
    this.container.view.camera.mode = this.container.view.camera.afterHitView
    return this
  }

  handleStationary(_) {
    console.log("stationary event")
    if (this.container.table.outcome.some((x) => x.type == "pot")) {
      console.log(this.container.table.outcome.filter((x) => x.type == "pot"))
    }
    if (this.shots.length > 0) {
      setTimeout(() => {
        this.playNextShot()
      }, this.delay)
    }

    return this
  }

  handleInput(input: Input): Controller {
    switch (input.key) {
      case "KeyOUp":
        this.container.view.camera.mode = this.container.view.camera.topView
        break
    }
    return this
  }
}
