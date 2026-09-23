import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Ball } from "../../model/ball"
import { Outcome } from "../../model/outcome"
import { Table } from "../../model/table"
import { Controller } from "../controller"
import { Rules } from "./rules"
import { TableGeometry } from "../../view/tablegeometry"
import { TableConfig } from "../../view/tableconfig"
import { Rack } from "../../utils/rack"
import { isFirstShot } from "../../utils/utils"
import { R } from "../../model/physics/constants"
import { Session } from "../../network/client/session"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Aim } from "../aim"
import { PlaceBall } from "../placeball"
import { PlaceBallEvent } from "../../events/placeballevent"
import { ScoreEvent } from "../../events/scoreevent"
import { roundVec } from "../../utils/three-utils"
import { Respot } from "../../utils/respot"
import { scaleTableModel } from "../../utils/table-scaler"
import { ReplayEncoder } from "../../utils/replay-encoder"

/**
 * Solo reveal mode for the ?image= cloth. No groups, no fouls and no 8-ball
 * end condition: every potted ball is worth a point and the game ends when the
 * last ball drops, which fills the reveal. Kept separate from EightBall because
 * it reuses only the table and rack, not the eightball rules.
 */
export class Reveal implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "reveal"

  constructor(container: Container) {
    this.container = container
  }

  readonly asset = "models/p8.min.gltf"

  tableGeometry(): void {
    TableConfig.apply(this.rulename, TableConfig.tableSizeFromUrl())
  }

  scaleTableModel(scene: any): void {
    const tableSize = TableConfig.tableSizeFromUrl()
    if (tableSize === 6) {
      scaleTableModel(scene, -2800, -1350)
    }
  }

  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  rack(): Ball[] {
    return Rack.fromInitParam(Rack.eightBall())
  }

  secondToPlay(): void {
    // Intentionally empty
  }

  otherPlayersCueBall(): Ball {
    return this.cueball
  }

  allowsPlaceBall(): boolean {
    return true
  }

  placeBall(target?: Vector3): Vector3 {
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      if (isFirstShot(this.container.recorder)) {
        const baulkline =
          ((-R * 11) / 0.5) * (TableConfig.tableSizeFromUrl() / 10)
        max.setX(baulkline)
        min.setX(baulkline)
      }
      return target.clone().clamp(min, max)
    }
    const baulkline = ((-R * 11) / 0.5) * (TableConfig.tableSizeFromUrl() / 10)
    return new Vector3(baulkline, 0, 0)
  }

  nextCandidateBall(): Ball | undefined {
    const table = this.container.table
    return Respot.closest(table.cueball, table.balls)
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.potCount(outcome) > 0
  }

  getAmountScored(outcome: Outcome[]): number {
    return Outcome.potCount(outcome)
  }

  respot(_outcome: Outcome[]): Ball[] {
    return []
  }

  /** Every shot is legal: a potted cue ball is the only thing to correct. */
  foulReason(_outcome: Outcome[]): string | null {
    return null
  }

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
  }

  update(outcome: Outcome[]): Controller {
    const session = Session.getInstance()
    const table = this.container.table
    const cueball = table.cueball
    const pots = Outcome.pots(outcome).filter((b) => b !== cueball)

    if (pots.length > 0) {
      this.currentBreak += pots.length
      session.addMyScore(pots.length)
      this.container.sound.playSuccess(table.inPockets())
      this.container.sendEvent(this.scoreEvent(session))
    }

    if (this.isEndOfGame(outcome)) {
      return this.handleGameEnd(true)
    }

    // A potted cue ball is respotted without any foul; the shooter plays on.
    if (Outcome.isCueBallPotted(cueball, outcome)) {
      const startPos = this.placeBall()
      roundVec(startPos)
      this.container.sendEvent(new PlaceBallEvent(startPos, undefined, true))
      return new PlaceBall(this.container, startPos)
    }

    return new Aim(this.container)
  }

  isEndOfGame(outcome: Outcome[]): boolean {
    const potted = new Set(Outcome.pots(outcome))
    return this.container.table.balls.every(
      (b) => b === this.container.table.cueball || !b.onTable() || potted.has(b)
    )
  }

  private scoreEvent(session: Session): ScoreEvent {
    return new ScoreEvent(
      session.playerIndex === 0 ? session.myScore() : session.opponentScore(),
      session.playerIndex === 1 ? session.myScore() : session.opponentScore(),
      this.currentBreak,
      (session.playerIndex + 1) as any
    )
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    const end = MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )

    const updateDeckButton = this.buildUpdateDeckButton(isWinner)
    this.container.notifyLocal({
      type: "GameOver",
      title: isWinner ? "YOU WON" : "GAME OVER",
      subtext: endSubtext ?? `Score: ${Session.getInstance().myScore()}`,
      highBreaks: MatchResultHelper.getHighBreaks(this.container),
      icon: isWinner ? "🏆" : "🎱",
      extraClass: isWinner ? "is-winner" : "",
      extra: updateDeckButton,
      share: false,
      duration: 0,
    })

    return end
  }

  private buildUpdateDeckButton(isWinner: boolean): string {
    if (!isWinner) {
      return `<button type="button" class="notification-btn" data-notification-action="rematch" data-notification-url="./reveal/index.html">Update Deck</button>`
    }

    const params = new URLSearchParams(
      typeof globalThis.location !== "undefined"
        ? globalThis.location.search
        : ""
    )
    const image = params.get("image") ?? ""

    let stateParam = ""
    try {
      const gameState = this.container.recorder.wholeGame()
      const encoded = ReplayEncoder.crush(JSON.stringify(gameState))
      stateParam = ReplayEncoder.fullyEncodeURI(encoded)
    } catch (e) {
      console.error("Failed to encode reveal replay state", e)
    }

    const targetParams = new URLSearchParams()
    if (image) {
      targetParams.set("image", image)
    }
    if (stateParam) {
      targetParams.set("state", stateParam)
    }
    const query = targetParams.toString()
    const suffix = query ? "?" + query : ""
    const url = `./reveal/index.html${suffix}`

    return `<button type="button" class="notification-btn" data-notification-action="rematch" data-notification-url="${url}">Update Deck</button>`
  }
}
