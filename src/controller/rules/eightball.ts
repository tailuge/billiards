import { Vector3 } from "three"
import { Container } from "../../container/container"
import { Aim } from "../../controller/aim"
import { Controller } from "../../controller/controller"
import { PlaceBall } from "../../controller/placeball"
import { WatchAim } from "../../controller/watchaim"
import { PlaceBallEvent } from "../../events/placeballevent"
import { WatchEvent } from "../../events/watchevent"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { Rules } from "./rules"
import { TableGeometry } from "../../view/tablegeometry"
import { StartAimEvent } from "../../events/startaimevent"
import { MatchResultHelper } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"
import { ScoreEvent } from "../../events/scoreevent"
import { roundVec } from "../../utils/three-utils"
import { R } from "../../model/physics/constants"
import { isFirstShot } from "../../utils/utils"

export class EightBall implements Rules {
  readonly container: Container

  cueball: Ball
  currentBreak = 0
  previousBreak = 0
  rulename = "eightball"
  openTable = true
  p1Assignment = 0 // 0: None, 1: Solids, 2: Stripes
  p2Assignment = 0

  constructor(container: Container) {
    this.container = container
  }

  startTurn(): void {
    this.previousBreak = this.currentBreak
    this.currentBreak = 0
    // Sync local state from Session on turn start
    const session = Session.getInstance()
    this.p1Assignment = session.p1type
    this.p2Assignment = session.p1type === 0 ? 0 : (session.p1type === 1 ? 2 : 1)
    if (this.p1Assignment !== 0) {
      this.openTable = false
    }
  }

  nextCandidateBall(): Ball | undefined {
    const table = this.container.table
    const active = this.container.inferActivePlayer()
    const assignment = active === 1 ? this.p1Assignment : this.p2Assignment

    const candidates = table.balls.filter(b => b !== this.cueball && b.onTable())
    if (this.openTable || assignment === 0) {
      return candidates.filter(b => (b.label || 0) !== 8).sort((a, b) => (a.label || 0) - (b.label || 0))[0]
    }

    const myBalls = candidates.filter(b => {
      const l = b.label || 0
      return assignment === 1 ? (l >= 1 && l <= 7) : (l >= 9 && l <= 15)
    })

    if (myBalls.length > 0) {
      return myBalls.sort((a, b) => (a.label || 0) - (b.label || 0))[0]
    }

    return table.balls.find(b => (b.label || 0) === 8)
  }

  placeBall(target?: Vector3): Vector3 {
    const baulkline = (-R * 11) / 0.5
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      if (isFirstShot(this.container.recorder)) {
        max.setX(baulkline)
        min.setX(baulkline)
      }
      return target.clone().clamp(min, max)
    }
    return new Vector3(baulkline, 0, 0)
  }

  asset(): string {
    return "models/p8.min.gltf"
  }

  tableGeometry(): void {
    TableGeometry.hasPockets = true
  }

  table(): Table {
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  rack(): Ball[] {
    return Rack.eightBall()
  }

  update(outcome: Outcome[]): Controller {
    const reason = this.eightBallFoulReason(this.container.table, outcome)

    if (reason) {
      const ballsPotted = Outcome.pots(outcome)
      if (ballsPotted.some((b) => (b.label || 0) === 8)) {
        return this.handleGameEnd(false, "8-ball pocketed on foul")
      }
      return this.handleFoul(outcome, reason)
    }

    const pots = Outcome.pots(outcome)
    if (pots.length > 0) {
      const labels = pots.map((b) => b.label || 0)
      const hasEight = labels.includes(8)

      if (hasEight) {
        const strikerAssignment = this.getStrikerAssignment()
        if (this.hasRemainingGroupBalls(this.container.table, strikerAssignment)) {
          return this.handleGameEnd(false, "8-ball pocketed early")
        }
        return this.handleGameEnd(true)
      }

      if (this.openTable) {
        const hasSolids = labels.some((l) => l >= 1 && l <= 7)
        const hasStripes = labels.some((l) => l >= 9 && l <= 15)

        if (hasSolids && !hasStripes) {
          this.assignGroups(1)
        } else if (hasStripes && !hasSolids) {
          this.assignGroups(2)
        }
      }

      return this.handlePot(outcome)
    }

    return this.handleMiss()
  }

  private handleFoul(outcome: Outcome[], reason: string): Controller {
    this.container.notify({
      type: "Foul",
      title: "FOUL",
      subtext: reason,
      extra: "Ball in hand",
    })
    this.startTurn()
    const cueball = this.container.table.cueball
    const startPos = cueball.onTable() ? cueball.pos.clone() : this.placeBall()
    roundVec(startPos)
    this.container.sendEvent(new PlaceBallEvent(startPos, undefined, true))

    if (this.container.isSinglePlayer) {
      return new PlaceBall(this.container, startPos)
    }
    return new WatchAim(this.container)
  }

  private handlePot(outcome: Outcome[]): Controller {
    const table = this.container.table
    const pots = Outcome.potCount(outcome)
    this.currentBreak += pots
    Session.getInstance().addMyScore(pots)

    this.container.sound.playSuccess(table.inPockets())
    if (this.isEndOfGame(outcome)) {
      return this.handleGameEnd(true)
    }

    this.container.sendEvent(new WatchEvent(table.serialise()))
    return new Aim(this.container)
  }

  handleGameEnd(isWinner: boolean, endSubtext?: string): Controller {
    return MatchResultHelper.presentGameEnd(
      this.container,
      this.rulename,
      isWinner,
      endSubtext
    )
  }

  private handleMiss(): Controller {
    const table = this.container.table
    this.container.sendEvent(new StartAimEvent())
    if (this.container.isSinglePlayer) {
      this.container.sendEvent(new WatchEvent(table.serialise()))
      this.startTurn()
      return new Aim(this.container)
    }
    return new WatchAim(this.container)
  }

  isPartOfBreak(outcome: Outcome[]): boolean {
    return Outcome.isBallPottedNoFoul(this.container.table.cueball, outcome)
  }

  isEndOfGame(outcome: Outcome[]): boolean {
    const eightBall = this.container.table.balls.find(b => (b.label || 0) === 8)
    return !eightBall || !eightBall.onTable()
  }

  otherPlayersCueBall(): Ball {
    return this.cueball
  }

  secondToPlay(): void {
  }

  allowsPlaceBall(): boolean {
    return true
  }

  private eightBallFoulReason(table: Table, outcome: Outcome[]): string | null {
    const cueball = table.cueball

    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return "Cue ball potted"
    }

    const firstCollision = Outcome.firstCollision(Outcome.cueBallFirst(cueball, outcome))

    if (!firstCollision) {
      return "No ball hit"
    }

    const hitBall = firstCollision.ballB!
    const hitBallLabel = hitBall.label || 0

    if (this.openTable) {
      if (hitBallLabel === 8) {
        return "8-ball hit first on open table"
      }
    } else {
      const strikerAssignment = this.getStrikerAssignment()
      const isSolid = hitBallLabel >= 1 && hitBallLabel <= 7
      const isStripe = hitBallLabel >= 9 && hitBallLabel <= 15

      if (hitBallLabel === 8) {
        if (this.hasRemainingGroupBalls(table, strikerAssignment)) {
          return "8-ball hit first"
        }
      } else if (strikerAssignment === 1 && !isSolid) {
        return "Wrong group hit first (Solids)"
      } else if (strikerAssignment === 2 && !isStripe) {
        return "Wrong group hit first (Stripes)"
      }
    }

    if (Outcome.potCount(outcome) === 0) {
      const firstCollisionIndex = outcome.indexOf(firstCollision)
      const cushionsAfter = outcome.slice(firstCollisionIndex + 1).some((o) => o.type === OutcomeType.Cushion)
      if (!cushionsAfter) {
        return "No cushion after contact"
      }
    }

    return null
  }

  private getStrikerAssignment(): number {
    const active = this.container.inferActivePlayer()
    return active === 1 ? this.p1Assignment : this.p2Assignment
  }

  private assignGroups(assignment: number) {
    this.openTable = false
    const active = this.container.inferActivePlayer()
    if (active === 1) {
      this.p1Assignment = assignment
      this.p2Assignment = assignment === 1 ? 2 : 1
    } else {
      this.p2Assignment = assignment
      this.p1Assignment = assignment === 1 ? 2 : 1
    }
    const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()
    this.container.sendScoreUpdate(s1, s2, this.currentBreak, undefined, this.p1Assignment)
  }

  private hasRemainingGroupBalls(table: Table, assignment: number): boolean {
    if (assignment === 0) return true
    return table.balls.some((b) => {
      if (!b.onTable() || b === table.cueball) return false
      const label = b.label || 0
      if (assignment === 1) return label >= 1 && label <= 7
      if (assignment === 2) return label >= 9 && label <= 15
      return false
    })
  }

  handleScore(event: ScoreEvent): Controller {
    if (event.p1type !== undefined) {
      this.p1Assignment = event.p1type
      this.p2Assignment = event.p1type === 0 ? 0 : (event.p1type === 1 ? 2 : 1)
      if (this.p1Assignment !== 0) {
        this.openTable = false
      }
    }
    this.container.updateScoreHud(event.p1, event.p2, event.b, event.active, event.p1type)
    return this.container.controller
  }
}
