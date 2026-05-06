import { GameEvent } from "../../events/gameevent"
import { Outcome } from "../../model/outcome"
import { Logger } from "./logger"
import { Container } from "../../container/container"
import { EventType } from "../../events/eventtype"
import { AimCalculator } from "./aimcalculator"
import { StartAimEvent } from "../../events/startaimevent"
import { PlaceBallEvent, RespotBody } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { EventUtil } from "../../events/eventutil"
import { Respot } from "../../utils/respot"
import { zero } from "../../utils/three-utils"
import { MatchResult } from "../client/matchresult"
import { ReplayEncoder } from "../../utils/replay-encoder"
import { Session } from "../client/session"
import { AimEvent } from "../../events/aimevent"
import { Ball } from "../../model/ball"
import { Vector3 } from "three"

export class BotEventHandler {
  private readonly logs: Logger
  private readonly container: Container
  private readonly publishSequenceToPlayer: (
    events: GameEvent[],
    delay?: number
  ) => void
  protected enqueueMessage: (message: string) => void
  private readonly calculator: AimCalculator
  private readonly botName: string

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
    this.botName =
      new URLSearchParams(globalThis.location.search).get("bot") ?? "ClawBreak"
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
    const p1type = Session.getInstance().p1type
    let botType = 0
    if (p1type === 1) botType = 2
    else if (p1type === 2) botType = 1
    if (this.container.rules.isEndOfGame(outcome, botType)) {
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
          winner: this.botName,
          loser: Session.getInstance().playername,
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

    const foulReason = this.container.rules.foulReason(outcome, botType)
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

      const respotted = this.container.rules.respot(outcome)
      let respot: RespotBody | undefined
      if (respotted.length > 0) {
        const ball = respotted[0]
        respot = { id: ball.id, pos: ball.pos.clone() }
      }
      const placeBallEvent = new PlaceBallEvent(startPos, respot, true)
      this.publishSequenceToPlayer([placeBallEvent])
      return
    }

    const pots = this.container.rules.getAmountScored(outcome)
    if (pots > 0) {
      const session = Session.getInstance()
      session.addOpponentScore(pots)

      if (session.p1type === 0 && this.container.rules.rulename === "eightball") {
        const pottedBalls = Outcome.pots(outcome)
        const hasSolid = pottedBalls.some((b) => (b.label ?? 0) >= 1 && (b.label ?? 0) <= 7)
        const hasStripe = pottedBalls.some((b) => (b.label ?? 0) >= 9 && (b.label ?? 0) <= 15)
        if (hasSolid && !hasStripe) {
          // bot potted solids → bot is type 1, so human (p1) is type 2
          session.p1type = 2
        } else if (hasStripe && !hasSolid) {
          // bot potted stripes → bot is type 2, so human (p1) is type 1
          session.p1type = 1
        }
      }

      const { p1: s1, p2: s2 } = session.orderedScoresForHud()
      const active = this.container.inferActivePlayer()
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
        ball.fround()
      }
    }

    const cueball = table.cueball
    cueball.pos.copy(
      event.useStartPos ? event.pos : this.container.rules.placeBall()
    )
    cueball.setStationary()
    cueball.fround()
    this.publishSequenceToPlayer(this.aim())
  }

  private aim() {
    const p1type = Session.getInstance().p1type
    let botType = 0
    if (p1type === 1) botType = 2
    else if (p1type === 2) botType = 1
    const targetBall = this.container.rules.nextCandidateBall(botType)
    return this.botSelector(targetBall)
  }

  private botSelector(targetBall) {
    if (this.botName === "TheFarJaw") {
      return this.theFarJaw(targetBall)
    }
    return this.clawBreak(targetBall)
  }

  private clawBreak(targetBall: Ball) {
    const table = this.container.table
    const cueball = table.cueball
    const targetPoint = targetBall?.pos ?? zero
    const aimPoint = this.calculator.getAimPoint(cueball.pos, targetPoint)
    const hitEvent = this.calculator.generateShot(
      table,
      0,
      AimCalculator.DEFAULT_SHOT_POWER,
      aimPoint ?? undefined
    )
    const aimEvent = AimEvent.fromJson(hitEvent.tablejson.aim)
    return [aimEvent, hitEvent]
  }

  private theFarJaw(targetBall: Ball) {
    const table = this.container.table
    const cueball = table.cueball
    const targetPoint = targetBall.pos
    const aimPoint = this.calculator.getAimPoint(
      cueball.pos,
      targetPoint,
      this.calculator.pockets
    )
    // now get knuckes for pocket
    const knuckles = this.calculator.closestKnuckles(
      this.calculator.findBestPocket(
        cueball.pos,
        targetPoint,
        this.calculator.pockets
      )
    )

    // pick more distant knuckle
    const farKnuckle =
      targetPoint.distanceTo(knuckles[0]) > targetPoint.distanceTo(knuckles[1])
        ? knuckles[0]
        : knuckles[1]

    const farKnuckleAimPoint = this.calculator.getAimPoint(
      cueball.pos,
      targetPoint,
      [farKnuckle]
    )

    const pocketHitEvent = this.calculator.generateShot(
      table,
      0,
      AimCalculator.DEFAULT_SHOT_POWER,
      aimPoint,
      new Vector3(0, 0, 0)
    )
    const farKnuckleHitEvent = this.calculator.generateShot(
      table,
      0,
      AimCalculator.MAX_SHOT_POWER,
      farKnuckleAimPoint,
      new Vector3(0, -0.3, 0)
    )
    const aimEvent = AimEvent.fromJson(pocketHitEvent.tablejson.aim)
    const farKnuckleAimEvent = AimEvent.fromJson(
      farKnuckleHitEvent.tablejson.aim
    )
    return [aimEvent, farKnuckleAimEvent, farKnuckleHitEvent]
  }
}
