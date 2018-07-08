import { Ball } from "./ball"

export class Cushion {
  static tableX = 41
  static tableY = 21
  static elasticity = 0.8

  static willBounce(ball: Ball, t: number): boolean {
    let futurePosition = ball.futurePosition(t)
    return (
      Math.abs(futurePosition.x) > Cushion.tableX ||
      Math.abs(futurePosition.y) > Cushion.tableY
    )
  }

  static bounce(ball: Ball, t: number) {
    let futurePosition = ball.futurePosition(t)
    if (Math.abs(futurePosition.x) > Cushion.tableX) {
      Cushion.bounceX(ball)
    }
    if (Math.abs(futurePosition.y) > Cushion.tableY) {
      Cushion.bounceY(ball)
    }
  }

  private static bounceX(ball) {
    ball.vel.x *= -Cushion.elasticity
  }

  private static bounceY(ball) {
    ball.vel.y *= -Cushion.elasticity
  }
}
