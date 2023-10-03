import { Ball } from "./ball"

export enum OutcomeType {
  Pot = "Pot",
  Cushion = "Cushion",
  Collision = "Collision",
  Hit = "Hit",
}

export class Outcome {
  type: OutcomeType
  timestamp: number
  ballA: Ball | null = null
  ballB: Ball | null = null
  incidentSpeed: number

  constructor(type, ballA: Ball, ballB: Ball, incidentSpeed) {
    this.type = type
    this.ballA = ballA
    this.ballB = ballB
    this.incidentSpeed = incidentSpeed
    this.timestamp = Date.now()
  }

  static pot(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Pot, ballA, ballA, incidentSpeed)
  }

  static cushion(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Cushion, ballA, ballA, incidentSpeed)
  }

  static collision(ballA, ballB, incidentSpeed) {
    return new Outcome(OutcomeType.Collision, ballA, ballB, incidentSpeed)
  }

  static hit(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Hit, ballA, ballA, incidentSpeed)
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

  static potCount(outcomes: Outcome[]) {
    return outcomes.filter((o) => o.type == OutcomeType.Pot).length
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
    return false
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
