import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { PlaceBall } from "../../controller/placeball"
import { WatchAim } from "../../controller/watchaim"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { zero } from "../../utils/utils"
import { Rules } from "./rules"

export class NineBall implements Rules {
  readonly container: Container

  cueball: Ball

  constructor(container) {
    this.container = container
  }

  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  rack() {
    return Rack.diamond()
  }

  update(outcome: Outcome[]): Controller {
    const table = this.container.table
    // if white potted switch to other player
    if (Outcome.isCueBallPotted(table.cueball, outcome)) {
      this.container.log("in off")
      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      this.container.sendEvent(new PlaceBallEvent(zero, true))
      return new WatchAim(this.container)
    }
    if (Outcome.isBallPottedNoFoul(table.cueball, outcome)) {
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

  isPartOfBreak(outcome: Outcome[]) {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  isEndOfGame(_: Outcome[]) {
    return (
      this.container.table.balls.filter((ball) => ball.onTable()).length === 1
    )
  }

  otherPlayersCueBall(): Ball {
    // only for three cushion
    return this.cueball
  }

  secondToPlay() {
    // only for three cushion
  }

  allowsPlaceBall() {
    return true
  }
}
