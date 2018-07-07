import { Ball } from "./ball"

export class Cushion {
  static tableX = 41
  static tableY = 21
  static elasticity = 0.8

  static bounce(ball: Ball): boolean {
    let bx = Cushion.bounceX(ball)
    let by = Cushion.bounceY(ball)
    return bx || by
  }

  private static bounceX(ball) {
    if (Math.abs(ball.pos.x) > Cushion.tableX) {
      ball.pos.x = ball.pos.x > 0 ? Cushion.tableX : -Cushion.tableX
      ball.vel.x *= -Cushion.elasticity
      return true
    }
    return false
  }

  private static bounceY(ball) {
    if (Math.abs(ball.pos.y) > Cushion.tableY) {
      ball.pos.y = ball.pos.y > 0 ? Cushion.tableY : -Cushion.tableY
      ball.vel.y *= -Cushion.elasticity
      return true
    }
    return false
  }
}
