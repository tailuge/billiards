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

  static positionsAtContact(a: Ball, b: Ball) {
    const p = a.pos.clone().sub(b.pos) // Relative position
    const v = a.vel.clone().sub(b.vel) // Relative velocity
    const rSum = 2 * R

    const a_coeff = v.lengthSq()
    if (a_coeff === 0) return { a: a.pos.clone(), b: b.pos.clone() }

    const b_coeff = 2 * p.dot(v)
    const c_coeff = p.lengthSq() - rSum * rSum

    const discriminant = b_coeff * b_coeff - 4 * a_coeff * c_coeff

    // If discriminant < 0, they never actually touch on these vectors.
    // Use the negative root to find the *first* point of contact.
    const t =
      discriminant < 0
        ? 0
        : Math.fround((-b_coeff - Math.sqrt(discriminant)) / (2 * a_coeff))

    return {
      a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t),
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
