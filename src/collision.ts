import { Ball } from "./ball"
import { Vector3 } from "three"

export class Collision {
  static epsilon = 0.001
  static up = new Vector3(0, 0, 1)

  static collide(a: Ball, b: Ball): boolean {
    if (a.pos.distanceTo(b.pos) < 1) {
      Collision.seperate(a, b)
      Collision.updateVelocities(a, b)
      return true
    }
    return false
  }

  private static seperate(a: Ball, b: Ball) {
    let midpoint = a.pos.clone().lerp(b.pos, 0.5)
    let ab = b.pos
      .clone()
      .sub(a.pos)
      .normalize()
    a.pos.copy(midpoint).addScaledVector(ab, -0.5 - Collision.epsilon)
    b.pos.copy(midpoint).addScaledVector(ab, 0.5 + Collision.epsilon)
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
