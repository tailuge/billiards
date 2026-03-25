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

  private static readonly ab = new Vector3()
  private static readonly abTangent = new Vector3()
  private static readonly vPoint = new Vector3()
  private static readonly vRel = new Vector3()
  private static readonly impulseNormal = new Vector3()
  private static readonly impulseTangential = new Vector3()
  private static readonly angularImpulseA = new Vector3()
  private static readonly angularImpulseB = new Vector3()
  private static readonly temp = new Vector3()

  private dynamicFriction(vRel: number): number {
    return 0.01 + 0.108 * exp(-1.088 * vRel)
  }

  public updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    a.ballmesh.trace.forceTrace(contact.a)
    b.ballmesh.trace.forceTrace(contact.b)
    const ab = CollisionThrow.ab.subVectors(contact.b, contact.a).normalize()
    const abTangent = CollisionThrow.abTangent.set(-ab.y, ab.x, 0)

    const e = 0.99
    const vPoint = CollisionThrow.vPoint
      .copy(a.vel)
      .sub(b.vel)
      .add(
        CollisionThrow.temp
          .copy(ab)
          .multiplyScalar(-R)
          .cross(a.rvel)
          .sub(CollisionThrow.angularImpulseB.copy(ab).multiplyScalar(R).cross(b.rvel))
      )

    const vRelNormalMag = ab.dot(vPoint)
    const vRel = CollisionThrow.vRel
      .copy(vPoint)
      .addScaledVector(ab, -vRelNormalMag)
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
    const impulseNormal = CollisionThrow.impulseNormal
      .copy(ab)
      .multiplyScalar(this.normalImpulse)
    const impulseTangential = CollisionThrow.impulseTangential
      .copy(abTangent)
      .multiplyScalar(this.tangentialImpulse)

    // Apply impulses to linear velocities
    a.vel
      .addScaledVector(impulseNormal, 1 / m)
      .addScaledVector(impulseTangential, 1 / m)
    b.vel
      .addScaledVector(impulseNormal, -1 / m)
      .addScaledVector(impulseTangential, -1 / m)

    // Angular velocity updates
    const angularImpulseA = CollisionThrow.angularImpulseA
      .copy(ab)
      .multiplyScalar(-R)
      .cross(impulseTangential)
    const angularImpulseB = CollisionThrow.angularImpulseB
      .copy(ab)
      .multiplyScalar(R)
      .cross(impulseTangential)

    a.rvel.addScaledVector(angularImpulseA, 1 / I)
    b.rvel.addScaledVector(angularImpulseB, 1 / I)

    return vRelNormalMag
  }
}
