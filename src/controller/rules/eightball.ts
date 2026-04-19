import { Container } from "../../container/container"
import { Controller } from "../../controller/controller"
import { ScoreEvent } from "../../events/scoreevent"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Rack } from "../../utils/rack"
import { NineBall } from "./nineball"
import { Rules } from "./rules"
import { Table } from "../../model/table"
import { Session } from "../../network/client/session"

export class EightBall extends NineBall implements Rules {
  openTable = true
  p1Assignment = 0 // 0: None, 1: Solids, 2: Stripes
  p2Assignment = 0

  constructor(container: Container) {
    super(container)
    this.rulename = "eightball"
  }

  override rack(): Ball[] {
    const balls = Rack.triangle()
    // Rack.triangle() already puts cueball at index 0.
    // Balls 1-15 are at indices 1-15.
    // We want ball 8 (at triangle[8]) to be in the center (position tp[4]).
    // tp[4] corresponds to the 5th object ball, which is at triangle[5].
    Rack.swapBallPositions(balls[8], balls[5])
    return balls
  }

  override startTurn(): void {
    super.startTurn()
    // Sync local state from Session on turn start
    const session = Session.getInstance()
    this.p1Assignment = session.p1a
    this.p2Assignment = session.p2a
    if (this.p1Assignment !== 0 || this.p2Assignment !== 0) {
      this.openTable = false
    }
  }

  override update(outcome: Outcome[]): Controller {
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
        if (
          this.hasRemainingGroupBalls(this.container.table, strikerAssignment)
        ) {
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
    this.container.sendScoreUpdate(
      s1,
      s2,
      this.currentBreak,
      undefined,
      this.p1Assignment,
      this.p2Assignment
    )
  }

  protected override isFoul(outcome: Outcome[]): boolean {
    return this.eightBallFoulReason(this.container.table, outcome) !== null
  }

  private eightBallFoulReason(table: Table, outcome: Outcome[]): string | null {
    const cueball = table.cueball

    // 1. Cue ball potted
    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return "Cue ball potted"
    }

    // 2. Wrong ball hit first
    const firstCollision = Outcome.firstCollision(
      Outcome.cueBallFirst(cueball, outcome)
    )

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

    // 3. No cushion after contact
    if (Outcome.potCount(outcome) === 0) {
      const firstCollisionIndex = outcome.indexOf(firstCollision)
      const cushionsAfter = outcome
        .slice(firstCollisionIndex + 1)
        .some((o) => o.type === OutcomeType.Cushion)
      if (!cushionsAfter) {
        return "No cushion after contact"
      }
    }

    return null
  }

  private getStrikerAssignment(): number {
    const active = this.container.inferActivePlayer()
    // if active is 1 (p1), return p1Assignment, if 2 (p2) return p2Assignment
    return active === 1 ? this.p1Assignment : this.p2Assignment
  }

  override handleScore(event: ScoreEvent): Controller {
    if (event.p1a !== undefined) this.p1Assignment = event.p1a
    if (event.p2a !== undefined) this.p2Assignment = event.p2a
    if (this.p1Assignment !== 0 || this.p2Assignment !== 0) {
      this.openTable = false
    }
    return super.handleScore(event)
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
}
