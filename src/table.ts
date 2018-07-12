import { Cushion } from "./cushion"
import { Collision } from "./collision"
import { Knuckle } from "./knuckle"
import { Ball } from "./ball"
import { Vector3 } from "three"

export class Table {
  balls: Ball[]
  aim = new Vector3(1, 0, 0)
  up = new Vector3(0, 0, 1)
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

    return true
  }

  serialise() {
    return this.balls.map(b => b.serialise())
  }

  static fromSerialised(data) {
    return new Table(data.map(b => Ball.fromSerialised(b)))
  }

  rotateAim(t) {
    this.aim.applyAxisAngle(this.up, t)
  }

  hit(speed) {
    this.balls[0].vel.copy(this.aim.clone().multiplyScalar(speed))
  }
}
