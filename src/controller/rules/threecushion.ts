import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { WatchAim } from "../../controller/watchaim"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { Camera } from "../../view/camera"
import { TableConfig } from "../../view/tableconfig"
import { Rules } from "./rules"
import { isFirstShot } from "../../utils/utils"
import { zero } from "../../utils/three-utils"
import { Respot } from "../../utils/respot"
import { StartAimEvent } from "../../events/startaimevent"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"

export class ThreeCushion implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "threecushion"

  /** Solo long-race latch: the race target was reached but the win is owed
   * until the current break ends (the player chose to continue the break). */
  private winDeferred = false

  constructor(container: Container) {
    this.container = container
  }

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
  }

  nextCandidateBall(_p1type?: number): Ball | undefined {
    if (isFirstShot(this.container.recorder)) {
      return undefined
    }
    return Respot.furthest(this.cueball, this.container.table.balls)
  }

  placeBall(_?: Vector3): Vector3 {
    return zero
  }

  readonly asset = "models/threecushion.min.gltf"

  secondToPlay(): void {
    this.cueball = this.container.table.balls[1]
  }

  tableGeometry(): void {
    TableConfig.apply(this.rulename, TableConfig.tableSizeFromUrl())
  }

  scaleTableModel(scene): void {
    const sizeScale = TableConfig.tableSizeFromUrl() / 10
    if (sizeScale !== 1) {
      const adjust = 0.022
      scene.scale.x *= sizeScale * (1 + adjust)
      scene.scale.y *= sizeScale * (1 + 2 * adjust)
      scene.updateMatrix()
      scene.updateMatrixWorld()
    }
  }

  table(): Table {
    this.tableGeometry()
    Camera.configureForRule("threecushion")
    const table = new Table(this.rack())
    table.proximityEnabled = Session.isPracticeMode()
    this.cueball = table.cueball
    return table
  }

  rack(): Ball[] {
    return Rack.fromInitParam(Rack.three())
  }

  update(outcomes: Outcome[]): Controller {
    if (Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.container.sound.playSuccess(outcomes.length / 3)
      this.container.sendEvent(new WatchEvent(this.container.table.serialise()))
      const scored = this.getAmountScored(outcomes)
      this.currentBreak += scored
      Session.getInstance().addMyScore(scored)

      if (this.isTargetReached()) {
        if (!this.canDeferWin()) {
          return this.handleGameEnd(true)
        }
        if (!this.winDeferred) {
          this.winDeferred = true
          this.promptWinOrContinueBreak()
        }
      }
      return new Aim(this.container)
    }

    if (this.winDeferred) {
      // Break is over: the deferred win is declared now.
      return this.handleGameEnd(true)
    }

    this.startTurn()

    if (this.container.isSinglePlayer) {
      this.cueball = this.otherPlayersCueBall()
      const cue = this.container.table.cue
      if (cue) {
        cue.aim.i = this.container.table.balls.indexOf(this.cueball)
      }
      return new Aim(this.container)
    }

    this.container.sendEvent(new StartAimEvent())
    return new WatchAim(this.container)
  }

  otherPlayersCueBall(): Ball {
    const balls = this.container.table.balls
    return this.cueball === balls[0] ? balls[1] : balls[0]
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.isThreeCushionPoint(this.cueball, outcome)
  }

  isEndOfGame(_: Outcome[]): boolean {
    // While a win is deferred the game is deliberately still in play, so the
    // recorder treats post-target shots as ordinary break shots instead of
    // flushing (and duplicating) the break into the tray.
    if (this.winDeferred) {
      return false
    }
    return this.isTargetReached()
  }

  private isTargetReached(): boolean {
    const session = Session.getInstance()
    const p1ClientId =
      session.playerIndex === 0
        ? session.clientId
        : (session.opponentClientId ?? "opponent")
    const p2ClientId =
      session.playerIndex === 0
        ? (session.opponentClientId ?? "opponent")
        : session.clientId

    const p1Target = session.getRaceTargetForPlayer(p1ClientId)
    const p2Target = session.getRaceTargetForPlayer(p2ClientId)

    const { p1: s1, p2: s2 } = session.orderedScoresForHud()

    return s1 >= p1Target || s2 >= p2Target
  }

  /** Deferring the win is a solo-mode nicety for long races with a break worth
   * continuing: short races, breaks of 4 or less and every networked (two
   * player) or bot game still end the moment the target is reached. */
  private canDeferWin(): boolean {
    if (!this.container.isSinglePlayer) {
      return false
    }
    if (this.currentBreak <= 4) {
      return false
    }
    const session = Session.getInstance()
    return session.getRaceTargetForPlayer(session.clientId) >= 10
  }

  private promptWinOrContinueBreak(): void {
    this.container.notifyLocal(
      {
        type: "Info",
        icon: "🏆",
        title: "RACE COMPLETE",
        subtext: "Declare win or continue break",
        extra:
          '<button type="button" class="notification-btn" data-notification-action="declarewin">Declare win</button>' +
          '<button type="button" class="notification-btn" data-notification-action="continuebreak">Continue break</button>',
        duration: 0,
      },
      0,
      {
        declarewin: () => {
          this.container.notification.clear()
          this.container.updateController(this.handleGameEnd(true))
        },
        continuebreak: () => this.container.notification.clear(),
      }
    )
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )
  }

  allowsPlaceBall(): boolean {
    return false
  }

  advanceState(outcomes: Outcome[]): void {
    if (!Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.cueball = this.otherPlayersCueBall()
    }
  }

  foulReason(_outcome: Outcome[]): string | null {
    return null
  }

  getAmountScored(outcome: Outcome[]): number {
    if (!Outcome.isThreeCushionPoint(this.cueball, outcome)) {
      return 0
    }
    if (!Session.isPracticeMode()) {
      return 1
    }
    return Outcome.getProximityScore(this.cueball, outcome) || 1
  }

  respot(_outcome: Outcome[]): Ball[] {
    return []
  }
}
