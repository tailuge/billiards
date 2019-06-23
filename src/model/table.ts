import { Cushion } from "./physics/cushion"
import { Collision } from "./physics/collision"
import { Knuckle } from "./physics/knuckle"
import { Pocket } from "./physics/pocket"
import { Cue } from "../view/cue"
import { Ball } from "./ball"

export class Table {
  balls: Ball[]
  cue = new Cue()
  pairs: any[] = []

  constructor(balls) {
    this.balls = balls
    this.cue.setCueBall(balls[0])
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

  private prepareAdvancePair(a, b, t) {
    if (Collision.willCollide(a, b, t)) {
      Collision.collide(a, b)
      return false
    }
    if (Cushion.willBounce(a, t)) {
      Cushion.bounce(a, t)
      return false
    }
    let k = Knuckle.willBounceAny(a, t)
    if (k) {
      k.bounce(a)
      return false
    }
    let p = Pocket.willFallAny(a, t)
    if (p) {
      p.fall(a, t)
      return false
    }

    return true
  }

  allStationary() {
    return this.balls.every(b => !b.inMotion() || !b.onTable())
  }

  serialise() {
    return this.balls.map(b => b.serialise())
  }

  static fromSerialised(data) {
    return new Table(data.map(b => Ball.fromSerialised(b)))
  }
}
