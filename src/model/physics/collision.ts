import { Ball, State } from "../ball"

export class Collision {
  static willCollide(a: Ball, b: Ball, t: number): boolean {
    return (
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceToSquared(b.futurePosition(t)) < 1
    )
  }

  static collide(a: Ball, b: Ball) {
    return Collision.updateVelocities(a, b)
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const ab = b.pos.clone().sub(a.pos).normalize()
    const aDotCenters = ab.dot(a.vel)
    const bDotCenters = ab.dot(b.vel)
    a.vel.addScaledVector(ab, bDotCenters).addScaledVector(ab, -aDotCenters)
    b.vel.addScaledVector(ab, aDotCenters).addScaledVector(ab, -bDotCenters)
    a.state = State.Sliding
    b.state = State.Sliding
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)
  }

}
