import { Controller } from "./controller"
import { Replay } from "./replay"
import { Aim } from "./aim"
import { GameEvent } from "../events/gameevent"

export class DrillReplay extends Replay {
  constructor(container, preShotState: number[], shots: GameEvent[]) {
    super(container, preShotState, shots, false, 1500)
    container.view.camera.forceMode(container.view.camera.topView)
  }

  override handleStationary(_): Controller {
    if (this.shots.length > 0 && this.timer === undefined) {
      this.playNextShot(this.delay)
    }
    if (this.shots.length === 0 && this.timer === undefined) {
      return new Aim(this.container)
    }
    return this
  }
}
