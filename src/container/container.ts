import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { Session } from "../network/client/session"
import { StationaryEvent } from "../events/stationaryevent"
import { Table } from "../model/table"
import { View } from "../view/view"
import { Init } from "../controller/init"
import { AimInputs } from "../view/aiminputs"
import { Keyboard } from "../events/keyboard"
import { Sound } from "../view/sound"
import { Chat } from "../view/chat"
import { ChatEvent } from "../events/chatevent"
import { Throttle } from "../events/throttle"
import { Sliders } from "../view/sliders"
import { Recorder } from "../events/recorder"
import { LinkFormatter } from "../view/link-formatter"
import { Rules } from "../controller/rules/rules"
import { RuleFactory } from "../controller/rules/rulefactory"
import { Menu } from "../view/menu"
import { Comment } from "../view/comment"
import { Hud } from "../view/hud"
import { NotificationEvent } from "../events/notificationevent"
import { LobbyIndicator } from "../view/lobbyindicator"
import { MessageRelay } from "../network/client/messagerelay"
import { ScoreReporter } from "../network/client/scorereporter"
import {
  Notification,
  NotificationData,
  NotificationActionHandlers,
} from "../view/notification"
import { ScoreEvent } from "../events/scoreevent"
import { ContainerConfig } from "./containerconfig"
import { Controller } from "../controller/controller"
import { ParticleSystem } from "../view/particle-system"
import { End } from "../controller/end"
import { Replay } from "../controller/replay"
import { Aim } from "../controller/aim"
import { PlaceBall } from "../controller/placeball"
import { PlayShot } from "../controller/playshot"
import { WatchAim } from "../controller/watchaim"
import { WatchShot } from "../controller/watchshot"
import { EventType } from "../events/eventtype"
import { HitEvent } from "../events/hitevent"
import { PlaceBallEvent } from "../events/placeballevent"
import { RerackEvent } from "../events/rerackevent"
import {
  hashJson,
  hashStateCheck,
  summariseStateDiff,
} from "../utils/desync-tripwire"

type ActivePlayer = 0 | 1 | 2

/**
 * Model, View, Controller container.
 */
export class Container {
  table: Table
  particles: ParticleSystem
  view: View
  controller: Controller
  inputQueue: Input[] = []
  eventQueue: GameEvent[] = []
  keyboard?: Keyboard
  sound: Sound
  chat: Chat
  sliders: Sliders
  recorder: Recorder
  linkFormatter: LinkFormatter
  id: string
  isSinglePlayer: boolean = true
  rules: Rules
  menu: Menu
  comment: Comment
  hud: Hud
  notification: Notification
  lobbyIndicator: LobbyIndicator
  relay: MessageRelay | null = null
  scoreReporter: ScoreReporter | null = null
  replayMode: boolean = false
  frame: (timestamp: number) => void

  private hudScores = {
    p1: 0,
    p2: 0,
  }
  private hudActivePlayer: ActivePlayer = 0
  private wasReplay: boolean = false

  last = performance.now()
  readonly step = 0.001953125 * 1
  private lastAuthoritativeState:
    | {
        eventType: EventType
        tableState: number[]
        tableStateHash: string
        payloadHash: string
        cueballPos?:
          | {
              x: number
              y: number
            }
          | undefined
      }
    | undefined

  broadcast: (event: GameEvent) => void = () => {}
  log: (text: string) => void

  constructor(config: ContainerConfig) {
    const {
      element,
      log,
      assets,
      ruletype,
      keyboard,
      id,
      relay = null,
      scoreReporter = null,
      replayMode = false,
    } = config
    this.log = log
    this.replayMode = replayMode
    this.rules = RuleFactory.create(ruletype, this)
    this.table = this.rules.table()
    this.view = new View(element, this.table, assets)
    this.table.cue.aimInputs = new AimInputs(this)
    if (keyboard) {
      this.keyboard = keyboard
    }
    this.sound = assets.sound
    this.chat = new Chat(this.sendChat)
    this.sliders = new Sliders()
    this.linkFormatter = new LinkFormatter(this)
    this.recorder = new Recorder(this, this.linkFormatter)
    this.id = id ?? ""
    this.menu = new Menu(this)
    this.comment = new Comment(this)
    this.table.addToScene(this.view.scene)
    this.particles = new ParticleSystem()
    this.hud = new Hud()
    this.notification = new Notification()
    this.relay = relay
    this.scoreReporter = scoreReporter
    this.lobbyIndicator = new LobbyIndicator(
      Session.getInstance().botMode,
      this.replayMode,
      this.rules
    )
    this.updateController(new Init(this))
    //  this.updateController(new End(this))
  }

  init() {
    if (location.port !== "8081" && this.lobbyIndicator) {
      this.lobbyIndicator.init()
    }
  }

  sendChat = (msg) => {
    this.sendEvent(new ChatEvent(this.id, msg))
  }

  throttle = new Throttle(250, (event) => {
    this.broadcast(event)
  })

  sendEvent(event) {
    this.clearExpiredAuthoritativeState(event)
    this.checkSenderPreHitDrift(event)
    this.recorder.record(event)
    this.trackSenderAuthoritativeEvent(event)
    this.throttle.send(event)
  }

  private trackSenderAuthoritativeEvent(event: GameEvent) {
    if (
      event.type !== EventType.PLACEBALL &&
      event.type !== EventType.RERACK &&
      event.type !== EventType.HIT
    ) {
      return
    }

    const tableState = this.table.shortSerialise()
    const tableStateHash = hashStateCheck(tableState)
    const payloadHash = hashJson(event)
    const clientId = Session.getInstance().clientId
    const placeBallIsAuthoritative = this.isAuthoritativePlaceBallEvent(event)

    globalThis.console?.debug?.(
      "tripwire: sender_authoritative_event",
      JSON.stringify(
        {
          eventType: event.type,
          clientId,
          payloadHash,
          tableStateHash,
          recentHistory: this.recorder.getRecentHistory(),
          ...this.getEventSpecificBreadcrumb(event, tableState),
        },
        null,
        2
      )
    )

    if (
      event.type === EventType.RERACK ||
      (event.type === EventType.PLACEBALL && placeBallIsAuthoritative)
    ) {
      const cueballPos =
        event.type === EventType.PLACEBALL
          ? {
              x: this.table.cueball.pos.x,
              y: this.table.cueball.pos.y,
            }
          : undefined
      this.lastAuthoritativeState = {
        eventType: event.type,
        tableState,
        tableStateHash,
        payloadHash,
        cueballPos,
      }
      return
    }

    this.lastAuthoritativeState = undefined
  }

  private checkSenderPreHitDrift(event: GameEvent) {
    if (event.type !== EventType.HIT || !this.lastAuthoritativeState) {
      return
    }

    if (this.lastAuthoritativeState.eventType === EventType.PLACEBALL) {
      this.checkSenderPreHitPlaceBallDrift(event as HitEvent)
      return
    }

    const currentTableState = this.table.shortSerialise()
    const diffSummary = summariseStateDiff(
      this.lastAuthoritativeState.tableState,
      currentTableState
    )
    if (!diffSummary || diffSummary.maxDrift <= 1e-9) {
      return
    }

    globalThis.console?.warn?.(
      "tripwire: sender_pre_hit_authoritative_drift",
      JSON.stringify(
        {
          clientId: Session.getInstance().clientId,
          authoritativeEventType: this.lastAuthoritativeState.eventType,
          previousTableStateHash: this.lastAuthoritativeState.tableStateHash,
          currentTableStateHash: hashStateCheck(currentTableState),
          previousPayloadHash: this.lastAuthoritativeState.payloadHash,
          nextPayloadHash: hashJson(event),
          recentHistory: this.recorder.getRecentHistory(),
          maxDrift: diffSummary.maxDrift,
          driftedBallIndices: diffSummary.driftedBallIndices,
          ballDiffs: diffSummary.ballDiffs,
        },
        null,
        2
      )
    )
  }

  private checkSenderPreHitPlaceBallDrift(event: HitEvent) {
    const authoritativeState = this.lastAuthoritativeState
    if (
      !authoritativeState ||
      authoritativeState.eventType !== EventType.PLACEBALL ||
      !authoritativeState.cueballPos
    ) {
      return
    }

    const currentCueballPos = this.table.cueball.pos
    const dx = authoritativeState.cueballPos.x - currentCueballPos.x
    const dy = authoritativeState.cueballPos.y - currentCueballPos.y
    const dist = Math.hypot(dx, dy)
    if (dist <= 1e-9) {
      return
    }

    globalThis.console?.warn?.(
      "tripwire: sender_pre_hit_authoritative_drift",
      JSON.stringify(
        {
          clientId: Session.getInstance().clientId,
          authoritativeEventType: authoritativeState.eventType,
          previousTableStateHash: authoritativeState.tableStateHash,
          currentTableStateHash: hashStateCheck(this.table.shortSerialise()),
          previousPayloadHash: authoritativeState.payloadHash,
          nextPayloadHash: hashJson(event),
          recentHistory: this.recorder.getRecentHistory(),
          cueballDiff: {
            remoteX: authoritativeState.cueballPos.x,
            remoteY: authoritativeState.cueballPos.y,
            localX: currentCueballPos.x,
            localY: currentCueballPos.y,
            dx,
            dy,
            dist,
          },
        },
        null,
        2
      )
    )
  }

  private getEventSpecificBreadcrumb(event: GameEvent, tableState: number[]) {
    if (event.type === EventType.HIT) {
      const hitEvent = event as HitEvent
      return {
        stateCheckHash: hashStateCheck(hitEvent.tablejson?.stateCheck),
        cueballX: tableState[0],
        cueballY: tableState[1],
      }
    }

    if (event.type === EventType.PLACEBALL) {
      const placeBallEvent = event as PlaceBallEvent
      const authoritative = this.isAuthoritativePlaceBallEvent(event)
      const cueballPos = this.table.cueball.pos
      const dx = placeBallEvent.pos.x - cueballPos.x
      const dy = placeBallEvent.pos.y - cueballPos.y
      const dist = Math.hypot(dx, dy)
      if (authoritative && dist > 1e-9) {
        globalThis.console?.warn?.(
          "tripwire: sender_placeball_emit_mismatch",
          JSON.stringify(
            {
              clientId: Session.getInstance().clientId,
              eventType: event.type,
              payloadHash: hashJson(event),
              eventPos: {
                x: placeBallEvent.pos.x,
                y: placeBallEvent.pos.y,
              },
              cueballPos: {
                x: cueballPos.x,
                y: cueballPos.y,
              },
              dx,
              dy,
              dist,
            },
            null,
            2
          )
        )
      }

      return {
        authoritative,
        useStartPos: placeBallEvent.useStartPos ?? false,
        emittedCueballPos: {
          x: placeBallEvent.pos.x,
          y: placeBallEvent.pos.y,
        },
      }
    }

    const rerackEvent = event as RerackEvent
    const ballDiffs =
      rerackEvent.ballinfo?.balls
        ?.map((ballInfo) => {
          const currentBall = this.table.balls[ballInfo.id]
          if (!currentBall) {
            return undefined
          }

          const dx = ballInfo.pos.x - currentBall.pos.x
          const dy = ballInfo.pos.y - currentBall.pos.y
          const dist = Math.hypot(dx, dy)
          if (dist <= 1e-9) {
            return undefined
          }

          return {
            ballId: ballInfo.id,
            eventX: ballInfo.pos.x,
            eventY: ballInfo.pos.y,
            tableX: currentBall.pos.x,
            tableY: currentBall.pos.y,
            dx,
            dy,
            dist,
          }
        })
        .filter(
          (diff): diff is NonNullable<typeof diff> => diff !== undefined
        ) ?? []

    if (ballDiffs.length > 0) {
      globalThis.console?.warn?.(
        "tripwire: sender_rerack_emit_mismatch",
        JSON.stringify(
          {
            clientId: Session.getInstance().clientId,
            eventType: event.type,
            payloadHash: hashJson(event),
            ballDiffs,
          },
          null,
          2
        )
      )
    }

    return {
      rerackBallIds:
        rerackEvent.ballinfo?.balls?.map((ballInfo) => ballInfo.id) ?? [],
    }
  }

  private isAuthoritativePlaceBallEvent(event: GameEvent): boolean {
    if (event.type !== EventType.PLACEBALL) {
      return false
    }

    const placeBallEvent = event as PlaceBallEvent
    return Boolean(placeBallEvent.useStartPos && this.table.cueball.onTable())
  }

  private clearExpiredAuthoritativeState(event: GameEvent) {
    if (!this.lastAuthoritativeState) {
      return
    }

    if (this.lastAuthoritativeState.eventType !== EventType.PLACEBALL) {
      return
    }

    if (
      event.type === EventType.SCORE ||
      event.type === EventType.STARTAIM ||
      event.type === EventType.WATCHAIM
    ) {
      this.lastAuthoritativeState = undefined
    }
  }

  private myHudSlot(): 1 | 2 {
    return Session.getInstance().playerIndex === 1 ? 2 : 1
  }

  private opponentHudSlot(): 1 | 2 {
    return this.myHudSlot() === 1 ? 2 : 1
  }

  inferActivePlayer(controller: Controller = this.controller): ActivePlayer {
    if (
      controller instanceof Aim ||
      controller instanceof PlaceBall ||
      controller instanceof PlayShot
    ) {
      return this.myHudSlot()
    }
    if (controller instanceof WatchAim || controller instanceof WatchShot) {
      return this.opponentHudSlot()
    }
    return 0
  }

  setHudActivePlayer(active: ActivePlayer) {
    this.hudActivePlayer = active
    this.hud.setActivePlayer(active)
  }

  updateScoreHud(p1: number, p2: number, b: number, active?: ActivePlayer) {
    const session = Session.getInstance()
    session.updateScoresFromNetwork(p1, p2, b)
    const orderedScores = session.orderedScoresForHud()
    this.hudScores = orderedScores
    const orderedNames = session.orderedNamesForHud()
    this.hud.updateScores(
      orderedScores.p1,
      orderedScores.p2,
      orderedNames.p1Name,
      orderedNames.p2Name,
      b
    )
    this.setHudActivePlayer(active ?? this.inferActivePlayer())
  }

  sendScoreUpdate(p1: number, p2: number, b: number, active?: ActivePlayer) {
    const activePlayer = active ?? this.inferActivePlayer()
    const changed =
      this.hudScores.p1 !== p1 ||
      this.hudScores.p2 !== p2 ||
      Session.getInstance().currentBreak !== b ||
      this.hudActivePlayer !== activePlayer
    this.updateScoreHud(p1, p2, b, activePlayer)
    if (changed) {
      this.sendEvent(new ScoreEvent(p1, p2, b, activePlayer))
    }
  }

  notify(data: NotificationData | string, duration?: number) {
    this.notification.show(data, duration)
    this.sendEvent(new NotificationEvent(data, duration))
  }

  notifyLocal(
    data: NotificationData | string,
    duration?: number,
    actionHandlers?: NotificationActionHandlers
  ) {
    this.notification.show(data, duration, actionHandlers)
  }

  advance(elapsed) {
    this.frame?.(elapsed)

    const steps = Math.floor(elapsed / this.step)
    const computedElapsed = steps * this.step
    const stateBefore = this.table.allStationary()
    for (let i = 0; i < steps; i++) {
      this.table.advance(this.step)
    }
    this.table.updateBallMesh(computedElapsed)
    this.view.update(computedElapsed, this.table.cue.aim)
    this.table.cue.update(computedElapsed)
    this.particles.update(computedElapsed)
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent())
      this.table.cue.hittingAnimation = false
    }
    this.sound.processOutcomes(this.table.outcome)
  }

  processEvents() {
    if (this.keyboard) {
      const inputs = this.keyboard.getEvents()
      inputs.forEach((i) => this.inputQueue.push(i))
    }

    while (this.inputQueue.length > 0) {
      this.lastEventTime = this.last
      const input = this.inputQueue.shift()
      input && this.updateController(this.controller.handleInput(input))
    }

    // only process events when stationary
    if (this.table.allStationary()) {
      const event = this.eventQueue.shift()
      if (event) {
        this.lastEventTime = performance.now()
        this.recorder.record(event)
        this.updateController(event.applyToController(this.controller))
      }
    }
  }

  lastEventTime = performance.now()

  animate(timestamp): void {
    this.advance((timestamp - this.last) / 1000)
    this.last = timestamp
    this.processEvents()
    const needsRender =
      timestamp < this.lastEventTime + 32000 ||
      !this.table.allStationary() ||
      this.view.sizeChanged()
    if (needsRender) {
      this.view.render()
    }
    requestAnimationFrame((t) => {
      this.animate(t)
    })
  }

  updateController(controller: Controller) {
    this.wasReplay = this.wasReplay || controller instanceof Replay
    if (controller !== this.controller) {
      const playerName = Session.getInstance().playername
      this.log(`${playerName}: Transition to ${controller.name}`)
      this.controller = controller
      const active = this.inferActivePlayer(controller)
      if (
        active !== 0 ||
        controller instanceof Init ||
        controller instanceof End
      ) {
        this.setHudActivePlayer(active)
      }
      this.menu?.setShareVisible(
        controller instanceof Replay ||
          (this.wasReplay && controller instanceof End)
      )
      this.menu?.setConcedeVisible(!this.isSinglePlayer && !this.replayMode)

      // Update comment button visibility based on player mode
      this.comment?.updateButtonVisibility()

      this.controller.onFirst()
    }
  }
}
