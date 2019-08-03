import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { WatchShot } from "./watchshot"
import { ControllerBase } from "./controllerbase"

export class WatchAim extends ControllerBase {
  readonly scale = 0.000001

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.view.camera.mode = this.container.view.camera.topView
  }

  handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    return this
  }

  handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.json)
    return new WatchShot(this.container)
  }
}
