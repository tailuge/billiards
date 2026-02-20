import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import { Session } from "../network/client/session"
import { WatchEvent } from "../events/watchevent"

export class WatchShot extends ControllerBase {
  override get name(): string {
    return "WatchShot"
  }
  constructor(container) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
  }

  override handleStationary(_) {
    const table = this.container.table
    const outcome = table.outcome
    if (this.container.rules.isEndOfGame(outcome)) {
      return this.container.rules.handleGameEnd(false)
    }
    if (Session.isBotMode()) {
      const nextController = this.container.rules.update(outcome)
      const [s1, s2] = this.container.rules.getScores()
      const b = this.container.rules.currentBreak
      this.container.sendScoreUpdate(s1, s2, b)

      const isPartOfBreak = this.container.rules.isPartOfBreak(outcome)
      const isEndOfGame = this.container.rules.isEndOfGame(outcome)
      this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame)
      table.cue.aimAtNext(table.cueball, this.container.rules.nextCandidateBall())

      if (nextController.name === "Aim") {
        // Bot continues turn. Stay in Watch mode for human.
        this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
        return new WatchAim(this.container)
      }
      return nextController
    }
    return this
  }

  override handleStartAim(_) {
    this.container.rules.startTurn()
    return new Aim(this.container)
  }

  override handlePlaceBall(event: PlaceBallEvent) {
    if (event.respot) {
      const ball = this.container.table.balls.find(
        (b) => b.id === event.respot!.id
      )
      if (ball) {
        ball.pos.copy(event.respot!.pos)
        ball.setStationary()
      }
    }
    if (event.useStartPos) {
      this.container.rules.startTurn()
      return new PlaceBall(this.container, event.pos.clone())
    }
    this.container.rules.startTurn()
    return new PlaceBall(this.container)
  }

  override handleWatch(event) {
    if ("rerack" in event.json) {
      console.log("Respot")
      RerackEvent.applyBallinfoToTable(this.container.table, event.json)
      return this
    }
    return new WatchAim(this.container)
  }
}
