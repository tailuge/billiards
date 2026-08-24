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
import { ReplayCodec } from "../utils/replay-codec"
import { Assets } from "../view/assets"
import { SnookerConfig } from "../utils/snookerconfig"
import { ThreeCushionConfig } from "../utils/threecushionconfig"
import { logNetEvent } from "../utils/event-log"
import { Session } from "../network/client/session"
import { MessageRelay } from "../network/client/messagerelay"
import { MessagingMessageRelay } from "../network/client/messagingmessagerelay"
import { BotRelay } from "../network/bot/botrelay"
import { ScoreReporter } from "../network/client/scorereporter"
import { BeginEvent } from "../events/beginevent"
import { Logger } from "../network/bot/logger"
import { getUID } from "../utils/uid"
import { DrillPanel } from "../view/drillpanel"
import { AnalysisPanel } from "../view/analysispanel"
import { applyPhysicsParams } from "../utils/physicsparams"
import { ResumeStore } from "../utils/resumestore"
import { Aim } from "../controller/aim"
import { WatchAim } from "../controller/watchaim"
import { PlaceBall } from "../controller/placeball"
import { Controller } from "../controller/controller"

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
  /** Resume watermark: msgId of the last message already reflected in the
   * restored snapshot. While set, netEvent drops the buffered replay up to
   * and including this id, then processes everything after it as live. */
  private resumeWatermark?: string
  /** Buffered messages dropped while the watermark filter is armed. */
  private resumeSkipped = 0
  /** True after a successful restore; traces the first events processed. */
  private resumed = false
  /** Count of post-resume events traced so far. */
  private resumeTraced = 0
  breakState: {
    init: any
    shots: any[]
    now: number
    score: number
    players?: { player1: string; player2: string }
    tableSize?: number
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
  examMode: boolean = false
  speedrun: boolean = false
  localMesh: boolean = false
  freeAim: boolean = false
  raceTo: number | null = null
  readonly botDelay: number = 500
  constructor(canvas3d, params) {
    this.now = Date.now()
    this.playername = params.get("userName") ?? "Anon"
    this.tableId = params.get("tableId") ?? "default"
    this.clientId = params.get("userId") ?? `G_${getUID()}`
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
    this.examMode = params.has("exam")
    this.speedrun = params.has("speedrun")
    this.localMesh = params.has("localmesh")
    this.freeAim = params.get("freeaim") === "true"
    SnookerConfig.reds = Number.parseInt(params.get("reds") ?? "15") || 15
    ThreeCushionConfig.raceTo =
      Number.parseInt(params.get("raceTo") ?? "7") || 7
    this.raceTo = params.has("raceTo") ? ThreeCushionConfig.raceTo : null
    console.log(
      `clientId: ${this.clientId} playername: ${this.playername} tableId: ${this.tableId} spectator: ${this.spectator} botMode: ${this.botMode} practiceMode: ${this.practiceMode} drillMode: ${this.drillMode}`
    )
    Session.init(
      this.clientId,
      this.playername,
      this.tableId,
      this.spectator,
      this.botMode,
      this.examMode,
      this.practiceMode,
      this.replay ? 4 : Number.parseInt(params.get("lod") ?? "2"),
      this.first,
      this.speedrun
    )
    Session.getInstance().applyUrlParams(params)
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
    const isSinglePlayer = !this.wss && !this.botMode && !this.replay
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
      isSinglePlayer,
      examMode: this.examMode,
      portraitMode: {
        roomVisible: !this.localMesh,
        singlePlayer: isSinglePlayer,
        replay: !!this.replay,
      },
      freeAim: this.freeAim,
    }
    return new Container(config)
  }

  start() {
    // If replay state embeds a non-default tableSize and the URL doesn't have
    // one yet, add it and redirect so that TableGeometry, scaleTableModel, and
    // Camera all see the correct value from the start.
    if (this.replay) {
      try {
        const state = this.parse(this.replay)
        const stateTableSize = state.tableSize
        if (
          stateTableSize !== undefined &&
          stateTableSize !== 10 &&
          !new URLSearchParams(globalThis.location.search).has("tableSize")
        ) {
          const url = new URL(globalThis.location.href)
          url.searchParams.set("tableSize", String(stateTableSize))
          globalThis.location.href = url.toString()
          return
        }
      } catch {
        // If parsing fails, proceed normally
      }
    }

    this.assets = new Assets(this.ruletype)
    if (this.localMesh) {
      this.assets.createLocal(true)
      this.onAssetsReady()
    } else {
      this.assets.loadFromWeb(() => {
        this.onAssetsReady()
      })
    }
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
    this.messageRelay = new MessagingMessageRelay()
    this.container = this.createContainer(scoreReporter)
    this.container.init()
    if (this.wss && !this.replay && !this.spectator) {
      this.container.comment.openChat()
    }
  }

  onAssetsReady() {
    console.log(`${this.playername} assets ready`)
    const scoreReporter = new ScoreReporter()

    if (this.botMode) {
      this.initBotMode(scoreReporter)
    } else {
      this.initMultiplayer(scoreReporter)
    }

    if (this.raceTo !== null) {
      this.container.chat.showMessage(`race to : ${this.raceTo}`)
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
      this.connectRelayIfNeeded()
      this.container.eventQueue.push(new BeginEvent())
    } else {
      this.initGameLoop()
    }

    // trigger animation loops
    this.container.animate(performance.now())

    // Expose container for debugging/playwright verification
    globalThis.container = this.container
  }

  private async connectRelay(): Promise<void> {
    if (!(this.wss && this.messageRelay instanceof MessagingMessageRelay))
      return
    const relay = this.messageRelay
    const li = this.container.lobbyIndicator
    await li.init()
    const mc = li.getMessagingClient()
    if (!mc) return
    await relay.connect(
      mc,
      this.tableId,
      () => {
        this.container.chat.showMessage("🔌")
      },
      () => {
        this.container.chat.showMessage("⚡")
      }
    )
  }

  private connectRelayIfNeeded(): void {
    this.connectRelay() // fire-and-forget for spectator path
  }

  private async initGameLoop() {
    if (this.wss) {
      // Subscribe FIRST so the relay's subscriber list is populated before
      // we connect/join the table. Without this ordering, an opponent who
      // sent BeginEvent before our subscribe() ran would drop on the floor
      // (Race 2).
      this.messageRelay?.subscribe(this.tableId, (e, msgId) => {
        this.netEvent(e, msgId)
      })
    }

    // Restore before connecting so the watermark filter is armed before any
    // buffered replay can be delivered (subscribe above only registers the
    // callback; messages start flowing once connectRelay() resolves).
    if (this.wss && !this.replay) {
      this.tryResume()
    }

    await this.connectRelay()

    if (this.wss) {
      if (this.messageRelay instanceof MessagingMessageRelay && !this.replay) {
        // One-shot handshake promise; the library retries the join handshake
        // until accepted so it cannot hang.
        await this.messageRelay.awaitBothJoined()
      }
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

  /** Phase 2 resume: rebuild table, score and controller from the stored
   * turn-boundary snapshot instead of running Init's fresh rack. Runs after
   * subscribe() but before connectRelay(), so the watermark filter is armed
   * before the replayed buffer can arrive. The entry is retained, not
   * consumed: restore is idempotent (same entry + buffer replays to the same
   * state), so a second reload without a new shot re-resumes from the same
   * boundary instead of resetting both players to a fresh rack. Cleanup stays
   * with End.onFirst (game over), the next save (new boundary), and the
   * tableId guard (stale tab). Self-echo suppression stays on: the snapshot
   * already reflects our own broadcasts. */
  private tryResume() {
    const entry = ResumeStore.load(this.tableId)
    if (!entry) {
      console.log("resume: no stored entry (or stale tableId), starting fresh")
      return
    }
    const session = Session.getInstance()
    // Role/opponent identity come from the URL (`first` flag plus the
    // opponent.* params applied at construction), same assignment a live join
    // produces; playerIndex must be set before updateScoreHud maps p1/p2 onto
    // my/opponent scores.
    session.playerIndex = this.first ? 0 : 1
    session.p1type = entry.p1type
    // Mirror Init.handleWatch for the second player: ThreeCushion/Sagu give
    // each player their own cue ball (p2 owns balls[1]) and this is the only
    // place role-based ownership is assigned. Without it a refreshed second
    // player keeps the fresh-rules default and resumes into Aim/WatchAim with
    // the wrong ball. No-op for every other rule type.
    if (!this.first) {
      this.container.rules.secondToPlay()
    }
    // Restore the table BEFORE constructing the controller so Aim/WatchAim
    // constructors (cue placement, aim-at-next, camera) see restored ball
    // positions rather than the fresh rack.
    this.container.table.updateFromSerialised(entry.tablejson)
    const controller = this.resumeController(entry.controller)
    if (!controller) {
      console.log(`resume: unknown controller ${entry.controller}, aborting`)
      return
    }
    const cueBall = (entry.tablejson as { aim?: { i?: number } } | undefined)
      ?.aim?.i
    console.log(
      `resume: restoring ${entry.controller} from msgId ${entry.msgId ?? "<none>"}, ` +
        `score ${entry.score.p1}-${entry.score.p2} b${entry.score.b} active ${entry.score.active}, ` +
        `cueBall ${cueBall}`
    )
    this.resumeWatermark = entry.msgId
    this.container.updateScoreHud(
      entry.score.p1,
      entry.score.p2,
      entry.score.b,
      entry.score.active as 0 | 1 | 2
    )
    this.container.updateController(controller)
    this.resumed = true
  }

  private resumeController(name: string): Controller | null {
    switch (name) {
      case "Aim":
        return new Aim(this.container)
      case "WatchAim":
        return new WatchAim(this.container)
      case "PlaceBall":
        return new PlaceBall(this.container)
      default:
        return null
    }
  }

  netEvent(e: string, msgId?: string) {
    ResumeStore.noteMsgId(msgId)
    if (this.resumeWatermark !== undefined) {
      // Post-refresh buffer replay: drop everything up to and including the
      // watermark msgId (the snapshot already reflects it), then let the rest
      // flow through the ordinary path. No fallback logic if the watermark
      // never appears — accepted as-is.
      this.resumeSkipped++
      if (msgId === this.resumeWatermark) {
        console.log(
          `resume: watermark ${this.resumeWatermark} reached after skipping ` +
            `${this.resumeSkipped} buffered messages; processing live`
        )
        this.resumeWatermark = undefined
      }
      return
    }
    const event = EventUtil.fromSerialised(e)
    if (event.clientId === Session.getInstance().clientId) {
      return
    }
    if (this.resumed && this.resumeTraced < 5) {
      this.resumeTraced++
      console.log(
        `resume: processing ${event.constructor.name} (${this.resumeTraced})`
      )
    }

    if (!Session.getInstance().vsNotificationShown) {
      this.container.notification.clear()
    }

    logNetEvent(this.playername, event, "receive")

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
    this.container.view.portraits.refresh()
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
      return ReplayCodec.decode(s)
    }
  }

  offerUpload() {
    this.container.chat.showMessage(
      `<a class="pill" target="_blank" href="https://scoreboard-tailuge.vercel.app/hiscore.html${location.search}"> upload high score 🏆</a`
    )
  }
}
