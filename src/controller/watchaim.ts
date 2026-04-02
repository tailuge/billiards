import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { WatchShot } from "./watchshot"
import { ControllerBase } from "./controllerbase"
import { warnAimDriftTripwire } from "../utils/aim-drift-tripwire"

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
    this.container.table.cue.updateAimInput()
    return this
  }

  override handleHit(event: HitEvent) {
    const tablejson = event.tablejson
    const aim = tablejson.aim ?? tablejson
    const serialisedCueball = tablejson.balls?.[0]?.pos

    warnAimDriftTripwire(
      "tripwire: remote_hit_pre_apply_state_gap",
      aim,
      this.container.table.cueball.pos,
      {
        phase: "pre_apply",
        controller: this.name,
        eventClientId: event.clientId,
        eventPlayername: event.playername,
        eventSequence: event.sequence,
        serialisedCueball: serialisedCueball
          ? {
              x: serialisedCueball.x,
              y: serialisedCueball.y,
            }
          : undefined,
      }
    )

    this.container.table.updateFromSerialised(event.tablejson)
    this.container.table.cue.updateAimInput()

    warnAimDriftTripwire(
      "tripwire: remote_hit_post_apply_state_gap",
      aim,
      this.container.table.cueball.pos,
      {
        phase: "post_apply",
        controller: this.name,
        eventClientId: event.clientId,
        eventPlayername: event.playername,
        eventSequence: event.sequence,
        serialisedCueball: serialisedCueball
          ? {
              x: serialisedCueball.x,
              y: serialisedCueball.y,
            }
          : undefined,
      }
    )

    return new WatchShot(this.container, event)
  }
}
