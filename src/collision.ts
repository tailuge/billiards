import { Ball } from "./ball"

export class Collision {
  static willCollide(a: Ball, b: Ball, t: number): boolean {
    return (
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceTo(b.futurePosition(t)) < 1
    )
  }

  static collide(a: Ball, b: Ball) {
    Collision.updateVelocities(a, b)
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const ab = b.pos
      .clone()
      .sub(a.pos)
      .normalize()
    let aDotCenters = ab.dot(a.vel)
    let bDotCenters = ab.dot(b.vel)
    a.vel.addScaledVector(ab, bDotCenters).addScaledVector(ab, -aDotCenters)
    b.vel.addScaledVector(ab, aDotCenters).addScaledVector(ab, -bDotCenters)
  }
}
