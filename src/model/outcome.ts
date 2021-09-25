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
  ballA: number
  ballB: number
  incidentSpeed: number

  constructor(type, ballA: Ball, ballB: Ball, incidentSpeed) {
    this.type = type
    this.ballA = ballA.index
    this.ballB = ballB.index
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

  static pottedCueBall(outcomes: Outcome[]) {
    return outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA == 0)
  }

  static pottedBallNoFoul(outcomes: Outcome[]) {
    return (
      outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA != 0) &&
      !Outcome.pottedCueBall(outcomes)
    )
  }
}
