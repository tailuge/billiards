import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { WatchShot } from "./watchshot"
import { ControllerBase } from "./controllerbase"

export class WatchAim extends ControllerBase {
  override get name() {
    return "WatchAim"
  }

  constructor(container) {
    super(container)
    this.container.table.cueball = this.container.rules.otherPlayersCueBall()
    this.container.table.cue.moveTo(this.container.table.cueball.pos)
    this.container.view.camera.suggestMode(this.container.view.camera.topView)
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    this.container.table.cueball.pos.copy(event.pos)
    return this
  }

  override handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.tablejson)
    return new WatchShot(this.container)
  }
}
