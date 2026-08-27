import { Aim } from "../controller/aim"
import { Controller } from "../controller/controller"
import { PlaceBall } from "../controller/placeball"
import { WatchAim } from "../controller/watchaim"
import { ResumeStore } from "../utils/resumestore"
import { Session } from "../network/client/session"

export interface ResumeHost {
  tableId: string
  first: boolean
  container: any
}

export class ResumeHandler {
  private resumeWatermark?: string
  private resumeSkipped = 0
  private resumed = false
  private resumeTraced = 0

  constructor(private readonly host: ResumeHost) {}

  tryResume(): void {
    const entry = ResumeStore.load(this.host.tableId)
    if (!entry) {
      console.log("resume: no stored entry (or stale tableId), starting fresh")
      return
    }
    const session = Session.getInstance()
    session.playerIndex = this.host.first ? 0 : 1
    session.p1type = entry.p1type
    if (!this.host.first) {
      this.host.container.rules.secondToPlay()
    }
    this.host.container.table.updateFromSerialised(entry.tablejson)
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
    this.host.container.updateScoreHud(
      entry.score.p1,
      entry.score.p2,
      entry.score.b,
      entry.score.active as 0 | 1 | 2
    )
    this.host.container.updateController(controller)
    this.resumed = true
  }

  shouldDropMessage(msgId?: string): boolean {
    if (this.resumeWatermark === undefined) return false
    this.resumeSkipped++
    if (msgId === this.resumeWatermark) {
      console.log(
        `resume: watermark ${this.resumeWatermark} reached after skipping ` +
          `${this.resumeSkipped} buffered messages; processing live`
      )
      this.resumeWatermark = undefined
    }
    return true
  }

  isResumed(): boolean {
    return this.resumed
  }

  shouldTrace(): boolean {
    return this.resumed && this.resumeTraced < 5
  }

  traceEvent(event: GameEventLike): void {
    this.resumeTraced++
    console.log(
      `resume: processing ${event.constructor.name} (${this.resumeTraced})`
    )
  }

  private resumeController(name: string): Controller | null {
    switch (name) {
      case "Aim":
        return new Aim(this.host.container)
      case "WatchAim":
        return new WatchAim(this.host.container)
      case "PlaceBall":
        return new PlaceBall(this.host.container)
      default:
        return null
    }
  }
}

type GameEventLike = { constructor: { name: string } }
