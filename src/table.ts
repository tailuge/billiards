import { Cushion } from "./cushion"
import { Collision } from "./collision"
import { Knuckle } from "./knuckle"
import { Pocket } from "./pocket"
import { Cue } from "./cue"
import { Ball } from "./ball"
import { crossUp } from "./utils"

export class Table {
  balls: Ball[]
  cue = new Cue()
  pairs: any[] = []

  constructor(balls) {
    this.balls = balls
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
        console.log(JSON.stringify(this.serialise()))
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

  serialise() {
    return this.balls.map(b => b.serialise())
  }

  static fromSerialised(data) {
    return new Table(data.map(b => Ball.fromSerialised(b)))
  }

  hit(speed) {
    this.balls[0].vel.copy(this.cue.aim.clone().multiplyScalar(speed))
    this.balls[0].rvel.copy(
      crossUp(this.cue.aim).multiplyScalar(speed * -this.cue.height * 3)
    )
  }
}
