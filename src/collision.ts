import { Ball } from "./ball"
import { Vector3 } from "three"

export class Collision {
  static epsilon = 0.001
  static up = new Vector3(0, 0, 1)

  static willCollide(a: Ball, b: Ball, t: number): boolean {
    return a.futurePosition(t).distanceTo(b.futurePosition(t)) < 1
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
