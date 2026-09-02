import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import { Session } from "../network/client/session"
import { BeginEvent } from "../events/beginevent"
import { HitEvent } from "../events/hitevent"

export class WatchShot extends ControllerBase {
  private recorded = false

  override get name(): string {
    return "WatchShot"
  }
  constructor(container, _hitEvent?: HitEvent) {
    super(container)
    this.container.sound.lastOutcomeTime = -1
    this.container.table.outcome = []
    this.container.table.hit()
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
  }

  private recordShot() {
    if (this.recorded) return
    this.recorded = true
    const outcome = this.container.table.outcome
    this.container.recorder.updateBreak(outcome, false, false, true)
  }

  override handleStationary(_) {
    if (Session.isBotMode()) {
      this.container.sendEvent(new BeginEvent())
    }

    this.recordShot()
    const outcome = this.container.table.outcome
    if (
      this.container.rules.rulename !== "snooker" &&
      this.container.rules.isEndOfGame(outcome) &&
      !Session.isBotMode()
    ) {
      return this.container.rules.handleGameEnd(false)
    }
    return this
  }

  override handleStartAim(_) {
    this.recordShot()
    this.container.rules.startTurn()
    return new Aim(this.container)
  }

  override handlePlaceBall(event: PlaceBallEvent) {
    this.recordShot()
    const respot = event.respot
    if (respot) {
      const ball = this.container.table.balls.find((b) => b.id === respot.id)
      if (ball) {
        ball.pos.copy(respot.pos)
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
    this.recordShot()
    if ("rerack" in event.json) {
      console.log("Respot")
      RerackEvent.applyBallinfoToTable(this.container.table, event.json)
      return this
    }
    return new WatchAim(this.container)
  }
}
