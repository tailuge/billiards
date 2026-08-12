import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import { Session } from "../network/client/session"
import { BeginEvent } from "../events/beginevent"
import { HitEvent } from "../events/hitevent"
import { ScoreEvent } from "../events/scoreevent"

export class WatchShot extends ControllerBase {
  override get name(): string {
    return "WatchShot"
  }

  private scoreEventReceived = false

  constructor(container, _hitEvent?: HitEvent) {
    super(container)
    this.container.table.outcome = []
    this.container.table.hit()
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
  }

  override handleScore(event: ScoreEvent) {
    this.scoreEventReceived = true
    return super.handleScore(event)
  }

  override handleStationary(_) {
    if (Session.isBotMode()) {
      this.container.sendEvent(new BeginEvent())
    }

    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome) && !Session.isBotMode()) {
      if (this.container.rules.rulename === "snooker" && !this.scoreEventReceived) {
        const points = this.container.rules.getAmountScored(outcome)
        if (points > 0) {
          Session.getInstance().addOpponentScore(points)
          const { p1, p2 } = Session.getInstance().orderedScoresForHud()
          this.container.updateScoreHud(p1, p2, 0)
        }
      }
      return this.container.rules.handleGameEnd(false)
    }
    return this
  }

  override handleStartAim(_) {
    this.container.rules.startTurn()
    return new Aim(this.container)
  }

  override handlePlaceBall(event: PlaceBallEvent) {
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
    if ("rerack" in event.json) {
      console.log("Respot")
      RerackEvent.applyBallinfoToTable(this.container.table, event.json)
      return this
    }
    return new WatchAim(this.container)
  }
}
