import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { Cushion } from "./cushion"
import { Vector3 } from "three"

export class Knuckle {
  pos: Vector3
  radius: number

  constructor(pos, radius) {
    this.pos = pos
    this.radius = radius
  }

  private static willBounce(knuckle, futurePosition) {
    return futurePosition.distanceTo(knuckle.pos) < 0.5 + knuckle.radius
  }

  public bounce(ball) {
    const kb = ball.pos
      .clone()
      .sub(this.pos)
      .normalize()
    let velDotCenters = kb.dot(ball.vel)
    ball.vel.addScaledVector(kb, -2 * Cushion.elasticity * velDotCenters)
  }

  static willBounceAny(ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return (
      ball.onTable() &&
      TableGeometry.knuckles.find(k => Knuckle.willBounce(k, futurePosition))
    )
  }
}
