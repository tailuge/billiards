import { Vector3 } from "three"
import { Ball } from "../ball"
import { Collision } from "./collision"
import { I, m, R } from "./constants"
import { exp } from "../../utils/utils"

/**
 * Based on
 * https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
 *
 */
export class CollisionThrow {
  normalImpulse: number
  tangentialImpulse: number

  private dynamicFriction(vRel: number): number {
    return 0.01 + 0.108 * exp(-1.088 * vRel)
  }

  public updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    a.ballmesh.trace.forceTrace(contact.a)
    b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.sub(contact.a).normalize()
    const abTangent = new Vector3(-ab.y, ab.x, 0)

    const e = 0.99
    const vPoint = a.vel
      .clone()
      .sub(b.vel)
      .add(
        ab
          .clone()
          .multiplyScalar(-R)
          .cross(a.rvel)
          .sub(ab.clone().multiplyScalar(R).cross(b.rvel))
      )

    const vRelNormalMag = ab.dot(vPoint)
    const vRel = vPoint.addScaledVector(ab, -vRelNormalMag)
    const vRelMag = vRel.length()
    const vRelTangential = abTangent.dot(vRel) // slip velocity perpendicular to line of impact

    const μ = this.dynamicFriction(vRelMag)

    // let normalImpulse = vRelNormalMag;
    // let tangentialImpulse = Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) * (-vRelTangential)
    // matches paper when throwAngle = Math.atan2(tangentialImpulse, normalImpulse)

    // Normal impulse (inelastic collision)
    this.normalImpulse = (-(1 + e) * vRelNormalMag) / (2 / m)

    // Tangential impulse (frictional constraint) reduced by 1/4 until understood
    this.tangentialImpulse =
      0.25 *
      Math.min((μ * Math.abs(this.normalImpulse)) / vRelMag, 1 / 7) *
      -vRelTangential

    // Impulse vectors
    const impulseNormal = ab.clone().multiplyScalar(this.normalImpulse)
    const impulseTangential = abTangent
      .clone()
      .multiplyScalar(this.tangentialImpulse)

    // Apply impulses to linear velocities
    a.vel
      .addScaledVector(impulseNormal, 1 / m)
      .addScaledVector(impulseTangential, 1 / m)
    b.vel
      .addScaledVector(impulseNormal, -1 / m)
      .addScaledVector(impulseTangential, -1 / m)

    // Angular velocity updates
    const angularImpulseA = ab
      .clone()
      .multiplyScalar(-R)
      .cross(impulseTangential)
    const angularImpulseB = ab
      .clone()
      .multiplyScalar(R)
      .cross(impulseTangential)

    a.rvel.addScaledVector(angularImpulseA, 1 / I)
    b.rvel.addScaledVector(angularImpulseB, 1 / I)

    return vRelNormalMag
  }
}
