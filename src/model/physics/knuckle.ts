import { Ball } from "../ball"
import { Vector3 } from "three"
import { R, e } from "./constants"
import { PocketGeometry } from "../../view/pocketgeometry"

export class Knuckle {
  pos: Vector3
  radius: number

  constructor(pos, radius) {
    this.pos = pos
    this.radius = radius
  }

  private static willBounce(knuckle, futurePosition) {
    return futurePosition.distanceTo(knuckle.pos) < R + knuckle.radius
  }

  public bounce(ball: Ball) {
    const kb = ball.pos.clone().sub(this.pos).normalize()
    const velDotCenters = kb.dot(ball.vel)
    ball.vel.addScaledVector(kb, -2 * e * velDotCenters)
    ball.rvel.multiplyScalar(0.5)
    return Math.abs(velDotCenters)
  }

  static findBouncing(ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return PocketGeometry.knuckles.find((k) =>
      Knuckle.willBounce(k, futurePosition)
    )
  }
}
