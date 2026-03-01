import { Vector3 } from "three"
import { Ball, State } from "../ball"
import { CollisionThrow } from "./collisionthrow"
import { R } from "./constants"

export class Collision {
  static willCollide(a: Ball, b: Ball, t: number): boolean {
    return (
      (a.inMotion() || b.inMotion()) &&
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceToSquared(b.futurePosition(t)) < 4 * R * R
    )
  }

  static collide(a: Ball, b: Ball) {
    return Collision.updateVelocities(a, b)
  }

  static readonly p = new Vector3()
  static readonly v = new Vector3()

  static positionsAtContact(a: Ball, b: Ball) {
    this.p.subVectors(a.pos, b.pos)
    this.v.subVectors(a.vel, b.vel)

    const rSum = 2 * R
    const aCoeff = this.v.lengthSq()

    if (aCoeff === 0) {
      return {
        a: a.pos.clone(),
        b: b.pos.clone(),
      }
    }

    const bCoeff = 2 * this.p.dot(this.v)
    const cCoeff = this.p.lengthSq() - rSum * rSum

    const discriminant = bCoeff * bCoeff - 4 * aCoeff * cCoeff

    const t =
      discriminant < 0 ? 0 : (-bCoeff - Math.sqrt(discriminant)) / (2 * aCoeff)

    return {
      a: new Vector3().copy(a.pos).addScaledVector(a.vel, t),
      b: new Vector3().copy(b.pos).addScaledVector(b.vel, t),
    }
  }

  static readonly model = new CollisionThrow()

  private static updateVelocities(a: Ball, b: Ball) {
    const impactSpeed = Collision.model.updateVelocities(a, b)
    a.state = State.Sliding
    b.state = State.Sliding
    return impactSpeed
  }
}
