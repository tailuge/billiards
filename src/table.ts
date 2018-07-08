import { Cushion } from "./cushion"
import { Collision } from "./collision"
import { Ball } from "./ball"

export class Table {
  balls: Ball[]

  constructor(balls) {
    this.balls = balls
  }

  advance(t) {
    this.balls.forEach(a => {
      this.balls.forEach(b => {
        if (a != b) {
          this.canAdvance(a, b, t)
          a.update(t)
        }
      })
    })
  }

  canAdvance(a, b, t) {
    if (Collision.willCollide(a, b, t)) {
      Collision.collide(a, b)
      return false
    }
    if (Cushion.willBounce(a, t)) {
      Cushion.bounce(a, t)
      return false
    }
    return true
  }
}
