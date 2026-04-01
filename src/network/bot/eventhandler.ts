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
import { zero } from "../../utils/three-utils"
import { MatchResult } from "../client/matchresult"
import { ReplayEncoder } from "../../utils/replay-encoder"
import { Session } from "../client/session"
import { AimEvent } from "../../events/aimevent"

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

  /**
   * Main entry point for the bot to handle game events.
   */
  public handle(event: GameEvent): void {
    this.logs.info(`Bot handling event: ${event.type}`)
    switch (event.type) {
      case EventType.STARTAIM:
        this.handleStartAim()
        break
      case EventType.PLACEBALL:
        this.handlePlaceBall(event as PlaceBallEvent)
        break
      case EventType.BEGIN:
        this.handleStationary()
        break
    }
  }

  /**
   * The balls have finished rolling after a shot. Bot applies rules to decide the next action.
   */
  private handleStationary(): void {
    const outcome = this.container.table.outcome
    if (this.container.rules.isEndOfGame(outcome)) {
      // Upload match result when bot wins
      if (this.container.scoreReporter) {
        let replayData: string | undefined
        try {
          const gameState = this.container.recorder.wholeGame()
          replayData = ReplayEncoder.crush(JSON.stringify(gameState))
        } catch (e) {
          console.error("Failed to encode replay data", e)
        }
        const result: MatchResult = {
          winner: "ClawBreak",
          loser: "Player",
          winnerScore: Session.getInstance().opponentScore(),
          loserScore: Session.getInstance().myScore(),
          ruleType: this.container.rules.rulename,
        }
        if (replayData) {
          result.replayData = replayData
        }
        this.container.scoreReporter.submitMatchResult(result)
      }
      this.container.updateController(this.container.rules.handleGameEnd(false))
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
      if (!cueball.onTable()) {
        Respot.respotBehind(
          this.container.rules.placeBall(),
          cueball,
          this.container.table
        )
      }
      const startPos = cueball.pos.clone()
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
      Session.getInstance().addOpponentScore(pots)
      const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()

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
    this.publishSequenceToPlayer(this.aim())
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
    this.publishSequenceToPlayer(this.aim())
  }

  private aim(): [AimEvent, HitEvent] {
    const table = this.container.table
    const cueball = table.cueball
    const targetBall = this.container.rules.nextCandidateBall()
    const targetPoint = targetBall?.pos ?? zero

    const aimPoint = this.calculator.getAimPoint(cueball.pos, targetPoint)
    const hitEvent = this.calculator.generateRandomShot(
      table,
      0,
      aimPoint ?? undefined
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
  }
}
