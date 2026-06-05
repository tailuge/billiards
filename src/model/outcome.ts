import { Ball } from "./ball"
import { R } from "./physics/constants"

export enum OutcomeType {
  Pot = "Pot",
  Cushion = "Cushion",
  Collision = "Collision",
  Hit = "Hit",
  Proximity = "Proximity",
}

export class Outcome {
  type: OutcomeType
  timestamp: number
  ballA: Ball | null = null
  ballB: Ball | null = null
  incidentSpeed: number

  constructor(
    type: OutcomeType,
    ballA: Ball,
    ballB: Ball,
    incidentSpeed: number,
    timestamp: number
  ) {
    this.type = type
    this.ballA = ballA
    this.ballB = ballB
    this.incidentSpeed = incidentSpeed
    this.timestamp = timestamp
  }

  static pot(ballA: Ball, incidentSpeed: number, timestamp: number) {
    return new Outcome(OutcomeType.Pot, ballA, ballA, incidentSpeed, timestamp)
  }

  static cushion(ballA: Ball, incidentSpeed: number, timestamp: number) {
    return new Outcome(
      OutcomeType.Cushion,
      ballA,
      ballA,
      incidentSpeed,
      timestamp
    )
  }

  static collision(
    ballA: Ball,
    ballB: Ball,
    incidentSpeed: number,
    timestamp: number
  ) {
    return new Outcome(
      OutcomeType.Collision,
      ballA,
      ballB,
      incidentSpeed,
      timestamp
    )
  }

  static hit(ballA: Ball, incidentSpeed: number, timestamp: number) {
    return new Outcome(OutcomeType.Hit, ballA, ballA, incidentSpeed, timestamp)
  }

  static proximity(
    ballA: Ball,
    ballB: Ball,
    distance: number = 0,
    timestamp: number
  ) {
    return new Outcome(OutcomeType.Proximity, ballA, ballB, distance, timestamp)
  }

  static isCueBallPotted(cueBall, outcomes: Outcome[]) {
    return outcomes.some(
      (o) => o.type == OutcomeType.Pot && o.ballA === cueBall
    )
  }

  static isBallPottedNoFoul(cueBall, outcomes: Outcome[]) {
    return (
      outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA !== null) &&
      !Outcome.isCueBallPotted(cueBall, outcomes)
    )
  }

  static pots(outcomes: Outcome[]): Ball[] {
    return outcomes
      .filter((o) => o.type == OutcomeType.Pot)
      .map((o) => o.ballA!)
  }
  static potCount(outcomes: Outcome[]) {
    return this.pots(outcomes).length
  }

  static onlyRedsPotted(outcomes: Outcome[]) {
    return this.pots(outcomes).every((b) => b.id > 6)
  }

  static firstCollision(outcome: Outcome[]) {
    const collisions = outcome.filter((o) => o.type === OutcomeType.Collision)
    return collisions.length > 0 ? collisions[0] : undefined
  }

  static isClearTable(table) {
    const onTable = table.balls.filter((ball) => ball.onTable())
    return onTable.length === 1 && onTable[0] === table.cueball
  }

  static isThreeCushionPoint(cueBall, outcomes: Outcome[]) {
    outcomes = Outcome.cueBallFirst(cueBall, outcomes).filter(
      (outcome) => outcome.ballA === cueBall
    )
    const cannons = new Set()
    let cushions = 0
    for (const outcome of outcomes) {
      if (outcome.type === OutcomeType.Cushion) {
        cushions++
      }
      if (outcome.type === OutcomeType.Collision) {
        cannons.add(outcome.ballB)
        if (cannons.size === 2) {
          return cushions >= 3
        }
      }
    }

    // Pass 2: Proximity point
    const proximity = outcomes.find(
      (o) => o.type === OutcomeType.Proximity && o.ballA === cueBall
    )
    if (proximity) {
      const collisionCount = new Set(
        outcomes
          .filter(
            (o) => o.type === OutcomeType.Collision && o.ballA === cueBall
          )
          .map((o) => o.ballB)
      ).size
      if (collisionCount === 1 && cushions >= 3) {
        return true
      }
    }

    return false
  }

  static getProximityScore(cueBall: Ball, outcomes: Outcome[]): number {
    const proximityOutcomes = outcomes.filter(
      (o) => o.type === OutcomeType.Proximity && o.ballA === cueBall
    )
    if (proximityOutcomes.length === 0) return 0

    const minDistance = Math.min(
      ...proximityOutcomes.map((o) => o.incidentSpeed)
    )

    if (minDistance <= 2 * R) return 3
    if (minDistance <= 3 * R) return 2
    if (minDistance <= 4 * R) return 1
    return 0
  }

  static cueBallFirst(cueBall, outcomes) {
    outcomes.forEach((o) => {
      if (o.type === OutcomeType.Collision && o.ballB === cueBall) {
        o.ballB = o.ballA
        o.ballA = cueBall
      }
    })
    return outcomes
  }
}
