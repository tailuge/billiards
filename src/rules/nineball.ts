import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { Controller } from "../controller/controller"
import { PlaceBall } from "../controller/placeball"
import { WatchAim } from "../controller/watchaim"
import { PlaceBallEvent } from "../events/placeballevent"
import { WatchEvent } from "../events/watchevent"
import { Outcome } from "../model/outcome"
import { Table } from "../model/table"
import { Rack } from "../utils/rack"
import { zero } from "../utils/utils"
import { Rules } from "./rules"

export class NineBall implements Rules {
  readonly container: Container

  constructor(container) {
    this.container = container
  }

  table(): Table {
    return new Table(this.rack())
  }

  rack() {
    return Rack.diamond()
  }

  update(outcome: Outcome[]): Controller {
    const table = this.container.table
    // if white potted switch to other player
    if (Outcome.isCueBallPotted(table.balls[0], outcome)) {
      this.container.log("in off")
      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      this.container.sendEvent(new PlaceBallEvent(zero, true))
      return new WatchAim(this.container)
    }
    if (Outcome.isBallPottedNoFoul(table.balls[0], table.outcome)) {
      this.container.sound.playSuccess(table.inPockets())
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }
    // if no pot and no foul switch to other player
    this.container.log("no pot")
    this.container.sendEvent(table.cue.aim)
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  secondToPlay() {
    // nothing to note
  }
}
