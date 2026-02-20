import { GameEvent } from "../../events/gameevent"
import { Logger } from "./logger"
import { Container } from "../../container/container"
import { EventType } from "../../events/eventtype"
import { HitEvent } from "../../events/hitevent"
import { AimEvent } from "../../events/aimevent"
import { Vector3 } from "three"
import { R } from "../../model/physics/constants"
import { Aim } from "../../controller/aim"
import { StartAimEvent } from "../../events/startaimevent"

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
    const controller = this.container.rules.update(outcome)
    if (controller instanceof Aim) {
      // valid shot continue
      this.handleStartAim()
    } else {
      // switch to players turn
      this.publishToPlayer(new StartAimEvent())
    }
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

    const aim = new AimEvent()
    aim.pos = cueball.pos.clone()
    aim.i = table.balls.indexOf(cueball)
    aim.angle = Math.random() * 2 * Math.PI
    aim.power = 0.5 * 160 * R // 50% of max power
    aim.offset = new Vector3(
      (Math.random() - 0.5) * 0.6, // random side spin
      (Math.random() - 0.5) * 0.6 // random top/bottom spin
    )
    // Clamp offset to valid range
    if (aim.offset.length() > 0.3) {
      aim.offset.normalize().multiplyScalar(0.3)
    }

    table.cue.aim = aim

    const hitEvent = new HitEvent(table.serialise())
    return hitEvent
  }
}
