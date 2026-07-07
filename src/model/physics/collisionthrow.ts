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
  private static readonly vPoint = new Vector3()
  private static readonly vRelTangentialVec = new Vector3()
  private static readonly impulseNormal = new Vector3()
  private static readonly impulseTangential = new Vector3()
  private static readonly angularImpulse = new Vector3()
  private static readonly tmp = new Vector3()

  private dynamicFriction(vRel: number): number {
    return 0.01 + 0.108 * exp(-1.088 * vRel)
  }

  public updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    a.ballmesh?.trace.forceTrace(contact.a)
    b.ballmesh?.trace.forceTrace(contact.b)

    const ab = CollisionThrow.ab.subVectors(contact.b, contact.a).normalize()
    const abTangentY = ab.x
    const abTangentX = -ab.y

    const e = 0.925

    // vPoint = (vA - vB) + ((-R*ab) x wA - (R*ab) x wB)
    const vPoint = CollisionThrow.vPoint.subVectors(a.vel, b.vel)
    CollisionThrow.tmp.copy(ab).multiplyScalar(-R).cross(a.rvel)
    vPoint.add(CollisionThrow.tmp)
    CollisionThrow.tmp.copy(ab).multiplyScalar(R).cross(b.rvel)
    vPoint.sub(CollisionThrow.tmp)

    const vRelNormalMag = ab.dot(vPoint)
    const vRelTangentialVec = CollisionThrow.vRelTangentialVec
      .copy(vPoint)
      .addScaledVector(ab, -vRelNormalMag)
    const vRelMag = vRelTangentialVec.length()

    const μ = this.dynamicFriction(vRelMag)

    // Normal impulse (inelastic collision)
    this.normalImpulse = (-(1 + e) * vRelNormalMag) / (2 / m)

    // Tangential impulse (frictional constraint)
    const impulseTangential = CollisionThrow.impulseTangential.set(0, 0, 0)
    if (vRelMag > 1e-8) {
      const maxJt_friction = μ * Math.abs(this.normalImpulse)
      const maxJt_stick = (m / 7) * vRelMag
      const jtMag = Math.min(maxJt_friction, maxJt_stick)
      impulseTangential.copy(vRelTangentialVec).multiplyScalar(-jtMag / vRelMag)
      this.tangentialImpulse =
        impulseTangential.x * abTangentX + impulseTangential.y * abTangentY
    } else {
      this.tangentialImpulse = 0
    }

    // Impulse vectors
    const impulseNormal = CollisionThrow.impulseNormal
      .copy(ab)
      .multiplyScalar(this.normalImpulse)

    // Apply impulses to linear velocities (constrained to XY plane)
    const invM = 1 / m
    a.vel.addScaledVector(impulseNormal, invM).addScaledVector(impulseTangential, invM)
    a.vel.z = 0
    b.vel.addScaledVector(impulseNormal, -invM).addScaledVector(impulseTangential, -invM)
    b.vel.z = 0

    // Angular velocity updates
    const angularImpulse = CollisionThrow.angularImpulse
      .copy(ab)
      .multiplyScalar(R)
      .cross(impulseTangential)

    const invI = 1 / I
    a.rvel.addScaledVector(angularImpulse, invI)
    b.rvel.addScaledVector(angularImpulse, invI)

    return vRelNormalMag
  }
}
