import { Cushion } from "./physics/cushion"
import { Collision } from "./physics/collision"
import { Knuckle } from "./physics/knuckle"
import { Pocket } from "./physics/pocket"
import { Cue } from "../view/cue"
import { Ball } from "./ball"
import { AimEvent } from "../events/aimevent"
import { upCross } from "../utils/utils"

export class Table {
  balls: Ball[]
  cue = new Cue()
  pairs: any[]
  outcome: any[] = []

  constructor(balls) {
    this.initialiseBalls(balls)
  }

  initialiseBalls(balls) {
    this.balls = balls
    this.pairs = []
    this.balls.forEach(a => {
      this.balls.forEach(b => {
        if (a != b) {
          this.pairs.push({ a: a, b: b })
        }
      })
    })
  }

  advance(t) {
    let depth = 0
    while (!this.prepareAdvanceAll(t)) {
      if (depth++ > 100) {
        throw new Error("Depth exceeded resolving collisions")
      }
    }
    this.balls.forEach(a => {
      a.update(t)
    })
  }

  prepareAdvanceAll(t) {
    return !this.pairs.some(pair => !this.prepareAdvancePair(pair.a, pair.b, t))
  }

  private prepareAdvancePair(a: Ball, b: Ball, t) {
    if (Collision.willCollide(a, b, t)) {
      Collision.collide(a, b)
      this.outcome.push({ type: "collision", a: a, b: b })
      return false
    }
    if (Cushion.willBounce(a, t)) {
      Cushion.bounce(a, t)
      this.outcome.push({ type: "cushion", a: a })
      return false
    }
    let k = Knuckle.willBounceAny(a, t)
    if (k) {
      k.bounce(a)
      this.outcome.push({ type: "cushion", a: a })
      return false
    }
    let p = Pocket.willFallAny(a, t)
    if (p) {
      p.fall(a, t)
      this.outcome.push({ type: "pot", a: a })
      return false
    }

    return true
  }

  allStationary() {
    return this.balls.every(b => !b.inMotion() || !b.onTable())
  }

  hit() {
    let aim = this.cue.aim
    this.balls[0].vel.copy(aim.dir.clone().multiplyScalar(aim.power))
    let rvel = upCross(aim.dir).multiplyScalar(
      (aim.power * aim.verticalOffset * 5) / 2
    )
    rvel.z = (-aim.sideOffset * 5) / 2
    this.balls[0].rvel.copy(rvel)
    aim.power = 0
  }

  serialise() {
    return {
      balls: this.balls.map(b => b.serialise()),
      aim: this.cue.aim.copy()
    }
  }

  static fromSerialised(data) {
    let table = new Table(data.balls.map(b => Ball.fromSerialised(b)))
    table.cue.aim = AimEvent.fromJson(data.aim)
    return table
  }

  updateFromSerialised(data) {
    this.balls.forEach((b, i) => Ball.updateFromSerialised(b, data.balls[i]))
    this.cue.aim = AimEvent.fromJson(data.aim)
  }
}
