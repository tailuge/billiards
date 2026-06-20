import { expect as chaiExpect } from "chai"
import { Vector3 } from "three"
import { Ball } from "../../../src/model/ball"
import { Collision } from "../../../src/model/physics/collision"
import { CollisionThrow } from "../../../src/model/physics/collisionthrow"
import { m, R } from "../../../src/model/physics/constants"

describe("CollisionThrow Engine Accuracy", () => {
  const model = new CollisionThrow()

  function check(v: number, wx: number, wz: number, phiDeg: number) {
    const a = new Ball(new Vector3(0, 0, 0))
    a.vel.set(0, v, 0)
    a.rvel.set(wx, 0, wz)

    const phi = (phiDeg * Math.PI) / 180
    // b is at distance 2R, at angle phi from the y-axis
    // If a is moving along +y, and they hit at angle phi:
    // bpos = (2R * sin(phi), 2R * cos(phi), 0)
    const bpos = new Vector3(Math.sin(phi) * 2 * R, Math.cos(phi) * 2 * R, 0)
    const b = new Ball(bpos)

    // Adjust pos to ensure they are at contact (to match updateVelocities expectations)
    const contact = Collision.positionsAtContact(a, b)
    a.pos.copy(contact.a)
    b.pos.copy(contact.b)

    // Save pre-collision state before engine modifies velocities
    const preAVel = a.vel.clone()
    const preBVel = b.vel.clone()
    const preARvel = a.rvel.clone()
    const preBRvel = b.rvel.clone()

    model.updateVelocities(a, b)

    const actualThrow =
      (Math.atan2(
        Math.abs(model.tangentialImpulse),
        Math.abs(model.normalImpulse)
      ) *
        180) /
      Math.PI

    // Alciatore Paper expectations (CIT Model)
    // Jn = m/2 * (1 + e) * vn
    // Jt = min(mu * Jn, m/7 * vt)
    const e = 0.925
    const ab = b.pos.clone().sub(a.pos).normalize()
    const vPoint = preAVel
      .clone()
      .sub(preBVel)
      .add(
        ab
          .clone()
          .multiplyScalar(-R)
          .cross(preARvel)
          .sub(ab.clone().multiplyScalar(R).cross(preBRvel))
      )
    const vn = Math.abs(ab.dot(vPoint))
    const vtVec = vPoint.clone().addScaledVector(ab, -ab.dot(vPoint))
    const vt = vtVec.length()
    const mu = 0.01 + 0.108 * Math.exp(-1.088 * vt)

    const Jn = (m / 2) * (1 + e) * vn
    const Jt = Math.min(mu * Jn, (m / 7) * vt)
    // Project the paper's tangential impulse onto the XY tangent direction
    // to match what the engine stores in tangentialImpulse
    const abTangent = new Vector3(-ab.y, ab.x, 0)
    const paperImpulseTangential = vtVec.clone().normalize().multiplyScalar(-Jt)
    const jtProjected = Math.abs(paperImpulseTangential.dot(abTangent))
    const expectedThrow =
      (Math.atan2(jtProjected, Math.abs(Jn)) * 180) / Math.PI

    console.log(
      `v=${v}, wx=${wx}, wz=${wz}, phi=${phiDeg}: Engine=${actualThrow.toFixed(
        4
      )}, Paper=${expectedThrow.toFixed(4)}, Ratio=${(
        actualThrow / expectedThrow
      ).toFixed(4)}`
    )

    chaiExpect(actualThrow).to.be.closeTo(
      expectedThrow,
      1e-4,
      `Failed for v=${v}, wx=${wx}, wz=${wz}, phi=${phiDeg}`
    )
  }

  it("matches CIT paper for various inputs", () => {
    check(1, 0, 0, 15)
    check(1, 0, 0, 30)
    check(1, 0, 0, 45)
    check(0.5, 0, 0, 30)
    check(2, 0, 0, 30)
    check(1, 20, 0, 30)
    check(1, 0, 20, 30)
  })
})
