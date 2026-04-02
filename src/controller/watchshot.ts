import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { ControllerBase } from "./controllerbase"
import { PlaceBall } from "./placeball"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import { Session } from "../network/client/session"
import { BeginEvent } from "../events/beginevent"
import { HitEvent } from "../events/hitevent"
import { warnAimDriftTripwire } from "../utils/aim-drift-tripwire"

export class WatchShot extends ControllerBase {
  override get name(): string {
    return "WatchShot"
  }
  constructor(container, hitEvent?: HitEvent) {
    super(container)
    this.container.table.outcome = []

    const tablejson = hitEvent?.tablejson
    const aim = tablejson ? (tablejson.aim ?? tablejson) : undefined
    const serialisedCueball = tablejson?.balls?.[0]?.pos

    warnAimDriftTripwire(
      "tripwire: remote_hit_sim_start_gap",
      aim,
      this.container.table.cueball.pos,
      {
        phase: "sim_start",
        controller: this.name,
        eventClientId: hitEvent?.clientId,
        eventPlayername: hitEvent?.playername,
        eventSequence: hitEvent?.sequence,
        serialisedCueball: serialisedCueball
          ? {
              x: serialisedCueball.x,
              y: serialisedCueball.y,
            }
          : undefined,
      }
    )

    this.container.table.hit()
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
  }

  override handleStationary(_) {
    if (Session.isBotMode()) {
      this.container.sendEvent(new BeginEvent())
    }

    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome) && !Session.isBotMode()) {
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
