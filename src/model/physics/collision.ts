import { upCross, zero } from "../../utils/utils"
import { Ball, State } from "../ball"
import { I, m, R } from "./constants"

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
    const sep = a.pos.distanceTo(b.pos)
    const rv = a.vel.clone().sub(b.vel)
    const t = (sep - 2 * R) / rv.length() || 0
    return {
      a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t),
    }
  }

  private static noThrowOrigalUpdateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    a.ballmesh.trace.forceTrace(contact.a)
    b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.sub(contact.a).normalize()
    const aDotCenters = ab.dot(a.vel)
    const bDotCenters = ab.dot(b.vel)
    a.vel.addScaledVector(ab, bDotCenters - aDotCenters)
    b.vel.addScaledVector(ab, aDotCenters - bDotCenters)
    a.state = State.Sliding
    b.state = State.Sliding
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)
  }

  private static relativeVelocityAtContact(a: Ball, b: Ball) {
    const contact = a.pos.clone().add(b.pos).multiplyScalar(0.5); // Midpoint between ball centers

    const rA = contact.clone().sub(a.pos); // Vector from ball A's center to contact point
    const rB = contact.clone().sub(b.pos); // Vector from ball B's center to contact point

    const velA = a.vel.clone().add(rA.cross(a.rvel)); // Velocity of contact point on ball A
    const velB = b.vel.clone().add(rB.cross(b.rvel)); // Velocity of contact point on ball B

    const relV = velB.sub(velA); // Relative velocity at the contact point
    return relV
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b);
    a.ballmesh.trace.forceTrace(contact.a)
    b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.sub(contact.a).normalize();
    const abTangential = upCross(ab)

    // Relative velocity at contact point
    const relVel = Collision.relativeVelocityAtContact(a, b)

    // Normal and tangential components
    const vRelNormal = ab.clone().multiplyScalar(relVel.dot(ab));
    const vRelTangential = abTangential.clone().multiplyScalar(relVel.dot(abTangential));


    // Normal impulse (handled by existing logic)
    const aDotCenters = ab.dot(a.vel);
    const bDotCenters = ab.dot(b.vel);
    a.vel.addScaledVector(ab, bDotCenters - aDotCenters);
    b.vel.addScaledVector(ab, aDotCenters - bDotCenters);

    // Frictional impulse for tangential velocity (throw effect)
    const frictionCoefficient = 0.005
    const Ft = Math.min(frictionCoefficient * vRelNormal.length(), m * vRelTangential.length());
    const tangentialDir = vRelTangential.clone().normalize();

    a.vel.addScaledVector(tangentialDir, -Ft / m);
    b.vel.addScaledVector(tangentialDir, Ft / m);

    // Angular velocity update
    const angularChange = R * Ft / I;

    a.rvel.addScaledVector(tangentialDir, -angularChange);
    b.rvel.addScaledVector(tangentialDir, angularChange);
    a.vel.setZ(0)
    b.vel.setZ(0)
    //    console.log("a.rvel    ",a.rvel)
    //    console.log("b.rvel    ",b.rvel)

    a.state = State.Sliding
    b.state = State.Sliding
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)

  }

}
