import { Container } from "./container"
import { ContainerConfig } from "./containerconfig"
import { Keyboard } from "../events/keyboard"
import { EventUtil } from "../events/eventutil"
import { BreakEvent } from "../events/breakevent"
import { GameEvent } from "../events/gameevent"
import {
  bounceHan,
  bounceHanBlend,
  mathavanAdapter,
} from "../model/physics/physics"
import { strongeAdapter } from "../model/physics/stronge"
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
import { Logger } from "../network/bot/logger"
import { getUID } from "../utils/uid"
import { DrillPanel } from "../view/drillpanel"
import { AnalysisPanel } from "../view/analysispanel"
import { applyPhysicsParams } from "../utils/physicsparams"

/**
 * Integrate game container into HTML page
 */
export class BrowserContainer {
  container: Container
  canvas3d
  tableId
  clientId
  wss
  lobbyUrl
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
  botName: string = ""
  practiceMode: boolean = false
  drillMode: boolean = false
  analysisMode: boolean = false
  readonly botDelay: number = 500
  constructor(canvas3d, params) {
    this.now = Date.now()
    this.playername =
      params.get("userName") ??
      params.get("name") ??
      params.get("playername") ??
      "Anon"
    this.tableId = params.get("tableId") ?? "default"
    this.clientId =
      params.get("userId") ?? params.get("clientId") ?? `G_${getUID()}`
    this.replay = params.get("state")
    this.ruletype = params.get("ruletype") ?? "nineball"
    const lobbyUrl = params.get("lobbyUrl")
    const wss = params.get("websocketserver")
    this.lobbyUrl = lobbyUrl
    this.wss = wss
    this.canvas3d = canvas3d
    this.cushionModel = this.cushion(params.get("cushionModel"))
    this.spectator = params.has("spectator")
    this.first = params.has("first")
    this.botMode = params.has("bot")
    this.botName = params.get("bot") ?? ""
    this.practiceMode = params.has("practice")
      ? params.get("practice") !== "false"
      : this.ruletype !== "nineball"
    this.drillMode = params.has("drill")
    this.analysisMode = params.has("analysis")
    SnookerConfig.reds = Number.parseInt(params.get("reds") ?? "15") || 15
    ThreeCushionConfig.raceTo =
      Number.parseInt(params.get("raceTo") ?? "7") || 7
    console.log(
      `clientId: ${this.clientId} playername: ${this.playername} tableId: ${this.tableId} spectator: ${this.spectator} botMode: ${this.botMode} practiceMode: ${this.practiceMode} drillMode: ${this.drillMode}`
    )
    Session.init(
      this.clientId,
      this.playername,
      this.tableId,
      this.spectator,
      this.botMode,
      this.practiceMode,
      Number.parseInt(params.get("lod") ?? "2"),
      this.first
    )
    console.log(Session.getInstance())
    applyPhysicsParams(params)
  }

  cushion(model) {
    switch (model) {
      case "bounceHan":
        return bounceHan
      case "bounceHanBlend":
        return bounceHanBlend
      case "stronge": {
        return strongeAdapter
      }
      default:
        return mathavanAdapter
    }
  }

  private createContainer(scoreReporter: ScoreReporter) {
    // Analysis mode reuses the drill rules (no rings/popups); only its panel and
    // layout differ.
    const effectiveRuletype =
      (this.drillMode || this.analysisMode) && this.ruletype === "threecushion"
        ? "threecushion-drill"
        : this.ruletype
    const config: ContainerConfig = {
      element: this.canvas3d,
      log: console.log,
      assets: this.assets,
      ruletype: effectiveRuletype,
      keyboard: new Keyboard(this.canvas3d, { disabled: this.analysisMode }),
      id: this.playername,
      relay: this.messageRelay,
      messagingUrl: this.lobbyUrl ?? this.wss ?? undefined,
      scoreReporter: scoreReporter,
      replayMode: !!this.replay,
      botMode: this.botMode,
      isSinglePlayer: !this.wss && !this.botMode && !this.replay,
    }
    return new Container(config)
  }

  start() {
    this.assets = new Assets(this.ruletype)
    this.assets.loadFromWeb(() => {
      this.onAssetsReady()
    })
  }

  private initBotMode(scoreReporter: ScoreReporter) {
    this.container = this.createContainer(scoreReporter)
    this.container.init()
    const logs = new Logger()
    this.messageRelay = new BotRelay(logs, this.container)
    this.messageRelay.subscribe(this.tableId, (e) => {
      this.netEvent(e)
    })
    this.container.notify({
      type: "Info",
      title: this.ruletype,
      subtext: `Playing vs 🦞 ${this.botName}`,
      extra: "You first",
    } as const)
  }

  private initMultiplayer(scoreReporter: ScoreReporter) {
    this.messageRelay = new NchanMessageRelay(this.wss ?? undefined)
    this.container = this.createContainer(scoreReporter)
    this.container.init()
  }

  onAssetsReady() {
    console.log(`${this.playername} assets ready`)
    const scoreReporter = new ScoreReporter()

    if (this.botMode) {
      this.initBotMode(scoreReporter)
    } else {
      this.initMultiplayer(scoreReporter)
    }

    this.container.broadcast = (e) => {
      this.broadcast(e)
    }
    this.container.table.cushionModel = this.cushionModel
    if (this.analysisMode) {
      new AnalysisPanel(this.container)
    } else if (this.drillMode) {
      new DrillPanel(this.container)
    }
    this.setReplayLink()

    if (this.spectator) {
      this.container.eventQueue.push(new BeginEvent())
    } else {
      this.initGameLoop()
    }

    // trigger animation loops
    this.container.animate(performance.now())

    // Expose container for debugging/playwright verification
    globalThis.container = this.container
  }

  private initGameLoop() {
    if (this.wss) {
      this.messageRelay?.subscribe(this.tableId, (e) => {
        this.netEvent(e)
      })
      if (!this.first) {
        this.broadcast(new BeginEvent())
      }
    }

    if (this.replay) {
      this.startReplay(this.replay)
    } else if (this.container.isSinglePlayer) {
      this.container.eventQueue.push(new BreakEvent())
    }
  }

  netEvent(e: string) {
    const event = EventUtil.fromSerialised(e)
    if (event.clientId === Session.getInstance().clientId) {
      return
    }

    if (!Session.getInstance().vsNotificationShown) {
      this.container.notification.clear()
    }

    //    logNetEvent(this.playername, event, "receive")
    if (event.clientId) {
      Session.getInstance().setOpponentClientId(event.clientId)
    }
    if (event.playername) {
      Session.getInstance().opponentName = event.playername
    }

    const session = Session.getInstance()
    if (
      !session.vsNotificationShown &&
      !this.botMode &&
      !this.spectator &&
      session.playername &&
      session.opponentName
    ) {
      const names = session.orderedNamesForHud()
      if (names.p1Name && names.p2Name) {
        this.container.notifyLocal({
          type: "Info",
          title: `${this.ruletype}, ${names.p1Name} vs ${names.p2Name}`,
          extra:
            this.ruletype === "threecushion"
              ? `Race to: ${ThreeCushionConfig.raceTo}`
              : undefined,
        })
        session.vsNotificationShown = true
      }
    }
    this.container.eventQueue.push(event)
  }

  broadcast(event: GameEvent) {
    if (this.messageRelay) {
      event.clientId = Session.getInstance().clientId
      event.playername = Session.getInstance().playername
      //      logNetEvent(this.playername, event, "broadcast")
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
      `<a class="pill" target="_blank" href="https://scoreboard-tailuge.vercel.app/hiscore.html${location.search}"> upload high score 🏆</a`
    )
  }
}
