import { GameEvent } from "../../events/gameevent"
import { Logger } from "./logger"
import { Container } from "../../container/container"
import { EventType } from "../../events/eventtype"
import { HitEvent } from "../../events/hitevent"
import { AimCalculator } from "./aimcalculator"
import { StartAimEvent } from "../../events/startaimevent"
import { Outcome } from "../../model/outcome"
import { NineBall } from "../../controller/rules/nineball"
import { PlaceBallEvent, RespotBody } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { EventUtil } from "../../events/eventutil"
import { Respot } from "../../utils/respot"
import { gameOverButtons } from "../../utils/gameover"
import { zero } from "../../utils/three-utils"

export class BotEventHandler {
  private readonly logs: Logger
  private readonly container: Container
  private readonly publishSequenceToPlayer: (
    events: GameEvent[],
    delay?: number
  ) => void
  protected enqueueMessage: (message: string) => void
  private readonly calculator: AimCalculator

  constructor(
    logs: Logger,
    container: Container,
    publishSequenceToPlayer: (events: GameEvent[], delay?: number) => void,
    enqueueMessage: (message: string) => void
  ) {
    this.logs = logs
    this.container = container
    this.publishSequenceToPlayer = publishSequenceToPlayer
    this.enqueueMessage = enqueueMessage
    this.calculator = new AimCalculator()
  }

  handle(event): void {
    this.logs.info(`Bot handling event: ${event.type}`)
    if (event.type === EventType.STARTAIM) {
      this.handleStartAim()
    }
    if (event.type === EventType.PLACEBALL) {
      this.handlePlaceBall(event)
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
      this.container.notifyLocal({
        type: "GameOver",
        title: "YOU LOST",
        subtext: "Lostber 🦞",
        icon: "🥈",
        extraClass: "is-loser",
        extra: gameOverButtons.forMode(true),
        duration: 0,
      })
      this.container.recorder.wholeGameLink()
      return
    }

    const foulReason = NineBall.foulReason(this.container.table, outcome)
    if (foulReason) {
      this.container.notify({
        type: "Foul",
        title: "FOUL",
        subtext: foulReason,
        extra: "Ball in hand",
      })

      const cueball = this.container.table.cueball
      const startPos = cueball.onTable()
        ? cueball.pos.clone()
        : this.container.rules.placeBall()
      cueball.setStationary()

      const nineBall = this.container.table.balls[9]
      const nineBallPotted = Outcome.pots(outcome).includes(nineBall)
      let respot: RespotBody | undefined
      if (nineBallPotted) {
        Respot.nineBall(this.container.table)
        respot = {
          id: nineBall.id,
          pos: nineBall.pos.clone(),
        }
      }
      const placeBallEvent = new PlaceBallEvent(startPos, respot, true)
      this.publishSequenceToPlayer([placeBallEvent])
      return
    }
    const pots = Outcome.potCount(outcome)
    if (pots > 0) {
      this.container.addOpponentScore(pots)
      const { p1: s1, p2: s2 } = this.container.getOrderedScores()
      const active = this.container.inferActivePlayerFromController()
      this.container.sendScoreUpdate(s1, s2, 0, active)

      // pot success, send watch event to other player
      this.publishSequenceToPlayer([
        new WatchEvent(this.container.table.serialise()),
      ])
      // this player has to take another shot.
      this.enqueueMessage(EventUtil.serialise(new StartAimEvent()))
      return
    }

    this.logs.hide()
    // switch to players turn
    this.publishSequenceToPlayer([new StartAimEvent()])
  }

  private handleStartAim(): void {
    this.logs.show()
    const hitEvent = this.aim()
    this.publishSequenceToPlayer([hitEvent])
  }

  private handlePlaceBall(event: PlaceBallEvent): void {
    const table = this.container.table

    if (event.respot) {
      const ball = table.balls.find((b) => b.id === event.respot?.id)
      if (ball) {
        ball.pos.copy(event.respot.pos)
        ball.setStationary()
      }
    }

    const cueball = table.cueball
    cueball.pos.copy(
      event.useStartPos ? event.pos : this.container.rules.placeBall()
    )
    cueball.setStationary()
    const hitEvent = this.aim()
    this.publishSequenceToPlayer([hitEvent])
  }

  private aim(): HitEvent {
    const table = this.container.table
    const cueball = table.cueball
    const targetBall = this.container.rules.nextCandidateBall()
    const targetPoint = targetBall?.pos ?? zero

    const aimPoint = this.calculator.getAimPoint(cueball.pos, targetPoint)
    return this.calculator.generateRandomShot(
      table,
      0,
      aimPoint ?? undefined
    )
  }
}
