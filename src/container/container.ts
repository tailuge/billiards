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
import { HitEvent } from "../events/hitevent"
import { BallTray } from "../view/ball-tray"
import { checkDesyncTripwire } from "../utils/desync-tripwire"

type ActivePlayer = 0 | 1 | 2

interface HitHistoryEntry {
  shotIndex: number
  event: Record<string, unknown>
  state: number[]
}

const DESYNC_HISTORY_SLICE = 3

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
  ballTray: BallTray
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
  private readonly hitHistoryLimit = 8
  private hitHistory: HitHistoryEntry[] = []

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
      isSinglePlayer = true,
    } = config
    this.log = log
    this.replayMode = replayMode
    this.isSinglePlayer = isSinglePlayer
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
    this.ballTray = new BallTray(this)
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
    if (event.type === "HIT") {
      this.attachOutgoingHitHistory(event as HitEvent)
    }
    this.recorder.record(event)
    this.throttle.send(event)
  }

  private attachOutgoingHitHistory(hitEvent: HitEvent) {
    const currentEntry = this.createHitHistoryEntry(
      hitEvent.tablejson,
      this.hitHistory.length
    )
    hitEvent.tablejson.historyWindow = [
      ...this.cloneHitHistoryWindow(
        this.hitHistory.slice(-(this.hitHistoryLimit - 1))
      ),
      this.cloneHitHistoryEntry(currentEntry),
    ]
    this.hitHistory = [
      ...this.hitHistory.slice(-(this.hitHistoryLimit - 1)),
      currentEntry,
    ]
  }

  getRemoteHitHistoryDiagnostics(hitEvent: HitEvent) {
    const remoteHistoryWindow = this.normaliseHitHistoryWindow(
      hitEvent.tablejson?.historyWindow
    )
    if (!remoteHistoryWindow) {
      return {}
    }

    const localHistoryWindow = remoteHistoryWindow
      .map((entry) => this.getComparableHitHistoryEntry(entry.shotIndex))
      .filter((entry): entry is HitHistoryEntry => entry !== undefined)

    return {
      remoteHistoryWindow: this.cloneHitHistoryWindow(
        remoteHistoryWindow.slice(-DESYNC_HISTORY_SLICE)
      ),
      localHistoryWindow: this.cloneHitHistoryWindow(
        localHistoryWindow.slice(-DESYNC_HISTORY_SLICE)
      ),
    }
  }

  recordReceivedHitHistory(hitEvent: HitEvent) {
    const remoteHistoryWindow = this.normaliseHitHistoryWindow(
      hitEvent.tablejson?.historyWindow
    )
    const latestEntry =
      remoteHistoryWindow?.[remoteHistoryWindow.length - 1] ??
      this.createHitHistoryEntry(hitEvent.tablejson, this.hitHistory.length)

    if (
      this.hitHistory.some((entry) => entry.shotIndex === latestEntry.shotIndex)
    ) {
      return
    }

    this.hitHistory = [
      ...this.hitHistory.slice(-(this.hitHistoryLimit - 1)),
      this.cloneHitHistoryEntry(latestEntry),
    ]
  }

  private getComparableHitHistoryEntry(shotIndex: number) {
    const existingEntry = this.hitHistory.find(
      (entry) => entry.shotIndex === shotIndex
    )
    if (existingEntry) {
      return this.cloneHitHistoryEntry(existingEntry)
    }

    if (shotIndex !== this.hitHistory.length) {
      return undefined
    }

    return {
      shotIndex,
      event: {},
      state: this.table.shortSerialise().slice(),
    }
  }

  private normaliseHitHistoryWindow(
    historyWindow: unknown
  ): HitHistoryEntry[] | undefined {
    if (!Array.isArray(historyWindow)) {
      return undefined
    }

    return historyWindow
      .map((entry) => this.normaliseHitHistoryEntry(entry))
      .filter((entry): entry is HitHistoryEntry => entry !== undefined)
  }

  private normaliseHitHistoryEntry(
    entry: unknown
  ): HitHistoryEntry | undefined {
    const candidate = entry as {
      shotIndex?: unknown
      event?: unknown
      state?: unknown
    }
    if (
      typeof candidate?.shotIndex !== "number" ||
      !Array.isArray(candidate.state) ||
      typeof candidate.event !== "object" ||
      candidate.event === null
    ) {
      return undefined
    }

    return {
      shotIndex: candidate.shotIndex,
      event: JSON.parse(JSON.stringify(candidate.event)) as Record<
        string,
        unknown
      >,
      state: candidate.state.slice(),
    }
  }

  private createHitHistoryEntry(tablejson, shotIndex: number): HitHistoryEntry {
    return {
      shotIndex,
      event: this.cloneHitPayloadForHistory(tablejson),
      state: this.cloneStateCheck(tablejson?.stateCheck),
    }
  }

  private cloneHitPayloadForHistory(tablejson): Record<string, unknown> {
    return {
      type: "HIT",
      tablejson: {
        aim: JSON.parse(JSON.stringify(tablejson?.aim ?? null)),
        balls: JSON.parse(JSON.stringify(tablejson?.balls ?? [])),
      },
    }
  }

  private cloneStateCheck(stateCheck: number[] | undefined): number[] {
    return (stateCheck ?? this.table.shortSerialise()).slice()
  }

  private cloneHitHistoryEntry(entry: HitHistoryEntry): HitHistoryEntry {
    return {
      shotIndex: entry.shotIndex,
      event: JSON.parse(JSON.stringify(entry.event)) as Record<string, unknown>,
      state: entry.state.slice(),
    }
  }

  private cloneHitHistoryWindow(
    historyWindow: HitHistoryEntry[]
  ): HitHistoryEntry[] {
    return historyWindow.map((entry) => this.cloneHitHistoryEntry(entry))
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
    const stateAtStart = this.table.shortSerialise()
    try {
      for (let i = 0; i < steps; i++) {
        this.table.advance(this.step)
      }
    } catch (e) {
      const payload = checkDesyncTripwire(
        "tripwire: advance_exception",
        undefined,
        stateAtStart,
        () => ({
          phase: "advance",
          controller: this.controller.name,
          shotCount: this.recorder.getShotCount(),
          recentHistory: this.recorder.getRecentHistory(),
          localHistoryWindow: this.cloneHitHistoryWindow(
            this.hitHistory.slice(-DESYNC_HISTORY_SLICE)
          ),
          stateAtStart,
        })
      )
      if (e instanceof Error) {
        e.message = `${e.message} ${payload}`
      }
      throw e
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
      const isTwoPlayer =
        !this.isSinglePlayer &&
        !this.replayMode &&
        !Session.isBotMode() &&
        !Session.isSpectator()
      this.menu?.setConcedeVisible(isTwoPlayer)
      this.comment?.setVisible(isTwoPlayer)

      this.controller.onFirst()
    }
  }
}
