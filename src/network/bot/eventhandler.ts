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
  private delay: number

  constructor(
    logs: Logger,
    container: Container,
    publishToPlayer: (event: GameEvent) => void,
    delay: number = 2000
  ) {
    this.logs = logs
    this.container = container
    this.publishToPlayer = publishToPlayer
    this.delay = delay
  }

  private isBotTurn: boolean = false
  private isThinking: boolean = false
  private timeoutId: number | null = null

  handle(event: GameEvent): void {
    this.logs.info(`Bot handling event: ${event.type}`)

    if (event.type === EventType.STARTAIM) {
      if (this.isBotTurn) {
        // If we thought it was our turn but we get a STARTAIM, it means the turn switched back to the human
        this.isBotTurn = false
        this.cancelAction()
      } else {
        this.isBotTurn = true
        this.startThinking()
      }
    } else if (event.type === EventType.WATCHAIM) {
      if (this.isBotTurn && !this.isThinking) {
        this.startThinking()
      }
    } else if (event.type === EventType.PLACEBALL) {
      this.isBotTurn = true
      this.scheduleAction(() => this.handlePlaceBall())
    } else if (event.type === EventType.HIT || event.type === EventType.ABORT) {
      this.cancelAction()
      if (event.type === EventType.HIT) {
        this.isThinking = false
      } else {
        this.isBotTurn = false
        this.isThinking = false
      }
    }
  }

  private startThinking() {
    this.isThinking = true
    this.scheduleAction(() => this.handleStartAim())
  }

  private scheduleAction(action: () => void) {
    this.cancelAction()
    this.timeoutId = globalThis.setTimeout(
      action,
      this.delay
    ) as unknown as number
  }

  private cancelAction() {
    if (this.timeoutId !== null) {
      globalThis.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private handleStartAim(): void {
    if (!this.isBotTurn) return

    // First, generate the shot and show the player where the bot is aiming
    const hitEvent = this.generateRandomShot()
    this.publishToPlayer(new WatchEvent(this.container.table.serialise()))

    // Then wait a bit more (simulating "thinking/finalizing") before taking the shot
    this.scheduleAction(() => {
      if (this.isBotTurn) {
        this.publishToPlayer(hitEvent)
      }
    })
  }

  private handlePlaceBall(): void {
    if (!this.isBotTurn) return
    const pos = this.container.rules.placeBall()

    // Send the place ball event first
    const placeBallEvent = new PlaceBallEvent(pos)
    this.publishToPlayer(placeBallEvent)

    // Then wait a bit more before showing the aim
    this.scheduleAction(() => {
      if (this.isBotTurn) {
        this.handleStartAim()
      }
    })
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
