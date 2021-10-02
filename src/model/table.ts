import { Cushion } from "./physics/cushion"
import { Collision } from "./physics/collision"
import { Knuckle } from "./physics/knuckle"
import { Pocket } from "./physics/pocket"
import { Cue } from "../view/cue"
import { Ball, State } from "./ball"
import { AimEvent } from "../events/aimevent"
import { upCross, unitAtAngle, zero } from "../utils/utils"
import { TableGeometry } from "../view/tablegeometry"
import { Outcome } from "./outcome"

export class Table {
  balls: Ball[]
  cue = new Cue()
  pairs: any[]
  outcome: Outcome[] = []

  constructor(balls: Ball[]) {
    this.initialiseBalls(balls)
  }

  initialiseBalls(balls: Ball[]) {
    this.balls = balls
    this.pairs = []
    this.balls.forEach((a) => {
      this.balls.forEach((b) => {
        if (a !== b) {
          this.pairs.push({ a: a, b: b })
        }
      })
    })
  }

  advance(t: number) {
    let depth = 0
    while (!this.prepareAdvanceAll(t)) {
      if (depth++ > 100) {
        throw new Error("Depth exceeded resolving collisions")
      }
    }
    this.balls.forEach((a) => {
      a.update(t)
    })
  }

  updateBallMesh(t) {
    this.balls.forEach((a) => {
      a.updateMesh(t)
    })
  }

  prepareAdvanceAll(t: number) {
    return this.pairs.length > 0
      ? !this.pairs.some((pair) => !this.prepareAdvancePair(pair.a, pair.b, t))
      : !this.balls.some((ball) => !this.prepareAdvanceToCushions(ball, t))
  }

  private prepareAdvancePair(a: Ball, b: Ball, t: number) {
    if (!a.inMotion() && !b.inMotion()) {
      return true
    }
    if (Collision.willCollide(a, b, t)) {
      var incidentSpeed = Collision.collide(a, b)
      this.outcome.push(Outcome.collision(a, b, incidentSpeed))
      return false
    }
    return this.prepareAdvanceToCushions(a, t)
  }

  private prepareAdvanceToCushions(a: Ball, t: number): boolean {
    let futurePosition = a.futurePosition(t)
    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return true
    }

    if (Cushion.willBounce(a, t)) {
      var incidentSpeed = Cushion.bounce(a, t)
      this.outcome.push(Outcome.cushion(a, incidentSpeed))
      return false
    }
    let k = Knuckle.willBounceAny(a, t)
    if (k) {
      var knuckleIncidentSpeed = k.bounce(a)
      this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed))
      return false
    }
    let p = Pocket.willFallAny(a, t)
    if (p) {
      var pocketIncidentSpeed = p.fall(a, t)
      this.outcome.push(Outcome.pot(a, pocketIncidentSpeed))
      return false
    }

    return true
  }

  allStationary() {
    return this.balls.every((b) => !b.inMotion() || !b.onTable())
  }

  hit() {
    let aim = this.cue.aim
    this.balls[0].vel.copy(unitAtAngle(aim.angle).multiplyScalar(aim.power))
    if (aim.spinOnly) {
      this.balls[0].vel.copy(zero)
    }
    this.balls[0].state = State.Sliding

    let angle = Math.atan2(-aim.sideOffset, aim.verticalOffset)
    if (angle == 0) {
      this.balls[0].rvel.copy(zero)
    } else {
      let spinPower = Math.sqrt(
        aim.verticalOffset * aim.verticalOffset +
          aim.sideOffset * aim.sideOffset
      )
      let dir = unitAtAngle(aim.angle)
      let rvel = upCross(dir)
        .applyAxisAngle(dir, angle)
        .multiplyScalar(spinPower * aim.power * 2)
      this.balls[0].rvel.copy(rvel)
    }
    aim.power = 0
    console.log(this.balls[0].pos)
  }

  serialise() {
    return {
      balls: this.balls.map((b) => b.serialise()),
      aim: this.cue.aim.copy(),
    }
  }

  static fromSerialised(data) {
    let table = new Table(data.balls.map((b) => Ball.fromSerialised(b)))
    table.updateFromSerialised(data)
    return table
  }

  updateFromSerialised(data) {
    if (data.balls) {
      this.balls.forEach((b, i) => Ball.updateFromSerialised(b, data.balls[i]))
    }
    if (data.aim) {
      this.cue.aim = AimEvent.fromJson(data.aim)
    }
  }

  shortSerialise() {
    return this.balls
      .map((b) => [b.pos.x, b.pos.y])
      .reduce((acc, val) => acc.concat(val), [])
  }

  updateFromShortSerialised(data) {
    this.balls.forEach((b, i) => {
      {
        b.pos.x = data[i * 2]
        b.pos.y = data[i * 2 + 1]
      }
    })
  }
}
