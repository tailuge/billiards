import { GameEvent } from "../../events/gameevent"
import { Logger } from "./logger"
import { Container } from "../../container/container"
import { EventType } from "../../events/eventtype"
import { HitEvent } from "../../events/hitevent"
import { AimEvent } from "../../events/aimevent"
import { Vector3 } from "three"
import { R } from "../../model/physics/constants"
import { StartAimEvent } from "../../events/startaimevent"
import { Outcome } from "../../model/outcome"
import { NineBall } from "../../controller/rules/nineball"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"

export class BotEventHandler {
  private logs: Logger
  private container: Container
  private publishToPlayer: (event: GameEvent) => void

  constructor(
    logs: Logger,
    container: Container,
    publishToPlayer: (event: GameEvent) => void
  ) {
    this.logs = logs
    this.container = container
    this.publishToPlayer = publishToPlayer
  }

  handle(event: GameEvent): void {
    this.logs.info(`Bot handling event: ${event.type}`)
    if (event.type === EventType.STARTAIM) {
      this.handleStartAim()
    }
    if (event.type === EventType.PLACEBALL) {
      this.handlePlaceBall()
    }
    if (event.type === EventType.BEGIN) {
      this.handleStationary()
    }
  }

  private handleStationary(): void {
    // The balls have finished rolling after a shot, now apply rules to find out
    // if turn continues or switches maybe with a foul and a placeball
    // gameover is also an option
    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome)) {
      // bot has won, notify player
    }

    const foulReason = NineBall.foulReason(this.container.table, outcome)
    if (foulReason) {
      // bot has fouled, notify player
      this.container.notify({
        type: "Foul",
        title: "FOUL",
        subtext: foulReason,
        extra: "Ball in hand",
      })

      // in nineball it is ball in hand
      const cueball = this.container.table.cueball
      const startPos = cueball.onTable()
        ? cueball.pos.clone()
        : this.container.rules.placeBall()
      const placeBallEvent = new PlaceBallEvent(startPos, undefined, true)
      this.publishToPlayer(placeBallEvent)
    }

    if (Outcome.potCount(outcome) > 0) {
      // pot success, send watch event to other player
      this.publishToPlayer(new WatchEvent(this.container.table.serialise()))
      // this player has to take another shot.
    }

    // switch to players turn
    this.publishToPlayer(new StartAimEvent())
  }

  private handleStartAim(): void {
    const hitEvent = this.generateRandomShot()
    this.publishToPlayer(hitEvent)
  }

  private handlePlaceBall(): void {
    const table = this.container.table
    const pos = this.container.rules.placeBall()
    const cueball = table.cueball
    cueball.pos.copy(pos)
    cueball.setStationary()
    const hitEvent = this.generateRandomShot()
    this.publishToPlayer(hitEvent)
  }

  private generateRandomShot(): HitEvent {
    const table = this.container.table
    const cueball = table.cueball

    const targetBall = this.container.rules.nextCandidateBall()
    table.cue.aimAtNext(cueball, targetBall)
    const aim = table.cue.aim
    aim.i = table.balls.indexOf(cueball)
    aim.angle = aim.angle + (Math.random() - 0.5) * 0.1
    aim.power = 80 * R
    aim.offset = new Vector3(0, (Math.random() - 0.5) * 0.6)

    // Clamp offset to valid range
    if (aim.offset.length() > 0.3) {
      aim.offset.normalize().multiplyScalar(0.3)
    }

    const hitEvent = new HitEvent(table.serialise())
    return hitEvent
  }
}
