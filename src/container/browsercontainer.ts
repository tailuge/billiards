import { Container } from "./container"
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
import { ScoreReporter } from "../network/client/scorereporter"
import { BeginEvent } from "../events/beginevent"
import { logNetEvent } from "../utils/event-log"

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
  constructor(canvas3d, params) {
    this.now = Date.now()
    this.playername = params.get("name") ?? params.get("playername") ?? "Anon"
    this.tableId = params.get("tableId") ?? "default"
    this.clientId = params.get("clientId") ?? "default"
    this.replay = params.get("state")
    this.ruletype = params.get("ruletype") ?? "nineball"
    this.wss = params.get("websocketserver")
    this.canvas3d = canvas3d
    this.cushionModel = this.cushion(params.get("cushionModel"))
    this.spectator = params.has("spectator")
    this.first = params.has("first")
    SnookerConfig.reds = parseInt(params.get("reds") ?? "15") || 15
    ThreeCushionConfig.raceTo = parseInt(params.get("raceTo") ?? "2") || 2
    console.log(
      `clientId: ${this.clientId} playername: ${this.playername} tableId: ${this.tableId} spectator: ${this.spectator}`
    )
    Session.init(this.clientId, this.playername, this.tableId, this.spectator)
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

  start() {
    this.assets = new Assets(this.ruletype)
    this.assets.loadFromWeb(() => {
      this.onAssetsReady()
    })
  }

  onAssetsReady() {
    console.log(`${this.playername} assets ready`)
    this.messageRelay = new NchanMessageRelay()
    const scoreReporter = new ScoreReporter()
    this.container = new Container(
      this.canvas3d,
      console.log,
      this.assets,
      this.ruletype,
      new Keyboard(this.canvas3d),
      this.playername,
      this.messageRelay,
      scoreReporter
    )
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
    if (event.clientId !== Session.getInstance().clientId) {
      if (event.playername) {
        Session.getInstance().opponentName = event.playername
      }
      this.container.eventQueue.push(event)
    } else {
      console.log("Ignoring own event")
    }
  }

  broadcast(event: GameEvent) {
    if (this.wss && this.messageRelay) {
      event.clientId = Session.getInstance().clientId
      event.playername = Session.getInstance().playername
      logNetEvent(this.playername, event, "broadcast")
      this.messageRelay.publish(this.tableId, EventUtil.serialise(event))
    }
  }

  setReplayLink() {
    const url = window.location.href.split("?")[0]
    const prefix = `${url}?ruletype=${this.ruletype}&state=`
    this.container.linkFormatter.replayUrl = prefix
  }

  startReplay(replay) {
    this.breakState = this.parse(replay)
    if (this.breakState.players) {
      const session = Session.getInstance()
      session.playername = this.breakState.players.player1
      session.opponentName = this.breakState.players.player2
    }
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
      `<a class="pill" target="_blank" href="https://scoreboard-tailuge.vercel.app/hiscore.html${location.search}"> upload high score 🏆</a`
    )
  }
}
