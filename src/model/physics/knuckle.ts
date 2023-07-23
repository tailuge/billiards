import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { Vector3 } from "three"
import { e } from "./constants"

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
    const kb = ball.pos.clone().sub(this.pos).normalize()
    const velDotCenters = kb.dot(ball.vel)
    ball.vel.addScaledVector(kb, -2 * e * velDotCenters)
    return Math.abs(velDotCenters)
  }

  static findBouncing(ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return TableGeometry.knuckles.find((k) =>
      Knuckle.willBounce(k, futurePosition)
    )
  }
}
