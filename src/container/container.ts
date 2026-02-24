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
import { Hud } from "../view/hud"
import { NotificationEvent } from "../events/notificationevent"
import { LobbyIndicator } from "../view/lobbyindicator"
import { MessageRelay } from "../network/client/messagerelay"
import { ScoreReporter } from "../network/client/scorereporter"
import { Notification, NotificationData } from "../view/notification"
import { ScoreEvent } from "../events/scoreevent"
import { ContainerConfig } from "./containerconfig"
import { Controller } from "../controller/controller"

type ActivePlayer = 0 | 1 | 2

/**
 * Model, View, Controller container.
 */
export class Container {
  table: Table
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
  hud: Hud
  notification: Notification
  lobbyIndicator: LobbyIndicator
  relay: MessageRelay | null = null
  scoreReporter: ScoreReporter | null = null
  frame: (timestamp: number) => void

  private localScores = {
    my: 0,
    opponent: 0,
  }
  private hudScores = {
    p1: 0,
    p2: 0,
  }
  private hudActivePlayer: ActivePlayer = 0
  currentBreak = 0

  last = performance.now()
  readonly step = 0.001953125 * 1

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
    } = config
    this.log = log
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
    this.table.addToScene(this.view.scene)
    this.hud = new Hud()
    this.notification = new Notification()
    this.relay = relay
    this.scoreReporter = scoreReporter
    this.lobbyIndicator = new LobbyIndicator(this.relay, this.rules)
    this.lobbyIndicator.init()
    this.updateController(new Init(this))
  }

  sendChat = (msg) => {
    this.sendEvent(new ChatEvent(this.id, msg))
  }

  throttle = new Throttle(0, (event) => {
    this.broadcast(event)
  })

  sendEvent(event) {
    this.recorder.record(event)
    this.throttle.send(event)
  }

  getMyScore(): number {
    if (Session.hasInstance()) {
      return Session.getInstance().myScore()
    }
    return this.localScores.my
  }

  getOpponentScore(): number {
    if (Session.hasInstance()) {
      return Session.getInstance().opponentScore()
    }
    return this.localScores.opponent
  }

  setMyScore(score: number): void {
    if (Session.hasInstance()) {
      Session.getInstance().setMyScore(score)
      return
    }
    this.localScores.my = score
  }

  setOpponentScore(score: number): void {
    if (Session.hasInstance()) {
      Session.getInstance().setOpponentScore(score)
      return
    }
    this.localScores.opponent = score
  }

  addMyScore(delta: number): void {
    this.setMyScore(this.getMyScore() + delta)
  }

  addOpponentScore(delta: number): void {
    this.setOpponentScore(this.getOpponentScore() + delta)
  }

  getOrderedScores(): { p1: number; p2: number } {
    if (Session.hasInstance()) {
      return Session.getInstance().orderedScoresForHud()
    }
    return { p1: this.localScores.my, p2: this.localScores.opponent }
  }

  getOrderedNames(): { p1Name?: string; p2Name?: string } {
    if (Session.hasInstance()) {
      return Session.getInstance().orderedNamesForHud()
    }
    return {}
  }

  setScoresFromNetwork(p1: number, p2: number, breakScore: number): void {
    if (Session.hasInstance() && Session.getInstance().playerIndex === 1) {
      this.setMyScore(p2)
      this.setOpponentScore(p1)
    } else {
      this.setMyScore(p1)
      this.setOpponentScore(p2)
    }
    this.currentBreak = breakScore
  }

  private myHudSlot(): 1 | 2 {
    return Session.hasInstance() && Session.getInstance().playerIndex === 1
      ? 2
      : 1
  }

  private opponentHudSlot(): 1 | 2 {
    return this.myHudSlot() === 1 ? 2 : 1
  }

  inferActivePlayerFromControllerName(name: string): ActivePlayer {
    if (name === "Aim" || name === "PlaceBall" || name === "PlayShot") {
      return this.myHudSlot()
    }
    if (name === "WatchAim" || name === "WatchShot") {
      return this.opponentHudSlot()
    }
    return 0
  }

  inferActivePlayerFromController(controller = this.controller): ActivePlayer {
    return this.inferActivePlayerFromControllerName(controller?.name ?? "")
  }

  setHudActivePlayer(active: ActivePlayer) {
    this.hudActivePlayer = active
    this.hud.setActivePlayer(active)
  }

  updateScoreHud(p1: number, p2: number, b: number, active?: ActivePlayer) {
    this.setScoresFromNetwork(p1, p2, b)
    const orderedScores = this.getOrderedScores()
    this.hudScores = orderedScores
    const orderedNames = this.getOrderedNames()
    this.hud.updateScores(
      orderedScores.p1,
      orderedScores.p2,
      orderedNames.p1Name,
      orderedNames.p2Name,
      b
    )
    this.setHudActivePlayer(active ?? this.inferActivePlayerFromController())
  }

  sendScoreUpdate(p1: number, p2: number, b: number, active?: ActivePlayer) {
    const activePlayer = active ?? this.inferActivePlayerFromController()
    const changed =
      this.hudScores.p1 !== p1 ||
      this.hudScores.p2 !== p2 ||
      this.currentBreak !== b ||
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

  notifyLocal(data: NotificationData | string, duration?: number) {
    this.notification.show(data, duration)
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
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent())
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
      timestamp < this.lastEventTime + 12000 ||
      !this.table.allStationary() ||
      this.view.sizeChanged()
    if (needsRender) {
      this.view.render()
    }
    requestAnimationFrame((t) => {
      this.animate(t)
    })
  }

  updateController(controller) {
    if (controller !== this.controller) {
      const playerName = Session.hasInstance()
        ? Session.getInstance().playername
        : "_"
      this.log(`${playerName}: Transition to ${controller.name}`)
      this.controller = controller
      const active = this.inferActivePlayerFromController(controller)
      if (
        active !== 0 ||
        controller.name === "Init" ||
        controller.name === "End"
      ) {
        this.setHudActivePlayer(active)
      }
      this.menu?.setShareVisible(controller.name === "Replay")
      this.controller.onFirst()
    }
  }
}
