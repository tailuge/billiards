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
    a.ballmesh?.trace.forceTrace(contact.a)
    b.ballmesh?.trace.forceTrace(contact.b)
    const ab = contact.b.sub(contact.a).normalize()
    const abTangent = new Vector3(-ab.y, ab.x, 0)

    const e = 0.925
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
    const vRelTangentialVec = vPoint.clone().addScaledVector(ab, -vRelNormalMag)
    const vRelMag = vRelTangentialVec.length()

    const μ = this.dynamicFriction(vRelMag)

    // Normal impulse (inelastic collision)
    this.normalImpulse = (-(1 + e) * vRelNormalMag) / (2 / m)

    // Tangential impulse (frictional constraint)
    let impulseTangential = new Vector3(0, 0, 0)
    if (vRelMag > 1e-8) {
      const maxJt_friction = μ * Math.abs(this.normalImpulse)
      const maxJt_stick = (m / 7) * vRelMag
      const jtMag = Math.min(maxJt_friction, maxJt_stick)
      impulseTangential = vRelTangentialVec
        .clone()
        .multiplyScalar(-jtMag / vRelMag)
      this.tangentialImpulse = impulseTangential.dot(abTangent)
    } else {
      this.tangentialImpulse = 0
    }

    // Impulse vectors
    const impulseNormal = ab.clone().multiplyScalar(this.normalImpulse)

    // Apply impulses to linear velocities (constrained to XY plane)
    a.vel
      .addScaledVector(impulseNormal, 1 / m)
      .addScaledVector(impulseTangential, 1 / m)
    a.vel.z = 0
    b.vel
      .addScaledVector(impulseNormal, -1 / m)
      .addScaledVector(impulseTangential, -1 / m)
    b.vel.z = 0

    // Angular velocity updates
    // Jt is the tangential impulse applied TO ball A.
    // The force acts at the contact point relative to ball A: rA = R * ab
    // Torque for A: tauA = rA x Jt = (R * ab) x Jt
    // For ball B, the impulse is -Jt and it acts at rB = -R * ab
    // Torque for B: tauB = rB x (-Jt) = (-R * ab) x (-Jt) = (R * ab) x Jt
    // Thus both balls receive the SAME angular impulse.
    const angularImpulse = ab.clone().multiplyScalar(R).cross(impulseTangential)

    a.rvel.addScaledVector(angularImpulse, 1 / I)
    b.rvel.addScaledVector(angularImpulse, 1 / I)

    return vRelNormalMag
  }
}