import { ControllerBase } from "./controllerbase"
import { AimEvent, Controller, HitEvent, Input } from "./controller"
import { MessageRelay } from "../network/client/messagerelay"
import { EventUtil } from "../events/eventutil"
import { GameEvent } from "../events/gameevent"
import { ScoreEvent } from "../events/scoreevent"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import { BreakEvent } from "../events/breakevent"
import { Session } from "../network/client/session"
import { EventType } from "../events/eventtype"
import { Camera } from "../view/camera"

export class Spectate extends ControllerBase {
  override get name() {
    return "Spectate"
  }
  messageRelay: MessageRelay
  tableId: string
  messages: GameEvent[] = []
  private activePlayer: 0 | 1 | 2 = 0
  constructor(container, messageRelay, tableId) {
    super(container)
    this.messageRelay = messageRelay
    this.tableId = tableId
    this.container.view.camera.aimzLerp = 0.04
    this.suggestRandomWatchCamera()
    this.messageRelay.subscribe(this.tableId, (message) => {
      const event = EventUtil.fromSerialised(message)
      this.messages.push(event)

      this.sniffNames(event)

      if (
        event instanceof HitEvent ||
        event instanceof AimEvent ||
        event instanceof ScoreEvent ||
        event instanceof PlaceBallEvent ||
        event instanceof BreakEvent ||
        event instanceof RerackEvent
      ) {
        this.container.eventQueue.push(event)
      }
    })
  }

  /** Randomly suggest either the top-down or the zoomed-out aim view, so the
   * spectator's camera varies like WatchAim's does per turn. */
  private suggestRandomWatchCamera() {
    const camera = this.container.view.camera
    camera.suggestMode(Math.random() < 0.5 ? camera.topView : camera.aimzView)
  }

  override handleScore(event: ScoreEvent): Controller {
    if (event.active !== 0 && event.active !== this.activePlayer) {
      this.activePlayer = event.active
      this.suggestRandomWatchCamera()
    }
    return super.handleScore(event)
  }

  private sniffNames(event: GameEvent) {
    const session = Session.getInstance()

    let changed = false

    if (
      event.type === EventType.BEGIN &&
      !session.spectatedP1Name &&
      event.playername
    ) {
      session.spectatedP1Name = event.playername
      changed = true
    } else if (
      event.type === EventType.WATCHAIM &&
      !session.spectatedP2Name &&
      event.playername
    ) {
      session.spectatedP2Name = event.playername
      changed = true
    }

    if (changed) {
      this.container.view.portraits.refresh()
      const names = session.orderedNamesForHud()
      const scores = session.orderedScoresForHud()
      this.container.updateScoreHud(scores.p1, scores.p2, session.currentBreak)

      if (!session.vsNotificationShown && names.p1Name && names.p2Name) {
        this.container.notifyLocal({
          type: "Info",
          title: `${names.p1Name} vs ${names.p2Name}`,
        })
        session.vsNotificationShown = true
      }
    }
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    this.container.table.cueball = this.container.table.balls[event.i]
    this.container.table.cueball.pos.copy(event.pos)
    this.container.table.cue.updateAimInput()
    return this
  }

  override handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.tablejson)
    this.container.table.cue.updateAimInput()
    this.container.table.outcome = []
    this.container.table.proximityIndicator.hide()
    this.container.table.hit()
    return this
  }

  override handleBreak(event: BreakEvent) {
    this.container.table.updateFromShortSerialised(event.init)
    return this
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
    return this
  }

  override handleRerack(event: RerackEvent) {
    RerackEvent.applyBallinfoToTable(this.container.table, event.ballinfo)
    return this
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
