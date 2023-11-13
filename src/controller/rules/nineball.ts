import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { PlaceBall } from "../../controller/placeball"
import { WatchAim } from "../../controller/watchaim"
import { ChatEvent } from "../../events/chatevent"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { zero } from "../../utils/utils"
import { End } from "../end"
import { Rules } from "./rules"
import { R } from "../../model/physics/constants"
import { Respot } from "../../utils/respot"
import { TableGeometry } from "../../view/tablegeometry"
import { StartAimEvent } from "../../events/startaimevent"

export class NineBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0

  constructor(container) {
    this.container = container
  }

  startTurn() {
    // not used
  }

  nextCandidateBall() {
    return Respot.closest(
      this.container.table.cueball,
      this.container.table.balls
    )
  }

  placeBall(target?): Vector3 {
    if (target) {
      const max = new Vector3(-TableGeometry.X / 2, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      return target.clamp(min, max)
    }
    return new Vector3((-R * 11) / 0.5, 0, 0)
  }

  asset(): string {
    return "models/p8.min.gltf"
  }

  tableGeometry() {
    TableGeometry.hasPockets = true
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
      this.startTurn()
      if (this.container.isSinglePlayer) {
        return new PlaceBall(this.container)
      }
      this.container.sendEvent(new PlaceBallEvent(zero, true))
      return new WatchAim(this.container)
    }
    if (Outcome.isBallPottedNoFoul(table.cueball, outcome)) {
      this.container.sound.playSuccess(table.inPockets())
      if (this.isEndOfGame(outcome)) {
        this.container.eventQueue.push(new ChatEvent(null, `game over`))
        this.container.recorder.wholeGameLink()
        return new End(this.container)
      }
      this.container.sendEvent(new WatchEvent(table.serialise()))
      return new Aim(this.container)
    }
    // if no pot and no foul switch to other player
    this.container.sendEvent(new StartAimEvent())
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  isPartOfBreak(outcome: Outcome[]) {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  isEndOfGame(_: Outcome[]) {
    const onTable = this.container.table.balls.filter((ball) => ball.onTable())
    return onTable.length === 1 && onTable[0] === this.cueball
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
