import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { PoolRules } from "./poolrules"
import { Session } from "../../network/client/session"
import { ScoreEvent } from "../../events/scoreevent"
import { Controller } from "../controller"

export class EightBall extends PoolRules {
  rulename = "eightball"
  openTable = true
  p1Assignment = 0 // 0: None, 1: Solids, 2: Stripes
  p2Assignment = 0

  override startTurn(): void {
    super.startTurn()
    // Sync local state from Session on turn start
    const session = Session.getInstance()
    this.p1Assignment = session.p1type
    this.p2Assignment = session.p1type === 0 ? 0 : (session.p1type === 1 ? 2 : 1)
    if (this.p1Assignment !== 0) {
      this.openTable = false
    }
  }

  override nextCandidateBall(): Ball | undefined {
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

  override rack(): Ball[] {
    return Rack.eightBall()
  }

  override update(outcome: Outcome[]): Controller {
    const reason = this.eightBallFoulReason(this.container.table, outcome)

    if (reason) {
      const ballsPotted = Outcome.pots(outcome)
      if (ballsPotted.some((b) => (b.label || 0) === 8)) {
        return this.handleGameEnd(false, "8-ball pocketed on foul")
      }
      this.startTurn()
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

  override isEndOfGame(outcome: Outcome[]): boolean {
    const eightBall = this.container.table.balls.find(b => (b.label || 0) === 8)
    return !eightBall || !eightBall.onTable()
  }

  override handleScore(event: ScoreEvent): void {
    if (event.p1type !== undefined) {
      this.p1Assignment = event.p1type
      this.p2Assignment = event.p1type === 0 ? 0 : (event.p1type === 1 ? 2 : 1)
      if (this.p1Assignment !== 0) {
        this.openTable = false
      }
    }
    super.handleScore(event)
  }
}
