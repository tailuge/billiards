import { Container } from "./container"
import { ContainerConfig } from "./containerconfig"
import { Keyboard } from "../events/keyboard"
import { EventUtil } from "../events/eventutil"
import { BreakEvent } from "../events/breakevent"
import { GameEvent } from "../events/gameevent"
import {
  bounceHan,
  bounceHanBlend,
  mathavenAdapter,
} from "../model/physics/physics"
import JSONCrush from "jsoncrush"
import { Assets } from "../view/assets"
import { SnookerConfig } from "../utils/snookerconfig"
import { ThreeCushionConfig } from "../utils/threecushionconfig"
import { Session } from "../network/client/session"
import { MessageRelay } from "../network/client/messagerelay"
import { NchanMessageRelay } from "../network/client/nchanmessagerelay"
import { BotRelay } from "../network/bot/botrelay"
import { ScoreReporter } from "../network/client/scorereporter"
import { BeginEvent } from "../events/beginevent"
import { logNetEvent } from "../utils/event-log"
import { Logger } from "../network/bot/logger"

/**
 * Integrate game container into HTML page
 */
export class BrowserContainer {
  container: Container
  canvas3d
  tableId
  clientId
  wss
  ruletype
  playername: string
  replay: string | null
  messageRelay: MessageRelay | null = null
  breakState: {
    init: any
    shots: any[]
    now: number
    score: number
    players?: { player1: string; player2: string }
  } = {
    init: null,
    shots: [],
    now: 0,
    score: 0,
  }
  cushionModel
  spectator
  first
  assets: Assets
  now
  botMode: boolean = false
  readonly botDelay: number = 500
  constructor(canvas3d, params) {
    this.now = Date.now()
    this.playername = params.get("name") ?? params.get("playername") ?? "Anon"
    this.tableId = params.get("tableId") ?? "default"
    this.clientId = params.get("clientId") ?? `G_${Date.now() % 100000}`
    this.replay = params.get("state")
    this.ruletype = params.get("ruletype") ?? "nineball"
    this.wss = params.get("websocketserver")
    this.canvas3d = canvas3d
    this.cushionModel = this.cushion(params.get("cushionModel"))
    this.spectator = params.has("spectator")
    this.first = params.has("first")
    this.botMode = params.has("bot")
    SnookerConfig.reds = Number.parseInt(params.get("reds") ?? "15") || 15
    ThreeCushionConfig.raceTo =
      Number.parseInt(params.get("raceTo") ?? "2") || 2
    console.log(
      `clientId: ${this.clientId} playername: ${this.playername} tableId: ${this.tableId} spectator: ${this.spectator} botMode: ${this.botMode}`
    )
    Session.init(
      this.clientId,
      this.playername,
      this.tableId,
      this.spectator,
      this.botMode
    )
    console.log(Session.getInstance())
  }

  cushion(model) {
    switch (model) {
      case "bounceHan":
        return bounceHan
      case "bounceHanBlend":
        return bounceHanBlend
      default:
        return mathavenAdapter
    }
  }

  private createContainer(scoreReporter: ScoreReporter) {
    const config: ContainerConfig = {
      element: this.canvas3d,
      log: console.log,
      assets: this.assets,
      ruletype: this.ruletype,
      keyboard: new Keyboard(this.canvas3d),
      id: this.playername,
      relay: this.messageRelay,
      scoreReporter: scoreReporter,
      replayMode: !!this.replay,
    }
    return new Container(config)
  }

  start() {
    this.assets = new Assets(this.ruletype)
    this.assets.loadFromWeb(() => {
      this.onAssetsReady()
    })
  }

  onAssetsReady() {
    console.log(`${this.playername} assets ready`)
    const scoreReporter = new ScoreReporter()

    if (this.botMode) {
      this.container = this.createContainer(scoreReporter)
      this.container.init()
      this.container.isSinglePlayer = false
      const logs = new Logger()
      this.messageRelay = new BotRelay(logs, this.container)
      this.messageRelay.subscribe(this.tableId, (e) => {
        this.netEvent(e)
      })
      this.container.notify({
        type: "Info",
        title: "Playing vs 🦞",
        subtext: "",
        extra: "You first",
      } as const)
    } else {
      this.messageRelay = new NchanMessageRelay()
      this.container = this.createContainer(scoreReporter)
      this.container.init()
    }

    this.container.broadcast = (e) => {
      this.broadcast(e)
    }
    this.container.table.cushionModel = this.cushionModel
    this.setReplayLink()

    if (this.spectator) {
      this.container.eventQueue.push(new BeginEvent())
      this.container.animate(performance.now())
      return
    }

    if (this.wss) {
      this.container.isSinglePlayer = false
      this.messageRelay.subscribe(this.tableId, (e) => {
        this.netEvent(e)
      })
      if (!this.first && !this.spectator) {
        this.broadcast(new BeginEvent())
      }
    }

    if (this.replay) {
      this.startReplay(this.replay)
    } else if (this.container.isSinglePlayer) {
      this.container.eventQueue.push(new BreakEvent())
    }

    // trigger animation loops
    this.container.animate(performance.now())
  }

  netEvent(e: string) {
    const event = EventUtil.fromSerialised(e)
    logNetEvent(this.playername, event, "receive")
    if (event.clientId === Session.getInstance().clientId) {
      console.log("Ignoring own event")
    } else {
      if (event.clientId) {
        Session.getInstance().setOpponentClientId(event.clientId)
      }
      if (event.playername) {
        Session.getInstance().opponentName = event.playername
      }
      this.container.eventQueue.push(event)
    }
  }

  broadcast(event: GameEvent) {
    if (this.messageRelay) {
      event.clientId = Session.getInstance().clientId
      event.playername = Session.getInstance().playername
      logNetEvent(this.playername, event, "broadcast")
      this.messageRelay.publish(this.tableId, EventUtil.serialise(event))
    }
  }

  setReplayLink() {
    const url = globalThis.location.href.split("?")[0]
    const prefix = `${url}?ruletype=${this.ruletype}&state=`
    this.container.linkFormatter.replayUrl = prefix
  }

  startReplay(replay) {
    this.breakState = this.parse(replay)
    const session = Session.getInstance()
    if (this.breakState.players) {
      session.playername = this.breakState.players.player1
      session.opponentName = this.breakState.players.player2
    }
    const orderedScores = session.orderedScoresForHud()
    this.container.updateScoreHud(orderedScores.p1, orderedScores.p2, 0, 0)
    const breakEvent = new BreakEvent(
      this.breakState.init,
      this.breakState.shots
    )
    this.container.eventQueue.push(breakEvent)
  }

  parse(s) {
    try {
      return JSON.parse(s)
    } catch {
      return JSON.parse(JSONCrush.uncrush(s))
    }
  }

  offerUpload() {
    this.container.chat.showMessage(
      `<a class="pill" target="_blank" rel="noopener noreferrer" href="https://scoreboard-tailuge.vercel.app/hiscore.html${location.search}"> upload high score 🏆</a>`,
      true
    )
  }
}
